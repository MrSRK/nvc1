const bcrypt=require('bcrypt-nodejs')
const jwt=require("jsonwebtoken")
const fs=require("fs")
const path=require('path')
const webp=require('webp-converter')
const sharp=require('sharp')
const ObjectId=require('mongoose').Types.ObjectId;
const storage=require('./storage')
/**
 * Default Core Module Authentication Name
 */
let coreAuthModelName
/**
 * Authentication middleware function for GUI (Pug) routes
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {Function} next express callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
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
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const authAPI=(req,res,next)=>
{
	try
	{
		if(!req.headers||!req.headers.authorization)
			return res.status(401).json({status:false,error:{name:"Error",message:"Unauthorized"}})
		jwt.verify(req.headers.authorization.split(" ")[1],(process.env.JWT_KEY||'10')+coreAuthModelName)
		return next()
	}
	catch(error)
	{
		console.log(error)
		return res.status(401).json({status:false,error:{name:"Error",message:"Unauthorized"}})
	}
}
/**
 * Midleware function for no-login users
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {Function} next callback function
 * @callback function(void)
 * @returns {Boolean} function status
 */
const authGuest=(req=null,res=null,next)=>
{
	return next()
}
/**
 * Return an Object of authentication functions for thes auth user (authModelName)
 * @param {String} authModelName authentication model name
 * @throws error
 * @returns {JSON} JSON Array with login functions
 */
