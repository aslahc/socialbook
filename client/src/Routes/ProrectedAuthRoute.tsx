// auth.ts

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  };
  
  export const isAdmin = (): boolean => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.isAdmin ? true : false;
  };
  