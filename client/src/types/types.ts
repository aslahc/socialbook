export interface User {
  _id: string;

  username: string;
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  bio?: string;
  dob?: string;
  profession?: string;
  profileimg?: string;
  bannerImg?: string;
  phone: string; // New field
  followers?: string[];
  following?: string[];
  savedPost?: string[];
  savePostCategory?: string[];
  isBlock?: boolean;
  isAdmin?: boolean;
}
export interface UserWithMessages extends User {
  messages?: { senderId: string; text: string }[];
}
export interface IPost {
  height: any;
  width: any;
  filter: any;
  _id: string; // Change '_id' to 'id' if your post IDs are named 'id'
  userId: {
    _id: string;
    username: string;
    profileimg: string;
  };
  likes: any[];
  createdAt: string;
  postUrl: string[];
  caption: string;
  type: string;
}
export interface Istory {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileimg: string;
  };

  stories: {
    storyImg: string;
    views: string[];
    createOn: string;
    expireOn: string;
    _id: string;
  }[];
}

export interface UsersState {
  users: User[];
  // user:User[];
}
export interface UserState {
  user: User | null;
  // user:User[];
}

export interface PostState {
  filteredPosts: any;
  posts: IPost[];
}

export interface StoryState {
  story: Istory[];
}
