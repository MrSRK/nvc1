const Model=require('./model')
let coreController=null

exports.setCoreController=controller=>
{
	try
	{
		coreController=controller
		return true
	}
	catch(error)
	{
		return false
	}
}
exports.authFunctionsObject=authModelName=>
{
	try
	{
		return coreController.authFunctionsObject(authModelName)
	}
	catch(error)
	{
		console.log(error)
		return false
	}
}
exports.schema=next=>
{
	try
	{
		return coreController.schema(Model,schema=>
		{
			next(schema)
		})
	}
	catch(error)
	{
		console.log(error)
		return next(null)
	}
}
exports.refreshToken=req=>
{
	try
	{
		return coreController.refreshToken(req)
	}
	catch(error)
	{
		return null
	}
}
exports.signIn=(req,res,name,next)=>
{
	try
	{
		return coreController.signIn(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.signUp=(req,res,name,next)=>
{
	try
	{
		return coreController.signUp(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.signOut=(req,res,name,next)=>
{
	try
	{
		return coreController.signOut(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.getList=(req,res,name,next)=>
{
	try
	{
		return coreController.getList(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.getSingle=(req,res,name,next)=>
{
	try
	{
		return coreController.getSingle(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.getListAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.getListAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.getSingleAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.getSingleAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.setSingleAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.setSingleAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.updateSingleAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.updateSingleAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.updateSinglePasswordAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.updateSinglePasswordAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.deleteSingleAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.deleteSingleAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.updateSingleImageAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.updateSingleImageAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.deleteSingleImageAuth=(req,res,name,next)=>
{
	try
	{
		return coreController.deleteSingleImageAuth(Model,req,res,name,(error,data)=>
		{
			return next(error,data)
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
exports.api404=(req,res,name,next)=>
{
	return next(null,{name:404,message:"Page not Found"})
}