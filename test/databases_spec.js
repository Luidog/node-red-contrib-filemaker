/* global describe beforeEach afterEach it */

const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const databasesNode = require("../src/nodes/databases.js");
const listNode = require("../src/nodes/list.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Databases Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    let testFlows = [{ id: "n1", type: "inject" }];
    helper.load(databasesNode, testFlows, function() {
      done();
    });
  });
  it("should return available databases", function(done) {
    let testFlow = [
      {
        id: "eff0d28.1c78bb",
        type: "tab",
        label: "Get Databases",
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
        id: "96572b6d.f133a8",
        type: "dapi-databases",
        z: "2f61f06f.5f61f8",
        name: "",
        client: "e5173483.adc92",
        output: "payload",
        x: 510,
        y: 560,
        wires: [["abcce428.f88018"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [databasesNode, clientNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const databasesNode = helper.getNode("96572b6d.f133a8");
        const helperNode = helper.getNode("abcce428.f88018");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.all.keys("databases");
            done();
          } catch (err) {
            done(err);
          }
        });
        databasesNode.receive({
          payload: {}
        });
      }
    );
  });
  it("should reject with an error message and a code", function(done) {
    let testFlow = [
      {
        id: "a0254177.9c8dc",
        type: "tab",
        label: "Databases Error",
        disabled: false,
        info: ""
      },
      {
        id: "c03adb39.c4a738",
        type: "helper"
      },
      {
        id: "bb98f3db.1ee78",
        type: "catch",
        z: "a0254177.9c8dc",

        name: "",
        scope: null,
        x: 360,
        y: 100,
        wires: [["c03adb39.c4a738"]]
      },
      {
        id: "faf29df7.988c78",
        type: "dapi-databases",
        z: "a0254177.9c8dc",
        data: "payload.data",
        dataType: "msg",
        client: "e5173483.adc92",
        output: "payload",

        x: 330,
        y: 40,
        wires: [["c03adb39.c4a738"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [databasesNode, clientNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: "https://httpstat.us/400",
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const databasesNode = helper.getNode("faf29df7.988c78");
        const helperNode = helper.getNode("c03adb39.c4a738");
        helperNode.on("input", function(msg) {
          console.log(msg.payload);
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.all.keys("data");
            done();
          } catch (err) {
            done(err);
          }
        });
        databasesNode.receive({
          payload: { data: "none" }
        });
      }
    );
  });
});
