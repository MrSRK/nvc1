const mongoose=require('mongoose')
/**
 * Connect to MongoDB.
*/
exports.connect=next=>
{
    try
    {
        const options={
            useFindAndModify:false,
            useCreateIndex:true,
            useNewUrlParser:true
        }
        mongoose.connect(process.env.MONGODB_URI,options)
        return next(null,mongoose)
    }
    catch(error)
    {
        return next(error,null)
    }
}
