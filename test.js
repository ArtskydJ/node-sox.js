var test = require('tape')
var sox = require('./')
var fs = require('fs')
var concat = require('concat-stream')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var testAudio = require('test-audio')()

function closeEnough(x, y) {
	var ratio = x / y
	var diff = Math.abs(ratio - 1)
	return diff < 0.005 // within 5 thousandths of the expected value
}

function assertSize(t, value) {
	return function (err, filename) {
		t.notOk(err, err ? err.message : 'no error')
		fs.createReadStream(filename)
			.pipe(concat(function (buf) {
				t.ok(closeEnough(buf.length, value), buf.length + ' bytes is close enough to ' + value + ' bytes')
				t.end()
			}))
	}
}

test('create temp dir', function (t) {
	mkdirp('./tmp', function (err) {
		t.notOk(err, err? err.message : 'no error')
		t.end()
	})
})

test('ogg > wav', function (t) {
	sox([
		testAudio.ogg.path,
		'./tmp/test_1i.wav'
	], assertSize(t, 542884))
})

test('ogg > wav - options - adjusted volume', { timeout: 3000 }, function (t) {
	sox([
		{ v: 0.9 },
		testAudio.ogg.path,
		{
			b: 16,
			c: 1,
			r: 44100,
			C: 5
		},
		'./tmp/test_2a.wav'
	], assertSize(t, 271464))
})

test('wav > flac', function (t) {
	sox([
		testAudio.wav.path,
		'./tmp/test_4.flac'
	], assertSize(t, 4711))
})

test('wav > ogg with effects', function (t) {
	sox([
		testAudio.wav.path,
		'./tmp/test_5t.ogg'
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '-t']
	], assertSize(t, 15737)) // FIXME
})

test('combinations of arguments', function (t) {
	sox([ // opts, fx
		testAudio.wav.path,
		'./tmp/wc1.ogg'
	], [
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '-t']
	])

	sox([ // opts
		testAudio.wav.path,
		'./tmp/wc2.ogg'
	])

	sox('sox', [ // path, opts
		testAudio.wav.path,
		'./tmp/wc3.ogg'
	])
	setTimeout(function () {
		t.pass('combos don\'t throw errors')
		t.end()
	}, 1000)
})

test('flac > ogg', function (t) {
	sox([
		testAudio.flac.path,
		'./tmp/test_7.ogg'
	], assertSize(t, 5086))
})

test('delete temp dir', function (t) {
	rimraf('./tmp', function (err) {
		t.notOk(err, err? err.message : 'no error')
		t.end()
	})
})
