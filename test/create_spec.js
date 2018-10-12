/* global before describe beforeEach afterEach it */

const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const create = require("../src/nodes/create.js");
const client = require("../src/client/client.js");

helper.init(require.resolve("node-red"));

describe("Create Record Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium(process.env, "./test/env.manifest");
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should send a message", function(done) {
    var testFlows = [
      {
        id: "f6c6ae45.9d8ed8",
        type: "filemaker-api-client",
        server: "https://fm.mutesymphony.com",
        name: "Mute Symphony",
        application: "node-red-app",
        user: "obi-wan",
        password: "kenobi",
        usage: true
      },
      {
        id: "771c5833.7d24d8",
        type: "create-record",
        client: "f6c6ae45.9d8ed8",
        layout: "People",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load([client, create], testFlows, function() {
      const createNode = helper.getNode("771c5833.7d24d8");
      const helperNode = helper.getNode("n2");
      helperNode.on("input", function(msg) {
        msg.should.have.property("payload");
      });
      done();
      createNode.receive({ payload: { data: { name: "Han Solo" } } });
    });
  });
});
