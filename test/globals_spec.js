/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const globalsNode = require("../src/nodes/globals.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Set Globals Node", function() {
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
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(globalsNode, testFlow, function() {
      done();
    });
  });

  it("should set globals", function(done) {
    var testFlows = [
      {
        id: "c596ca8d.d68938",
        type: "tab",
        label: "Set Globals",
        disabled: false,
        info: ""
      },
      {
        id: "a7e6e37b.58837",
        type: "helper"
      },
      {
        id: "aade6206.341ca",
        type: "catch",
        z: "c596ca8d.d68938",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["a7e6e37b.58837"]]
      },
      {
        id: "53d52c68.273e3c",
        type: "dapi-set-globals",
        z: "c596ca8d.d68938",
        client: "e5173483.adc92",
        data: "payload.data",
        dataType: "msg",
        output: "payload",
        x: 250,
        y: 40,
        wires: [["a7e6e37b.58837"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      }
    ];
    helper.load(
      [clientNode, globalsNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const globalNode = helper.getNode("53d52c68.273e3c");
        const helperNode = helper.getNode("a7e6e37b.58837");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.any.keys("data")
              .and.property("data")
              .to.be.an("object")
              .with.any.keys("Globals::data");
            done();
          } catch (err) {
            done(err);
          }
        });
        globalNode.receive({
          payload: { data: { "Globals::data": "Millenium Falcon" } }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Set Globals Error"
      },
      {
        id: "n2",
        type: "dapi-set-globals",
        z: "f1",
        name: "globals node",
        client: "3783b2da.4346a6",
        layout: "Devices",
        scripts: "",
        merge: true,
        wires: [["n3"]]
      },
      {
        id: "n3",
        type: "helper",
        z: "f1"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      }
    ];
    helper.load(
      [clientNode, globalsNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const globals = helper.getNode("n2");
        const helperNode = helper.getNode("n3");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "code", "error", "message");
            done();
          } catch (err) {
            done(err);
          }
        });
        globals.receive({ payload: { data: { parent: "Han Solo" } } });
      }
    );
  });
});
