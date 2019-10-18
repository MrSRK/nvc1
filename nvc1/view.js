const fs=require('fs')
const path=require('path')
/**
 * Collect all view direcroties for main and sub-modules and return them as array of string paths
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const __construct=next=>
{
	let views=[]
	try
	{
		return getNvc1GlobalViews((error,nvcgv)=>
		{
			if(error)
				throw(error)
			if(nvcgv)
				views=views.concat(nvcgv)
			return getNvc1Views((error,nvcv)=>
			{
				if(error)
					throw(error)
				if(nvcv)
					views=views.concat(nvcv)
				return getModulesViews((error,mv)=>
				{
					if(error)
						throw(error)
					if(mv)
						views=views.concat(mv)
					return next(null,views)
				})
			})
		})
	}
	catch(error)
	{
		return next(error,views)
	}
}
/**
 * Collect view direcroties for all mudules (if any)
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const getModulesViews=next=>
{
	try
	{
		let nvc1ModulesPath=path.join(__dirname, '../modules')
		return fs.exists(nvc1ModulesPath,exists=>
		{
			let views=[]
			if(exists)
				return fs.readdir(nvc1ModulesPath,(error,files)=>
				{
					if(error)
						throw(error)
					for(let i=0;i<files.length;i++)
						if(fs.existsSync(nvc1ModulesPath+'\\'+files[i]+'\\views'))
							views[views.length]=nvc1ModulesPath+'\\'+files[i]+'\\views'
					return next(null,views)
				})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Collect view direcroties for all core mudules (if any)
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const getNvc1Views=next=>
{
	try
	{
		let nvc1ModulesPath=path.join(__dirname, '../nvc1/modules')
		return fs.exists(nvc1ModulesPath,exists=>
		{
			let views=[]
			if(exists)
				return fs.readdir(nvc1ModulesPath,(error,files)=>
				{
					if(error)
						throw(error)
					for(let i=0;i<files.length;i++)
						if(fs.existsSync(nvc1ModulesPath+'\\'+files[i]+'\\views'))
							views[views.length]=nvc1ModulesPath+'\\'+files[i]+'\\views'
					return next(null,views)
				})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Collect view global direcroties (if any)
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const getNvc1GlobalViews=next=>
{
	try
	{
		let nvc1ViewsPath=path.join(__dirname, '../views')
		return fs.exists(nvc1ViewsPath,exists=>
		{
			if(exists)
				return next(null,[nvc1ViewsPath])
		})
	}
	catch(error)
	{
		return next(error,[])
	}
}
module.exports=__construct