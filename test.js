var test = require('tape')
var sox = require('./')
var fs = require('fs')
var concat = require('concat-stream')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var path = require('path')

var audioPath = path.dirname( require.resolve('test-audio') )
var relativePath = path.join.bind(null, audioPath)

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
		relativePath('test_1.ogg'),
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
		relativePath('test_2.ogg'),
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
		relativePath('test_2.ogg'),
		test_2,
		'./tmp/test_2a.wav'
	], assertSize(t, 2724056))
})

test('wav > flac', function (t) {
	sox([
		relativePath('test_4.wav'),
		'./tmp/test_4.flac'
	], assertSize(t, 13993))
})

test('wav > ogg with effects', function (t) {
	sox([
		relativePath('test_5.wav'),
		'./tmp/test_5t.ogg'
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '−t']
	], assertSize(t, 28821))
})

test('combinations of arguments', function (t) {
	sox([ //opts, fx
		relativePath('test_4.wav'),
		'./tmp/wc1.ogg'
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '−t']
	])

	sox([ //opts
		relativePath('test_5.wav'),
		'./tmp/wc2.ogg'
	])

	sox('sox', [ //path, opts
		relativePath('test_6.wav'),
		'./tmp/wc3.ogg'
	])
	setTimeout(function () {
		t.pass('combos don\'t throw errors')
		t.end()
	}, 1000)
})

test('flac > ogg', function (t) {
	sox([
		relativePath('test_7.flac'),
		'./tmp/test_7.ogg'
	], assertSize(t, 265597))
})

test('delete temp dir', function (t) {
	rimraf('./tmp', function (err) {
		t.notOk(err, err? err.message : 'no error')
		t.end()
	})
})
