/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const loginNode = require("../src/nodes/login.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Login Node", function() {
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
    helper.load(loginNode, testFlow, function() {
      done();
    });
  });
  it("should login to a Data API session", function(done) {
    var testFlow = [
      {
        id: "ad6ac1ee.a379",
        type: "tab",
        label: "Login",
        disabled: false,
        info: ""
      },
      {
        id: "b2ee9af1.20e748",
        type: "catch",
        z: "ad6ac1ee.a379",
        name: "",
        scope: null,
        x: 220,
        y: 100,
        wires: [["f7fa61c6.78379"]]
      },
      {
        id: "f7fa61c6.78379",
        type: "helper"
      },
      {
        id: "612b70ca.81566",
        type: "dapi-login",
        z: "ad6ac1ee.a379",
        client: "e5173483.adc92",
        output: "payload",
        x: 230,
        y: 40,
        wires: [["f7fa61c6.78379"]]
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
      [clientNode, loginNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const loginNode = helper.getNode("612b70ca.81566");
        const helperNode = helper.getNode("f7fa61c6.78379");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.have.any.keys("token", "_msgid");
            done();
          } catch (err) {
            done(err);
          }
        });
        loginNode.receive({ payload: {} });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Login Error Test"
      },
      {
        id: "n1",
        type: "dapi-login",
        z: "f1",
        name: "login Node",
        client: "3783b2da.4346a6",
        wires: [["n2"]]
      },
      {
        id: "n2",
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
        id: "n3",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n2"]]
      }
    ];
    helper.load(
      [clientNode, loginNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: "wrong-password"
        }
      },
      function() {
        const login = helper.getNode("n1");

        const helperNode = helper.getNode("n2");
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
        login.receive({ payload: {} });
      }
    );
  });
});
