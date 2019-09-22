/* global before describe beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const layoutNode = require("../src/nodes/layout.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Layout Info Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium({ manifestPath });
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(() =>
      setTimeout(() => {
        delete global.MARPAT;
        done();
      }, "500")
    );
  });

  it("should be loaded", function(done) {
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(layoutNode, testFlow, function() {
      done();
    });
  });

  it("should get layout information", function(done) {
    const testFlow = [
      {
        id: "b8b203cb.2fdb5",
        type: "tab",
        label: "Get Layout Info",
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
        type: "dapi-layout",
        z: "b8b203cb.2fdb5",
        name: "",
        client: "e5173483.adc92",
        output: "payload",
        layout: "payload.layout",
        layoutType: "msg",
        x: 670,
        y: 60,
        wires: [["3a50c4e9.9b3824"]]
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
      [clientNode, layoutNode, catchNode],
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
        const layoutNode = helper.getNode("3c1de137.e4ac3e");
        const helperNode = helper.getNode("3a50c4e9.9b3824");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("fieldMetaData", "portalMetaData");
            done();
          } catch (err) {
            done(err);
          }
        });
        layoutNode.receive({
          payload: { layout: "people" }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch List Error"
      },
      {
        id: "3c1de137.e4ac3e",
        type: "dapi-layout",
        z: "f1",
        name: "",
        client: "3783b2da.4346a6",
        output: "payload",
        layout: "payload.layout",
        layoutType: "msg",
        x: 670,
        y: 60,
        wires: [["3a50c4e9.9b3824"]]
      },
      {
        id: "3a50c4e9.9b3824",
        type: "helper",
        z: "f1"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        name: "Node-RED Test Client",
        usage: true
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["3a50c4e9.9b3824"]]
      }
    ];
    helper.load(
      [clientNode, layoutNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const layoutNode = helper.getNode("3c1de137.e4ac3e");
        const helperNode = helper.getNode("3a50c4e9.9b3824");
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
        layoutNode.receive({ payload: { layout: "none" } });
      }
    );
  });
});
