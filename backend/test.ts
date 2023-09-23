import {performance} from "perf_hooks";
import supertest, {SuperTest} from "supertest";
import {buildApp} from "./app";

let app: SuperTest<any>;

async function assignApp() {
    const appToTest = await buildApp();
    app = supertest(appToTest);
}

async function basicLatencyTest() {
    await app.post("/reset").expect(204);
    const start = performance.now();
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    await app.post("/charge").expect(200);
    console.log(`Latency: ${performance.now() - start} ms`);
}

async function runTests() {
    await assignApp();
    await basicLatencyTest();
}

runTests().catch(console.error);
