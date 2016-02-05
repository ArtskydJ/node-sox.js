var test = require('tape')
var sox = require('./')
var fs = require('fs')
var os = require('os')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var testAudio = require('test-audio')()

var tmpDir = path.join(os.tmpdir(), 'sox_js_test')

function closeEnough(x, y) {
	var ratio = x / y
	var diff = Math.abs(ratio - 1)
	return diff < 0.01 // within 1/100th of the correct value
}

function assertSize(t, value) {
	return function (err, filename) {
		t.ifError(err)
		fs.stat(filename, function (err, stat) {
			t.ifError(err)
			t.ok(closeEnough(stat.size, value), stat.size + ' bytes is close enough to ' + value + ' bytes')
			t.end()
		})
	}
}

test('create temp dir', function (t) {
	mkdirp(tmpDir, function (err) {
		t.ifError(err)
		t.end()
	})
})

test('ogg > wav', function (t) {
	sox([
		testAudio.ogg.path,
		path.join(tmpDir, 'test_1i.wav')
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
		path.join(tmpDir, 'test_2a.wav')
	], assertSize(t, 271464))
})

test('wav > flac', function (t) {
	sox([
		testAudio.wav.path,
		path.join(tmpDir, 'test_4.flac')
	], assertSize(t, 4711))
})

test('wav > ogg with effects', function (t) {
	sox([
		testAudio.wav.path,
		path.join(tmpDir, 'test_5t.ogg')
	], [
		'swap',
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '-t']
	], assertSize(t, 15737))
})

test('combinations of arguments', function (t) {
	sox([ // opts, fx
		testAudio.wav.path,
		path.join(tmpDir, 'wc1.ogg')
	], [
		['delay', 0.8],
		['phaser', 0.6, 0.66, 3, 0.6, 2, '-t']
	])

	sox([ // opts
		testAudio.wav.path,
		path.join(tmpDir, 'wc2.ogg')
	])

	sox('sox', [ // path, opts
		testAudio.wav.path,
		path.join(tmpDir, 'wc3.ogg')
	])
	setTimeout(function () {
		t.pass('combos don\'t throw errors')
		t.end()
	}, 1000)
})

test('flac > ogg', function (t) {
	sox([
		testAudio.flac.path,
		path.join(tmpDir, 'test_7.ogg')
	], assertSize(t, 5086))
})

test('delete temp dir', function (t) {
	rimraf(tmpDir, function (err) {
		t.ifError(err)
		t.end()
	})
})
