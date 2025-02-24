const { verifyToken }  = require("../utils-mod/utils");

const authMiddleware = async (req,res,next) => {
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
          const token = req.headers.authorization.split(" ")[1];
          const {userId,role} = verifyToken(token);
          req.user = {userId,role};
          next()
      } catch (error) {
          res.status(401);
          throw new Error("Unauthorized to access this route!!")
      }
  }else{
      res.status(401);
      throw new Error("Unauthorized to access this route!!")
  }
}

module.exports = authMiddleware;