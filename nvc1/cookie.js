const cookieParser=require('cookie-parser')
/**
 * @async
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const __construct=async(next)=>
{
	try
	{
		const options={
			sameSite:true,
			secure:true,
			maxAge:604800000 // 7 days
		}
		return next(null,cookieParser(process.env.COOKIE_SECRET,options))
	}
	catch(error)
	{
		return next(error)
	}
}
/**
 * Exports Module's functions
 */
module.exports=__construct