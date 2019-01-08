/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const listNode = require("../src/nodes/list.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("List Records Node", function() {
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
    helper.load(listNode, testFlow, function() {
      done();
    });
  });

  it("should List records", function(done) {
    var testFlows = [
      {
        id: "b8b203cb.2fdb5",
        type: "tab",
        label: "List Records",
        disabled: false,
        info: ""
      },
      {
        id: "3a50c4e9.9b3824",
        type: "helper"
      },
      {
        id: "f9a81ba9.646118",
        type: "catch",
        z: "b8b203cb.2fdb5",
        name: "",
        scope: null,
        x: 260,
        y: 100,
        wires: [["3a50c4e9.9b3824"]]
      },
      {
        id: "3c1de137.e4ac3e",
        type: "dapi-list-records",
        z: "b8b203cb.2fdb5",
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
        x: 250,
        y: 40,
        wires: [["3a50c4e9.9b3824"]]
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
      [clientNode, listNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const listNode = helper.getNode("3c1de137.e4ac3e");
        const helperNode = helper.getNode("3a50c4e9.9b3824");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload");
            done();
          } catch (err) {
            done(err);
          }
        });
        listNode.receive({
          payload: { layout: "people", data: { name: "Anakin Skywalker" } }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch List Error"
      },
      {
        id: "n2",
        type: "dapi-list-records",
        z: "f1",
        name: "List Node",
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
        type: "filemaker-api-client",
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
      [clientNode, listNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const list = helper.getNode("n2");
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
        list.receive({ payload: { layout: "none" } });
      }
    );
  });
});
