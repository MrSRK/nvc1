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
    email:{type:String,required:true},
    password:{type:String,required:true},
    images:[image]
},
{
    timestamps:true,
    versionKey:false
})
schema.pre('save',function save(next)
{
    const user=this
    if(!user.isModified('password'))
        return next()
    bcrypt.genSalt(10,(error,salt)=>
    {
        if(error)
            return next(error)
        bcrypt.hash(user.password,salt,null,(error,hash)=>
        {
            if(error)
                return next(error)
            user.password=hash
            next()
        })
    })
})
const model=mongoose.model(modelName,schema)
module.exports=model