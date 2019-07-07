# node-red-contrib-filemaker

Node-RED FileMaker nodes. These nodes use [fms-api-client](https://github.com/Luidog/fms-api-client) to connect to FileMaker Server. Each node exposes an fms-api-client method or utility. Nodes connecting to FileMaker Server depend upon a configurable FileMaker Data API [client](https://github.com/Luidog/fms-api-client#client-creation).

## Project Information

[![npm version](https://badge.fury.io/js/node-red-contrib-filemaker.svg)](https://www.npmjs.com/package/node-red-contrib-filemaker) [![Build Status](https://travis-ci.com/Luidog/node-red-contrib-filemaker.svg?branch=master)](https://travis-ci.com/Luidog/node-red-contrib-filemaker) [![Coverage Status](https://img.shields.io/coveralls/Luidog/node-red-contrib-filemaker/master.svg)](https://coveralls.io/r/Luidog/node-red-contrib-filemaker?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/Luidog/node-red-contrib-filemaker/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Luidog/node-red-contrib-filemaker?targetFile=package.json)

The nodes in this project use [fms-api-client](https://github.com/Luidog/fms-api-client) to connect via the FileMaker Data API to FileMaker Server. The nodes that connect to FileMaker Server depend upon a configurable [client](https://github.com/Luidog/fms-api-client#client-creation) node. The client node uses [marpat](https://github.com/Luidog/marpat) to store and maintain FileMaker Data API session information in-memory. For security client configuration parameters are not exported with a flow.

Once configured a client node will automatically create and maintain a FileMaker Data API session as needed. You are not required to call the [login](#login-node) or [logout](#logout-node) nodes in a flow.

Each node can be configured to use either static or dynamic parameters. Dynamic parameters may be
read from either the `msg` property or the `flow` and `global` contexts. The default output of each node is `msg.payload`. A node can also be configured to merge its output with any property on the `msg` object.

:v: and :heart: - [Lui de la Parra](https://mutesymphony.com)

## Table of Contents

- [Installation](#installation)
- [Login Node](#login-node)
  - [Login Illustration](#login-illustration)
  - [Login Flow](#login-flow)
- [Logout Node](#logout-node)
  - [Logout Illustration](#logout-illustration)
  - [Logout Flow](#logout-flow)
- [Product Info Node](#product-info-node)
  - [Product Info Illustration](#product-info-illustration)
  - [Product Info Flow](#product-info-flow)
- [Databases Node](#databases-node)
  - [Databases Illustration](#databases-illustration)
  - [Databases Flow](#databases-flow)
- [Database Scripts Node](#database-scripts-node)
  - [Database Scripts Illustration](#database-scripts-illustration)
  - [Database Scripts Flow](#database-scripts-flow)
- [Database Layouts Node](#database-layouts-node)
  - [Database Layouts Illustration](#database-layouts-illustration)
  - [Database Layouts Flow](#database-layouts-flow)
- [Layout Info Node](#layout-info-node)
  - [Layout Info Illustration](#layout-info-illustration)
  - [Layout Info Flow](#layout-info-flow)
- [Create Node](#create-node)
  - [Create Illustration](#create-illustration)
  - [Create Flow](#create-flow)
- [Edit Node](#edit-node)
  - [Edit Illustration](#edit-illustration)
  - [Edit Flow](#edit-flow)
- [Delete Node](#delete-node)
  - [Delete Illustration](#delete-illustration)
  - [Delete Flow](#delete-flow)
- [Get Node](#get-node)
  - [Get Illustration](#get-illustration)
  - [Get Flow](#get-flow)
- [List Node](#list-node)
  - [List Illustration](#list-illustration)
  - [List Flow](#list-flow)
- [Find Node](#find-node)
  - [Find Illustration](#find-illustration)
  - [Find Flow](#find-flow)
- [Script Node](#script-node)
  - [Script Illustration](#script-illustration)
  - [Script Flow](#script-flow)
- [Upload Node](#upload-node)
  - [Upload Illustration](#upload-illustration)
  - [Upload Flow](#upload-flow)
- [Globals Node](#globals-node)
  - [Globals Illustration](#globals-illustration)
  - [Globals Flow](#globals-flow)
- [Field Data Node](#field-data-node)
  - [Field Data Illustration](#field-data-illustration)
  - [Field Data Flow](#field-data-flow)
- [Record Ids Node](#record-ids-node)
  - [Record Ids Illustration](#record-ids-illustration)
  - [Record Ids Flow](#record-ids-flow)
- [Transform Node](#transform-node)
  - [Transform Illustration](#transform-illustration)
  - [Transform Flow](#transform-flow)
- [Container Data Node](#container-data-node)
  - [Container Data Illustration](#container-data-illustration)
  - [Container Data Flow](#container-data-flow)
- [Tests](#tests)
- [License](#license)
- [Dependencies](#dependencies)
- [Development Dependencies](#development-dependencies)

## Installation

These nodes can be installed from the command line by running the following command in your Node-RED directory:

```sh

npm install --save node-red-contrib-filemaker
```

These nodes can also be installed using the Node-RED palette manager.

## Login Node

The login node will open a FileMaker Data API session. This node will also save the resulting session token for future use by the configured client. You are _not required_ to login before using any other node in a flow.

### Login Illustration

![Login Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/login-node.png?raw=true)

### Login Flow

[![Example Flow](https://img.shields.io/badge/Flow-Login%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/login-example.json)

## Logout Node

The logout node closes the currently open Data API session and removes the associated session token. You are _not required_ to logout at the end of a flow.

### Logout Illustration

![Logout Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/logout-node.png?raw=true)

### Logout Flow

[![Logout Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/logout-example.json)

### Product Info Node

The product info node gets server product info. This node gets metadata for the FileMaker server the client is configured to use.

### Product Info Illustration

![Product Info Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/product-info-node.png?raw=true)

### Product Info Flow

[![Product Info Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/product-info-example.json)

### Databases Node

The databases node gets all the scripts and script folders accesible to the client.

### Databases Illustration

![Databases Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/databases-node.png?raw=true)

### Databases Flow

[![Databases Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/databases-example.json)

### Database Scripts Node

The database scripts node gets all the scripts and script folders accesible to the client.

### Database Scripts Illustration

![Database Scripts Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/database-scripts-node.png?raw=true)

### Database Scripts Flow

[![Database Scripts Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/database-scripts-example.json)

### Database Layouts Node

The database layouts node gets all the layouts and layout folders accesible to the client.

### Database Layouts Illustration

![Database Layouts Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/database-layouts-node.png?raw=true)

### Database Layouts Flow

[![Database Layouts Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/database-layouts-example.json)

### Layout Info Node

The layout info node gets metadata information for fields and portals on the specified layout.

### Layout Info Illustration

![Layout Info Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/layout-info-node.png?raw=true)

### Layout Info Flow

[![Layout Info Example Flow](https://img.shields.io/badge/Flow-Logout%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/layout-info-example.json)

## Create Node

The create node creates a record in FileMaker. By default The create node will use the value in `msg.payload.layout` as the layout context and `msg.payload.data` for setting field and portal data.

### Create Illustration

![Create Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/create-node.png?raw=true)

### Create Flow

[![Create Example Flow](https://img.shields.io/badge/Flow-Create%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/logout-example.json)

## Edit Node

The edit node edits a specific record in FileMaker. By default the edit node will use `msg.payload.recordId` as the record id to target for editing, the data found in `msg.payload.data` for editing field and portal data, and `msg.payload.layout` as the layout context.

### Edit Illustration

![Edit Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/edit-node.png?raw=true)

### Edit Flow

[![Edit Example Flow](https://img.shields.io/badge/Flow-Edit%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/edit-example.json)

## Delete Node

The delete node deletes a specific record in FileMaker. By default the delete node will use `msg.payload.recordId` as the record id to target for deletion and `msg.payload.layout` as the layout context.

### Delete Illustration

![Delete Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/delete-node.png?raw=true)

### Delete Flow

[![Delete Example Flow](https://img.shields.io/badge/Flow-Delete%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/delete-example.json)

## Get Node

The get node retrieves a specific FileMaker record. By default the get node will use `msg.payload.layout` as the layout context, and `msg.payload.recordId` as the record id to target.

### Get Illustration

![Get Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/get-node.png?raw=true)

### Get Flow

[![Get Example Flow](https://img.shields.io/badge/Flow-Get%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/get-example.json)

## Duplicate Node

The get node retrieves a specific FileMaker record. By default the get node will use `msg.payload.layout` as the layout context, and `msg.payload.recordId` as the record id to target.

### Duplicate Illustration

![Duplicate Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/duplicate-node.png?raw=true)

### Duplicate Flow

[![Duplicate Example Flow](https://img.shields.io/badge/Flow-Get%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/duplicate-example.json)

## List Node

The List node lists FileMaker records for a specified layout. By default the list node will use the value found in `msg.payload.layout` as the layout context.

### List Illustration

![List Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/list-node.png?raw=true)

### List Flow

[![List Example Flow](https://img.shields.io/badge/Flow-List%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/list-example.json)

## Find Node

The find node performs a find in FileMaker. By Default the find node will user `msg.payload.layout` as the layout context, and `msg.payload.query` as query parameters for the find.

### Find Illustration

![Find Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/find-node.png?raw=true)

### Find Flow

[![Find Example Flow](https://img.shields.io/badge/Flow-Find%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/find-example.json)

## Script Node

The script node will trigger a script in FileMaker. By default the script node will use `msg.payload.layout` as the layout context, and `msg.payload.script` as the script to run. An optional script parameter may also be passed using `msg.payload.parameter`.

### Script Illustration

![Script Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/script-node.png?raw=true)

### Script Flow

[![Script Example Flow](https://img.shields.io/badge/Flow-Script%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/script-example.json)

## Upload Node

The upload node will transfer binary data to a FileMaker container. By default the upload node will use `msg.payload.file` as either a string path or buffer object and `msg.payload.layout` as the layout context.

### Upload Illustration

![Upload Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/upload-node.png?raw=true)

### Upload Flow

[![Upload Example Flow](https://img.shields.io/badge/Flow-Upload%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/upload-example.json)

## Globals Node

The globals node will set global record field values for the current FileMaker session. The globals node will use `msg.payload.data` to set global fields.

### Globals Illustration

![Globals Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/globals-node.png?raw=true)

### Globals Flow

[![Globals Example Flow](https://img.shields.io/badge/Flow-Globals%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/globals-example.json)

## Field Data Node

The field data node reduces the data found in `msg.payload.data` to only include the `modId`, `recordId`, and `fieldData` properties.

### Field Data Illustration

![Field Data Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/field-data-node.png?raw=true)

### Field Data Flow

[![Field Data Example Flow](https://img.shields.io/badge/Flow-Field%20Data%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/field-data-example.json)

## Record Ids Node

The record ids node reduces the data found in `msg.payload.data` to only include the `recordId` property.

### Record Ids Illustration

![Record Ids Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/record-ids-node.png?raw=true)

### Record Ids Flow

[![Record Ids Example Flow](https://img.shields.io/badge/Flow-Record%20Ids%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/record-ids-example.json)

## Transform Node

The tranform node transforms data in `msg.payload.data`. It reduces `{ table::field : value }` properties to `{ table: { field : value } }` properties.

### Transform Illustration

![Transform Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/transform-node.png?raw=true)

### Transform Flow

[![Transform Example Flow](https://img.shields.io/badge/Flow-Transform%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/transform-example.json)

## Container Data Node

The container node retrieves container data from `msg.payload.data`. The container node requires a `container` property, a `filename` property, and a `destination` property. Each property should be a `dot notation` path to the required data, such as `fieldData.container` and `fieldData.fileName`. If the configured path does not exist it will be automatically created.

### Container Data Illustration

![Containers Node](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/images/container-data-node.png?raw=true)

### Container Data Flow

[![Containers Example Flow](https://img.shields.io/badge/Flow-Container%20Data%20Node-red.svg)](https://github.com/Luidog/node-red-contrib-filemaker/blob/master/examples/flows/container-data-example.json)

## Tests

```sh
npm install
npm test
```

```default
> node-red-contrib-filemaker@2.0.0 test /Development/node-red-contrib-filemaker
> snyk test && nyc _mocha --recursive  "test/**/*_spec.js" --timeout=30000 --exit


Testing /node-red-contrib-filemaker...

Organisation:      luidog
Package manager:   npm
Target file:       package-lock.json
Open source:       no
Project path:      /Users/Lui/Documents/Development/node-red-contrib-filemaker
Local Snyk policy: found

✓ Tested 363 dependencies for known vulnerabilities, no vulnerable paths found.

  Client Node
    ✓ should be loaded

  Container Data Node
    ✓ should be loaded
    ✓ should download an object with container data to a buffer (1524ms)
    ✓ should download an array of objects with container data to a buffer (332ms)
    ✓ should download an object with container data to the filesystem (329ms)
    ✓ should download an array of objects with container data to the filesystem (329ms)
    ✓ should throw an error with a message and a code when writing an object to a buffer and an error is triggered
    ✓ should throw an error with a message and a code when writing an array to a buffer an error is triggered
    ✓ should handle undefined data input when writing to a buffer
    ✓ should handle undefined data input when writing to a file
    ✓ should throw an error when writing data to the filesystem and an error is triggered
    ✓ should throw an error with a message and a code when writing to a buffer and an array is triggered

  Create Record Node
    ✓ should be loaded
    ✓ should create a record (188ms)
    ✓ should create allow the filemaker response to be merged to the message object (188ms)
    ✓ should use flow context to create a record. (187ms)
    ✓ should use global context to create a record. (189ms)
    ✓ should throw an error with a message and a code (209ms)

  Databases Node
    ✓ should be loaded
    ✓ should return available databases (87ms)
    ✓ should reject with an error message and a code (144ms)

  Delete Record Node
    ✓ should be loaded
    ✓ should delete a record (309ms)
    ✓ should throw an error with a message and a code (188ms)

  Duplicate Record Node
    ✓ should be loaded
    ✓ should duplicate a record (298ms)
    ✓ should reject with an error message and a code (192ms)

  Edit Record Node
    ✓ should be loaded
    ✓ should edit a record (312ms)
    ✓ should support merging data when editing a record (322ms)
    ✓ should throw an error with a message and a code (197ms)

  FieldData Utility Node
    ✓ should be loaded
    ✓ should transform an array of objects (314ms)
    ✓ should transform a a single object (330ms)
    ✓ should reject with an error message and code

  Find Records Node
    ✓ should be loaded
    ✓ should perform a find (298ms)
    ✓ should throw an error with a message and a code (216ms)

  Get Record Node
    ✓ should be loaded
    ✓ should get a specific record (338ms)
    ✓ should throw an error with a message and a code (221ms)

  Set Globals Node
    ✓ should be loaded
    ✓ should set globals (222ms)
    ✓ should throw an error with a message and a code (231ms)

  Layout Info Node
    ✓ should be loaded
    ✓ should get layout information (230ms)
    ✓ should throw an error with a message and a code (218ms)

  Get Layouts Node
    ✓ should be loaded
    ✓ should return a list of layouts (207ms)
    ✓ should reject with an error message and a code

  List Records Node
    ✓ should be loaded
    ✓ should List records (346ms)
    ✓ should throw an error with a message and a code (227ms)

  Login Node
    ✓ should be loaded
    ✓ should login to a Data API session (100ms)
    ✓ should throw an error with a message and a code (1423ms)

  Logout Node
    ✓ should be loaded
    ✓ should close a Data API Session (170ms)
    ✓ should throw an error with a message and a code

  Product Info Node
    ✓ should be loaded
    ✓ should return Data API Server Info (76ms)
    ✓ should reject with an error message and a code (119ms)

  Record Id Utility Node
    ✓ should be loaded
    ✓ should extract record ids from a single object (287ms)
    ✓ should extract record ids from an array of objects (280ms)
    ✓ should reject with an error message and a code

  Trigger Script Node
    ✓ should be loaded
    ✓ should trigger a script (230ms)
    ✓ should parse a script result if it is valid json (245ms)
    ✓ should not parse a script result if it is not valid json (230ms)
    ✓ should throw an error with a message and a code (242ms)

  Get Scripts Node
    ✓ should be loaded
    ✓ should return a list of scripts (241ms)
    ✓ should reject with an error message and a code

  Utility Services
    merge utility
      ✓ should merge data to the payload object
    sanitize utility
      ✓ should discard unspecified properties
    compact utility
      ✓ should accept an array of objects
      ✓ should remove null properties
      ✓ should remove null properties
      ✓ should remove empty strings
      ✓ should not remove false values
      ✓ should discard non json values
      ✓ should discard non json values
    isJson Utility
      ✓ it should return true for an object
      ✓ it should return true for an empty object
      ✓ it should return true for a stringified object
      ✓ it should return false for a number
      ✓ it should return false for undefined
      ✓ it should return false for a string
      ✓ it should return false for null
    castBoolean Utility
      ✓ it should cast a true string as true boolean
      ✓ it should cast a false string as false boolean
      ✓ it should cast multiple string values as booleans
      ✓ it should only cast strings of true or false

  Transform Utility Node
    ✓ should be loaded
    ✓ should transform an array of objects (377ms)
    ✓ should transform a single object (272ms)
    ✓ should throw an error with a message and a code

  Upload File Node
    ✓ should be loaded
    ✓ should upload to an existing record (460ms)
    ✓ should upload to a file to a new record (494ms)
    ✓ should throw an error with a message and a code


  102 passing (15s)

-----------------------|----------|----------|----------|----------|-------------------|
File                   |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------|----------|----------|----------|----------|-------------------|
All files              |      100 |      100 |      100 |      100 |                   |
 client                |      100 |      100 |      100 |      100 |                   |
  client.js            |      100 |      100 |      100 |      100 |                   |
 nodes                 |      100 |      100 |      100 |      100 |                   |
  containerData.js     |      100 |      100 |      100 |      100 |                   |
  create.js            |      100 |      100 |      100 |      100 |                   |
  databases.js         |      100 |      100 |      100 |      100 |                   |
  delete.js            |      100 |      100 |      100 |      100 |                   |
  duplicate.js         |      100 |      100 |      100 |      100 |                   |
  edit.js              |      100 |      100 |      100 |      100 |                   |
  fieldData.js         |      100 |      100 |      100 |      100 |                   |
  find.js              |      100 |      100 |      100 |      100 |                   |
  get.js               |      100 |      100 |      100 |      100 |                   |
  globals.js           |      100 |      100 |      100 |      100 |                   |
  layout.js            |      100 |      100 |      100 |      100 |                   |
  layouts.js           |      100 |      100 |      100 |      100 |                   |
  list.js              |      100 |      100 |      100 |      100 |                   |
  login.js             |      100 |      100 |      100 |      100 |                   |
  logout.js            |      100 |      100 |      100 |      100 |                   |
  productInfo.js       |      100 |      100 |      100 |      100 |                   |
  recordId.js          |      100 |      100 |      100 |      100 |                   |
  script.js            |      100 |      100 |      100 |      100 |                   |
  scripts.js           |      100 |      100 |      100 |      100 |                   |
  transform.js         |      100 |      100 |      100 |      100 |                   |
  upload.js            |      100 |      100 |      100 |      100 |                   |
 services              |      100 |      100 |      100 |      100 |                   |
  index.js             |      100 |      100 |      100 |      100 |                   |
  utilities.service.js |      100 |      100 |      100 |      100 |                   |
-----------------------|----------|----------|----------|----------|-------------------|
```

## License

MIT © [Lui de la Parra](https://mutesymphony.com/)

## Dependencies

- [fms-api-client](https://github.com/Luidog/fms-api-client): A FileMaker Data API client designed to allow easier interaction with a FileMaker database from a web environment.
- [fs-extra](https://github.com/jprichardson/node-fs-extra): fs-extra contains methods that aren't included in the vanilla Node.js fs package. Such as mkdir -p, cp -r, and rm -rf.
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [marpat](https://github.com/luidog/marpat): A class-based ES6 ODM for Mongo-like databases.
- [sinon](https://github.com/sinonjs/sinon): JavaScript test spies, stubs and mocks.
- [snyk](https://github.com/snyk/snyk): snyk library and cli utility

## Development Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [coveralls](https://github.com/nickmerwin/node-coveralls): takes json-cov output into stdin and POSTs to coveralls.io
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env file
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-google](https://github.com/google/eslint-config-google): ESLint shareable config for the Google style
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
- [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html): A ESLint plugin to lint and fix inline scripts contained in HTML files.
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier): Runs prettier as an eslint rule
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter): LCOV reporter for Mocha
- [mos](https://github.com/mosjs/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [mos-plugin-dependencies](https://github.com/mosjs/mos/tree/master/packages/mos-plugin-dependencies): A mos plugin that creates dependencies sections
- [mos-plugin-execute](https://github.com/team-767/mos-plugin-execute): Mos plugin to inline a process output
- [mos-plugin-installation](https://github.com/mosjs/mos/tree/master/packages/mos-plugin-installation): A mos plugin for creating installation section
- [mos-plugin-license](https://github.com/mosjs/mos-plugin-license): A mos plugin for generating a license section
- [node-red](https://github.com/node-red/node-red): A visual tool for wiring the Internet of Things
- [node-red-node-test-helper](https://github.com/node-red/node-red-node-test-helper): A test framework for Node-RED nodes
- [nyc](https://github.com/istanbuljs/nyc): the Istanbul command line interface
- [pm2](https://github.com/Unitech/pm2): Production process manager for Node.JS applications with a built-in load balancer.
- [prettier](https://github.com/prettier/prettier): Prettier is an opinionated code formatter
- [varium](https://npmjs.org/package/varium): A strict parser and validator of environment config variables
