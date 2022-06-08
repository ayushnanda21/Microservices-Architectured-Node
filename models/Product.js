const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
     name:{
         type: String,
          maxlength: 50
     },
     description:{
         type: String,
         required: true
     },
     richDescription:{
         type: String,
         default: ""
     },
     image:{
         type: String,
         default: ""
     },
     images:[
         {
             type: String
         }
     ],
     brand:{
         type: String,
        default: ""
     },
     price:{
        type: Number,
        default: 0
     },
     category:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
     },
     countInStock:{
         type: Number,
         required: true,
         min: 0,
         max: 255
     },
     rating:{
        type: Number,
        default: 0
     },
     numReviews:{
        type: Number,
        default: 0
     },
     isFeatured:{
         type: Boolean,
         default: false
     },
},
{timestamps: true}
);


//handling _id issue for getting id( creating virtuals)
// productSchema.virtual('id').get(function() {
//     return this._id.toHexString();
// });

// productSchema.set("toJSON", {
//     virtuals: true
// });
module.exports = mongoose.model("Product", productSchema);