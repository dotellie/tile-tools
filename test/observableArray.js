import { should } from "chai";

import { ObservableArray } from "../src/observableArray.js";

should();

/** @test {ObservableArray} */
describe("ObservableArray", () => {
	let array;

	describe("#push", () => {
		it("adds listeners correctly", () => {
			let count = 0;
			array = new ObservableArray("event", () => count++);
			const object = {
				on(_, c) {
					c();
				}
			};
			array.push(object);
			count.should.equal(1);
			array.length.should.equal(1);
		});
	});

	describe("#splice", () => {
		it("adds and removes listeners correctly", () => {
			let count = 0;
			array = new ObservableArray("event", on => (count += (on ? 1 : -1)));
			const object = {
				on(_, c) {
					c(true);
				},
				off(_, c) {
					c();
				}
			};
			array.push(object, object);
			array.splice(0, 1, object, object);
			count.should.equal(3);
			array.length.should.equal(3);
		});
	});
});
