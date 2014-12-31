var spawn = require('child_process').spawn
var hashToArray = require('hash-to-array')
var onetime = require('onetime')

module.exports = function job(soxFile, options, cb) {
	if (typeof soxFile === 'object') {
		cb = options
		options = soxFile
		soxFile = 'sox'
	}
	cb = onetime( cb || function () {} )

	var outputFilename = Object.keys(options).pop()
	var args = buildArgs(options)
	var sox = spawn(soxFile, args)
	sox.on('exit', function (code, signal) {
		code ?
			cb(new Error(signal), outputFilename) :
			cb(null, outputFilename)
	})
	sox.stderr.on('data', function (chunk) {
		var str = chunk.toString('utf8')
		cb(new Error(str), outputFilename)
	})
	sox.on('error', function (err) {
		cb(err, outputFilename)
	})
}

function buildArgs(options) {
	return Object.keys(options).reduce(function (args, filename) {
		return args.concat(
			hashToArray(options[filename]),
			filename
		)
	}, [])
}
