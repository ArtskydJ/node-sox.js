var spawn = require('child_process').spawn
var hashToArray = require('hash-to-array')
var onetime = require('onetime')

module.exports = function job(soxFile, filenames, effects, cb) {
	if (typeof soxFile === 'object') {
		cb = effects
		effects = filenames
		filenames = soxFile
		soxFile = 'sox'
	}
	if (typeof effects !== 'object') {
		cb = effects
		effects = []
	}
	cb = onetime( cb || function (e) {if (e) throw e} )

	var outputFilename = filenames[filenames.length-1]
	var args = buildArgs(filenames.concat(effects))
	var error = null

	spawn(soxFile, args)
		.on('error', setErrMsg)
		.on('close', function (code, signal) {
			setErrMsg(signal)
			cb(error, outputFilename)
		})
		.stderr.on('data', setErrMsg)

	function setErrMsg(err) {
		if (!error && err) {
			error = (err instanceof Error) ? err : new Error(err)
		}
	}
}

function buildArgs(opts) {
	return opts.reduce(function (args, opt) {
		return args.concat( hashToArray(opt) )
	}, [])
}
