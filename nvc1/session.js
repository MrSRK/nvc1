const session=require('express-session')
const MongoStore=require('connect-mongo')(session)
module.exports=next=>
{
    try
    {
        s=session({
            resave:true,
            saveUninitialized:true,
            secret:process.env.SESSION_SECRET,
            cookie:{maxAge:604800000}, // 7 days
            store:new MongoStore({
              url:process.env.MONGODB_URI,
              autoReconnect:true,
            })
        })
        next(null,s)
    }
    catch(error)
    {
        next(error,null)
    }
}