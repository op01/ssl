module.exports.sourceFileName = 'source_code.py'
module.exports.compile = (des) => `python3 -m py_compile ${des}/source_code.py`
module.exports.execute = ['/usr/bin/python3', '-S', 'source_code.py']
