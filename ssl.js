const isolate=require('./isolate')
const cp=require('child_process')
const fs=require('fs')

const sourceFile={
    'cpp':'source_code.cc',
    'python3':'source_code.py'
}
const compiler={
    'cpp':(des)=>`g++ -o ${des}/a.out ${des}/source_code.cc`,
    'python3':(des)=>`python3 -m py_compile ${des}/source_code.py`
}
const exec={
    'cpp':['./a.out'],
    'python3':['/usr/bin/python3','-S','source_code.py']
}
function init(){
    return isolate(['--cg','--init'])
    .then(result=>{
        return result.stdout.trim()
    })
}
function writeSource(dir,code,langauge){
    if(sourceFile.hasOwnProperty(langauge)){
        return new Promise((res,rej)=>{
            const file=dir+'/'+sourceFile[langauge]
            fs.writeFile(file,code,err=>{
                if(err)rej(err)
                else res(file)
            })
        })
    }
    else return Promise.reject(new Error('langauge not support'))
}
function compile(des,langauge){
    if(compiler.hasOwnProperty(langauge)){
        const cmd=compiler[langauge](des)
        return new Promise((res,rej)=>{
            cp.exec(cmd,(err,stdout,stderr)=>{
                if(err)rej(err)
                else res({stdout:stdout,stderr:stderr})
            })
        })
    }
    else return Promise.reject(new Error('langauge not support'))
}
function clean(){
    return isolate(['--cleanup'])
}
function run(langauge){
    if(exec.hasOwnProperty(langauge)){
        return isolate(['-p','--cg','--run','--',...exec[langauge]])
    }
    else return Promise.reject(new Error('langauge not support'))
}
function ssl(options){
    const {source_code,langauge}=options
    var isolateDirectory;
    return init()
    .then(dir=>{
        isolateDirectory=dir+'/box'
        return writeSource(isolateDirectory,source_code,langauge)
    })
    .then(()=>{
        return compile(isolateDirectory,langauge)
    })
    .then(()=>run(langauge))
    .then(x=>{
        return clean()
        .then(()=>x.stdout)
    })
    .catch(e=>{
        console.log('error',e)
    })
}
module.exports=ssl
