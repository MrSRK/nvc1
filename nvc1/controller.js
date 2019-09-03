
const db=require('./database')
module.exports.selectOne=next=>
{
    db.select('test',['test.id','test.test1','test.test2'],{id:1})

   // db.createTables('administrator')


    /*db.addColumns('administrator',
    [
        'test VARCHAR(254) NULL',
        'test2 VARCHAR(254) NULL',
        'test3 VARCHAR(254) NULL',
        'test4 VARCHAR(254) NULL',
        'test5 VARCHAR(254) NULL'
    ],
    error=>
    {
        console.log(error)
    })*/
}