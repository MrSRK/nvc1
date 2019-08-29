const chalk=require('chalk')

const nvc1=require('./nvc1/nvc1')

nvc1.run(async(error,app)=>
{
    if(!error)
        return console.log('%s Process Running...',chalk.blue('i'))
    console.error(error)
    console.log('%s Process Exit...',chalk.blue('X'))
    process.exit()
})