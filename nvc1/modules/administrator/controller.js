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
    return controller.findById(Model,_id,data,(error,data)=>
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