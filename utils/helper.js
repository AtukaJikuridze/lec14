const fs = require("fs/promises");

const write = async (path, content, stringify) => {
  const isJson = stringify ? JSON.stringify(content, null, 2) : content;
  await fs.writeFile(path, isJson);
};

const read = async (path, parse) => {
  let readParse = await fs.readFile(path, "utf-8");
  return parse ? JSON.parse(readParse) : readParse;
};

module.exports = {
  write,
  read,
};
