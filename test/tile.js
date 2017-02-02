import { should } from "chai";

import { Tile } from "../src";

should();

/** @test {Tile} */
describe("Tile", () => {
	/** @test {Tile#constructor} */
	describe("#constructor", () => {
		it("creates from objects", () => {
			let tile = new Tile({
				tileId: 56,
				tilesetId: 1
			});
			tile.tileId.should.equal(56);
			tile.tilesetId.should.equal(1);
		});
		it("creates from strings", () => {
			let tile = new Tile("224:5");
			tile.tileId.should.equal(224);
			tile.tilesetId.should.equal(5);
		});
		it("has empty default values", () => {
			const tile = new Tile();
			tile.tilesetId.should.equal(-1);
			tile.tilesetId.should.equal(-1);
		});
	});

	/** @test {Tile#emitEvents} */
	describe("#emitEvents", () => {
		it("starts fowarding data events when set", done => {
			const tile = new Tile();
			tile.emitEvents = true;
			tile.on("data-change", () => {
				done();
			});
			tile.setData(0, 0);
		});
		it("starts fowarding property events when set", done => {
			const tile = new Tile();
			tile.emitEvents = true;
			tile.on("property-change", () => {
				done();
			});
			tile.properties.set("is", "something");
		});
		it("doesn't forward anything when not set", () => {
			const tile = new Tile();

			tile.emitEvents = true;
			tile.emitEvents = false;

			tile.on("data-change", () => {
				throw new Error();
			});
			tile.on("property-change", () => {
				throw new Error();
			});
			tile.setData(0, 0);
			tile.properties.set("is", "something");
		});
	});

	/** @test {Tile#setData} */
	describe("#setData", () => {
		let tile;
		beforeEach(() => {
			tile = new Tile("10:8");
		});

		it("can replace only tile ID", () => {
			tile.setData(15);
			tile.tileId.should.equal(15);
			tile.tilesetId.should.equal(8);
		});
		it("can replace both tile ID and tileset ID", () => {
			tile.setData(84, 2);
			tile.tileId.should.equal(84);
			tile.tilesetId.should.equal(2);
		});
		it("doesn't replace if ID is -1", () => {
			tile.setData(-1, -1);
			tile.tileId.should.equal(10);
			tile.tilesetId.should.equal(8);
		});
		it("does replace empty if told so", () => {
			tile.setData(-1, -1, true);
			tile.tileId.should.equal(-1);
			tile.tilesetId.should.equal(-1);
		});
	});

	/** @test {Tile#toJSON} */
	describe("#toJSON", () => {
		it("stringifies with properties", () => {
			let tile = new Tile({
				tileId: 14,
				tilesetId: 3,
				properties: [
					["property", "is a string"]
				]
			});
			JSON.stringify(tile).should.contain("[\"property\",\"is a string\"]");
		});
		it("stringifies without properties", () => {
			let tile = new Tile("456:3");
			JSON.stringify(tile).should.equal("\"456:3\"");
		});
	});

	/** @test {Tile#clone} */
	describe("#clone", () => {
		let tile;
		beforeEach(() => {
			tile = new Tile({
				tileId: 14,
				tilesetId: 3,
				properties: [
					["property", "is a string"]
				]
			});
		});

		it("clones all the properties of a tile", () => {
			tile.clone().should.deep.equal(tile);
		});
		it("doesn't become the same tile", () => {
			tile.clone().should.not.equal(tile);
		});
	});
});
