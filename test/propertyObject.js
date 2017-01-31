import { should as chaiShould } from "chai";

import { PropertyObject } from "../src/propertyObject";

const should = chaiShould();

/** @test {PropertyObject} */
describe("PropertyObject", () => {
	const defaultProperties = [["test1", true], ["test2", 159]];
	let properties;

	beforeEach(() => {
		properties = new PropertyObject(defaultProperties);
	});

	/** @test {PropertyObject#constructor} */
	describe("#constructor", () => {
		it("creates width some default values", () => {
			properties._map.get("test1").should.equal(true);
			properties._map.get("test2").should.equal(159);
		});
		it("creates from another property object", () => {
			const newProperties = new PropertyObject(properties);
			newProperties.should.deep.equal(properties);
		});
		it("crashes when passed in an invalid properties object", () => {
			(() => {
				// eslint-disable-next-line no-new
				new PropertyObject(() => {});
			}).should.throw(TypeError);
		});
		it("rejects invalid value types", () => {
			(() => {
				// eslint-disable-next-line no-new
				new PropertyObject({ test: () => {} });
			}).should.throw(TypeError);
		});
	});

	/** @test {PropertyObject#get} */
	describe("#get", () => {
		it("gets basic values correctly", () => {
			properties.get("test1").should.equal(true);
			properties.get("test2").should.equal(159);
		});
		it("crashes when key is not a string", () => {
			(() => {
				properties.get(() => {});
			}).should.throw(TypeError);
		});
	});

	/** @test {PropertyObject#getAll} */
	describe("#getAll", () => {
		it("gets all values correctly", () => {
			const values = properties.getAll();
			for (let [key, value] of values) {
				let found = false;
				for (let [pkey, pvalue] of defaultProperties) {
					if (key === pkey) {
						value.should.equal(pvalue);
						found = true;
					}
				}
				found.should.be.true;
			}
		});
	});

	/** @test {PropertyObject#set} */
	describe("#set", () => {
		it("sets a key correctly", () => {
			properties.set("test3", "hello");
			properties.get("test3").should.equal("hello");
		});
		it("rejects keys of invalid types", () => {
			(() => {
				properties.set(() => {}, "invalid");
			}).should.throw(TypeError);
		});
		it("rejects values of invalid types", () => {
			// Should only accept valid JSON types.
			(() => {
				properties.set("test3", () => {});
			}).should.throw(TypeError);
			(() => {
				properties.set("test3", "hello");
				properties.set("test4", 123);
				properties.set("test5", true);
				properties.set("test6", { anObject: "with a value" });
			}).should.not.throw(TypeError);
		});
		it("ignores empty keys", () => {
			properties.set("", "hi");
			properties.getAll().length.should.equal(2);
		});
		it("fires a changed event correctly", done => {
			properties.on("property-change", change => {
				change.data.should.deep.equal([["test1", true], ["test1", "hello"]]);
				change.object.should.equal(properties);
				done();
			});
			properties.set("test1", "hello");
		});
	});

	/** @test {PropertyObject#remove} */
	describe("#remove", () => {
		it("removes a property correctly", () => {
			properties.remove("test1");
			should.not.exist(properties.get("test1"));
		});
		it("fires a changed event correctly", done => {
			properties.on("property-change", change => {
				change.data.should.deep.equal([["test1", true], [undefined, undefined]]);
				change.object.should.equal(properties);
				done();
			});
			properties.remove("test1");
		});
	});

	/** @test {PropertyObject#toJSON} */
	describe("#toJSON", () => {
		it("serializes correctly", () => {
			JSON.stringify(properties).should.equal("[[\"test1\",true],[\"test2\",159]]");
		});
	});
});
