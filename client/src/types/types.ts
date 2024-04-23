export interface User {
    _id:String;
    username: string;
    email: string;
    password: string;
    fname?: string;
    lname?: string;
    bio?: string;
    dob?: string;
    profileimg?: string;
    bannerImg?: string;
    phone: string; // New field
    followers?: number;
    following?: number;
    isBlock?:boolean
    isAdmin?:boolean
  }
  
  export interface UsersState {
    users: User[];
    // user:User[];
  }
  export interface UserState {
    user: User[];
    // user:User[];
  }
  