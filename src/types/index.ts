export interface User {
  uid: string;
  email: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  isAdmin?: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  createdAt: Date;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: Date;
}