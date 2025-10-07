import jwt from 'jsonwebtoken'

//doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {

     const token = req.headers.dtoken;

    if (!token) {
     
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    


    const token_decode = jwt.verify(token, process.env.JWT_SECRET);    
    req.doctorId = token_decode.id;
    
    next();
  } catch (error) {
    console.error("AuthDoctor Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default authDoctor