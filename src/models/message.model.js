const mongoose = require('mongoose')

const messagesSchema = mongoose.Schema({
    user:{
        type:String,
        unique:true
    },
    timeStamp: {
        type:Date,
        default: Date.now,
        get:(timeStamp) => moment(timeStamp).format('YYYY,MM,DD'),
    }
    ,message:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('messages', messagesSchema)