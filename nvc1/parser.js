const bodyParser=require('body-parser')
/**
 * Set parser as bodyParser json
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const setJson=async(next)=>
{
	try
	{
		return next(null,bodyParser.json())
	}
	catch(error)
	{
		next(error,null)
	}
}
/**
 * Set URL parser as BodyParser urlencoded
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const setUrlEncoded=async(next)=>
{
	try
	{
		return next(null,bodyParser.urlencoded({extended:true}))
	}
	catch(error)
	{
		next(error)
	}
}
module.exports.setJson=setJson
module.exports.setUrlEncoded=setUrlEncoded