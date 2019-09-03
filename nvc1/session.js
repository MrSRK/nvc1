const session=require('express-session')
var MySQLStore = require('express-mysql-session')(session);
module.exports=next=>
{
    try
    {
        next(null,session({
            key:'session',
            secret:process.env.SESSION_SECRET,
            store:new MySQLStore(
            {
                host:process.env.MYSQL_HOST,
                user:process.env.MYSQL_USER,
                password:process.env.MYSQL_PWD,
                database:process.env.MYSQL_DATABASE,
                clearExpired:true,
                checkExpirationInterval:86400000,
                expiration:86400000,
                endConnectionOnClose:true,
                schema:
                {
                    tableName:'express_sessions',
                    columnNames:
                    {
                        session_id:'session_id',
                        expires:'expires',
                        data:'data'
                    }
                }
            }),
            resave: false,
            saveUninitialized: false
        }))
    }
    catch(error)
    {
        next(error,null)
    }
}