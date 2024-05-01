// Controller for google login
export const googleLogin = async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, username } = req.body;
  
      const user = await userRepository.findUser(email);
  
      if (user) {
        const accessToken = generateTokenAndSetCookie(
          user._id ? user._id : "",
          res
        );
  
        const role = user.isAdmin ? "admin" : "user";
  
        const responseData = {
          _id: user._id || "",
          username: user.username || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          profileimg: user.profileimg || "",
          bio: user.bio || "",
          dob: user.dob || "",
          phone: user.phone !== undefined ? user.phone : undefined,
          isBlock: user.isBlock || false,
          isAdmin: user.isAdmin || false,
          accessToken,
          role,
        };
        return res.status(200).json({ success: true, responseData });
      } else {
        const password = generatePassword();
        const hashsedPassword = await bcrypt.hash(password, 10);
  
        const newUser = {
          email,
          username,
          firstName,
          lastName,
          password: hashsedPassword,
        } as IUsers;
  
        const createdUser = await userRepository.createNewUser(newUser);
        createdUser &&
          res
            .status(200)
            .json({ success: true, message: "User created successfully" });
      }
    } catch (error) {
      console.error("Error from google login controller", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };