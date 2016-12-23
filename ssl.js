const isolate = require('./lib/isolate')
const util = require('./lib/util')
const cp = require('child_process')

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

function init (boxId) {
  return isolate(['--cg', '--init', '--box-id', boxId])
    .then(result => {
      return result.stdout.trim()
    })
}
function writeSource (dir, code, langauge) {
  if (sourceFile.hasOwnProperty(langauge)) {
    const file = dir + '/' + sourceFile[langauge]
    return util.writeFile(file, code)
  } else return Promise.reject(new Error('langauge not support'))
}
function writeStdinFile (dir, stdin) {
  const file = dir + '/_in'
  return util.writeFile(file, stdin)
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
function clean (boxId) {
  return isolate(['--cleanup', '--box-id', boxId])
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
  const {source_code, langauge, stdin = ''} = options
  const isolateBoxId = util.generateBoxId()
  var isolateDirectory
  return init(isolateBoxId)
    .then(dir => {
      isolateDirectory = dir + '/box'
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
      return clean(isolateBoxId)
        .then(() => x.stdout)
    })
    .catch(e => {
      console.error('error', e)
      return Promise.reject(e)
    })
}
module.exports = ssl
