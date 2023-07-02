import { describe, it, expect } from "vitest";
import { effect, ref } from "../../responsive/responsive";

// 测试的对象
const data: {
    test: string;
} = {
    test: "Hello World",
};

// 全局变量
let global = "This is global variable";

describe("响应性系统", () => {
    it("可以自行册副作用函数", () => {
        const refData = ref(data);

        effect(() => {
            global = refData.test;
        });

        refData.test = "Good!";

        expect(global).toBe("Good!");
    });
});
