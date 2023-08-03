const mongoose = require('mongoose')

const messagesSchema = mongoose.Schema({
    user:{
        type:String,
        unique:true
    },
    timeStamp: {
        type:date,
        default: Date.now,
        get:(timeStamp) => moment (timeStamp).format ('YYYY,MM,DD'),
    }
    ,user:{
        type:String,
        unique:true
    }
})

module.exports = mongoose.model('messages', messagesSchema)