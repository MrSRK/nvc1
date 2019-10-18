const router=require('express').Router()
const name=__filename.split('\\').reverse()[2]
const controller=require('./controller')
const config=require('../config.json')
/**
 * Authorization functions array
 */
let auth=[];
/**
 * Return Module's express router
 * @throws error
 * @returns {Object} Express Router
 */
const getRouter=()=>
{
	try
	{
		return router
	}
	catch(error)
	{
		console.log(error)
		return null
	}
}
/**
 * Set Core (default) controller Object to this Controller
 * @param {Object} coreController
 * @throws error
 * @returns {Boolean} Function status
 */
const setCoreController=coreController=>
{
	try
	{
		controller.setCoreController(coreController)
		auth=controller.authFunctionsObject(config.auth)
		return true
	}
	catch(error)
	{
		console.log(error)
		return false
	}
}
/**
 * Route all Routes (module configuration json) to this router
 * @param {Array} menu Navigation menu array
 * @throws error
 */
const route=menu=>
{
	try
	{
		Object.keys(config.routes).forEach(key=>
		{
			config.routes[key].forEach(r=>
			{
				if(r.pug)
					router[r.method](r.route.replace('[name]',name),auth[r.auth],(req,res)=>
					{
						return controller.schema(schema=>
						{
							return res.status(200).render(r.pug,{
								title:r.title,
								menu:menu,
								root:name,
								schema:schema,
								user:key,
								_id:req.params._id||null
							})
						})
					})
				else
					router[r.method](r.route.replace('[name]',name),auth[r.auth+'Api'],(req,res)=>
					{
						return controller[r.function](req,res,name,(error,data)=>
						{
							if(error)
								return res.status(500).json({status:false,data:data,error:error})
							if(!r.auth)
								return res.status(200).json({status:true,data:data,error:error})
							token=controller.refreshToken(req)
							return res.status(200).json({status:true,token:token,data:data,error:error})
						})
					})
			})
		})
	}
	catch(error)
	{
		console.log(error)
	}
}

module.exports.getRouter=getRouter
module.exports.setCoreController=setCoreController
module.exports.route=route