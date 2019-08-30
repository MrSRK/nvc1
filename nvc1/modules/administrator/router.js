const express=require('express')
const router=express.Router()
const routerName=__filename.split('\\').reverse()[1]
//Administrator
router.get('/administrator/'+routerName,(req,res,next)=>
{
    return res.status(200).render('administrator/table',{
        title:'Table'
    })
})
router.get('/administrator/'+routerName+'/new',(req,res,next)=>
{
    return res.status(200).render('administrator/new',{
        title:'Table'
    })
})
router.get('/administrator/'+routerName+'/edit/:_id',(req,res,next)=>
{
    return res.status(200).render('administrator/edit',{
        title:'Table'
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
//Guest
router.get('/'+routerName+'/',(req,res,next)=>
{
    return res.status(200).render('guest/list',{
        title:'List'
    })
})
router.get('/'+routerName+'/show',(req,res,next)=>
{
    return res.status(200).render('guest/show',{
        title:'Show'
    })
})
router.all('/'+routerName+'/*',(req,res,next)=>
{
    return res.status(404).render('404',{
        title:'404'
    })
})
//Api
router.get('/api/'+routerName,(req,res,next)=>
{
    res.status(200).json({root:'list'})
})
router.get('/api/'+routerName+'/:_id',(req,res,next)=>
{
    res.status(200).json({root:'get'})
})
router.post('/api/'+routerName+'/',(req,res,next)=>
{
    res.status(200).json({root:'post'})
})
router.patch('/api/'+routerName+'/:_id',(req,res,next)=>
{
    res.status(200).json({root:'patch'})
})
router.delete('/api/'+routerName+'/:_id',(req,res,next)=>
{
    res.status(200).json({root:'delete'})
})
router.all('/api/'+routerName+'/*',(req,res,next)=>
{
    res.status(404).json({root:'404'})
})
module.exports=router