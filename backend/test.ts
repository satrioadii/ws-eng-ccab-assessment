import {performance} from "perf_hooks";
import supertest, {SuperTest} from "supertest";
import {buildApp} from "./app";

let app: SuperTest<any>;

async function assignApp() {
    const appToTest = await buildApp();
    app = supertest(appToTest);
}

async function basicLatencyTest() {
    console.log('----------------------------');
    console.log("Starting latency test");
    console.log('----------------------------');

    await app.post("/reset").expect(204);
    const start = performance.now();
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    console.log(`Latency: ${performance.now() - start} ms`);
    console.log('----------------------------');
    console.log('----------------------------');
}

async function basicConcurrencyTest() {
    console.log('----------------------------');
    console.log("Starting concurrency test");
    console.log('----------------------------')

    await app.post("/reset").expect(204);
    const start = performance.now();

    const promises = [];
    for (let i = 0; i < 20; i++) {
        promises.push(app.post("/charge").expect(200));
    }

    const results = await Promise.all(promises);

    console.log(`Latency: ${performance.now() - start} ms`);

    const defaultBalance = 100;
    const charges = 10;

    const expectedAuthorized = Math.floor(defaultBalance / charges);
    let authorizedRequest = 0;

    for (let idx = 0; idx < results.length; idx++) {
        const result = results[idx];
        console.log(idx, result.body);

        if (result?.body.isAuthorized) {
            authorizedRequest += 1;
        }
    }

    console.log(`Authorized requests: ${authorizedRequest}/${expectedAuthorized}`);

    console.log('----------------------------');
    console.log('----------------------------');
}

async function runTests() {
    await assignApp();
    await basicLatencyTest();
    await basicConcurrencyTest();
}

runTests().catch(console.error);
