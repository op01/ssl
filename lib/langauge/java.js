module.exports.sourceFileName = 'supreme.java'
module.exports.compile = (des) => `javac ${des}/supreme.java`
module.exports.execute = ['/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java', 'supreme']
