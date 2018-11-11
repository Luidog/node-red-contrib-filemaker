const { Filemaker } = require("fms-api-client");
const { connect } = require("marpat");

connect("nedb://memory");

function configurationNode(RED) {
  function Client(n) {
    let client = Filemaker.create(n);
    this.client = client.save();
    RED.nodes.createNode(this, n);
  }
  RED.nodes.registerType("filemaker-api-client", Client);
}

module.exports = configurationNode;
