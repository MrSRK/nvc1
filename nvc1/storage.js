const multer=require('multer')
const fs = require('fs')
const path = require('path')
let config={
	root:process.env.STORAGE_ROOT||'uploads/',
	subroot:'',
	name:'file'
}
/**
 *
 */
exports.create=(subroot,name,next)=>
{
	try
	{
		config.subroot=subroot
		config.name=name
		const storage=multer.diskStorage(
		{
			destination:destination,
			filename:filename
		})
		return next(null,multer({storage:storage}).single(config.name))
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 *
 */
 const destination=(req,file,next)=>
 {
	try
	{
		const filepath=path.join(__dirname, '../'+config.root+config.subroot)
		console.log(filepath)

		fs.exists(filepath,exists=>
		{
			if(!exists)
				fs.mkdir(filepath,{recursive:true},error=>
				{
					if(error)
						throw(error)
					return next(null,filepath)
				})
			else
				return next(null,filepath)
		})
	}
	catch(error)
	{
		next(error,null)
	}
 }
 /**
  *
  * @param {*} req
  * @param {*} file
  * @param {*} next
  */
 const filename=(req,file,next)=>
 {
	try
	{
		const filepath=path.join(__dirname, '../'+config.root+config.subroot)
		let ext=''
		if(file.originalname.lastIndexOf('.')>=0)
			ext='.'+file.originalname.split('.').reverse()[0]
		if(typeof req.files==undefined||!req.files)
			req.files={}
		var name=Date.now()+ext
		file.filename=name
		file.path=filepath+'/'+name
		req.files[config.name]=file
		next(null,name)
	}
	catch(error)
	{
		next(error,null)
	}
 }