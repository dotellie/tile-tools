import { should as chaiShould } from "chai";

import { EventEmitter } from "../src/event";

chaiShould();

/** @test {EventEmitter} */
describe("EventEmitter", () => {
	let ee = new EventEmitter();

	describe("#on", () => {
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
	describe("#off", () => {
		it("removes an event listener", () => {
			const listener = () => {};
			ee.on("event", listener);
			ee.off("event", listener);
			ee._listeners.length.should.equal(1);
		});
	});
	describe("#offAll", () => {
		it("removes all event listeners of a type", () => {
			ee.on("event", () => {});
			ee.on("event", () => {});
			ee.on("another-event", () => {});
			ee.offAll("event");
			ee._listeners.should.have.a.lengthOf(1);
		});
	});
	describe("#emit", () => {
		it("fires an event with arguements properly", done => {
			ee.on("event", e => {
				e.value.should.equal(456);
				e.something.should.equal("hi");
				done();
			});
			ee.emit("event", { value: 456, something: "hi" });
		});
	});
	describe("#forward", () => {
		it("starts forwarding a specified event", done => {
			const thing = new class extends EventEmitter {
				constructor() {
					super();

					this.forward(ee, "an-event");
				}
			}();

			thing.on("an-event", e => {
				e.should.equal("some data");

				done();
			});

			ee.emit("an-event", "some data");
		});
	});
});
