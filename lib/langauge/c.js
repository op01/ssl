module.exports.sourceFileName = 'source_code.c'
module.exports.compile = (des) => `gcc -o ${des}/a.out ${des}/source_code.c`
module.exports.execute = ['./a.out']
