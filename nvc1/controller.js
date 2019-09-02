
const database=require('./database').con()
module.exports.selectOne=next=>
{
    database.query('SELECT 1', function (error,results,fields)
    {
        if(error) 
            throw error;
        console.log(results)
    })
}