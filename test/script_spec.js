/* global before describe beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const scriptNode = require("../src/nodes/script.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Trigger Script Node", function() {
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
    helper.load(scriptNode, testFlow, function() {
      done();
    });
  });

  it("should trigger a script", function(done) {
    const testFlows = [
      {
        id: "28016085.26f9f8",
        type: "tab",
        label: "Trigger Script",
        disabled: false,
        info: ""
      },
      {
        id: "d89553b1.68315",
        type: "helper"
      },
      {
        id: "7320f090.489cd",
        type: "catch",
        z: "28016085.26f9f8",
        name: "",
        scope: null,
        x: 280,
        y: 100,
        wires: [["d89553b1.68315"]]
      },
      {
        id: "ad6b4a61.a752a8",
        type: "dapi-trigger-script",
        z: "28016085.26f9f8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        script: "payload.script",
        scriptType: "msg",
        parameter: "",
        parameterType: "none",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["d89553b1.68315"]]
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
      [clientNode, scriptNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const scriptNode = helper.getNode("ad6b4a61.a752a8");
        const helperNode = helper.getNode("d89553b1.68315");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.any.keys("layout", "script", "scriptError", "scriptResult");
            done();
          } catch (err) {
            done(err);
          }
        });
        scriptNode.receive({
          payload: { layout: "people", script: "JSON Result" }
        });
      }
    );
  });
  it("should parse a script result if it is valid json", function(done) {
    const testFlows = [
      {
        id: "28016085.26f9f8",
        type: "tab",
        label: "Trigger Script",
        disabled: false,
        info: ""
      },
      {
        id: "d89553b1.68315",
        type: "helper"
      },
      {
        id: "7320f090.489cd",
        type: "catch",
        z: "28016085.26f9f8",
        name: "",
        scope: null,
        x: 280,
        y: 100,
        wires: [["d89553b1.68315"]]
      },
      {
        id: "ad6b4a61.a752a8",
        type: "dapi-trigger-script",
        z: "28016085.26f9f8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        script: "payload.script",
        scriptType: "msg",
        parameter: "",
        parameterType: "none",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["d89553b1.68315"]]
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
      [clientNode, scriptNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const scriptNode = helper.getNode("ad6b4a61.a752a8");
        const helperNode = helper.getNode("d89553b1.68315");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.any.keys("layout", "script", "scriptError", "scriptResult")
              .and.property("scriptResult")
              .to.be.an("object")
              .with.any.keys("message");
            done();
          } catch (err) {
            done(err);
          }
        });
        scriptNode.receive({
          payload: { layout: "people", script: "JSON Result" }
        });
      }
    );
  });
  it("should not parse a script result if it is not valid json", function(done) {
    const testFlows = [
      {
        id: "28016085.26f9f8",
        type: "tab",
        label: "Trigger Script",
        disabled: false,
        info: ""
      },
      {
        id: "d89553b1.68315",
        type: "helper"
      },
      {
        id: "7320f090.489cd",
        type: "catch",
        z: "28016085.26f9f8",
        name: "",
        scope: null,
        x: 280,
        y: 100,
        wires: [["d89553b1.68315"]]
      },
      {
        id: "ad6b4a61.a752a8",
        type: "dapi-trigger-script",
        z: "28016085.26f9f8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        script: "payload.script",
        scriptType: "msg",
        parameter: "",
        parameterType: "none",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["d89553b1.68315"]]
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
      [clientNode, scriptNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const scriptNode = helper.getNode("ad6b4a61.a752a8");
        const helperNode = helper.getNode("d89553b1.68315");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.any.keys("layout", "script", "scriptError", "scriptResult")
              .and.property("scriptResult")
              .to.be.a("string");
            done();
          } catch (err) {
            done(err);
          }
        });
        scriptNode.receive({
          payload: { layout: "people", script: "Non JSON Result" }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Script Node Error"
      },
      {
        id: "n2",
        type: "dapi-trigger-script",
        z: "f1",
        name: "Script Node",
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
        name: "Node-RED Test Client",
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
      [clientNode, scriptNode, catchNode],
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
        const script = helper.getNode("n2");
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
        script.receive({ payload: { layout: "none" } });
      }
    );
  });
  it("should throw an error if a client cannot be initialized", function(done) {
    const testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Script Node Error"
      },
      {
        id: "n2",
        type: "dapi-trigger-script",
        z: "f1",
        name: "Script Node",
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
        name: "Node-RED Test Client",
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
      [clientNode, scriptNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const script = helper.getNode("n2");
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
        script.receive({ payload: { layout: "none" } });
      }
    );
  });
});
