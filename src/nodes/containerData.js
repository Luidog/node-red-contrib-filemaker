module.exports = function(RED) {
  function containerData(config) {
    const { containerData } = require("fms-api-client");
    const fs = require("fs-extra");
    const { constructParameters, send, handleError } = require("../services");
    const { output, ...configuration } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.status({ fill: "green", shape: "dot", text: "Ready" });
    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const {
        data,
        field,
        filename,
        destination,
        ...parameters
      } = constructParameters(message, configuration, node.context(), [
        "data",
        "field",
        "filename",
        "destination",
        "parameters"
      ]);

      destination && destination !== "buffer"
        ? await fs
            .ensureDir(destination)
            .then(() =>
              containerData(
                data || [{}],
                field,
                destination,
                filename,
                parameters
              )
            )
            .then(data =>
              Array.isArray(data)
                ? data.map(({ name, path }) => ({
                    filename: name,
                    path
                  }))
                : { ...data, filename: data.name }
            )
            .then(files => send(node, output, message, files))
            .catch(error => handleError(node, error.message, message))
        : await containerData(data || {}, field, "buffer", filename, parameters)
            .then(data =>
              Array.isArray(data)
                ? data.map(({ name, buffer }) => ({
                    filename: name,
                    buffer
                  }))
                : { ...data, filename: data.name }
            )
            .then(files => send(node, output, message, files))
            .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-container-data", containerData);
};
