const mongoose=require('mongoose')
const modelName=__dirname.split("\\").reverse()[0]
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
const schema=new mongoose.Schema({
	active:{type:Boolean,default:true},
	name:{type:String},
	code:{type:String},
	description:{type:String},
	images:[image]
},
{
	timestamps:true,
	versionKey:false
})
const model=mongoose.model(modelName,schema)
module.exports=model