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
		const auth=controller.authFunctionsObject('administrator')
		/**
		 * Administrator Dashboard Route
		 */
		loadNvc1Routers(error=>
		{
			if(error)
				throw(error)
			loadRouters(error=>
			{
				if(error)
					throw(error,null)
				let menu=[]
				routes.forEach(r=>{
					menu[menu.length]=r.name
				})
				/**
				 * Default Pages
				 */
				router.get('/',(req,res)=>
				{
					return res.status(200).render('home',{
						title:'Home Page',
						menu:menu
					})
				})
				router.get('/administrator',auth['administrator'],(req,res)=>
				{
					return res.status(200).render('administrator/home',{
						title:'Dashboard',
						menu:menu
					})
				})
				router.get('/api',(req,res)=>
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
						path: '/administrator'
					}]
				}
				const statusMonitor=expressStatusMonitorrequire(config)
				router.use(statusMonitor)
				router.get('/administrator/status',auth['administrator'],statusMonitor.pageRoute)
				routes.forEach(r=>
				{
					let ro=require(r.path)
					ro.setCoreController(controller)
					ro.route(menu)
					router.use(ro.router())
				})
				router.get('*',(req,res)=>
				{
					return res.status(404).render('404',{
						title:'404'
					})
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
						if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\index.js'))
						{
							console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
							routes[routes.length]={name:file,path:nvc1ModulesPath+'\\'+file+'\\index.js'}
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
						if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\index.js'))
						{
							console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
							routes[routes.length]={name:file,path:nvc1ModulesPath+'\\'+file+'\\index.js'}
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
		console.log(error)
		return next(error)
	}
}