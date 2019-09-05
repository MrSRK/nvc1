const ObjectId=require('mongoose').Types.ObjectId;
module.exports.find=(Model,next)=>
{
    return Model.find((error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findById=(Model,_id,next)=>
{
    if(!ObjectId.isValid(_id))
        return next({name:'Error',message:'Invalid ID'})
    return Model.findById(_id,(error,data)=>
    {
        return next(error,data)
    })
}
exports.saveOne=(Model,data,next)=>
{
    model=new Model(data)
    return model.save((error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findByIdAndUpdate=(Model,_id,data,next)=>
{
    if(!ObjectId.isValid(_id))
        return next({name:'Error',message:'Invalid ID'})
    const options=
    {
        new:true,
        select:'-password'
    }
    return Model.findByIdAndUpdate(_id,data,options,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findOneAndDelete=(Model,_id,data,next)=>
{
    if(!ObjectId.isValid(_id))
        return next({name:'Error',message:'Invalid ID'})
    return Model.findOneAndDelete(_id,data,options,(error,data)=>
    {
        return next(error,data)
    })
}