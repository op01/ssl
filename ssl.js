const isolate = require('./lib/isolate')
const util = require('./lib/util')
const cp = require('child_process')

var langStore = null

function loadLangaugeSync () {
  langStore = new Map()
  let files = util.lsSync('lib/langauge')
  files = files.filter(y => /\w+\.js$/.exec(y))
  for (let i of files) {
    let langName = i.slice(0, -3)
    let langModule = require('./lib/langauge/' + langName)
    langStore.set(langName, langModule)
  }
}

function init (boxId) {
  return isolate(['--cg', '--init', '--box-id', boxId])
    .then(result => {
      return result.stdout.trim()
    })
}
function writeSource (dir, code, file) {
  const path = dir + '/' + file
  return util.writeFile(path, code)
}
function writeStdinFile (dir, stdin) {
  const path = dir + '/_in'
  return util.writeFile(path, stdin)
}
function compile (des, compiler) {
  const cmd = compiler(des)
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (err, stdout, stderr) => {
      if (err)reject(err)
      else resolve({stdout: stdout, stderr: stderr})
    })
  })
}
function clean (boxId) {
  return isolate(['--cleanup', '--box-id', boxId])
}
function run (boxId, executor) {
  return isolate([
    '--box-id', boxId,
    '-p',
    '--cg',
    '--stdin', '_in',
    '--run',
    '--',
    ...executor])
}
function ssl (options) {
  const {source_code, langauge, stdin = ''} = options
  var isolateDirectory
  var langaugeModule
  var p
  if (!langStore.has(langauge)) {
    let error = new Error('langauge not support')
    p = Promise.reject(error)
  } else {
    langaugeModule = langStore.get(langauge)
    p = Promise.resolve()
  }
  const isolateBoxId = util.generateBoxId()
  return p
    .then(() => {
      return init(isolateBoxId)
    })
    .then(dir => {
      isolateDirectory = dir + '/box'
      return writeSource(isolateDirectory, source_code, langaugeModule.sourceFileName)
    })
    .then(() => {
      return compile(isolateDirectory, langaugeModule.compile)
    })
    .then(() => {
      return writeStdinFile(isolateDirectory, stdin)
    })
    .then(() => {
      return run(isolateBoxId, langaugeModule.execute)
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

loadLangaugeSync()
module.exports = ssl
