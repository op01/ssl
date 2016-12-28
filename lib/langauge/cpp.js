module.exports.sourceFileName = 'source_code.cc'
module.exports.compile = (des) => `g++ -o ${des}/a.out ${des}/source_code.cc`
module.exports.execute = ['./a.out']
