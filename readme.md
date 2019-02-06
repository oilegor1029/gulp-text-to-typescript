## Overview

A [`gulp`](http://gulpjs.com) plugin that converts text into a typescript constants file.

## Installation

```sh
npm i -E gulp-text-to-typescript
# or
yarn add -E gulp-text-to-typescript
```

## Usage

In your `gulpfile.js`:

```js
const textToTs = require('gulp-text-to-typescript')

gulp.task('parse-text-to-typescript', () => (
  gulp.src('src/assets/**/*.txt')
    .pipe(textToTs({
      fileName: "generatedClass.ts",
      className: "TextConstants",
    }))
    // Files destination
    .pipe(gulp.dest('./src/assets'))
))
```

---
*foo.txt*
```html
first text
```
*bar-test.txt*
```html
second text
```

Becomes:

*generatedClass.ts*
```typescript
export class TextConstants {
  static readonly FOO = "first text";
  static readonly BAR_TEST = "first text";
}
```

In your app, import the result like so (directory nesting depends on your build configuration):

```typescript
import { TextConstants } from 'assets/generatedClass.ts';
```

## Options

There are two available options:

- fileName: 
  - Required.
  - Name of the generated file.
  
- className:
  - Optional.
  - Name of the class.
    - Default name is 'TsConstants'


---

**Credits**

Base idea took from: https://github.com/Mitranim/gulp-html-to-js