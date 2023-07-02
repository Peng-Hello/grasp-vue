import { describe, it, expect } from "vitest";
import { obj, global } from "../../responsive/responsive";

describe("响应性系统", () => {
    it("简单的响应性测试", () => {
        obj.test = "Good!";
        expect(global, "Good!");
    });
});
