var resolveName = require("./path").resolveName;
var extensions = require("./path").extensions;

var wrapper = [
  "return (function (exports, require, module, __filename, __dirname) { ",
  "\n});"
];

function wrap(script) {
  return wrapper[0] + script + wrapper[1];
}

function createFunction(script) {
  try {
    return new Function(wrap(script));
  } catch (e) {
    throw new Error("Failed to parse script: " + e);
  }
}

function evaluate(require, __filename, __dirname) {
  var exports = {};
  var module = { exports: exports };

  function requireWithContext(name) {
    return require(name, __filename, __dirname);
  }

  return function evaluateInner(script) {
    var f = createFunction(script);
    f()(exports, requireWithContext, module, __filename, __dirname);
    return module.exports;
  };
}

function context(topLevelModuleMap, pathModuleMap) {
  topLevelModuleMap = topLevelModuleMap || {};
  pathModuleMap = pathModuleMap || {};

  function requireModule(name, __filename) {
    // First attempt to find top-level modules, e.g. "moment"
    if (name in topLevelModuleMap) {
      return topLevelModuleMap[name];
    }

    if (!__filename) {
      throw new Error("Module " + name + " not found!");
    }

    // Next, try to find locally registered modules, e.g. "./foo/a.js"
    var resolvedName = resolveName(name, __filename);

    for (let i = 0; i < extensions.length; i++) {
      var extension = extensions[i];

      if (resolvedName + extension in pathModuleMap) {
        return pathModuleMap[resolvedName + extension];
      }
    }

    throw new Error("Module " + name + " not found!");
  }

  return function evaluateInContext(__filename, __dirname) {
    var evaluateInner = evaluate(requireModule, __filename, __dirname);

    return function(script) {
      var result = evaluateInner(script);

      if (__filename) {
        pathModuleMap[__filename] = result;
      }

      return result;
    };
  };
}

const exportObject = context;

exportObject.wrap = wrap;
exportObject.createFunction = createFunction;
exportObject.evaluate = evaluate;
exportObject.extensions = extensions;

module.exports = exportObject;
