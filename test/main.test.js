const loader = require("../index");
const { evaluate } = loader;

describe("evaluate", () => {
  test("exports values", () => {
    const result = evaluate()("module.exports = 3;");
    expect(result).toBe(3);
  });

  test("requires modules by name", () => {
    const result = evaluate(name => name)(
      `
      const a = require('a');
      const b = require('b');
      module.exports = a + b;
    `
    );
    expect(result).toBe("ab");
  });

  test("module map", () => {
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

    expect(moduleMap.b).toBe(7);
  });
});

describe("loader", () => {
  test("top level modules", () => {
    const context = loader({
      m: 10
    });

    const script = "module.exports = 4 + require('m')";

    const result = context("s")(script);

    expect(result).toBe(14);
  });

  test("./ context", () => {
    const context = loader();

    const scriptA = "module.exports = 3;";
    const scriptB = "module.exports = 4 + require('./a')";

    context("a.js")(scriptA);
    const result = context("b.js")(scriptB);

    expect(result).toBe(7);
  });

  test("../ context", () => {
    const context = loader();

    const scriptA = "module.exports = 3;";
    const scriptB = "module.exports = 4 + require('../a')";

    context("a.js")(scriptA);
    const result = context("foo/b.js")(scriptB);

    expect(result).toBe(7);
  });
});
