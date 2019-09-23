const bcrypt = require('bcrypt-nodejs')
const jwt = require("jsonwebtoken")
const ObjectId=require('mongoose').Types.ObjectId;
const fs = require("fs")
const storage=require('./storage')
const path=require('path')
let coreAuthModelName
/**
 * Authentication middleware function for GUI (Pug) routes
 */
const authGUI=(req,res,next)=>
{
	try
	{
		if(req.session&&req.session.user&&req.session.user[coreAuthModelName])
			return next()
		return res.redirect(302,'/'+coreAuthModelName+'/'+coreAuthModelName+'/signIn')
	}
	catch(error)
	{
		console.log(error)
		return res.status(500).json({status:false,data:null,error:error})
	}
}
/**
 * Authentication middleware function for API (JSON) routes
 */
const authAPI=(req,res,next)=>
{
	try
	{
		if(!req.headers||!req.headers.authorization)
			return res.status(401).json({status:false,error:{name:"Error",message:"Unauthorized"}})
		const token=req.headers.authorization.split(" ")[1]
		const privateKey=(process.env.JWT_KEY||'10')+coreAuthModelName
		jwt.verify(token,privateKey)
		return next()
	}
	catch(error)
	{
		return res.status(401).json({status:false,error:{name:"Error",message:"Unauthorized"}})
	}
}
const authGuest=(req,res,next)=>
{
	return next()
}
/**
 * Return an Object of authentication functions for thes auth user (authModelName)
 */
exports.authFunctionsObject=authModelName=>
{
	try
	{
		coreAuthModelName=authModelName
		let authTable={}
		authTable['guest']=authGuest
		authTable[authModelName]=authGUI
		authTable[authModelName+'Api']=authAPI
		return authTable
	}
	catch(error)
	{
		console.log(error)
		return {}
	}
}
/**
 * Return Model's schema
 */
exports.schema=(Model,next)=>
{
   return next(Model.jsonSchema())
}
/**
 * Refresh time and return the 'new' token (+ check the token)
 */
exports.refreshToken=req=>
{
	try
	{
		const privateKey=(process.env.JWT_KEY||'10')+coreAuthModelName
		const expires=process.env.JWT_EXPIRES||"1h"
		const oldToken=req.headers.authorization.split(" ")[1]
		const decoded=jwt.verify(oldToken,privateKey)
		return jwt.sign(
		{
			userId:decoded.userId,
			root:decoded.root,
			userName:decoded.userName
		},
		privateKey,
		{
			expiresIn:expires
		})
	}
	catch(error)
	{
		return null
	}
}
/**
 * Retuen user's data and a jwt token if user signIn
 */
