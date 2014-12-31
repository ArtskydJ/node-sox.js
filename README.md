node-sox
========

A wrapper around [SoX](http://sox.sourceforge.net/). Transcode audio files easily!

examples
========

Simple transcode:
```js
var sox = require('sox')

sox({
	'song.wav': {},
	'song.flac': {}
})
```

Lower volume:
```js
var sox = require('sox')

sox({
	'song.flac': { volume: 0.8 },
	'song2.flac': {}
})
```

Transcode with options and error handling:
```js
var sox = require('sox')

sox({
	'song.ogg': {},
	'song.wav': {
		bits: 16,
		rate: 44100,
		channels: 2
	}
}).on('error', function (err) {
	console.log('oh no! ' + err.message)
})
```

#sox([soxPath], options, [cb])

- `soxPath` is a string of the path to SoX. Optional, defaults to `'sox'`, which works if the SoX binary is in your path. E.g. `'C:\Program Files\Sox\sox.exe'`.
- `options` is an object, and is required.
	- Each key but the last is an input filename. The value is an object of options that will be used to interpret the incoming file. (Rarely useful.)
	- The last key is the output filename. The value is an object of options that will be used to format the outgoing file.
	- The values are objects of options.
- `cb` is a function, and is optional. This function will be called when the conversion process is complete. It will have the following parameters:
	- `err` is an Error object if the conversion failed.
	- `path` is the outgoing file path.

###sox features that are not supported
- **effects** - Might support if there is demand for it. Create an issue if you *literally* can't live without this feature. If you're feeling generous, you could make a pull request.

#options

The common options are listed below.

###input and output:

If you use these options on `inputOpts`, they will be used to interpret the incoming file.  
Most likely you will want to use these on `outputOpts`. Then they will be used to format the outgoing file.

- [`b`][bitdepth-arg] or [`bits`][bitdepth-arg], **number**, bit depth. E.g. `16`. (Not applicable to complex encodings such as MP3 or GSM.)
- [`c`][channel-arg] or [`channels`][channel-arg], **number**, number of channels. E.g. `2` for stereo.
- [`r`][samplerate-arg] or [`rate`][samplerate-arg], **number**, sample rate. E.g. `44100`.

###input-only:

- `v` or `volume`, **floating point number**, volume adjustment. E.g. `0.8` would make the output file 80% of the volume of the original (which would be slightly quieter), while `1.0` would preserve the volume.

###output-only

- `C` or `compression`, **integer** or **float**, usage depends on output file type. See [SoX format docs](http://sox.sourceforge.net/soxformat.html) for more information.

###need more?

SoX options that you probably won't need are listed in [OPTIONS.md][options].

#install

Install [SoX 14.4.1a][sox-1441] or [SoX 14.4.2rc2][sox-1442]. Then install this package with npm: 

```
npm install sox
```

To run the tests, you must clone the [git repository](https://github.com/ArtskydJ/sox). (The test audio files are too large to put in the npm package.) You must also have SoX in your `PATH`. Then run:

```
npm test
```

I run the tests using:

- [SoX 14.4.1a][sox-1441]
- [SoX 14.4.2rc2][sox-1442]

Other versions of SoX should work fine.

#codec support

###FLAC

- **Problem:** FLAC was disabled accidentally in 14.4.1 (SourceForge default). [[Stack Overflow][s-o-flac]]
- **Solution:** Install [SoX 14.4.1a][sox-1441] or [SoX 14.4.2rc2][sox-1442].

###MP3

- **Problem:** MP3 is [proprietary](https://en.wikipedia.org/wiki/LAME#Patents_and_legal_issues). It's really lame and makes me mad.
- **Solution:** Compile the [LAME](http://lame.sourceforge.net/) encoder, and/or the [MAD](http://www.underbit.com/products/mad) decoder.
- **Links:**
	- [Windows (Precompiled)](https://github.com/EaterOfCode/sux/tree/master/win_libs)
	- [Windows (How-To)](http://www.codeproject.com/Articles/33901/Compiling-SOX-with-Lame-and-Libmad-for-Windows)
	- [Ubuntu (How-To)](http://superuser.com/questions/421153/how-to-add-a-mp3-handler-to-sox)
	- [Ubuntu (How-To) 2](http://eggblog.invertedegg.com/?p=19)
	- [CentOS (How-To)](http://techblog.netwater.com/?p=4)

#license

[VOL](http://veryopenlicense.com)

[sox-1441]: http://sourceforge.net/projects/sox/files/sox/14.4.1/
[sox-1442]: http://sourceforge.net/projects/sox/files/release_candidates/sox/14.4.2rc2/
[bitdepth-arg]: https://en.wikipedia.org/wiki/Audio_bit_depth
[channel-arg]: https://en.wikipedia.org/wiki/Audio_channel
[samplerate-arg]: https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
[options]: https://github.com/ArtskydJ/sox/blob/master/OPTIONS.md
[s-o-flac]: http://stackoverflow.com/questions/23382500/how-to-install-flac-support-flac-libraries-to-sox-in-windows/25755799
