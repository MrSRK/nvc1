const mongoose=require('mongoose')
/**
 * Connect to MongoDB.
*/
exports.connect=next=>
{
    try
    {
        mongoose.set('useFindAndModify',false)
        mongoose.set('useCreateIndex',true)
        mongoose.set('useNewUrlParser',true)
        mongoose.connect(process.env.MONGODB_URI)
        next(null,mongoose)
    }
    catch(error)
    {
        next(error,null)
    }

}