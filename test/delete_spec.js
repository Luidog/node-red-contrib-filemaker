/* global describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const clientNode = require("../src/client/client.js");
const createNode = require("../src/nodes/create.js");
const deleteNode = require("../src/nodes/delete.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Delete Record Node", function() {
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
    helper.load(deleteNode, testFlow, function() {
      done();
    });
  });

  it("should delete a record", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Delete Record Test"
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
        type: "create-record",
        client: "3783b2da.4346a6",
        layout: "People",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      {
        id: "n2",
        type: "delete-record",
        client: "3783b2da.4346a6",
        layout: "People",
        scripts: "",
        merge: true,
        wires: [["n4"]]
      },
      {
        id: "n3",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n4"]]
      },
      { id: "n4", type: "helper" }
    ];
    helper.load(
      [clientNode, deleteNode, createNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("n1");
        const helperNode = helper.getNode("n4");
        helperNode.on("input", function(msg) {
          try {
            expect(msg).to.be.an("object");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({ payload: { data: {} } });
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
        type: "filemaker-api-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        z: "f1",
        application: process.env.FILEMAKER_APPLICATION,
        user: process.env.FILEMAKER_USERNAME,
        password: process.env.FILEMAKER_PASSWORD,
        usage: true
      },
      {
        id: "n2",
        type: "delete-record",
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
