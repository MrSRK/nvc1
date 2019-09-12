const session=require('express-session')
const mongoose=require('mongoose')
const MongoStore=require('connect-mongo')(session)
module.exports=next=>
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
		next(error,null)
	}
}