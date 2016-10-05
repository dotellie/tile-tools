import { should } from "chai";

import { Tile } from "../src";

should();

/** @test {Tile} */
describe("TileMap", () => {
	/** @test {Tile#constructor} */
	describe("#create", () => {
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
	});

	/** @test {Tile#setTile} */
	describe("#setTile", () => {
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
				properties: {
					"property": "is a string"
				}
			});
			JSON.stringify(tile).should.contain("\"property\":\"is a string\"");
		});
		it("stringifies without properties", () => {
			let tile = new Tile("456:3");
			JSON.stringify(tile).should.equal("\"456:3\"");
		});
	});
});
