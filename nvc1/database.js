const mysql=require('mysql')
var connection=null
/**
 * Connect to Mysql.
*/
exports.connect=next=>
{
    try
    {
        connection=mysql.createConnection({
            host:process.env.MYSQL_HOST,
            user:process.env.MYSQL_USER,
            password:process.env.MYSQL_PWD,
            database:process.env.MYSQL_DATABASE
        })
        connection.connect(error=>
        {
            if(error)
                throw(error)
            return next(null,connection)
        })
    }
    catch(error)
    {
        return next(error,null)
    }
}
exports.desconnect=next=>
{
    connection.end(error=>
    {
        next(error)
    })
}
exports.con=_=>
{
    return connection
}