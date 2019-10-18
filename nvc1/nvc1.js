
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
const sass=require('./sass')
const router=require('./router')
const view=require('./view')
/**
 * Set's Environment Variables From .env File
 */
dotenv.config()
/**
 * Initialize all the core function and use them at app
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const run=next=>
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
				return app.use(handler())
			return false
		})
		/**
		 * Set Looger
		*/
		logger.setLoger((error,morgan)=>
		{
			if(error)
				throw error
			return app.use(morgan)
		})
		/**
		 * Set Parser
		*/
		bodyParser.setJson((error,parser)=>
		{
			if(error)
				throw error
			return app.use(parser)
		})
		bodyParser.setUrlEncoded((error,parser)=>
		{
			if(error)
				throw error
			return app.use(parser)
		})
		/**
		 * Session Load
		*/
		session((error,s)=>
		{
			if(error)
				throw(error)
			return app.use(s)
		})
		/**
		 * Cokkie Load
		*/
		cookie((error,s)=>
		{
			if(error)
				throw(error)
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
		/**
		 * Connect to MongoDB
		*/
		database.connect(error=>
		{
			if(error)
				throw(error)
		})
		/**
		 * Use Sass Module
		 */
		sass((error,s)=>
		{
			if(error)
				throw(error)
			return app.use(s)
		})
		console.groupEnd()
		/**
		 * Set Static files path
		 */
		app.use('/',express.static(path.join(__dirname,'../public')))
		app.use('/images',express.static(path.join(__dirname,'../uploads/images')))
		app.use('/js/lib',express.static(path.join(__dirname,'../node_modules/angular')))
		app.use('/js/lib',express.static(path.join(__dirname,'../node_modules/popper.js/dist/umd')))
		app.use('/js/lib',express.static(path.join(__dirname,'../node_modules/bootstrap/dist/js')))
		app.use('/js/lib',express.static(path.join(__dirname,'../node_modules/jquery/dist')))
		app.use('/webfonts',express.static(path.join(__dirname,'../node_modules/@fortawesome/fontawesome-free/webfonts')))
		app.use('/favicon.ico',express.static(path.join(__dirname,'../public/images/favicon.ico')))
		/**
		 * Static manifest
		 */
		app.get('/cache.manifest',(req,res)=>
		{
			res.append('Content-Type','text/cache-manifest')
			res.write('CACHE MANIFEST\n\n')

			res.write('CACHE:\n')
			res.write('/css/main.css\n')
			res.write('/js/lib/jquery.min.js\n')
			res.write('/js/lib/popper.min.js\n')
			res.write('/js/lib/bootstrap.min.js\n')
			res.write('/js/lib/angular.min.js\n')
			res.write('/js/main.js\n')
			res.write('/favicon.ico\n')

			res.write('/webfonts/fa-solid-900.woff2\n')

			res.write('/\n')
			res.write('/customer\n')
			//res.write('/test\n')

			res.end()
		})

		/**
		 * Routs
		 */
		router.route((error,routs)=>
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
			if(error)
				throw(error)
			app.set('views',views)
			return app.set('view engine','pug')
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
		return next(error)
	}
}
exports.run=run