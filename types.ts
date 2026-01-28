export interface User {
  id: string;
  username: string; // New for auth
  password: string; // New for auth (Note: Stored locally for demo)
  name: string;
  avatar: string;
  bio: string;
  friends: string[]; // array of user IDs
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  likes: string[]; // array of user IDs
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
  replyToPostId?: string; // Optional context if replying to a status
}

export type ViewState = 'HOME' | 'PROFILE' | 'MESSAGES' | 'LOGIN' | 'FRIENDS';

export interface AppState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  messages: Message[];
}