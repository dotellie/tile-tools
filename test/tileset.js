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
				tileset = new TileSet({ name, type, path });
			tileset.name.should.equal(name);
			tileset.type.should.equal(type);
			tileset.path.should.equal(path);
		});
	});
});
