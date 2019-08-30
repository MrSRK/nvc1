
const dotenv=require('dotenv')
const chalk=require('chalk')
const path=require('path')
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
const view=require('./view')
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
        console.group(chalk.yellow('# Loading Express [Core] Modules'))
        const app=new express();
        /**
         * Set Error Handler
         */
        await errorhandler.handle((error,handler)=>
        {
            if(error)
                throw error
            app.use(handler)
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('Errorhandler'),chalk.green('Successful'))
        })
        /**
         * Set Looger
         */
        await logger.setLoger((error,morgan)=>
        {
            if(error)
                throw error
            app.use(morgan)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Logger'),chalk.green('Successful'))
        })
        /**
         * 
         */
        await bodyParser.setJson((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (json)'),chalk.green('Successful'))
        })
        await bodyParser.setUrlEncoded((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (url)'),chalk.green('Successful'))
        })
        /**
         * Session Load
         */
        await session((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Session'),chalk.green('Successful'))
            return app.use(s)
        })
        /**
         * Cokkie Load
         */
        await cookie((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Cookie'),chalk.green('Successful'))
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
        console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Security'),chalk.green('Successful'))
        /**
         * Connect to MongoDB
        */
        await database.connect(error=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Database'),chalk.green('Successful'))
        })
        /*await storage.create('images','image',(error,upload)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s] Load: %s',chalk.green('✓'),chalk.red('Storage'),chalk.green('Successful'))
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
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Sass'),chalk.green('Successful'))
        })
        console.groupEnd()
        /**
         * Initialize Pug (jade)
         */
        await view((error,views)=>
        {
            if(error)
                throw(error)
            console.log(views)
            app.set('views',views)
            app.set('view engine','pug')
        })

        app.use('/',express.static(path.join(__dirname,'public')))
        app.use('/favicon.ico',express.static(path.join(__dirname,'public/images/favicon.ico')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/angular')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/popper.js/dist/umd')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/jquery/dist')))
        app.use('/webfonts',express.static(path.join(__dirname,'node_modules/@fortawesome/fontawesome-free/webfonts')))

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