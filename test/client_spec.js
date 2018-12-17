/* global describe before beforeEach afterEach it */

const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const clientNode = require("../src/client/client.js");

helper.init(require.resolve("node-red"));

describe("Client Node", function() {
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

  it("should be loaded", function(done) {
    const testFlows = [{ id: "n1", type: "inject" }];
    helper.load(clientNode, testFlows, function() {
      done();
    });
  });
});
