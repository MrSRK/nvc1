const sass=require('node-sass-middleware')
const path=require('path')
/**
 * Enable sass module and set publc directory for sass and css files
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const __construct=next=>
{
	try
	{
		const s=sass({
		   // outputStyle: 'compressed',
			src:path.join(__dirname,'../public'),
			dest: path.join(__dirname,'../public')
		})
		return next(null,s)
	}
	catch(error)
	{
		return next(error)
	}
}
module.exports=__construct