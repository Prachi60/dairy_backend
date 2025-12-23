import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js"


dotenv.config();

const authMiddleware =  async(req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id:decoded.id})
    // console.log("user",user);
    
        if (!user) {
          return handleResponse(res, 404, "User Not Found");
        }
    req.user = decoded;
    req.id = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
