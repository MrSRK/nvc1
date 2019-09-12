const express=require('express')
const path=require('path')
const fs=require('fs')
const chalk=require('chalk')
const router=express.Router()
const controller=require('./controller')
const expressStatusMonitorrequire=require('express-status-monitor')

const routes=[]
exports.route=n=>
{
	try
	{
		/**
		 * Administrator Dashboard Route
		 */
		loadNvc1Routers(error=>
		{
			if(error)
				throw(error,null)
			loadRouters(error=>
			{
				let menu=[]
				routes.forEach(r=>{
					menu[menu.length]=r.name
				})
				if(error)
					throw(error,null)
				router.get('/administrator',controller.authentication,(req,res,next)=>
				{
					return res.status(200).render('administrator/home',{
						title:'Dashboard',
						menu:menu
					})
				})
				router.get('/api',(req,res,next)=>
				{
					let r=[]
					menu.forEach(m=>
					{
						r[r.length]={
							name:m,
							path:'/'+m,
							routines:{
								list:"GET /"+m+"/",
								show:"GET /"+m+"/:_id",
								table:"GET /administrator/"+m+"/",
								insert:"PUT /administrator/"+m+"/new",
								update:"PATCH /administrator/"+m+"/:_id",
								remove:"DELETE /administrator/"+m+"/:_id",
							}
						}
					})
					return res.status(200).json({status:true,error:null,message:'Welcome to API',routes:r})

				})
				const config={
					healthChecks:[
					{
						protocol: 'http',
  						host: 'localhost',
						port: '80',
						path: '/'
					},
					{
						protocol: 'http',
  						host: 'localhost',
						port: '80',
						path: '/api'
					},
					{
						protocol: 'http',
  						host: 'localhost',
						port: '80',
						path: '/administrator',
					}]
				}
				const statusMonitor=expressStatusMonitorrequire(config)
				router.use(statusMonitor)
				router.get('/administrator/status',controller.authentication,statusMonitor.pageRoute)
				routes.forEach(r=>
				{
					router.use(require(r.path).route(menu))
				})
			})
		})
		return n(null,router)
	}
	catch(error)
	{
		return n(error,null)
	}
}
const loadRouters=(next)=>
{
	try
	{
		let nvc1ModulesPath=path.join(__dirname, '../modules')
		fs.exists(nvc1ModulesPath,exists=>
		{
			if(exists)
				fs.readdir(nvc1ModulesPath,(error,files)=>
				{
					if(error)
						throw(error)
					console.group(chalk.yellow('# Loading Express [Mudules] Routers'))
					if(files.length==0)
						console.log('%s %s',chalk.gray('-'),chalk.gray('none'))
					files.forEach(file=>
					{
						if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\router.js'))
						{
							//router.use(require(nvc1ModulesPath+'\\'+file+'\\router.js'))
							routes[routes.length]={name:file,path:nvc1ModulesPath+'\\'+file+'\\router.js'}
							console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
						} 
					})  
					console.groupEnd()
					return next(null)                 
				})
			else
				return next(null)
		})
	}
	catch(error)
	{
		return next(error)
	}
}
const loadNvc1Routers=(next)=>
{
	try
	{
		let nvc1ModulesPath=path.join(__dirname, '../nvc1/modules')
		fs.exists(nvc1ModulesPath,exists=>
		{
			if(exists)
				fs.readdir(nvc1ModulesPath,(error,files)=>
				{
					if(error)
						throw(error)
					console.group(chalk.yellow('# Loading Express [Core] Routers'))
					if(files.length==0)
						console.log('%s %s',chalk.gray('-'),chalk.gray('none'))
					files.forEach(file=>
					{
						if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\router.js'))
						{
							//router.use(require(nvc1ModulesPath+'\\'+file+'\\router.js'))
							routes[routes.length]={name:file,path:nvc1ModulesPath+'\\'+file+'\\router.js'}
							console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
						}
					})
					console.groupEnd()
					return next(null)
				})
			else
				return next(null)
		})
	}
	catch(error)
	{
		return next(error)
	}
}