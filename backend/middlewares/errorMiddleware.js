
const notFound = (req,res) => {
  return res.status(404).json({success:false,message:"Route Not Found!"})
}


const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const message = err.message || "Internal Server Error"
  res.status(statusCode);
  res.json({
    success:false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? err.stack : "null",
  });
};

module.exports = {
  errorHandler,
  notFound
};


