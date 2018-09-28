const spawn = require('child_process').spawn
const hashToArray = require('hash-to-array')
const onetime = require('onetime')


function runSoxProm(opts){
	return new Promise((resolve,reject)=>{

		if (!opts || typeof opts !== 'object') return reject(new Error('options must be an object'))
		if (!opts.inputFile) return reject(new Error('options.inputFile is a required parameter'))
		if (!opts.outputFile) return reject(new Error('options.outputFile is a required parameter'))

		const args = []
			.concat(hashToArray(opts.global || []))
			.concat(hashToArray(opts.input || []))
			.concat(opts.inputFile)
			.concat(hashToArray(opts.output || []))
			.concat(opts.outputFile)
			.concat(opts.effects || [])
			.reduce((flattened, ele) => flattened.concat(ele), [])

		let sox = spawn(opts.soxPath || 'sox', args)
		sox.on('error', reject)
		sox.stderr.on('data', stderr=>reject(new Error(stderr)))
		sox.on('close', (code, signal) => {
			if (code) return reject(new Error(signal))
			resolve(opts.outputFile)
		})
	})
}


module.exports = function runSox(opts,cb) {
	if(!cb) return runSoxProm(opts);
	runSoxProm(opts)
		.then(result => cb(null,result))
		.catch(cb)
}
