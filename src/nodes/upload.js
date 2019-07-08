module.exports = function(RED) {
  function upload(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const {
        layout,
        field,
        file,
        recordId,
        ...parameters
      } = constructParameters(message, configuration, node.context(), [
        "file",
        "layout",
        "field",
        "recordId",
        "parameters"
      ]);
      const connection = await this.connection.client;
      connection
        .upload(file, layout, field, recordId, parameters)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-upload-file", upload);
};
