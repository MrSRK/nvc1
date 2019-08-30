const express=require('express')
const path=require('path')
const fs=require('fs')
const router=express.Router()
module.exports=n=>
{
    loadNvc1Routers((error)=>
    {
        if(error)
            console.log(error)
    })
    return n(null,router)
}
const loadNvc1Routers=(next)=>
{
    try
    {
        let nvc1ModulesPath=path.join(__dirname, '../nvc1/modules')
        fs.exists(nvc1ModulesPath,exists=>
        {
            if(exists)
                fs.readdir(nvc1ModulesPath,(error,files)=>
                {
                    if(error)
                        throw(error)
                    files.forEach(file=>
                    {
                        if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\router.js'))
                            router.use(require(nvc1ModulesPath+'\\'+file+'\\router.js'))
                    })  
                    next(null)                 
                })
        })
    }
    catch(error)
    {
        next(error)
    }
}