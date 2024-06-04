const {ChatModel,MessageModel} = require('../chat/ChatModel');
const asyncHandler = require('express-async-handler')

const createChat = asyncHandler( async (req,res) => {
    const {receiverId} = req.body;
    // check if chat exist
    const chat = await ChatModel.create({members: [req.user.userId,receiverId]});
    res.status(201).json({success:true,data:chat,message:"Chat created successfully"});
})

const getChats = asyncHandler( async (req,res) => {
    // const {chatId} = req.params;
    const chats = await ChatModel.find({members:{$in : [req.user.userId,receiverId]}});
    res.status(200).json({success:true,data:chats,message:"Chats sent successfully"});
})

const sendMessage = asyncHandler( async (req,res) => {
    const {text,chatId} = req.body;
    const message = await MessageModel.create({sender: req.user.userId,chat:chatId,message:text});
    res.status(200).json({success:true,data:chats,message:"Chats sent successfully"});
})

const getMessages = asyncHandler( async (req,res) => {
    const {chatId} = req.params;
    const message = await MessageModel.find({chat:chatId});
    res.status(200).json({success:true,data:chats,message:"Messages sent successfully"});
})