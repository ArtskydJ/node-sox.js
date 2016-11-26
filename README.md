# SoX.js

> A wrapper around [SoX][sox]. Transcode audio files easily!

[![Build Status](https://travis-ci.org/ArtskydJ/sox.js.svg)](https://travis-ci.org/ArtskydJ/sox.js)

# Examples

Simple transcode:
```js
var sox = require('sox.js')
sox({ inputFile: 'song.wav', outputFile: 'song.flac' })
```

Lower volume:
```js
var sox = require('sox.js')
sox({
	input: { volume: 0.8 },
	inputFile: 'song.flac',
	outputFile: 'song2.flac'
], function done(err, outFilePath) {
	console.log(err) // => null
	console.log(outFilePath) // => song2.flac
})
```

Transcode with options and effects:
```js
var sox = require('sox.js')
sox({
	soxPath: 'C:\\Program Files (x86)\\sox-14-4-2\\sox.exe',
	inputFile: 'song.ogg',
	output: {
		bits: 16,
		rate: 44100,
		channels: 2
	},
	outputFile: 'song.wav'
	effects: 'phaser 0.6 0.66 3 0.6 2 −t'
}, function done(err, outFilePath) {
	console.log(err) // => null
	console.log(outFilePath) // => song.wav
})
```

# API
```js
var sox = require('sox.js')
```

## `sox(options, [cb])`

### `options` object

An object of options. Every option is optional except `options.inputFile` and `options.outputFile`.

Internally, these options are transformed into the command-line arguments passed to a SoX child process.

### `options.soxPath` string

The path to SoX, defaults to `'sox'`, which works if SoX is in your path.

Note that you might need double quotes around the path if there are spaces in it. E.g. `'"C:\Program Files\Sox\sox.exe"'`.

### `options.inputFile` string, required
### `options.outputFile` string, required

A file path, like `'./song.wav'`.

### `options.global` object|array of strings/numbers
### `options.input` object|array of strings/numbers
### `options.output` object|array of strings/numbers

You can supply an array of strings/numbers, or an object that will be transformed into an array of strings/numbers using [hash-to-array][hta].

See [common options](#common-options).

### `options.effects` string|array of strings/numbers/arrays

To see what options are available, read the [SoX effects docs][sox-effects].

You can put strings/numbers into sub-arrays, which will be flattened internally.

```js
sox({
	inputFile: './a.wav',
	outputFile: './b.wav'

	effects: 'speed 1.5 swap'
	// same as
	effects: [
		'speed 1.5 swap'
	]
	// same as
	effects: [
		'speed', 1.5,
		'swap'
	]
	// same as
	effects: [
		[ 'speed', '1.5' ],
		'swap'
	]
})
```

### `cb` function

A function that is called when the conversion process is complete. Optional; if omitted, errors are thrown. The function is passed the following parameters:
- `err` is null or an Error object.
- `outFilePath` is the outgoing file path. E.g. `'song.flac'`.

# Common Options

### input and output:

If you use these options on input files, they will be used to interpret the incoming file.
Usually you want to use these on output files, so they will be used to format the outgoing file.

- [`b`][bitdepth-arg] or [`bits`][bitdepth-arg], **number**, bit depth. E.g. `16`. (Not applicable to complex encodings such as MP3 or GSM.)
- [`c`][channel-arg] or [`channels`][channel-arg], **number**, number of channels. E.g. `2` for stereo.
- [`r`][samplerate-arg] or [`rate`][samplerate-arg], **number**, sample rate. E.g. `44100`.

### Input-only:

- `v` or `volume`, **floating point number**, volume adjustment. E.g. `0.8` would make the output file 80% of the volume of the original (which would be slightly quieter), while `1.0` would preserve the volume.

### Output-only

- `C` or `compression`, **integer** or **float**, usage depends on output file type. See [SoX format docs][sox-format] for more information.

### Need more?

SoX options that you probably won't need are listed in [OPTIONS.md][options].

# Install

- Install SoX. You can [download it][sox-1442], or you can do `apt-get install sox`.
- Install this package with npm: `npm install sox`

# Test

To run the tests, you must also have SoX in your PATH. Then run: `npm test`

I run the tests using [SoX 14.4.2][sox-1442], but other versions of SoX should work fine.

# Codec Support

### FLAC

- **Problem:** FLAC was disabled accidentally in 14.4.1. [[Stack Overflow][so-flac]]
- **Solution:** Install [SoX 14.4.2][sox-1442].

### MP3

- **Problem:** MP3 is [proprietary](https://en.wikipedia.org/wiki/LAME#Patents_and_legal_issues).
- **Solution:** Compile the [LAME][lame] encoder, and/or the [MAD][mad] decoder.
- **Links:**
	- [Windows (Precompiled)](https://github.com/EaterOfCode/sux/tree/master/win_libs)
	- [Windows (How-To)](http://www.codeproject.com/Articles/33901/Compiling-SOX-with-Lame-and-Libmad-for-Windows)
	- [Ubuntu (How-To)](http://superuser.com/questions/421153/how-to-add-a-mp3-handler-to-sox)
	- [Ubuntu (How-To) 2](http://eggblog.invertedegg.com/?p=19)
	- [CentOS (How-To)](http://techblog.netwater.com/?p=4)

# License

[MIT](http://choosealicense.com/licenses/mit/)

[sox]:         http://sox.sourceforge.net/
[sox-1442]:    http://sourceforge.net/projects/sox/files/sox/14.4.2/
[sox-effects]: http://sox.sourceforge.net/sox.html#EFFECTS
[sox-format]:  http://sox.sourceforge.net/soxformat.html
[bitdepth-arg]:   https://en.wikipedia.org/wiki/Audio_bit_depth
[channel-arg]:    https://en.wikipedia.org/wiki/Audio_channel
[samplerate-arg]: https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
[options]: https://github.com/ArtskydJ/sox.js/blob/master/OPTIONS.md
[hta]:     https://github.com/ArtskydJ/hash-to-array
[lame]:    http://lame.sourceforge.net/
[mad]:     http://www.underbit.com/products/mad
[so-flac]: http://stackoverflow.com/questions/23382500/how-to-install-flac-support-flac-libraries-to-sox-in-windows/25755799
