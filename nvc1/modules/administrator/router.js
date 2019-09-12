const express=require('express')
const controller=require('./controller')
const router=express.Router()
const routerName=__filename.split('\\').reverse()[1]

const authenticationApi=controller.authenticationApi
const authentication=controller.authentication

exports.route=(menu)=>
{
	//Administrator Routs
	router.get('/administrator/'+routerName,authentication,(req,res,next)=>
	{
		return res.status(200).render('administrator/table',{
			title:'Table',
			menu:menu,
			root:routerName
		})
	})
	router.get('/administrator/'+routerName+'/new',authentication,(req,res,next)=>
	{
		return controller.getSchema(schema=>
		{
			return res.status(200).render('administrator/new',{
				title:'New',
				menu:menu,
				root:routerName,
				schema:schema,
			})
		})
	})
	router.get('/administrator/'+routerName+'/signUp',(req,res,next)=>
	{
		return res.status(200).render('administrator/signUp',{
			title:'sign Up',
			menu:menu,
			root:routerName
		})
	})
	router.get('/administrator/'+routerName+'/signIn',(req,res,next)=>
	{
		return res.status(200).render('administrator/signIn',{
			title:'sign In',
			menu:menu,
			root:routerName
		})
	})
	router.get('/administrator/'+routerName+'/signOut',(req,res,next)=>
	{
		if(req.session&&req.session.user&&req.session.user[routerName])
			delete req.session.user[routerName]
		return res.redirect(302,'/administrator/administrator/signIn')
	})
	router.get('/administrator/'+routerName+'/:_id',authentication,(req,res,next)=>
	{
		return controller.getSchema(schema=>
		{
			return res.status(200).render('administrator/edit',{
				title:'Edit',
				menu:menu,
				root:routerName,
				schema:schema,
				_id:req.params._id
			})
		})
	})
	router.all('/administrator/'+routerName+'/*',(req,res,next)=>
	{
		return res.status(404).render('404',{
			title:'404',
			menu:menu,
			root:routerName
		})
	})
	//Api Routs
	router.get('/api/'+routerName,authenticationApi,(req,res,next)=>
	{
		return controller.find((error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.post('/api/'+routerName+'/signIn',(req,res,next)=>
	{
		let data=req.body.data
		return controller.signIn(data,routerName,(status,error,data)=>
		{
			if(status==401)
				return res.status(401).json({status:false,data:data,error:error}) 
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			if(!req.session.user)
				req.session.user={}
			//No need session info to confirm jwt
			req.session.user[routerName]={
				_id:data.user._id,
				root:routerName,
				email:data.user.email,
				token:data.token,
				root:routerName
			}
			return res.status(200).json({status:true,data:{token:data.token},error:error})
		})
	})
	router.get('/api/'+routerName+'/:_id',authenticationApi,(req,res,next)=>
	{
		return controller.findById(req.params._id,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.put('/api/'+routerName+'/',authenticationApi,(req,res,next)=>
	{
		let data=req.body.data
		return controller.saveOne(data,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.patch('/api/'+routerName+'/:_id',authenticationApi,(req,res,next)=>
	{
		let data=req.body.data
		return controller.findByIdAndUpdate(req.params._id,data,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.patch('/api/'+routerName+'/upload-image/:_id',authenticationApi,(req,res,next)=>
	{
		return controller.imageUpload(req.params._id,'/'+routerName,req,res,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.patch('/api/'+routerName+'/remove-image/:_imgId',authenticationApi,(req,res,next)=>
	{
		return controller.imageRemove(req.params._imgId,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.patch('/api/'+routerName+'/reset-password/:_id',authenticationApi,(req,res,next)=>
	{
		let data=req.body.data
		return controller.findByIdAndUpdatePassword(req.params._id,data,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.delete('/api/'+routerName+'/:_id',authenticationApi,(req,res,next)=>
	{
		return controller.findOneAndDelete(req.params._id,routerName,(error,data)=>
		{
			if(error)
				return res.status(500).json({status:false,data:data,error:error})
			return res.status(200).json({status:true,data:data,error:error})
		})
	})
	router.all('/api/'+routerName+'/*',(req,res,next)=>
	{
		return res.status(404).json({status:false,data:null,error:{name:404,message:"Page not Found"}})
	})
	return router
}
