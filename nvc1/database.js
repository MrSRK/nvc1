const mongoose=require('mongoose')
require('mongoose-schema-jsonschema')(mongoose);
/**
 * Connect to MongoDB.
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const connect=async(next)=>
{
	try
	{
		mongoose.set('useFindAndModify',false)
		mongoose.set('useCreateIndex',true)
		mongoose.set('useNewUrlParser',true)
		mongoose.connect(process.env.MONGODB_URI)
		return next(null,mongoose)
	}
	catch(error)
	{
		return next(error)
	}

}
module.exports.connect=connect