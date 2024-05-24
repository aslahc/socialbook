import jwt from "jsonwebtoken";

export interface UserPayload {
  userId: string;
  role: string;
}

export const generateToken = (userId: any, role: string) => {
  const stringUserId = userId.toString();
  const payload: UserPayload = {
    userId: stringUserId,
    role,
  };
  console.log("eneterd to jwt secret");
  console.log(process.env.JWT_SECRET, "sss......................");
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET! || "nwL19kn732imVwEFvu2/fZOdX8ZUy5tP97zvUEK9hXQ=",
    { expiresIn: "5h" }
  );
  console.log(token);

  return token;
};
export const generateRefreshToken = (userId: any) => {
  const payload = { userId: userId.toString() };
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET! ||
      "nwL19kn732imVwEFvu2/fZOdX8ZUy5tP97zvUEK9hXQ=",
    {
      expiresIn: "7d",
    }
  ); // Refresh token with 7 days expiry
  return refreshToken;
};