const authFunctionsObject=authModelName=>
{
	try
	{
		coreAuthModelName=authModelName
		let authTable={}
		authTable['guest']=authGuest
		authTable['guestApi']=authGuest
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
 * @param {Object} Model Mongoose model
 * @param {Function} next Callback function
 * @callback function(JSON)
 * @returns {JSON} (module) mongoose-schema-jsonschema JSON
 */
const schema=(Model,next)=>
{
   return next(Model.jsonSchema())
}
/**
 * Refresh time and return the 'new' token (+ check the token)
 * @param {Object} req express req Object
 * @throws error
 * @returns {String} jwt token
 */
const refreshToken=req=>
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
		console.log(error)
		return null
	}
}
/**
 * Retuen user's data and a jwt token if user signIn
 * @param {Object} Model Mongoose model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signIn=(Model,req,res=null,name,next)=>
{
	try
	{
		if(!req.body.data||!req.body.data.email)
			return next({name:"Error",message:"Email or Password not set"})
		 if(!req.body.data||!req.body.data.password)
		 	return next({name:"Error",message:"Email or Password not set"})
		const email=req.body.data.email
		const password=req.body.data.password
		return Model.findOne({email:email},(error,data)=>
		{
			if(error)
				return next(error)
			if(!data)
				return next({name:"Error",message:"Incorrect Email or Password"})
			return bcrypt.compare(password,data.password,(error,match)=>
			{
				if(error)
					return next(error)
				if(!match)
					return next({name:"Error",message:"Incorrect Email or Password"})
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
				req.session&&req.session.user&&req.session.user[coreAuthModelName]
				if(!req.session.user)
					req.session.user={}
				req.session.user[name]=data
				req.session.user[name].token=token
				let r=data.toObject()
				delete r.password
				return next(null,{user:r,token:token})
			})
		})
	}
	catch(error)
	{
		console.log(error)
		return next(error,null)
	}
}
/**
 * Store New user data
 * @param {Object} Model Mongoose model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signUp=(Model,req,res,name,next)=>
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
* @param {Object} Model Mongoose model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signOut=(Model=null,req,res,name,next)=>
{
	try
	{
		if(req.session&&req.session.user&&req.session.user[name])
			delete req.session.user[name]
		 res.redirect(302,'/'+name+'/'+name+'/signIn')
		 return true
	}
	catch(error)
	{
		console.log(error)
		return next(error,null)
	}
}
/**
 * Return list of records for this Model
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getList=(Model,req=null,res=null,name,next)=>
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Return list of records for this Model (need auth)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getListAuth=(Model,req=null,res=null,name=null,next)=>
{
	try
	{
		return Model.find(null,'-password',(error,data)=>
		{
			if(error)
				return next(error)
			return next(null,data)
		})
	}
	catch(error)
	{
		console.log(error)
		return next(error,null)
	}
}
/**
 * Return sigle record (by _id) for this Model
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getSingle=(Model,req,res=null,name,next)=>
{
	try
	{
		let select='-password'
		if(name=='administrator')
			select='-email -password'
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'})
		return Model.findById(_id,select,(error,data)=>
		{
			if(error)
				return next(error)
			return next(null,data)
		})
	}
	catch(error)
	{
		console.log(error)
		return next(error,null)
	}
}
/**
 * Return sigle record (by _id) for this Model (need Auth)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getSingleAuth=(Model,req,res=null,name=null,next)=>
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Insert image to Model's record, by record _id (need Auth)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSingleImageAuth=(Model,req,res,name,next)=>
{
	try
	{
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		return  storage.create('images/'+name+'/'+_id,'image',(error,upload)=>
		{
			if(error)
				return next(error)
			return upload(req,res,error=>
			{
				if(error)
					return next(error)
				return Model.findById(_id,'-password',(error,data)=>
				{
					if(error)
						return next(error)
					var data=data.toObject()
					if(!data.images)
						data.images=[]
					if(req.files&&req.files.image)
					{
						// Convert to webp
						const webpPathTmp=req.files.image.path.split('.').reverse().splice(1).reverse()+'.webp.tmp'
						const webpPath=req.files.image.path.split('.').reverse().splice(1).reverse()+'.webp'
						const webpName=req.files.image.filename.split('.').reverse().splice(1).reverse()+'.webp'
						return webp.cwebp(req.files.image.path,webpPathTmp,"-q 100",function(status,error)
						{
							if(error)
								return next(error)
							return sharp(webpPathTmp)
							.resize(parseInt(process.env.IMAGE_MAX_WIDTH)||800,parseInt(process.env.IMAGE_MAX_HEIGHT)||800,{fit:'inside'})
							.toFile(webpPath,(error,info)=>
							{
								if(error)
									return next(error)
								fs.unlink(webpPathTmp,error=>
								{
									if(error)
										console.log(error)
								})
								req.files.image.webpPath=webpPath
								req.files.image.webp=webpName
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
							})
						})
					}
					else
						return next({name:"Errror",message:"Image not set"},null)
				})
			})
		})
	}
	catch(error)
	{
		console.log(error)
		return next(error,null)
	}
}
/**
 * Delete image from Model's record, by record's image _id (need Auth)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const deleteSingleImageAuth=(Model,req,res=null,name=null,next)=>
{
	try
	{
		let _imgId=req.params._imgId
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
						fs.exists(e.path,exists=>
						{
							if(exists)
								fs.unlink(e.path,error=>
								{
									if(error)
										console.log(error)
								})
						})
						fs.exists(e.webpPath,exists=>
						{
							if(exists)
								fs.unlink(e.webpPath,error=>
								{
									if(error)
										console.log(error)
								})
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Insert New Record
 * Delete image from Model's record, by record's image _id (need Auth)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const setSingleAuth=(Model,req,res=null,name=null,next)=>
{
	try
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
	catch(error)
	{
		console.log(error)
		return next(error)
	}
}
/**
 * Update existing Record (by _id)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSingleAuth=(Model,req,res=null,name=null,next)=>
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Update existing Record's Password
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSinglePasswordAuth=(Model,req,res=null,name=null,next)=>
{
	try
	{
		let data=req.body.data||{}
		let _id=req.params._id
		if(!ObjectId.isValid(_id))
			return next({name:'Error',message:'Invalid ID'},null)
		if(!data.password)
			return next({name:"Error",message:"Password not set"},null)
		return bcrypt.genSalt(10,(error,salt)=>
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Delete existing record (by _id)
 * @param {JSON} Model Mongoose model
 * @param {JSON} req express req Object
 * @param {JSON} res express res Object
 * @param {String} name Mongoose model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const deleteSingleAuth=(Model,req,res=null,name=null,next)=>
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
		console.log(error)
		return next(error,null)
	}
}
/**
 * Exports Module's functions
 */
module.exports.authFunctionsObject=authFunctionsObject
module.exports.schema=schema
module.exports.refreshToken=refreshToken
module.exports.signIn=signIn
module.exports.signUp=signUp
module.exports.signOut=signOut
module.exports.getList=getList
module.exports.getListAuth=getListAuth
module.exports.getSingle=getSingle
module.exports.getSingleAuth=getSingleAuth
module.exports.updateSingleImageAuth=updateSingleImageAuth
module.exports.deleteSingleImageAuth=deleteSingleImageAuth
module.exports.setSingleAuth=setSingleAuth
module.exports.updateSingleAuth=updateSingleAuth
module.exports.updateSinglePasswordAuth=updateSinglePasswordAuth
module.exports.deleteSingleAuth=deleteSingleAuth