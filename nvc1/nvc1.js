
const dotenv=require('dotenv')
const chalk=require('chalk')
const path=require('path')
const express=require('express')
const pug=require('pug')
var favicon=require('serve-favicon')
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
                console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('Errorhandler'),chalk.green('Successful'))
                return app.use(handler())
            }
        })
        /**
         * Set Looger
        */ 
        logger.setLoger((error,morgan)=>
        {
            if(error)
                throw error
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Logger'),chalk.green('Successful'))
            return app.use(morgan)
        })
        /**
         * 
        */ 
        bodyParser.setJson((error,parser)=>
        {
            if(error)
                throw error
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (json)'),chalk.green('Successful'))
            return app.use(parser)
        })
        bodyParser.setUrlEncoded((error,parser)=>
        {
            if(error)
                throw error
            console.log('%s Module [%s]\tLoad: %s',chalk.green('✓'),chalk.red('parser (url)'),chalk.green('Successful'))
            return app.use(parser)
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
            if(process.env.NODE_ENV!=='development')
                if(req.path!=='/public/images')
                    security.csrf()(req,res,n)
                else
                    return n()
            else
                return n()
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
            console.log('%s Module [%s]\t\tLoad: %s',chalk.green('✓'),chalk.red('Sass'),chalk.green('Successful'))
            return app.use(s)
        })
        console.groupEnd()
        /**
         * Administrator Dashboard Route
         */
        app.get('/administrator/',(req,res,next)=>
        {
            return res.status(200).render('administrator/home',{
                title:'Dashboard'
            })
        })
        /**
         * Routs
         */
        router((error,routs)=>
        {
            if(error)
                throw(error)
            return app.use(routs)   
        })
        /**
         * Initialize Pug (jade)
         */
        view((error,views)=>
        {
            console.group(chalk.yellow('# Loaading (pug) views direcroties'))
            if(error)
                throw(error)
            app.set('views',views)
            views.forEach(p=>
            {
                console.log('%s Views \t\t\tLoad: %s\t\tFrom: %s',chalk.green('✓'),chalk.green('Successful'),chalk.gray(p))
            })
            console.groupEnd()
            return app.set('view engine','pug')
        })
        /**
         * Set Static files path
         */
        app.use(favicon(path.join(__dirname, '../public/images/', 'favicon.ico')))
        app.use('/',express.static(path.join(__dirname,'public')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/angular')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/popper.js/dist/umd')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
        app.use('/js/lib',express.static(path.join(__dirname,'node_modules/jquery/dist')))
        app.use('/webfonts',express.static(path.join(__dirname,'node_modules/@fortawesome/fontawesome-free/webfonts')))
        /**
         * Default Pages
         */
        app.get('',(req,res,next)=>
        {
            return res.status(404).render('home',{
                title:'Home Page'
            })
        })
        app.get('*',(req,res,n)=>
        {
            return res.status(404).render('404',{
                title:'404'
            })
        })
        /**
         * Listening Port
         */
        app.listen(process.env.APP_PORT||80)
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