import { should as chaiShould } from "chai";

import { EventEmitter } from "../src/event";

chaiShould();

/** @test {EventEmitter} */
describe("EventEmitter", () => {
	let ee = new EventEmitter();

	describe("on", () => {
		it("adds an event listener", () => {
			ee.on("event", () => {});
			ee._listeners.length.should.equal(1);
		});
		it("doesn't accept anything but strings as event names", () => {
			(() => {
				ee.on(() => {});
			}).should.throw(TypeError);
		});
		it("doesn't accept anything but functions as listeners", () => {
			(() => {
				ee.on("event", "not a function");
			}).should.throw(TypeError);
		});
	});
	describe("off", () => {
		it("removes an event listener", () => {
			const listener = () => {};
			ee.on("event", listener);
			ee.off("event", listener);
			ee._listeners.length.should.equal(1);
		});
	});
	describe("emit", () => {
		it("fires an event properly", done => {
			ee.on("event", () => {
				done();
			});
			ee.emit("event");
		});
	});
});
