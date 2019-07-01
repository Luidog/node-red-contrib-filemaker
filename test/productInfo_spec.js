/* global describe beforeEach afterEach it */

const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const productInfoNode = require("../src/nodes/productInfo.js");
const listNode = require("../src/nodes/list.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Product Info Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    let testFlows = [{ id: "n1", type: "inject" }];
    helper.load(productInfoNode, testFlows, function() {
      done();
    });
  });
  it("should return Data API Server Info", function(done) {
    let testFlow = [
      {
        id: "eff0d28.1c78bb",
        type: "tab",
        label: "Get Product Info",
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
        type: "dapi-product-info",
        z: "eff0d28.1c78bb",
        data: "payload.data",
        dataType: "msg",
        client: "e5173483.adc92",
        output: "payload",
        x: 330,
        y: 40,
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
      [productInfoNode, clientNode, catchNode],
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
        var productInfoNode = helper.getNode("871850c1.2c366");
        var helperNode = helper.getNode("abcce428.f88018");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.an("object")
              .with.all.keys(
                "buildDate",
                "dateFormat",
                "layout",
                "name",
                "timeFormat",
                "timeStampFormat",
                "version"
              );
            done();
          } catch (err) {
            done(err);
          }
        });
        productInfoNode.receive({
          payload: {
            layout: "people"
          }
        });
      }
    );
  });
  it("should reject with an error message and a code", function(done) {
    let testFlow = [
      {
        id: "a0254177.9c8dc",
        type: "tab",
        label: "Product Info Error",
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
        type: "dapi-product-info",
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
      [productInfoNode, clientNode, catchNode],
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
        const productInfoNode = helper.getNode("faf29df7.988c78");
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
        productInfoNode.receive({
          payload: { data: "none" }
        });
      }
    );
  });
});
