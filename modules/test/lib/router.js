const router=require('express').Router()
const name=__filename.split('\\').reverse()[2]
const controller=require('./controller')
const config=require('../config.json')
const auth=controller.authFunctionsObject(config.auth)
exports.setCoreController=coreController=>
{
	try
	{
		return controller.setCoreController(coreController)
	}
	catch(error)
	{
		return false
	}
}
exports.route=menu=>
{
	Object.keys(config.routes).forEach(key=>
	{
		config.routes[key].forEach(r=>
		{
			router[r.method](r.route.replace('[name]',name),pug?auth[r.auth]:auth[r.auth+'Api'],(req,res)=>
			{
				if(pug)
					return controller.schema(schema=>
					{
						return res.status(200).render(pug,{
							title:r.title,
							menu:menu,
							root:name,
							schema:schema,
							user:key
						})
					})
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