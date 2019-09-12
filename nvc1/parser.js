const bodyParser=require('body-parser')
exports.setJson=next=>
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
exports.setUrlEncoded=async(next)=>
{
	try
	{
		return next(null,bodyParser.urlencoded({extended:true}))
	}
	catch(error)
	{
		next(error,null)
	}
}