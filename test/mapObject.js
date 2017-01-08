import { should } from "chai";

import { MapObject } from "../src";
import { PropertyObject } from "../src/propertyObject";

should();

/** @test {MapObject} */
describe("MapObject", () => {
	const defaultProperties = {
		name: "a name",
		x: 12,
		y: 8,
		width: 1,
		height: 2
	};
	let mapObject;

	beforeEach(() => {
		mapObject = new MapObject(defaultProperties);
	});

	it("has default properties after being created", () => {
		mapObject = new MapObject();
		mapObject.name.should.be.a("string");
		mapObject.x.should.be.a("number");
		mapObject.y.should.be.a("number");
		mapObject.width.should.be.a("number");
		mapObject.height.should.be.a("number");
	});

	it("can take properties from an object", () => {
		mapObject.name.should.equal(defaultProperties.name);

		mapObject.x.should.equal(defaultProperties.x);
		mapObject.y.should.equal(defaultProperties.y);

		mapObject.width.should.equal(defaultProperties.width);
		mapObject.height.should.equal(defaultProperties.height);
	});

	it("accepts any kind of location", () => {
		mapObject = new MapObject({ x: -45, y: 45.4 });

		mapObject.x.should.equal(-45);
		mapObject.y.should.equal(45.4);
	});

	it("checks it's a valid rectangle", () => {
		(() => {
			// eslint-disable-next-line no-new
			new MapObject({ x: 0, y: 0, width: -1, height: 1});
		}).should.throw(RangeError);
		(() => {
			// eslint-disable-next-line no-new
			new MapObject({ x: 0, y: 0, width: 1, height: 0});
		}).should.throw(RangeError);
	});

	it("has a PropertyObject", () => {
		mapObject.properties.should.be.instanceof(PropertyObject);
	});

	it("can be cloned", () => {
		const cloned = mapObject.clone();
		cloned.should.not.equal(mapObject);
		cloned.should.deep.equal(mapObject);
	});
});
