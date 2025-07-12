import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  MapPin,
  Clock,
  Star,
  Plus,
  X,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { api } from "../../utils/api";

const UserProfile: React.FC = () => {
  const { userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || "",
    location: userData?.location || "",
    skillsOffered: userData?.skillsOffered || [],
    skillsWanted: userData?.skillsWanted || [],
    availability: userData?.availability || [],
    isPublic: userData?.isPublic || true,
  });
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [newAvailability, setNewAvailability] = useState("");

  const availabilityOptions = [
    "Weekdays",
    "Weekends",
    "Mornings",
    "Afternoons",
    "Evenings",
    "Flexible",
  ];

  const handleSave = () => {
    // Here you would save to your backend/MongoDB
    console.log("Saving profile data:", profileData);
    api.put("/profile", profileData);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (
      newSkillOffered.trim() &&
      !profileData.skillsOffered.includes(newSkillOffered.trim())
    ) {
      setProfileData({
        ...profileData,
        skillsOffered: [...profileData.skillsOffered, newSkillOffered.trim()],
      });
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (
      newSkillWanted.trim() &&
      !profileData.skillsWanted.includes(newSkillWanted.trim())
    ) {
      setProfileData({
        ...profileData,
        skillsWanted: [...profileData.skillsWanted, newSkillWanted.trim()],
      });
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setProfileData({
      ...profileData,
      skillsOffered: profileData.skillsOffered.filter((s) => s !== skill),
    });
  };

  const removeSkillWanted = (skill: string) => {
    setProfileData({
      ...profileData,
      skillsWanted: profileData.skillsWanted.filter((s) => s !== skill),
    });
  };

  const toggleAvailability = (option: string) => {
    const current = profileData.availability;
    const updated = current.includes(option)
      ? current.filter((a) => a !== option)
      : [...current, option];
    setProfileData({ ...profileData, availability: updated });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {profileData.isPublic ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-600">
                {profileData.isPublic ? "Public Profile" : "Private Profile"}
              </span>
            </div>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(userData?.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600">
                  ({userData?.totalRatings} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{userData?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {profileData.location || "Not specified"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={profileData.isPublic}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      isPublic: e.target.checked,
                    })
                  }
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Make my profile public
                  </span>
                  <p className="text-xs text-gray-500">
                    Others can find and contact you for skill swaps
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Skills I Can Offer</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.skillsOffered.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkillOffered(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a skill you can offer"
            />
            <button
              onClick={addSkillOffered}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Skills I Want to Learn</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.skillsWanted.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkillWanted(skill)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a skill you want to learn"
            />
            <button
              onClick={addSkillWanted}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Availability</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availabilityOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={profileData.availability.includes(option)}
                onChange={() => toggleAvailability(option)}
                disabled={!isEditing}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
