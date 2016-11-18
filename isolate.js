const cp=require('child_process')
function isolate(args){
    return new Promise((res,rej)=>{
        cp.execFile('/usr/local/bin/isolate',args,(err,stdout,stderr)=>{
            if(err){
                console.log("ERR")
                console.log(stdout)
                console.log(stderr)
                rej(err)
            }
            else res({stdout:stdout,stderr:stderr})
        })
    })
}
module.exports=isolate
