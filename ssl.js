const isolate = require('./isolate')
const cp = require('child_process')
const fs = require('fs')

const sourceFile = {
  'cpp': 'source_code.cc',
  'python3': 'source_code.py',
  'haskell': 'source_code.hs'
}
const compiler = {
  'cpp': (des) => `g++ -o ${des}/a.out ${des}/source_code.cc`,
  'python3': (des) => `python3 -m py_compile ${des}/source_code.py`,
  'haskell': (des) => `ghc -o ${des}/b.out ${des}/source_code.hs`
}
const exec = {
  'cpp': ['./a.out'],
  'python3': ['/usr/bin/python3', '-S', 'source_code.py'],
  'haskell': ['./b.out']
}
function init () {
  return isolate(['--cg', '--init'])
    .then(result => {
      return result.stdout.trim()
    })
}
function writeSource (dir, code, langauge) {
  if (sourceFile.hasOwnProperty(langauge)) {
    return new Promise((resolve, reject) => {
      const file = dir + '/' + sourceFile[langauge]
      fs.writeFile(file, code, err => {
        if (err)reject(err)
        else resolve(file)
      })
    })
  } else return Promise.reject(new Error('langauge not support'))
}
function writeStdinFile (dir, stdin) {
  return new Promise((resolve, reject) => {
    const file = dir + '/_in'
    fs.writeFile(file, stdin, err => {
      if (err)reject(err)
      else resolve(file)
    })
  })
}
function compile (des, langauge) {
  if (compiler.hasOwnProperty(langauge)) {
    const cmd = compiler[langauge](des)
    return new Promise((resolve, reject) => {
      cp.exec(cmd, (err, stdout, stderr) => {
        if (err)reject(err)
        else resolve({stdout: stdout, stderr: stderr})
      })
    })
  } else return Promise.reject(new Error('langauge not support'))
}
function clean () {
  return isolate(['--cleanup'])
}
function run (boxId, langauge) {
  if (exec.hasOwnProperty(langauge)) {
    return isolate(
      ['--box-id', boxId,
        '-p',
        '--cg',
        '--stdin', '_in',
        '--run',
        '--',
        ...exec[langauge]])
  } else return Promise.reject(new Error('langauge not support'))
}
function ssl (options) {
  const {source_code, langauge, stdin} = options
  var isolateDirectory
  var isolateBoxId
  return init()
    .then(dir => {
      isolateDirectory = dir + '/box'
      isolateBoxId = /\d+$/.exec(dir)[0]
      return writeSource(isolateDirectory, source_code, langauge)
    })
    .then(() => {
      return compile(isolateDirectory, langauge)
    })
    .then(() => {
      return writeStdinFile(isolateDirectory, stdin)
    })
    .then(() => {
      return run(isolateBoxId, langauge)
    })
    .then(x => {
      return clean()
        .then(() => x.stdout)
    })
    .catch(e => {
      console.error('error', e)
      return Promise.reject(e)
    })
}
module.exports = ssl
