const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
},{
    timestamps:true
});

const MessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    message: {
        type: String
    },
    lastMessage:{
        type: String
    }
},{timestamps:true})


const ChatModel = mongoose.model('Chat',ChatSchema);
const MessageModel = mongoose.model('Message',MessageSchema);

module.exports = {ChatModel,MessageModel};