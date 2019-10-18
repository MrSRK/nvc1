const errorhandler=require('errorhandler')
/**
 * Use error handler only at development mode
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const handler=next=>
{
	try
	{
		if(process.env.NODE_ENV==='development')
			return next(null,errorhandler)
		return next()
	}
	catch(error)
	{
		return next(error)
	}
}
module.exports.handler=handler