const  mongoose = require('mongoose')
const  otpSchema = mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('otp',otpSchema)