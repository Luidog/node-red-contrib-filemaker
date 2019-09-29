/* global describe before beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const clientNode = require("../src/client/client.js");
const createNode = require("../src/nodes/create.js");
const deleteNode = require("../src/nodes/delete.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Delete Record Node", function() {
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
    helper.load(deleteNode, testFlow, function() {
      done();
    });
  });

  it("should delete a record", function(done) {
    const testFlow = [
      {
        id: "c76706d3.5d9aa",
        type: "tab",
        label: "Delete Record",
        disabled: false,
        info: ""
      },
      {
        id: "170d96e0.3341c9",
        type: "dapi-delete-record",
        z: "c76706d3.5d9aa",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        recordId: "payload.recordId",
        recordIdType: "msg",
        scripts: "",
        scriptsType: "none",
        output: "payload",
        x: 540,
        y: 40,
        wires: [["ed53a9a5.d69f6"]]
      },
      {
        id: "42c2ddf9.1030ec",
        type: "dapi-create-record",
        z: "c76706d3.5d9aa",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "",
        dataType: "none",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 340,
        y: 40,
        wires: [["170d96e0.3341c9"]]
      },
      {
        id: "bf1c5ed7.0affa",
        type: "catch",
        z: "c76706d3.5d9aa",
        name: "",
        scope: null,
        x: 560,
        y: 100,
        wires: [["ed53a9a5.d69f6"]]
      },
      {
        id: "ed53a9a5.d69f6",
        type: "helper"
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
      [clientNode, deleteNode, createNode, catchNode],
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
        const createNode = helper.getNode("42c2ddf9.1030ec");
        const helperNode = helper.getNode("ed53a9a5.d69f6");
        helperNode.on("input", function(msg) {
          try {
            expect(msg).to.be.an("object");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({ payload: { layout: "people" } });
      }
    );
  });

  it("should throw an error with a message and a code", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Edit Error"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        z: "f1",
        database: process.env.FILEMAKER_DATABASE,
        user: process.env.FILEMAKER_USERNAME,
        password: process.env.FILEMAKER_PASSWORD,
        usage: true
      },
      {
        id: "n2",
        type: "dapi-delete-record",
        client: "3783b2da.4346a6",
        layout: "People",
        z: "f1",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      },
      { id: "n3", type: "helper" }
    ];
    helper.load(
      [clientNode, deleteNode, catchNode],
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
        const testNode = helper.getNode("n2");
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
        testNode.receive({ payload: {} });
      }
    );
  });

  it("should handle client initilization errors", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Edit Error"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        name: "Mute Symphony",
        z: "f1"
      },
      {
        id: "n2",
        type: "dapi-delete-record",
        client: "3783b2da.4346a6",
        layout: "People",
        z: "f1",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      },
      { id: "n3", type: "helper" }
    ];
    helper.load(
      [clientNode, deleteNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const testNode = helper.getNode("n2");
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
        testNode.receive({ payload: {} });
      }
    );
  });
});
