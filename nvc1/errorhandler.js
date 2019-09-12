const errorhandler=require('errorhandler')
/**
 * Use error handler only at development mode
 */
exports.handler=next=>
{
	try
	{
		if(process.env.NODE_ENV==='development')
			return next(null,errorhandler)
		return next(null,null)
	}
	catch(error)
	{
		return next(error,null)
	}
}