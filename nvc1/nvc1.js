
const dotenv=require('dotenv')
const chalk=require('chalk')
const express=require('express')
const errorhandler=require('./errorhandler')
const logger=require('./logger')
const bodyParser=require('./parser')
const session=require('./session')
const cookie=require('./cookie')
const security=require('./security')
const database=require('./database')
const storage=require('./storage')
const sass=require('./sass')
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
         * 
         */
        await bodyParser.setJson((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('parser (json)'))
        })
        await bodyParser.setUrlEncoded((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('parser (url)'))
        })
        /**
         * Session Load
         */
        await session((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Session'))
            return app.use(s)
        })
        /**
         * Cokkie Load
         */
        await cookie((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Cookie'))
            return app.use(s)
        })
        /**
         * Security Loader CSRF XSS
         */
        app.use((req,res,next)=>
        {
            if(req.path==='/public/images')
              next()
            else
                security.csrf()(req,res,next)
        })
        app.use(security.xframe('SAMEORIGIN'))
        app.use(security.xssProtection(true))
        app.disable('x-powered-by')
        console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Security'))
        /**
         * Connect to MongoDB
        */
        await database.connect(error=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Database'))
        })
        /*await storage.create('images','image',(error,upload)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Storage'))
            return upload(req,res,error=>
            {
                console.log('test')
            })
        })*/
        /**
         * Use Sass Module
         */
        await sass((error,s)=>
        {
            if(error)
                throw(error)
            app.use(s)
            console.log('%s Module [%s] successfully set...',chalk.green('✓'),chalk.red('Sass'))
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