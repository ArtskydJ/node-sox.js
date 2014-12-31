#more options

These options are copied from the help text displayed when running `sox -h`. If you want an exhaustive list of each option in depth, take a look at the [SoX docs](http://sox.sourceforge.net/sox.html#OPTIONS).

Some SoX options were purposefully removed from this list, including the options that cause SoX to write to stdout. (E.g. `--help`, `--version`)

#Global Options

The global options can be passed to any file, it doesn't matter.

| Command(s)                                       | Functionality                                                    |
|:-------------------------------------------------|:-----------------------------------------------------------------|
| `{buffer: BYTES}`                                | Set the size of all processing buffers (default 8192)            |
| `{combine: 'concatenate'}`                       | Concatenate all input files (default for sox, rec)               |
| `{combine: 'sequence'}`                          | Sequence all input files (default for play)                      |
| `'-m'`, `{m: true}`, `{combine: 'mix'}`          | Mix multiple input files (instead of concatenating)              |
| `{combine: 'mix-power'}`                         | Mix to equal power (instead of concatenating)                    |
| `'-M'`, `{M: true}`, `{combine: 'merge'}`        | Merge multiple input files (instead of concatenating)            |
| `'-T'`, `{T: true}`, `{combine: 'multiply'}`     | Multiply samples of corresponding channels from all input files (instead of concatenating) |
| `'-D'`, `{D: true}`, `{no-dither: true}`         | Don't dither automatically                                       |
| `{effects-file: FILENAME}`                       | File containing effects and options                              |
| `'-G'`, `{G: true}`, `{guard: true}`             | Use temporary files to guard against clipping                    |
| `{input-buffer: BYTES}`                          | Override the input buffer size (default: same as --buffer; 8192) |
| `'--norm'`, `{norm: true}`                       | Guard (see --guard) & normalise                                  |
| `{play-rate-arg: ARG}`                           | Default `rate` argument for auto-resample with `play'            |
| `{plot: 'gnuplot'|'octave'}`                     | Generate script to plot response of filter effect                |
| `{replay-gain: 'track'|'album'|'off'}`           | Default: 'off' (sox, rec), track (play)                          |
| `'-R'`, `{R: true}`                              | Use default random numbers (same on each run of SoX)             |
| `'--single-threaded'`, `{single-threaded: true}` | Disable parallel effects channels processing                     |
| `{temp: DIRECTORY}`                              | Specify the directory to use for temporary files                 |


#Format Options

When an output option isn't supplied, the output file will have the same format as the input file where possible.

| Command(s)                                     | Functionality                                         |
|:-----------------------------------------------|:------------------------------------------------------|
| `{v: FACTOR}`, `{volume: FACTOR}`              | Input file volume adjustment factor (real number)     |
| `{ignore-length: true}`                        | Ignore input file length given in header; read to EOF |
| `{t: FILETYPE}`, `{type: FILETYPE}`            | File type of audio                                    |
| `{e: ENCODING}`, `{encoding: ENCODING}`        | (See below this table)                                |
| `'-b'`, `{b: BITS}`, `{bits: BITS}`            | Encoded sample size in bits                           |
| `'-N'`, `{N: true}`, `{reverse-nibbles: true}` | Encoded nibble-order                                  |
| `'-X'`, `{X: true}`, `{reverse-bits: true}`    | Encoded bit-order                                     |
| `'-L'`, `{endian: 'little'}`, `{L: true}`      | Encoded byte-order; Little endian                     |
| `'-B'`, `{endian: 'big'}`, `{B: true}`         | Encoded byte-order; Big endian                        |
| `'-x'`, `{endian: 'swap'}`, `{x: true}`        | Encoded byte-order; swap means opposite to default    |
| `{c: CHANNELS}`, `{channels: CHANNELS}`        | Number of channels of audio data; e.g. 2 = stereo     |
| `{r: RATE}`, `{rate: RATE}`                    | Sample rate of audio                                  |
| `{C: FACTOR}`, `{compression: FACTOR}`         | Compression factor for output format                  |
| `{add-comment: TEXT}`                          | Append output file comment                            |
| `{comment: TEXT}`                              | Specify comment text for the output file              |
| `{comment-file: FILENAME}`                     | File containing comment text for the output file      |
| `{no-glob: true}`                              | Don't `glob' wildcard match the following filename    |

- ENCODING can be one of the following:
	- `'signed-integer'`
	- `'unsigned-integer'`
	- `'floating-point'`
	- `'mu-law'`
	- `'a-law'`
	- `'ima-adpcm'`
	- `'ms-adpcm'`
	- `'gsm-full-rate'`
