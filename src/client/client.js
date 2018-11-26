const { Filemaker } = require("fms-api-client");
const { connect } = require("marpat");

connect("nedb://memory");

function configurationNode(RED) {
  function Client(n) {
    RED.nodes.createNode(this, n);
    let client = Filemaker.create(
      Object.assign(n, {
        user: this.credentials.username,
        password: this.credentials.password
      })
    );

    this.client = client.save();
  }
  RED.nodes.registerType("filemaker-api-client", Client, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });
}

module.exports = configurationNode;
