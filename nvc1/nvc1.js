
const dotenv=require('dotenv')
const chalk=require('chalk')
const path=require('path')
const express=require('express')
const pug=require('pug')
const errorhandler=require('./errorhandler')
const logger=require('./logger')
const bodyParser=require('./parser')
const session=require('./session')
const cookie=require('./cookie')
const security=require('./security')
const database=require('./database')
const storage=require('./storage')
const sass=require('./sass')
const router=require('./router')
const view=require('./view')
/**
 * Set's Environment Variables From .env File 
 */
dotenv.config()
/**
 * Initialize all the core function and use them at app
 */
exports.run=next=>
{
    try
    {
        console.group(chalk.yellow('# Loading Express [Core] Modules'))
        const app=new express();
        /**
         * Set Error Handler
        */ 
        errorhandler.handler((error,handler)=>
        {
            if(error)
                throw error
            if(handler)
            {
                app.use(handler())
                console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('Errorhandler'),chalk.green('Successful'))
            }
        })
        /**
         * Set Looger
        */ 
        logger.setLoger((error,morgan)=>
        {
            if(error)
                throw error
            app.use(morgan)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Logger'),chalk.green('Successful'))
        })
        /**
         * 
        */ 
        bodyParser.setJson((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (json)'),chalk.green('Successful'))
        })
        bodyParser.setUrlEncoded((error,parser)=>
        {
            if(error)
                throw error
            app.use(parser)
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (url)'),chalk.green('Successful'))
        })
        /**
         * Session Load
        */ 
        session((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Session'),chalk.green('Successful'))
            return app.use(s)
        })
        /**
         * Cokkie Load
        */ 
        cookie((error,s)=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Cookie'),chalk.green('Successful'))
            return app.use(s)
        })
        /**
         * Security Loader CSRF XSS
        */
        app.use((req,res,n)=>
        {
            if(req.path!=='/public/images')
                security.csrf()(req,res,n)
        })
        app.use(security.xframe('SAMEORIGIN'))
        app.use(security.xssProtection(true))
        app.disable('x-powered-by')
        console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Security'),chalk.green('Successful'))
        /**
         * Connect to MongoDB
        */
        database.connect(error=>
        {
            if(error)
                throw(error)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Database'),chalk.green('Successful'))
        })
        /*storage.create('images','image',(error,upload)=>
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
        sass((error,s)=>
        {
            if(error)
                throw(error)
            app.use(s)
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Sass'),chalk.green('Successful'))
        })
        console.groupEnd()
        router((error,routs)=>
        {
            if(error)
                throw(error)
            app.use(routs)   
        })

        /**
         * Initialize Pug (jade)
         */
        console.group(chalk.yellow('# Loaading (pug) views direcroties'))
        view((error,views)=>
        {
            if(error)
                throw(error)
            app.set('views','views')
            app.set('view engine','pug')
            views.forEach(p=>
            {
                console.log('%s Views load \t\t\tLoad: %s\t\tFrom: %s',chalk.green('✓'),chalk.green('Successful'),chalk.gray(p))
            })
        })

        console.groupEnd()
        /**
         * Set Static files path
         */
        app.use('/',express.static(path.join(__dirname,'public')))
        app.use('/favicon.ico',express.static(path.join(__dirname,'public/images/favicon.ico')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/angular')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/popper.js/dist/umd')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/jquery/dist')))
        app.use('/webfonts',express.static(path.join(__dirname,'node_modules/@fortawesome/fontawesome-free/webfonts')))
        /**
         * 
         */
        app.listen(process.env.APP_PORT||80)
        app.get('',(req,res,n)=>
        {
            return res.status(404).render('404',{
                title:'404'
            })
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