exports.signIn=(Model,req,res,name,next)=>
{
	try
	{
		if(!req.body.data||!req.body.data.email)
			throw({name:"Error",message:"Email or Password not set"})
		 if(!req.body.data||!req.body.data.password)
		 	throw({name:"Error",message:"Email or Password not set"})
		const email=req.body.data.email
		const password=req.body.data.password
		return Model.findOne({email:email},(error,data)=>
		{
			if(error)
				throw(error)
			if(!data)
				throw({name:"Error",message:"Incorrect Email or Password"})
			bcrypt.compare(password,data.password,(error,match)=>
			{
				if(error)
					throw(error)
				if(!match)
					throw({name:"Error",message:"Incorrect Email or Password"})
				const privateKey=(process.env.JWT_KEY||'10')+name
				const expires=process.env.JWT_EXPIRES||"1h"
				const token=jwt.sign(
				{
					userId:data._id,
					root:name,
					userName:encodeURIComponent(data.name)
				},
				privateKey,
				{
					expiresIn:expires
				})
				return next(null,{user:data,token:token})
			})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 *
 */
exports.signUp=(Model,req,res,name,next)=>
{
	try
	{
		// DEN EXEI GRAFTEI AKOMA
	}
	catch(error)
	{
		//
	}
}
/**
 * Delete user Session and redirect to signIn page
 */
exports.signOut=(Model,req,res,name,next)=>
{
	try
	{
		if(req.session&&req.session.user&&req.session.user[name])
			delete req.session.user[name]
		 res.redirect(302,'/'+name+'/'+name+'/signIn')
		 return next(null,null)
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Return list of records for this Model
 */
exports.getList=(Model,req,res,name,next)=>
{
	try
	{
		let select='-password'
		if(name=='administrator')
			select='-email -password'
		return Model.find(null,select,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Return list of records for this Model (need auth)
 */
exports.getListAuth=(Model,req,res,name,next)=>
{
	try
	{
		return Model.find(null,'-password',(error,data)=>
		{
			if(error)
				throw(error)
			return next(null,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Return sigle record (by _id) for this Model
 */
exports.getSingle=(Model,req,res,name,next)=>
{
	try
	{
		let select='-password'
		if(name=='administrator')
			select='-email -password'
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			throw({name:'Error',message:'Invalid ID'})
		return Model.findById(_id,select,(error,data)=>
		{
			if(error)
				throw(error)
			return next(null,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Return sigle record (by _id) for this Model (need Auth)
 */
exports.getSingleAuth=(Model,req,res,name,next)=>
{
	try
	{
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		return Model.findById(_id,'-password',(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Insert image to Model's record, by record _id (need Auth)
 */
exports.updateSingleImageAuth=(Model,req,res,name,next)=>
{
	try
	{
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		return  storage.create('images'+name+'/'+_id,'image',(error,upload)=>
		{
			if(error)
				throw(error)
			return upload(req,res,error=>
			{
				if(error)
					throw(error)
				return Model.findById(_id,'-password',(error,data)=>
				{
					if(error)
						throw(error)
					var data=data.toObject()
					if(!data.images)
						data.images=[]
					if(req.files&&req.files.image)
					{
						data.images[data.images.length]=req.files.image
						const options=
						{
							new:true,
							select:'-password'
						}
						return Model.findByIdAndUpdate(_id,data,options,(error,data)=>
						{
							return next(error,data)
						})
					}
					else
						throw({name:"Errror",message:"Image not set"},null)
				})
			})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Delete image from Model's record, by record's image _id (need Auth)
 */
exports.deleteSingleImageAuth=(Model,req,res,name,next)=>
{
	try
	{
		let _imgId=req.params._id
		if(!ObjectId.isValid(_imgId))
			return next({name:'Error',message:'Invalid ID'},null)
		return Model.findOne({'images._id':_imgId},(error,data)=>
		{
			if(error)
				return next(error,null)
			if(data&&data.images)
				data.images.forEach((e,i)=>
				{
					if(e&&e._id==_imgId)
					{
						data.images.splice(i,1)
						fs.unlink(e.path,error=>
						{
							if(error)
								console.log(error)
						})
					}
				})
			const _id=data._id
			delete data._id
			delete data.createdAt
			delete data.updatedAt
			const options=
			{
				new:true,
				select:'-password'
			}
			return Model.findByIdAndUpdate(_id,data,options,(error,data)=>
			{
				return next(error,data)
			})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Insert New Record
 */
exports.setSingleAuth=(Model,req,res,name,next)=>
{
	let data=req.body.data||{}
	if(data._id)
		delete data._id
	let model=new Model(data)
	return model.save((error,data)=>
	{
		if(error)
			return next(error,data)
		var data=data.toObject()
		if(data.password)
		delete data.password
		return next(error,data)
	})
}
/**
 * Update existing Record (by _id)
 */
exports.updateSingleAuth=(req,res,name,next)=>
{
	try
	{
		let data=req.body.data||{}
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		if(data.password)
			delete data.password
		const options=
		{
			new:true,
			select:'-password'
		}
		return Model.findByIdAndUpdate(_id,data,options,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Update existing Record's Password
 */
exports.updateSinglePasswordAuth=(req,res,name,next)=>
{
	try
	{
		let data=req.body.data||{}
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		if(!data.password)
			return next({name:"Error",message:"Password not set"},null)
		bcrypt.genSalt(10,(error,salt)=>
		{
			if(error)
				return next(error,null)
			bcrypt.hash(data.password,salt,null,(error,hash)=>
			{
				if(error)
					return next({name:"Error",message:"Password set error"},null)
				data.password=hash
				const options=
				{
					new:true,
					select:'-password'
				}
				return Model.findByIdAndUpdate(_id,{password:data.password},options,(error,data)=>
				{
					return next(error,data)
				})
			})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Delete existing record (by _id)
 */
exports.deleteSingleAuth=(req,res,name,next)=>
{
	try
	{
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		const options=
		{
			select:'-password'
		}
		return Model.findByIdAndRemove(_id,options,(error,data)=>
		{
			p=path.join(__dirname,'../uploads/images/'+root+'/'+_id)
			fs.rmdir(p,error=>
			{
				if(error)
					console.log(error,null)
			});
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}