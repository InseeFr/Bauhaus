import { deleteNodes } from './edit';

describe("deleteNodes", () => {
	const codes = [
		{ code: "A"}, { code: "C"}, { code: "D", parents: [{ code: 'C' }]}, { code: "E", parents: [{ code: 'A' }, { code: 'C' }] }
	]

	it("should return the same array if the code to delete does not exist", () => {
		expect(deleteNodes(codes, { code: "B"})).toEqual(codes);
	})
	it("should remove the standalone code if it exists", () => {
		const result = deleteNodes(codes, { code: "A"});
		expect(result.find(({ code }) => code === "A")).toBeUndefined();
	})
	it("should remove children if they have only one parent", () => {
		const result = deleteNodes(codes, { code: "C"});
		expect(result).toEqual([{ code: "A"}, { code: "E", parents: [{ code: "A" }] }]);
	})
})
