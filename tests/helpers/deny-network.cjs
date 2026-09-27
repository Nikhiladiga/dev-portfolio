const { syncBuiltinESMExports } = require("node:module");

const message = "Build attempted outbound network access";
const block = () => {
  throw new Error(message);
};

globalThis.fetch = async () => {
  throw new Error(message);
};

for (const moduleName of [
  "node:http",
  "node:https",
  "node:net",
  "node:tls",
  "node:dgram",
]) {
  const networkModule = require(moduleName);
  for (const method of ["request", "get", "connect", "createConnection", "createSocket"]) {
    if (typeof networkModule[method] === "function") {
      networkModule[method] = block;
    }
  }
}

syncBuiltinESMExports();
