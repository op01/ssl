const fs = require('fs')

const MAX_BOX = 1000
const boxIds = new Set()

function generateBoxId () {
  if (boxIds.size >= MAX_BOX) {
    throw new Error('GG box overflow')
  } else {
    for (let i = 0; i < MAX_BOX; i++) {
      if (!boxIds.has(i)) {
        boxIds.add(i)
        return '' + i
      }
    }
    throw new Error('why no space for me')
  }
}

function writeFile (path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err)reject(err)
      else resolve()
    })
  })
}

function lsSync (path) {
  return fs.readdirSync(path)
}

module.exports.generateBoxId = generateBoxId
module.exports.writeFile = writeFile
module.exports.lsSync = lsSync
