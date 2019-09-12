const Model=require('./model')
const controller=require('../../nvc1/controller')

exports.authenticationApi=(req,res,next)=>
{
    return controller.authenticationApi(req,res,error=>
    {
        next(error)
    })
}
exports.authentication=(req,res,next)=>
{
    return controller.authentication(req,res,error=>
    {
        next(error)
    })
}

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
exports.findOneAndDelete=(_id,root,data,next)=>
{
    return controller.findOneAndDelete(Model,_id,root,data,(error,data)=>
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