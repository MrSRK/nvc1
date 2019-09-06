const bcrypt = require('bcrypt-nodejs')
const jwt = require("jsonwebtoken")
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
    if(data.password)
        delete data.password
    bcrypt.genSalt(10,(error,salt)=>
    {
        if(error)
            return next(error)
        bcrypt.hash(data.password,salt,null,(error,hash)=>
        {
            data.password=hash
            const options=
            {
                new:true,
                select:'-password'
            }
            return Model.findByIdAndUpdate(_id,data,options,(error,data)=>
            {
                return next(error,data)
            })
        })
    })
}
module.exports.findByIdAndUpdatePassword=(Model,_id,data,next)=>
{
    if(!ObjectId.isValid(_id))
        return next({name:'Error',message:'Invalid ID'})
    if(!data.password)
        return next({name:"Error",message:"Password not set"})

    bcrypt.genSalt(10,(error,salt)=>
    {
        if(error)
            return next(error)
        bcrypt.hash(data.password,salt,null,(error,hash)=>
        {
            data.password=hash
            const options=
            {
                new:true,
                select:'-password'
            }
            return Model.findByIdAndUpdate(_id,{password:data.password},options,(error,data)=>
            {
                return next(error,data)
            })
        })
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
module.exports.signIn=(Model,JWT_KEY,data,next)=>
{
    try
    {
        if(!data||!data.email)
            return next(401,{name:"Error",message:"Email or Password not set"},null)
         if(!data||!data.password)
            return next(401,{name:"Error",message:"Email or Password not set"},null)
        const email=data.email
        const password=data.password
        return Model.findOne({email:email},(error,data)=>
        {
            if(error)
                return next(500,error,null)
            if(!data)
                return next(401,{name:"Error",message:"Incorrect Email or Password"},null)
            bcrypt.compare(password,data.password,(error,match)=>
            {
                if(error)
                    return next(500,error,null)
                if(!match)
                    return next(401,{name:"Error",message:"Incorrect Email or Password"},null)
                const privateKey=(process.env.JWT_KEY||'10')+JWT_KEY
                const expires=process.env.JWT_EXPIRES||"1h"
                const token=jwt.sign(
                {
                    userId:data._id,
                    root:JWT_KEY
                },
                privateKey,
                {
                    expiresIn:expires
                })
                return next(200,null,{user:data,token:token})
            })
        })
    }
    catch(error)
    {
        return next(500,error,null)
    }
}