/* global describe it */

const { expect } = require("chai");
const {
  merge,
  sanitize,
  compact,
  isJson,
  castBooleans
} = require("../src/services");

describe("Utility Services", function() {
  describe("merge utility", () => {
    it("should merge data to the payload object", () => {
      return expect(merge("payload", {}, { object: true }))
        .to.be.a("object")
        .and.to.include.keys("payload")
        .and.property("payload")
        .to.be.a("object");
    });
  });

  describe("sanitize utility", function() {
    it("should discard unspecified properties", function() {
      return expect(sanitize({ keep: true, discard: true }, ["keep"]))
        .to.be.a("object")
        .and.to.not.have.keys("discard");
    });
  });

  describe("compact utility", function() {
    it("should accept an array of objects", function() {
      return expect(compact([{}, {}])).to.be.a("object");
    });
    it("should remove null properties", function() {
      return expect(compact([{ hasNull: null }, {}]))
        .to.be.a("object")
        .and.to.not.have.keys("hasNull");
    });
    it("should remove null properties", function() {
      return expect(compact({ hasNull: null }))
        .to.be.a("object")
        .and.to.not.have.keys("hasNull");
    });
    it("should remove empty strings", function() {
      return expect(compact({ emptyString: "" }))
        .to.be.a("object")
        .and.to.not.have.keys("emptyString");
    });
    it("should not remove false values", function() {
      return expect(compact({ isfalse: false }))
        .to.be.a("object")
        .and.to.have.keys("isfalse");
    });
    it("should discard non json values", function() {
      return expect(compact([{ isfalse: false }, "string"]))
        .to.be.a("object")
        .and.to.have.keys("isfalse")
        .and.to.not.have.keys("string");
    });
    it("should discard non json values", function() {
      return expect(compact("string")).to.be.a("object");
    });
  });

  describe("isJson Utility", () => {
    it("it should return true for an object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
    it("it should return true for an empty object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
    it("it should return true for a stringified object", () => {
      return expect(isJson({})).to.equal(true);
    });
    it("it should return false for a number", () => {
      return expect(isJson(1)).to.equal(false);
    });
    it("it should return false for undefined", () => {
      return expect(isJson()).to.equal(false);
    });
    it("it should return false for a string", () => {
      return expect(isJson("string")).to.equal(false);
    });
    it("it should return false for null", () => {
      return expect(isJson(null)).to.equal(false);
    });
  });
  describe("castBoolean Utility", () => {
    it("it should cast a true string as true boolean", () => {
      return expect(castBooleans({ boolean: "true" })).to.deep.equal({
        boolean: true
      });
    });
    it("it should cast a false string as false boolean", () => {
      return expect(castBooleans({ boolean: "false" })).to.deep.equal({
        boolean: false
      });
    });
    it("it should cast multiple string values as booleans", () => {
      return expect(
        castBooleans({ boolean: "false", stillBoolean: "true" })
      ).to.deep.equal({ boolean: false, stillBoolean: true });
    });
    it("it should only cast strings of true or false", () => {
      return expect(
        castBooleans({
          boolean: "false",
          number: 1,
          string: "yup",
          actualBoolean: false,
          trueBoolean: true,
          stillBoolean: "true"
        })
      ).to.deep.equal({
        boolean: false,
        number: 1,
        string: "yup",
        actualBoolean: false,
        trueBoolean: true,
        stillBoolean: true
      });
    });
  });
});
