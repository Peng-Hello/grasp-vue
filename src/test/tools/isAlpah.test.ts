import isAlpha from "../../tools/isAlpha";
import { describe, it, expect } from "vitest";
describe("测试工具函数,判断字符是否为字母", () => {
    it("判断A", () => {
        expect(isAlpha("A")).toBe(true);
    });
    it("判断>", () => {
        expect(isAlpha(">")).toBe(false);
    });
});
