const mongoose=require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const modelName=__dirname.split("\\").reverse()[0]
const image=mongoose.Schema({
    fieldname:{type:String,required:true},
    originalname:{type:String},
    encoding:{type:String},
    mimetype:{type:String},
    destination:{type:String},
    filename:{type:String},
    path:{type:String},
    size:{type:Number},
})
const schema=new mongoose.Schema({
    active:{type:Boolean,default:true},
    name:{type:String},
    company:{type:String},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    address:{type:String,required:true}
},
{
    timestamps:true,
    versionKey:false
})
const model=mongoose.model(modelName,schema)
module.exports=model