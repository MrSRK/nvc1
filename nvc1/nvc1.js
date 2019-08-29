
const dotenv=require('dotenv')
const chalk=require('chalk')
const express=require('express')
const errorhandler=require('./errorhandler')
const logger=require('./logger')
const database=require('./database')
/**
 * Set's Environment Variables From .env File 
 */
dotenv.config()
/**
 * Initialize all the core function and use them at app
 */
exports.run=async(next)=>
{
    try
    {
        const app=new express();
        /**
         * Set Error Handler
         */
        await errorhandler.handle((error,handler)=>
        {
            if(error)
                throw error
            app.use(handler)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Errorhandler'))
        })
        /**
         * Set Looger
         */
        await logger.setLoger((error,morgan)=>
        {
            if(error)
                throw error
            app.use(morgan)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Logger'))
        })
        /**
         * Connect to MongoDB
        */
        await database.connect(error=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Database'))
        })
        /**
         * Return app
         */
        return next(null,app)
    }
    catch(error)
    {
        console.log('%s NVC1 %s',chalk.red('X'),chalk.red('Fatal Error'))
        return next(error,null)
    }
}