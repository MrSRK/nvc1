const Model=require('./model')
const controller=require('../../controller')
exports.getSchema=next=>
{
    return controller.getSchema(Model,schema=>
    {
        return next(schema)
    })
}
exports.imageUpload=(_id,root,req,res,next)=>
{
    return controller.imageUpload(Model,_id,root,req,res,(error,data)=>
    {
        return next(error,data)
    })
}
exports.imageRemove=(_imgId,next)=>
{
    return controller.imageRemove(Model,_imgId,(error,data)=>
    {
        return next(error,data)
    })
}
exports.find=next=>
{
    return controller.find(Model,(error,data)=>
    {
        return next(error,data)
    })
}
exports.findById=(_id,next)=>
{
    return controller.findById(Model,_id,(error,data)=>
    {
        return next(error,data)
    })
}
exports.saveOne=(data,next)=>
{
    return controller.saveOne(Model,data,(error,data)=>
    {
        return next(error,data)
    })
}
exports.findByIdAndUpdate=(_id,data,next)=>
{
    return controller.findByIdAndUpdate(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
exports.findByIdAndUpdatePassword=(_id,data,next)=>
{
    return controller.findByIdAndUpdatePassword(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
exports.findOneAndDelete=(_id,data,next)=>
{
    return controller.findOneAndDelete(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
exports.signIn=(data,routerName,next)=>
{
    JWT_KEY=routerName
    return controller.signIn(Model,JWT_KEY,data,(status,error,data)=>
    {
        return next(status,error,data)
    })
}
exports.authentication=(req,res,next)=>
{
    const jwt = require("jsonwebtoken")
    try
    {
        if(!req.headers.authorization)
            throw(error)
        const token=req.headers.authorization.split(" ")[1]
        const privateKey=(process.env.JWT_KEY||'10')
        const decoded=jwt.verify(token,privateKey)
        console.log(decoded)
        return next()
    }
    catch(error)
    {
        console.log(error)
    }
}