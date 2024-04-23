import { useEffect, useState } from 'react';

const useAuth = (): boolean | null => {
  const [authUser, setAuthUser] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log("pppppppppppppppppppppppppppp")
      // If token exists, user is authenticated
      setAuthUser(true);
    } else {
      // No token found, user is not authenticated
      setAuthUser(false);
    }
  }, ); // Add token as a dependency

  return authUser;
};

export default useAuth;
