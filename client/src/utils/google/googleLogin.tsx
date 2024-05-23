import axiosInstance from "../../axios/axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
// import { setUser } from "../../store/features/userDetailsSlice";
import { setUserDetails } from "../../utils/reducers/userDetails";

// import { addToken } from "../../store/features/tokenSlice";
import { useNavigate } from "react-router-dom";
interface IFormInput {
  email: string;
  password?: string;
  fname?: string;
  lname?: string;
  username?: string;
  confirmPassword?: string;
  given_name?: string;
  name?: string;
}
// Hook for Google Login
const useGoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleLogin = async (userData: IFormInput) => {
    try {
      const updatedUserData = {
        username: userData.given_name,
        email: userData.email,
        firstName: userData.name,
        // lastName: userData.lname,
      };

      console.log("google resposne ", updatedUserData);
      const response = await axiosInstance.post(
        "/google-login",
        updatedUserData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("ii", response);
      const data = response.data;
      console.log("from back ", data);
      if (data) {
        console.log(data.userData);
        dispatch(setUserDetails(data.userData));
        const { token, role } = data;

        // Store the accessToken and role in localStorage
        localStorage.setItem("token", token);
        navigate("/home", { replace: true });

        // localStorage.setItem('role', role);
        //     if (data.responseData.isAdmin) {
        //       navigate("/admin", { replace: true });
        //     } else {
        //       navigate("/home", { replace: true });
        //     }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return googleLogin;
};

export default useGoogleLogin;
