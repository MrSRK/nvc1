const express=require('express')
const controller=require('./controller')
const router=express.Router()
const routerName=__filename.split('\\').reverse()[1]
//Administrator Routs
router.get('/administrator/'+routerName,(req,res,next)=>
{
    return controller.find((error,data)=>
    {
        if(error)
            return res.status(500).render('500',{
                title:'Error',
                error:error
            })
        return res.status(200).render('administrator/table',{
            title:'Table',
            data:data
        })
    })
})
router.get('/administrator/'+routerName+'/new',(req,res,next)=>
{
    return res.status(200).render('administrator/new',{
        title:'New'
    })
})
router.get('/administrator/'+routerName+'/:_id',(req,res,next)=>
{
    return controller.findById(req.param._id,(error,data)=>
    {
        if(error)
            return res.status(500).render('500',{
                title:'Edit',
                error:error
            })
        return res.status(200).render('administrator/edit',{
            title:'Edit',
            data:data
        })
    })
    
})
router.get('/administrator/'+routerName+'/signUp',(req,res,next)=>
{
    return res.status(200).render('administrator/signUp',{
        title:'sign Up'
    })
})
router.get('/administrator/'+routerName+'/signIn',(req,res,next)=>
{
    return res.status(200).render('administrator/signIn',{
        title:'sign In'
    })
})
router.all('/administrator/'+routerName+'/*',(req,res,next)=>
{
    return res.status(404).render('404',{
        title:'404'
    })
})
/**
 * Guest Routs
 */
router.get('/'+routerName+'/',(req,res,next)=>
{
    return controller.find((error,data)=>
    {
        if(error)
            return res.status(500).render('500',{
                title:'List',
                error:error
            })
        return res.status(200).render('guest/list',{
            title:'List',
            data:data
        })

    })
    
})
router.get('/'+routerName+'/:_id',(req,res,next)=>
{
    return controller.findById(req.param._id,(error,data)=>
    {
        if(error)
            return res.status(500).render('500',{
                title:'Error',
                error:error
            })
        return res.status(200).render('guest/show',{
            title:'Show',
            data:data
        })
    })
})
router.all('/'+routerName+'/*',(req,res,next)=>
{
    return res.status(404).render('404',{
        title:'404'
    })
})
//Api Routs
router.get('/api/'+routerName,(req,res,next)=>
{
    return controller.find((error,data)=>
    {
        if(error)
            return res.status(500).json({status:false,data:data,error:error})
        return res.status(200).json({status:true,data:data,error:error})

    })
})
router.get('/api/'+routerName+'/:_id',(req,res,next)=>
{
    return controller.findById(req.param._id,(error,data)=>
    {
        if(error)
            return res.status(500).json({status:false,data:data,error:error})
        return res.status(200).json({status:true,data:data,error:error})
    })
})
router.put('/api/'+routerName+'/',(req,res,next)=>
{
    let data=req.body.data
    return controller.saveOne(data,(error,data)=>
    {
        if(error)
            return res.status(500).json({status:false,data:data,error:error})
        return res.status(200).json({status:true,data:data,error:error})
    })
})
router.patch('/api/'+routerName+'/:_id',(req,res,next)=>
{
    let data=req.body.data
    return controller.findByIdAndUpdate(req.param._id,data,(error,data)=>
    {
        if(error)
            return res.status(500).json({status:false,data:data,error:error})
        return res.status(200).json({status:true,data:data,error:error})
    })
})
router.delete('/api/'+routerName+'/:_id',(req,res,next)=>
{
    return controller.findOneAndDelete(req.param._id,(error,data)=>
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
module.exports=router