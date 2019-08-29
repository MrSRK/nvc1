const fs=require('fs')
const path=require('path')
module.exports=async(next)=>
{
    views=[]
    try
    {
        const modulesDir=path.join(__dirname, '../modules')
        fs.exists(modulesDir,exists=>
        {
            if(!exists)
                fs.mkdir(modulesDir,{recursive:true},error=>
                {
                    if(error)
                        throw(error)
                    return next(null)
                })
            else
            {
                fs.readdir(modulesDir,(error,files)=>
                {
                    if(error)
                        throw(error)
                    files.forEach(file=>
                    {
                        if(fs.lstatSync(modulesDir+'/'+file).isDirectory())
                        {
                            if(fs.existsSync(modulesDir+'/'+file+'/views'))
                            {}
                        }
                    })
                })
                //asdasdasdad
            }
        })
    }
    catch(error)
    {
        next(error)
    }
    finally
    {
        console.log(views)
    }
}

//app.set('views',[path.join(__dirname, 'views'),path.join(__dirname, 'views2')])
//app.set('view engine','pug')