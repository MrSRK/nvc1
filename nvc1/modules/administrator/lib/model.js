const mongoose=require('mongoose')
const bcrypt = require('bcrypt-nodejs')
/**
 * Set Models Name by directory name
 */
const modelName=__dirname.split("\\").reverse()[1]
/**
 * Image sub schema
 */
const image=mongoose.Schema({
	fieldname:{type:String,required:true},
	originalname:{type:String},
	encoding:{type:String},
	mimetype:{type:String},
	destination:{type:String},
	filename:{type:String},
	path:{type:String},
	webp:{type:String},
	webpPath:{type:String},
	size:{type:Number},
})
/**
 * model's schema
 */
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
/**
 * Pre all save executs to convert password to hash
 */
schema.pre('save',function save(next)
{
	const user=this
	if(!user.isModified('password'))
		return next()
	return bcrypt.genSalt(10,(error,salt)=>
	{
		if(error)
			return next(error)
		return bcrypt.hash(user.password,salt,null,(error,hash)=>
		{
			if(error)
				return next(error)
			user.password=hash
			return next()
		})
	})
})
module.exports=mongoose.model(modelName,schema)