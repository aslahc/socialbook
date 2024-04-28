export interface User {
    _id:String;
    username: string;
    email: string;
    password: string;
    fname?: string;
    lname?: string;
    bio?: string;
    dob?: string;
    profession?:string;
    profileimg?: string;
    bannerImg?: string;
    phone: string; // New field
    followers?: number;
    following?: number;
    isBlock?:boolean
    isAdmin?:boolean
  }
  export interface IPost {
    filter: any;
    _id: string; // Change '_id' to 'id' if your post IDs are named 'id'
    userId: {
      _id: string;
      username: string;
      profileimg: string;
    };
    likes:any[]
    createdAt: string;
    postUrl: string;
    caption: string;

  }
  

  
  
  export interface UsersState {
    users: User[];
    // user:User[];
  }
  export interface UserState {
    user: User[];
    // user:User[];
  }
  
  export interface PostState{
    posts:IPost[]
  }