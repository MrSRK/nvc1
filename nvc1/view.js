const fs=require('fs')
const path=require('path')
module.exports=async(next)=>
{
    let views=[]
    try
    {
        getNvc1Views((error,nvcv)=>
        {
            if(error)
                throw(error)
            views=views.concat(nvcv)
            getModulesViews((error,mv)=>
            {
                if(error)
                    throw(error)
                views=views.concat(mv)
                next(null,views)
            })
        })
    }
    catch(error)
    {
        next(error,views)
    }    
}
const getModulesViews=next=>
{
    try
    {
        let nvc1ModulesPath=path.join(__dirname, '../modules')
        fs.exists(nvc1ModulesPath,exists=>
        {
            let views=[]
            if(exists)
                fs.readdir(nvc1ModulesPath,(error,files)=>
                {
                    if(error)
                        throw(error)
                    for(let i=0;i<files.length;i++)
                        if(fs.existsSync(nvc1ModulesPath+'\\'+files[i]+'\\views'))
                            views[views.length]=nvc1ModulesPath+'\\'+files[i]+'\\views'
                    next(null,views)                 
                })
        })
    }
    catch(error)
    {
        next(error,null)
    }
    
}
const getNvc1Views=next=>
{
    try
    {
        let nvc1ViewsPath=path.join(__dirname, '../views')
        fs.exists(nvc1ViewsPath,exists=>
        {
            if(exists)
                next(null,[nvc1ViewsPath]) 
        })
    }
    catch(error)
    {
        next(error,[])
    } 
}