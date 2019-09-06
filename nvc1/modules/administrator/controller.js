const Model=require('./model')
const controller=require('../../controller')
module.exports.find=next=>
{
    return controller.find(Model,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findById=(_id,next)=>
{
    return controller.findById(Model,_id,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.saveOne=(data,next)=>
{
    return controller.saveOne(Model,data,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findByIdAndUpdate=(_id,data,next)=>
{
    return controller.findByIdAndUpdate(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findByIdAndUpdatePassword=(_id,data,next)=>
{
    return controller.findByIdAndUpdatePassword(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findOneAndDelete=(_id,data,next)=>
{
    return controller.findOneAndDelete(Model,_id,data,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.signIn=(data,routerName,next)=>
{
    JWT_KEY=routerName
    return controller.signIn(Model,JWT_KEY,data,(status,error,data)=>
    {
        return next(status,error,data)
    })
}
module.exports.authentication=(req,res,next)=>
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