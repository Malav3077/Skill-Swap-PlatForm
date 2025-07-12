import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Star,
  Calendar,
  Award,
  Edit3,
  Camera,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../utils/api";
import { Review, Skill } from "../../types";
import ProfileEditModal from "./ProfileEditModal";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, reviewsResponse, skillsResponse] =
        await Promise.all([
          api.get("/users/profile"),
          api.get(`/reviews/user/${user?.id}`),
          api.get(`/skills?user_id=${user?.id}`),
        ]);

      setProfile(profileResponse);
      setReviews(reviewsResponse);
      setSkills(skillsResponse);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: any) => {
    try {
      await api.put("/users/profile", profileData);
      updateUser(profileData);
      setProfile({ ...profile, ...profileData });
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const offeredSkills = skills.filter(
    (skill) => skill.skill_type === "offered"
  );
  const wantedSkills = skills.filter((skill) => skill.skill_type === "wanted");

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative group">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
            )}
            <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{profile?.name}</h1>
                <div className="flex items-center space-x-4 mt-2 text-blue-100">
                  {profile?.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined{" "}
                    {new Date(profile?.created_at || "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center mt-4 md:mt-0"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>

            {profile?.bio && (
              <p className="mt-4 text-blue-100">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {profile?.swaps_completed || 0}
          </h3>
          <p className="text-gray-600">Completed Swaps</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {profile?.average_rating ? `${profile.average_rating}/5` : "N/A"}
          </h3>
          <p className="text-gray-600">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{skills.length}</h3>
          <p className="text-gray-600">Total Skills</p>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Offered */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
            Skills I Offer ({offeredSkills.length})
          </h2>
          <div className="space-y-3">
            {offeredSkills.length > 0 ? (
              offeredSkills.map((skill) => (
                <div key={skill.id} className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                  <p className="text-sm text-gray-600">{skill.category}</p>
                  {skill.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {skill.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No skills offered yet
              </p>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
            Skills I Want to Learn ({wantedSkills.length})
          </h2>
          <div className="space-y-3">
            {wantedSkills.length > 0 ? (
              wantedSkills.map((skill) => (
                <div key={skill.id} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{skill.title}</h3>
                  <p className="text-sm text-gray-600">{skill.category}</p>
                  {skill.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {skill.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No learning goals yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-start space-x-4">
                  {review.reviewer_photo ? (
                    <img
                      src={review.reviewer_photo}
                      alt={review.reviewer_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {review.reviewer_name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {review.feedback && (
                      <p className="text-gray-600 mt-1">{review.feedback}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onSubmit={handleProfileUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
