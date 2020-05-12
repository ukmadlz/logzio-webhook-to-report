import * as Hapi from '@hapi/hapi';
import LogzIO from 'logzio-typescript';
import { v4 as uuid } from 'uuid';
import * as Datastore from 'nedb';
import { config as dotenv } from 'dotenv';

// Load local ENV
dotenv();

// Instantiate LogzIO lib
const logzio = new LogzIO('us', process.env.LOGZIO_API_TOKEN);


// Load Server
console.log('Loading Server');
const host = 'localhost';
const port = process.env.PORT || 3000;
const server: Hapi.Server = new Hapi.Server({
  host,
  port
});

// Routes
console.log('Loading Server Routes');
// Create test report
server.route({
  method: 'POST',
  path: '/alert',
  handler: async (request, h) => {
    // Test ID to use
    const testID = uuid();

    // Create the custom endpoint
    const alertDetails = await logzio.endpoints.custom.create(testID, `${process.env.BASE_URI}/alert/${testID}`, 'POST');
    console.log(alertDetails);
    return {
      testID
    };
  }
});

// Cleanup after use
server.route({
  method: 'DELETE',
  path: '/alert/{testID}',
  handler: async (request, h) => {
    // Test ID to use
    const { testID } = request.params;

    // Create the custom endpoint
    const endpoints = await logzio.endpoints.list();
    const endpoint = endpoints.data.find((endpoint) => endpoint.title === testID);
    if (!endpoint) return {};
    try {
      await logzio.endpoints.delete(endpoint.id);
      return {};
    } catch(error) {
      console.error('Error Deleting Endpoint');
      console.error(error);
      return {};
    }
  }
});

// HTTP interceptor alerts
server.route({
  method: 'POST',
  path: '/alert/{testID}',
  handler: (request, h) => {
    const testId = request.params.testID;
    console.log(request.payload);
    // const { alert_title } = request.payload;
    return {};
  }
});

// Fetch report
server.route({
  method: 'GET',
  path: '/alert/{testID}',
  handler: (request, h) => {
    const testId = request.params.testID;
    console.log(testId);
    return request.params;
  }
});

// Fill the memory
server.route({
  method: ['GET'],
  path: '/test/memory/{records}',
  handler: async (request, h) => {
    const { records } = request.params;
    const recordsToInsert = await Array.apply(0, Array(Number(records))).map(() => {
      return { uuid: uuid(), date: new Date() };
    });
    const success = new Promise((resolve, reject) => {
      const db = new Datastore();
      return db.insert(recordsToInsert, (error, newDocs) => {
        if(error) return reject(error);
        return resolve(newDocs);
      });
    });
    return await success;
  }
});

// Catch the explosions
// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});


// Catch unhandling rejected promises
process.on('unhandledRejection', (reason: any) => {
  console.error('unhandledRejection');
  console.error(reason);
});

export default server;