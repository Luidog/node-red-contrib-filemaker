/* global describe beforeEach afterEach it */

const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const recordIdNode = require("../src/nodes/recordId.js");
const listNode = require("../src/nodes/list.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Record Id Utility Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    let testFlows = [{ id: "n1", type: "inject" }];
    helper.load(recordIdNode, testFlows, function() {
      done();
    });
  });
  it("should extract record ids from an array of data", function(done) {
    let testFlow = [
      {
        id: "eff0d28.1c78bb",
        type: "tab",
        label: "Select Record Id",
        disabled: false,
        info: ""
      },
      {
        id: "abcce428.f88018",
        type: "helper"
      },
      {
        id: "b4b1ae5f.4801b8",
        type: "catch",
        z: "eff0d28.1c78bb",
        name: "",
        scope: null,
        x: 560,
        y: 100,
        wires: [["abcce428.f88018"]]
      },
      {
        id: "871850c1.2c366",
        type: "list-records",
        z: "eff0d28.1c78bb",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 330,
        y: 40,
        wires: [["c2e318c8.f96378"]]
      },
      {
        id: "c2e318c8.f96378",
        type: "recordId",
        z: "eff0d28.1c78bb",
        data: "payload.data",
        dataType: "msg",
        output: "payload.data",
        x: 530,
        y: 40,
        wires: [["abcce428.f88018"]]
      },
      {
        id: "e5173483.adc92",
        type: "filemaker-api-client",
        z: "",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      }
    ];
    helper.load(
      [recordIdNode, clientNode, listNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var listNode = helper.getNode("871850c1.2c366");
        var helperNode = helper.getNode("abcce428.f88018");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .and.property("data")
              .to.be.a("array");
            done();
          } catch (err) {
            done(err);
          }
        });
        listNode.receive({
          payload: {
            layout: "people"
          }
        });
      }
    );
  });
});
