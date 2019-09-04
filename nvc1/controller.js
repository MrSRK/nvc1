
const db=require('./database')
module.exports.find=(Model,next)=>
{
    Model.find((error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findById=(Model,_id,next)=>
{
    Model.findById(_id,(error,data)=>
    {
        return next(error,data)
    })
}
exports.saveOne=(Model,data,next)=>
{
    model=new Model(data)
    model.save((error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findByIdAndUpdate=(Model,_id,data,next)=>
{
    const options=
    {
        new:true,
        select:'-password'
    }
    Model.findByIdAndUpdate(_id,data,options,(error,data)=>
    {
        return next(error,data)
    })
}
module.exports.findOneAndDelete=(Model,_id,data,next)=>
{
    Model.findOneAndDelete(_id,data,options,(error,data)=>
    {
        return next(error,data)
    })
}