var extensions = [".js", ".jsx", ".json"];

function join(a, b) {
  if (!a) return b;
  return a + "/" + b;
}

function baseName(filename) {
  return filename.slice(filename.lastIndexOf("/") + 1);
}

function dirName(filename) {
  var base = baseName(filename);
  return filename.slice(0, -(base.length + 1));
}

function resolveName(name, filename) {
  var resolvedName = name;

  // Remove the file extension if one exists
  for (var i = 0; i < extensions.length; i++) {
    var extension = extensions[i];
    if (resolvedName.endsWith(extension)) {
      resolvedName = resolvedName.slice(0, -extension.length);
      break;
    }
  }

  if (resolvedName.startsWith("./")) {
    resolvedName = join(dirName(filename), resolvedName.slice(2));
  }

  while (resolvedName.startsWith("../")) {
    filename = dirName(filename);
    resolvedName = resolvedName.slice(3);
  }

  return resolvedName;
}

module.exports = {
  join,
  baseName,
  dirName,
  resolveName,
  extensions
};
