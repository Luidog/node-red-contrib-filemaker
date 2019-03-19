/* global describe before beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const client = require("../src/client/client.js");
const createNode = require("../src/nodes/create.js");
const editNode = require("../src/nodes/edit.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Edit Record Node", function() {
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
    helper.load(editNode, testFlow, function() {
      done();
    });
  });

  it("should edit a record", function(done) {
    const testFlow = [
      {
        id: "f8662af9.79e6b8",
        type: "tab",
        label: "Edit Record",
        disabled: false,
        info: ""
      },
      {
        id: "44471c63.16ac64",
        type: "helper"
      },
      {
        id: "69d29232.370f4c",
        type: "catch",
        z: "f8662af9.79e6b8",
        name: "",
        scope: null,
        x: 460,
        y: 100,
        wires: [["44471c63.16ac64"]]
      },
      {
        id: "791e43cb.29487c",
        type: "dapi-create-record",
        z: "f8662af9.79e6b8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "payload.data",
        dataType: "msg",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["2e084d48.3df1ca"]]
      },
      {
        id: "2e084d48.3df1ca",
        type: "dapi-edit-record",
        z: "f8662af9.79e6b8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        recordId: "payload.recordId",
        recordIdType: "msg",
        data: '{"name":"Darth Vader"}',
        dataType: "json",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 450,
        y: 40,
        wires: [["44471c63.16ac64"]]
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
      [client, createNode, editNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("791e43cb.29487c");
        const helperNode = helper.getNode("44471c63.16ac64");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({
          payload: {
            layout: "people",
            data: {
              name: "Anakin Skywalker"
            }
          }
        });
      }
    );
  });

  it("should support merging data when editing a record", function(done) {
    const testFlow = [
      {
        id: "f8662af9.79e6b8",
        type: "tab",
        label: "Edit Record Merge Test",
        disabled: false,
        info: ""
      },
      {
        id: "44471c63.16ac64",
        type: "helper"
      },
      {
        id: "69d29232.370f4c",
        type: "catch",
        z: "f8662af9.79e6b8",
        name: "",
        scope: null,
        x: 460,
        y: 100,
        wires: [["44471c63.16ac64"]]
      },
      {
        id: "791e43cb.29487c",
        type: "dapi-create-record",
        z: "f8662af9.79e6b8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "payload.data",
        dataType: "msg",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["2e084d48.3df1ca"]]
      },
      {
        id: "2e084d48.3df1ca",
        type: "dapi-edit-record",
        z: "f8662af9.79e6b8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        recordId: "payload.recordId",
        recordIdType: "msg",
        data: '{"name":"Darth Vader"}',
        dataType: "json",
        scripts: "",
        scriptsType: "none",
        merge: "true",
        mergeType: "bool",
        output: "payload",
        x: 450,
        y: 40,
        wires: [["44471c63.16ac64"]]
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
      [client, createNode, editNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("791e43cb.29487c");
        const helperNode = helper.getNode("44471c63.16ac64");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("recordId", "modId", "name");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({
          payload: {
            layout: "people",
            data: {
              name: "Anakin Skywalker"
            }
          }
        });
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
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      },
      {
        id: "n1",
        type: "dapi-edit-record",
        client: "3783b2da.4346a6",
        layout: "People",
        z: "f1",
        scripts: "",
        merge: true,
        wires: [["n3"]]
      },
      {
        id: "n2",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      },
      { id: "n3", type: "helper" }
    ];
    helper.load(
      [client, editNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const testNode = helper.getNode("n1");
        const helperNode = helper.getNode("n3");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "code", "error", "code", "message");
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
