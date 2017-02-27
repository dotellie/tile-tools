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
		it("inserts at correct index even after multiple pushes", () => {
			array = new ObservableArray();
			const object1 = { on() {} }, object2 = { on() {} };
			array.push(object1);
			array.push(object2);
			array.push(object1);
			array[0].should.equal(object1);
			array[1].should.equal(object2);
			array[2].should.equal(object1);
		});
	});

	describe("#splice", () => {
		it("adds and removes listeners correctly", () => {
			let count = 0;
			array = new ObservableArray("event", e => (count += (e.detail ? 1 : -1)));
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

		it("sends model information when firing events", done => {
			const object = { on(_, c) {
				c();
			}, off() {} };

			array = new ObservableArray("event", e => {
				e.model.should.deep.equal({
					index: 0, item: object
				});
				done();
			});

			array.push(object);
		});
	});
});
