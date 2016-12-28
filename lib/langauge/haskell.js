module.exports.sourceFileName = 'source_code.hs'
module.exports.compile = (des) => `ghc -o ${des}/b.out ${des}/source_code.hs`
module.exports.execute = ['/usr/bin/python3', '-S', './b.out']
