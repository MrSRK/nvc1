const session=require('express-session')
const mongoose=require('mongoose')
const MongoStore=require('connect-mongo')(session)
/**
 * Collect all routes (from modules) and add return them
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const __construct=next=>
{
	try
	{
		const options={
			resave:true,
			saveUninitialized:true,
			secret:process.env.SESSION_SECRET,
			store: new MongoStore(
			{
				mongooseConnection: mongoose.connection
			})
		}
		next(null,session(options))
	}
	catch(error)
	{
		next(error)
	}
}
module.exports=__construct