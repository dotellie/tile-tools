import { should as chaiShould } from "chai";

import { TileSet } from "../src";

const should = chaiShould();

/** @test {TileSet} */
describe("TileSet", () => {
	/** @test {TileSet#constructor} */
	describe("#constructor", () => {
		it("creates with default values", () => {
			const tileset = new TileSet({});
			tileset.name.should.be.a("string");
			tileset.type.should.be.a("string");
			should.not.exist(tileset.path);
		});
		it("creates with definded values", () => {
			const name = "hello",
				type = "image",
				path = "./some/path.png",
				virtualPath = "./some/other/path.png",
				tileset = new TileSet({ name, type, path, virtualPath });
			tileset.name.should.equal(name);
			tileset.type.should.equal(type);
			tileset.path.should.equal(path);
			tileset.virtualPath.should.equal(virtualPath);
		});
		it("defaults virtual path to normal path", () => {
			const path = "./a/path.png",
				tileset = new TileSet({ path });
			tileset.virtualPath.should.equal(path);
		});
		it("fails if any tile properties key isn't a number", () => {
			(() => {
				// eslint-disable-next-line no-new
				new TileSet({ tileProperties: {
					"a string": "should be invalid"
				} });
			}).should.throw(TypeError);
		});
	});

	/** @test {TileSet#getTileProperties} */
	describe("#getTileProperty", () => {
		let tileset;

		beforeEach(() => {
			tileset = new TileSet({
				tileProperties: {
					"0": [["test", "isTest"]],
					"5": [["test5", "is5"]]
				}
			});
		});

		it("gets a property object correctly", () => {
			tileset.getTileProperties(0).get("test").should.equal("isTest");
			tileset.getTileProperties(5).get("test5").should.equal("is5");
		});

		it("throws an error if ID doesn't have a properties object", () => {
			(() => {
				tileset.getTileProperties(10);
			}).should.throw(RangeError);
		});

		it("fails if argument isn't a number", () => {
			(() => {
				tileset.getTileProperties("a string");
			}).should.throw(TypeError);
		});
	});

	/** @test {TileSet#createTileProperties} */
	describe("#createTileProperties", () => {
		it("creates a tile property for a tile ID", () => {
			const tileset = new TileSet({});
			tileset.createTileProperties(2);
			tileset.hasTileProperties(2).should.be.ok;
		});

		it("fails if argument isn't a number", () => {
			(() => {
				new TileSet({}).createTileProperties("a string");
			}).should.throw(TypeError);
		});
	});

	/** @test {TileSet#hasTileProperties} */
	describe("#hasTileProperties", () => {
		it("checks if there is a tile property object for an ID", () => {
			const tileset = new TileSet({
				tileProperties: {
					"4": [["key", "value"]]
				}
			});
			tileset.hasTileProperties(4).should.be.ok;
			tileset.hasTileProperties(0).should.not.be.ok;
		});

		it("fails if argument isn't a number", () => {
			(() => {
				new TileSet({}).hasTileProperties("a string");
			}).should.throw(TypeError);
		});
	});

	/** @test {TileSet#toJSON} */
	describe("#toJSON", () => {
		it("doesn't have a virtualPath property", () => {
			const jsonObject = new TileSet({}).toJSON();
			should.not.exist(jsonObject.virtualPath);
		});
	});
});
