const Model=require('./model')
let coreController=null
/**
 * Set Core Controller
 * @param {Object} controller express req Object
 * @throws error
 * @returns {boolean} Function status
 */
const setCoreController=controller=>
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
/**
 * Bypass core's funcion Authentication Functions to the current controller / model
 * @param {String} authModelName express req Object
 * @throws error
 * @returns {boolean} Function status
 */
const authFunctionsObject=authModelName=>
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
/**
 * Bypass core's funcion schema to the current controller / model
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const schema=next=>
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
/**
 * Bypass core's funcion Refresh Token to the current controller / model
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const refreshToken=req=>
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
/**
 * Bypass core's funcion sign In to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signIn=(req,res,name,next)=>
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
/**
 * Bypass core's funcion sign Up to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signUp=(req,res,name,next)=>
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
/**
 * Bypass core's funcion sign Out to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const signOut=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Get List to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getList=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Get Single to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getSingle=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Get List (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getListAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Get Single (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const getSingleAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Update Single (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSingleAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Update Single Password (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSinglePasswordAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Delete Single (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const deleteSingleAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Update Single Image (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const updateSingleImageAuth=(req,res,name,next)=>
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
/**
 * Bypass core's funcion Delete Single Image (with) authentication to the current controller / model
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const deleteSingleImageAuth=(req,res,name,next)=>
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
/**
 * Default 404 page controller
 * @param {Object} req express req Object
 * @param {Object} res express res Object
 * @param {String} name authentication model name
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {boolean} Function status
 */
const api404=(req,res,name,next)=>
{
	return next(null,{name:404,message:"Page not Found"})
}
/**
 * Modul's Exports
 */
module.exports.setCoreController=setCoreController
module.exports.authFunctionsObject=authFunctionsObject
module.exports.schema=schema
module.exports.refreshToken=refreshToken
module.exports.signIn=signIn
module.exports.signUp=signUp
module.exports.signOut=signOut
module.exports.getList=getList
module.exports.getSingle=getSingle
module.exports.getListAuth=getListAuth
module.exports.getSingleAuth=getSingleAuth
module.exports.updateSingleAuth=updateSingleAuth
module.exports.updateSinglePasswordAuth=updateSinglePasswordAuth
module.exports.deleteSingleAuth=deleteSingleAuth
module.exports.updateSingleImageAuth=updateSingleImageAuth
module.exports.deleteSingleImageAuth=deleteSingleImageAuth
module.exports.api404=api404