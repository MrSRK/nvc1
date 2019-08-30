const mysql=require('mysql')
let connection=null
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
            password:MYSQL_PWD,
            database:MYSQL_DATABASE
        })
        connection.connect(error=>
        {
            if(error)
                throw(error)
            next(null,connection)
        })
    }
    catch(error)
    {
        next(error,null)
    }
}
exports.desconnect=next=>
{
    connection.end(error=>
    {
        next(error)
    })
}
exports.con=connection