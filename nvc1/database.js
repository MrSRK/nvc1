const mysql=require('mysql')
var connection=null
/**
 * 
 */
exports.select=(table,columns,where,order,limit)=>
{
    try
    {
        let sql=`SELECT ?? FROM ??`
        if(where)
            sql+=` WHERE ?`
        if(order)
            sql+=` ORDER BY ?`
        if(limit)
            if(limit.step&&limit.start)
                sql+=` LIMIT ${limit.start},${limit.step}`
            else
                sql+=` LIMIT ${limit}`
        var query=connection.query(sql,[columns,table,where],(error,results,fields)=>
        {
            if(error)
                throw error
            console.log(results)
        })
        console.log(query.sql)
    }
    catch(error)
    {
        console.log(error)
    }
}
exports.addColumns=(table,columns,next)=>
{
    try
    {
        connection.query(`SHOW COLUMNS FROM ${table}`,(error,rows,fields)=>
        {
            if(error)
                throw(error)
            let add=[]
            let after='is_active'
            let unick=true
            columns.forEach(col=>
            {
                unick=true
                let name=col.split(' ')[0]
                rows.forEach(row=>
                {
                    if(row.Field==name)
                        unick=false
                })
                if(unick)
                    add[add.length]=`ADD COLUMN ${col} AFTER ${after}`
                after=name
            })
            let sql=`
                ALTER TABLE
                ${table}
                ${add.join(',\n')}
            `
            connection.query(sql,error=>
            {
                if(error)
                    throw(error)
            })
        })
    }
    catch(error)
    {
        next(error)
    } 
}
exports.createTables=(table,referTables,next)=>
{
    try
    {
        let sql=`
            CREATE TABLE IF NOT EXISTS
            ${table} 
            (
                id INT NOT NULL AUTO_INCREMENT,
                is_active TINYINT(1) DEFAULT 1,
                date_add TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY  KEY(id)
            )
        `
        connection.query(sql,error=>
        {
            if(error)
                throw error
            if(referTables)
                referTables.forEach(subTable=>
                {
                    let sql=`
                        CREATE TABLE IF NOT EXISTS
                        ${subTable} 
                        (
                            id INT NOT NULL AUTO_INCREMENT,
                            parent_id INT NULL,
                            is_active TINYINT(1) DEFAULT 1,
                            date_add TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            date_mod TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY  KEY(id)
                            FOREIGN KEY (parent_id) REFERENCES ${table}(id) ON DELETE CASCADE
                        )
                    `
                    connection.query(sql,(error)=>
                    {
                        if(error)
                            throw error
                    })
                })
        })
    }
    catch(error)
    {
        next(error)
    }   
}
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
exports.con=_=>
{
    return connection
}