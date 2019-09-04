const Model=require('./model')
const controller=require('../../controller')
module.exports.find=next=>
{
    return controller.find(Model,(error,data)=>
    {
        if(error)
            return next(error,data)
        return next(error,data)
    })
}
module.exports.findById=(id,next)=>
{
    return controller.findById(Model,id,(error,data)=>
    {
        if(error)
            return next(error,data)
        return next(error,data)
    })
}
module.exports.saveOne=(data,next)=>
{
    return controller.saveOne(Model,data,(error,data)=>
    {
        if(error)
            return next(error,data)
        return next(error,data)
    })
}
module.exports.findByIdAndUpdate=(id,data,next)=>
{
    return controller.findById(Model,id,data,(error,data)=>
    {
        if(error)
            return next(error,data)
        return next(error,data)
    })
}
module.exports.findOneAndDelete=(id,data,next)=>
{
    return controller.findOneAndDelete(Model,id,data,(error,data)=>
    {
        if(error)
            return next(error,data)
        return next(error,data)
    })
}