# sox.js

> A wrapper around [SoX][sox]. Transcode audio files easily!

[![Build Status](https://travis-ci.org/ArtskydJ/sox.js.svg)](https://travis-ci.org/ArtskydJ/sox.js)

# examples

Simple transcode:
```js
var sox = require('sox.js')
sox([ 'song.wav', 'song.flac' ])
```

Lower volume:
```js
var sox = require('sox.js')
sox([
	{ volume: 0.8 }, //options for the file go before it
	// ↓
	'song.flac',
	'song2.flac'
], function done(err, outFilePath) {
	console.log(err) // => null
	console.log(outFilePath) // => song.flac
})
```

Transcode with options and effects:
```js
var sox = require('sox.js')
sox('"C:\\Program Files (x86)\\sox-14-4-2\\sox.exe"', [
	'song.ogg',
	{
		bits: 16,
		rate: 44100,
		channels: 2
	}, // ↓
	'song.wav'
], [
	'phaser', '0.6', '0.66', '3', '0.6', '2', '−t'
],
function done(err, outFilePath) {
	console.log(err) // => null
	console.log(outFilePath) // => song.flac
})
```

# api
```js
var sox = require('sox.js')
```

## `sox([soxPath], filenames, [effects], [cb])`

### `soxPath` string

The path to SoX, defaults to `'sox'`, which works if SoX is in your path.

Note that you might need double quotes around the path if there are spaces in it. E.g. `'"C:\Program Files\Sox\sox.exe"'`.

### `filenames` array

The elements can be strings, arrays of strings, numbers, or objects.

###### object element

The object will be transformed into a list of strings using [hash-to-array][hta].

To describe the options for a file, the object must be listed right *before* that file. See [common options](#common-options).

###### string element

Usually a filename, like `'./song.wav'`.

Can be used for options or global options. Remember that options for a file must be listed before the file.

### `effects` array

To see what options are available, read the [SoX effects docs][sox-effects].

###### string, or number element

Effect name: `'reverse'`, `'swap'`, `'speed 1.5'`

Or effect option: `'-h'`, `1.5`

###### array element (array of strings)

You can put strings into subarrays, which will be flattened internally, so this will act just like putting them in individual strings. E.g. `['speed', 1.5]`


```js
var effects = [
	'speed', '1.5',
	'swap'
]
// same as
var effects = [
	'speed 1.5 swap'
]
// same as
var effects = [
	[ 'speed', '1.5' ],
	'swap'
]
```

### `cb` function

A function that is called when the conversion process is complete. Optional; if omitted, errors are thrown. The function is passed the following parameters:
- `err` is null or an Error object.
- `outFilePath` is the outgoing file path. E.g. `'song.flac'`.

# common options

### input and output:

If you use these options on input files, they will be used to interpret the incoming file.  
Usually you want to use these on output files, so they will be used to format the outgoing file.

- [`b`][bitdepth-arg] or [`bits`][bitdepth-arg], **number**, bit depth. E.g. `16`. (Not applicable to complex encodings such as MP3 or GSM.)
- [`c`][channel-arg] or [`channels`][channel-arg], **number**, number of channels. E.g. `2` for stereo.
- [`r`][samplerate-arg] or [`rate`][samplerate-arg], **number**, sample rate. E.g. `44100`.

### input-only:

- `v` or `volume`, **floating point number**, volume adjustment. E.g. `0.8` would make the output file 80% of the volume of the original (which would be slightly quieter), while `1.0` would preserve the volume.

### output-only

- `C` or `compression`, **integer** or **float**, usage depends on output file type. See [SoX format docs][sox-format] for more information.

### need more?

SoX options that you probably won't need are listed in [OPTIONS.md][options].

# install

Install [SoX 14.4.2][sox-1442]. Then install this package with npm:

```
npm install sox
```

To run the tests, you must clone the [git repository](https://github.com/ArtskydJ/sox). (The test audio files are too large to put in the npm package.) You must also have SoX in your `PATH`. Then run:

```
npm test
```

I run the tests using [SoX 14.4.2][sox-1442], but other versions of SoX should work fine.

# codec support

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

# license

[VOL](http://veryopenlicense.com)

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
