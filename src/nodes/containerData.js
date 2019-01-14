module.exports = function(RED) {
  function containerData(configuration) {
    const { containerData } = require("fms-api-client");
    const fs = require("fs-extra");
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    node.on("input", async message => {
      let {
        data,
        field,
        name,
        destination,
        ...parameters
      } = constructParameters(message, configuration, node.context(), [
        "data",
        "field",
        "name",
        "destination",
        "parameters"
      ]);
      destination !== "buffer"
        ? await fs
            .ensureDir(destination)
            .then(() =>
              containerData(data, field, destination, name, parameters)
            )
            .then(files =>
              node.send(merge(configuration.output, message, files))
            )
            .catch(error => node.error(error.message, message))
        : await containerData(data, field, destination, name, parameters)
            .then(files =>
              node.send(merge(configuration.output, message, files))
            )
            .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-container-data", containerData);
};
