var test = require('tap').test
var sox = require('./')
var fs = require('fs')
var concat = require('concat-stream')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')

function closeEnough(x, y) {
	var ratio = x / y
	var diff = Math.abs(ratio - 1)
	return diff < 0.005 //within 5 thousandths of the expected value
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
		'test-audio/test_1.ogg',
		'./tmp/test_1i.wav'
	], assertSize(t, 138636))
})

var test_2 = {
	b: 16,
	c: 1,
	r: 44100,
	C: 5
}

test('ogg > wav - options - too loud', function (t) {
	t.plan(2)
	sox([
		'./test-audio/test_2.ogg',
		test_2,
		'./tmp/test_2l.wav'
	], function (err) {
		t.ok(/sox WARN rate/.test(err.message), 'error message is a warning')
		t.ok(/clipped/.test(err.message), 'error message says it clipped')
	})
})

test('ogg > wav - options - adjusted volume', {timeout: 3000}, function (t) {
	sox([
		{ v: 0.99 },
		'./test-audio/test_2.ogg',
		test_2,
		'./tmp/test_2a.wav'
	], assertSize(t, 2724056))
})

test('ogg > mp3', function (t) {
	sox([
		'./test-audio/test_3.ogg',
		'./tmp/test_3.mp3'
	], assertSize(t, 230295))
})

test('wav > flac', function (t) {
	sox([
		'./test-audio/test_4.wav',
		'./tmp/test_4.flac'
	], assertSize(t, 13993))
})

test('wav > ogg with effects', function (t) {
	sox([
		'./test-audio/test_5.wav',
		'./tmp/test_5t.ogg'
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '−t']
	], assertSize(t, 28821))
})

test('combinations of arguments', function (t) {
	sox([ //opts, fx
		'./test-audio/test_4.wav',
		'./tmp/wc1.ogg'
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '−t']
	])

	sox([ //opts
		'./test-audio/test_5.wav',
		'./tmp/wc2.ogg'
	])

	sox('sox', [ //path, opts
		'./test-audio/test_6.wav',
		'./tmp/wc3.ogg'
	])
	setTimeout(function () {
		t.pass('combos don\'t throw errors')
		t.end()
	}, 1000)
})

test('wav > mp3', function (t) {
	sox([
		'./test-audio/test_6.wav',
		'./tmp/test_6.mp3'
	], assertSize(t, 264986))
})

test('flac > ogg', function (t) {
	sox([
		'./test-audio/test_7.flac',
		'./tmp/test_7.ogg'
	], assertSize(t, 265597))
})

test('delete temp dir', function (t) {
	rimraf('./tmp', function (err) {
		t.notOk(err, err? err.message : 'no error')
		t.end()
	})
})
