const express=require('express')
const path=require('path')
const fs=require('fs')
const chalk=require('chalk')
const router=express.Router()
module.exports=n=>
{
    try
    {
        loadNvc1Routers(error=>
        {
            if(error)
                throw(error,null)
            loadRouters(error=>
            {
                if(error)
                    throw(error,null)
            })
        })
        return n(null,router)
    }
    catch(error)
    {
        return n(error,null)
    }
}
const loadRouters=(next)=>
{
    try
    {
        let nvc1ModulesPath=path.join(__dirname, '../modules')
        fs.exists(nvc1ModulesPath,exists=>
        {
            if(exists)
                fs.readdir(nvc1ModulesPath,(error,files)=>
                {
                    if(error)
                        throw(error)
                    console.group(chalk.yellow('# Loading Express [Mudules] Routers'))
                    if(files.length==0)
                        console.log('%s %s',chalk.gray('-'),chalk.gray('none'))
                    files.forEach(file=>
                    {
                        if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\router.js'))
                        {
                            router.use(require(nvc1ModulesPath+'\\'+file+'\\router.js'))
                            console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
                        } 
                    })  
                    console.groupEnd()
                    return next(null)                 
                })
            else
                return next(null)
        })
    }
    catch(error)
    {
        return next(error)
    }
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
                    console.group(chalk.yellow('# Loading Express [Core] Routers'))
                    if(files.length==0)
                        console.log('%s %s',chalk.gray('-'),chalk.gray('none'))
                    files.forEach(file=>
                    {
                        if(fs.existsSync(nvc1ModulesPath+'\\'+file+'\\router.js'))
                        {
                            router.use(require(nvc1ModulesPath+'\\'+file+'\\router.js'))
                            console.log('%s Router [%s]\tAdd: %s',chalk.green('✓'),chalk.red(file),chalk.green('Successful'))
                        }
                    })
                    console.groupEnd()
                    return next(null)
                })
            else
                return next(null)
        })
    }
    catch(error)
    {
        return next(error)
    }
}