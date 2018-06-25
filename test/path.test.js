const { baseName, dirName, resolveName } = require("../path");

test("basename foo/bar.js", () => {
  expect(baseName("foo/bar.js")).toBe("bar.js");
});

test("basename bar.js", () => {
  expect(baseName("bar.js")).toBe("bar.js");
});

test("dirname foo/bar.js", () => {
  expect(dirName("foo/bar.js")).toBe("foo");
});

test("dirname bar.js", () => {
  expect(dirName("bar.js")).toBe("");
});

test("resolve ./a", () => {
  const result = resolveName("./a", "bar.js");
  expect(result).toBe("a");
});

test("resolve ./a", () => {
  const result = resolveName("./a", "foo/bar.js");
  expect(result).toBe("foo/a");
});

test("resolve ../a", () => {
  const result = resolveName("../a", "foo/bar.js");
  expect(result).toBe("a");
});

test("resolve ../test/a", () => {
  const result = resolveName("../test/a", "foo/bar.js");
  expect(result).toBe("test/a");
});
