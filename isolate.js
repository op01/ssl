const cp = require('child_process')
function isolate (args) {
  return new Promise((resolve, reject) => {
    cp.execFile('/usr/local/bin/isolate', args, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else resolve({stdout: stdout, stderr: stderr})
    })
  })
}
module.exports = isolate
