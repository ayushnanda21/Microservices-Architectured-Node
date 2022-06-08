const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
        minlength: 5
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    passwordHash : {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street:{
        type: String,
        default: ''
    },
    apartment:{
        type: String,
        default: ''
    },
    zip:{
        type: String,
        default:''
    },
    city:{
        type: String,
        default:''
    },
    country:{
        type: String,
        default:''
    }
},
{timestamps: true}
);

//creating virtuals
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

module.exports= mongoose.model("User",userSchema);