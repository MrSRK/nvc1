const cookieParser=require('cookie-parser')
module.exports=async(next)=>
{
    try
    {
        const options={
            sameSite:true,
            secure:true,
            maxAge:604800000 // 7 days
        }
        const c=cookieParser(process.env.COOKIE_SECRET,options)
        next(null,c)
    }
    catch(error)
    {
        next(error,null)
    }
}