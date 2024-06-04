require("express-async-errors");
require("dotenv").config();

const express = require("express");
// const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");
const connectDb = require("./config/db");
const PORT = process.env.PORT;
const cloudinary = require('cloudinary').v2;
const { setConfig } = require('cloudinary-build-url');
const appConfig = require("./app");

// docs
// const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('../openapi.json');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  



const server = app.listen(PORT, () => {
  try {
    connectDb();
    appConfig(app);
    console.log(`server started in port ${PORT}`)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});


// socket
const io = require("socket.io")(server,{
  cors:{
    origin: "http://localhost:3000"
  }
});


io.on('connection',socket=>{
  console.log('connected');

  socket.on('join chat', chatId => {
    socket.join(chatId);

    socket.on('sendMessage', text => {
      socket.broadCast.to(chatId)
    })

  })

})