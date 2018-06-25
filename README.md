# Web module loader

This package loads commonjs modules at runtime. It's intended to immitate node's module loading in the browser. It will also work within node.

## Installation

```bash
npm install --save web-module-loader
```

## Usage

There are two APIs:

- [**`loader`**](#loader) - A higher-level API that allows providing top-level modules by name (e.g. `moment`), and registers exports as scripts are evaluated.
- [**`evaluate`**](#evaluate) - A lower-level API that allows passing a `require` function and then evaluating a script that can look up modules by calling the provided `require`.

### Loader

#### Requiring top-level modules

If `moment` is installed, for example:

```js
import loader from "web-module-loader";
import moment from "moment";

const context = loader({ moment });

const script = `
const moment = require('moment');

module.exports = moment(1111111111111).format('MM/DD/YY');
`;

const result = context()(script);

console.log(result); // => 03/17/05
```

#### Multiple scripts

Scripts can require one another by relative path:

```js
import loader from "web-module-loader";

const context = loader();

const scriptA = "module.exports = 1;";
const scriptB = "module.exports = 2 + require('./a');";
const scriptC = "module.exports = 3 + require('../b');";

context("a.js")(scriptA);
context("b.js")(scriptB);
const result = context("foo/c.js")(scriptC);

console.log(result); // => 6;
```

### Evaluate

#### Exporting values

```js
import { evaluate } from "web-module-loader";

const result = evaluate()("module.exports = 3;");

console.log(result); // => 3
```

#### Requiring modules

If `moment` is installed, for example:

```js
import { evaluate } from "web-module-loader";
import moment from "moment";

const require = name => {
  switch (name) {
    case "moment":
      return moment;
    default:
      throw new Error(`Module ${name} not found!`);
  }
};

const script = `
module.exports = moment(1111111111111).format('MM/DD/YY');
`;

const result = evaluate(require)(script);

console.log(result); // => 03/17/05
```

#### Storing exported modules

If you want to evaluate multiple files that can `require` one another, consider creating an object to store exports by name:

```js
import { evaluate } from "web-module-loader";

const moduleMap = {};

const require = name => {
  if (name in moduleMap) {
    return moduleMap[name];
  }

  throw new Error(`Module ${name} not found!`);
};

const scriptA = "module.exports = 3;";
const scriptB = "module.exports = 4 + require('a')";

const bundler = evaluate(require);
moduleMap.a = bundler(scriptA);
moduleMap.b = bundler(scriptB);

console.log(moduleMap.b); // => 7
```
