'use strict'

const pt = require('path')
const {Transform} = require('stream')
const File = require('vinyl')

/**
 *
 * @param options {fileName, className?}
 *    fileName: Required. name of generated file.
 *    className: Optional. Default: 'TsConstants'. Name of the generated class.
 * @return {module:stream.internal.Transform}
 */
module.exports = function gulpTextToTypescript(options) {
  options = Object.assign({}, options)
  if (!options.className) options.className = 'TsConstants'
  return fileNameTransform(options)
}

function fileNameTransform({fileName, className}) {
  if (!fileName || typeof fileName !== 'string') {
    throw Error(`Option 'fileName' must be a non-empty string, got: ${fileName}`)
  }

  const lines = [`export class ${className} {`]

  return new Transform({
    objectMode: true,

    transform(file, __, done) {
      if (file.isBuffer()) {
        const path = parseClassname(pt.join('', file.relative))
        //console.log(file);
        const text = file.contents.toString()

        lines.push(`\tstatic readonly ${escape(path)} = '${escape(text)}';`)
      }
      done()
    },

    flush(done) {
      this.push(new File({
        path: fileName,
        contents: Buffer.from(lines.join('\n') + "\n}"),
      }))
      done()
    },
  })
}

// Remove path and dashes and make class name uppercase
function parseClassname(text) {
  //Remove extension
  text = text.replace(/\.[^/.]+$/, "");
  //Remove path
  const position = text.lastIndexOf('/');
  if (position >= 0){
    text = text.substring(position+1);
  } else {
    text = text;
  }
  // Replace whitespace - and . with _
  text = text.replace(/(\s|\-|\.)/g,"_");
  // Uppercase
  text = text.toUpperCase();
  return text;
}

function escape(text) {
  return text.replace(/'/g, "\\'").replace(/\r\n|\n/g, '\\n');
}
