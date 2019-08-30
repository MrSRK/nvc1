const sass=require('node-sass-middleware')
const path=require('path')
module.exports=next=>
{
    try
    {
        const s=sass({
            outputStyle: 'compressed',
            src:path.join(__dirname,'public'),
            dest: path.join(__dirname,'public')
        })
        return next(null,s)
    }
    catch(error)
    {
        return next(error,null)
    }
    
}