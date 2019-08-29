const errorhandler = require('errorhandler')
/**
 * Use error handler only at development mode
 */
exports.handle=async(next)=>
{
    try
    {
        if(process.env.NODE_ENV==='development')
            return next(null,errorhandler)
    }
    catch(error)
    {
        return next(error,null)
    }
}