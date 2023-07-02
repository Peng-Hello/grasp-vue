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
    it("可以自行册副作用函数", async () => {
        const refData = ref(data);

        effect(() => {
            console.log("effect run ...");

            global = refData.test;
        });

        refData.test = "Good!";

        // 一个不存在的属性导致副作用函数重新执行了，这不是我们想要的。
        // 发生这个情况就是因为我们桶结构与问题，不能使得属性建立明确关系
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                refData.no = "no";
                resolve(refData);
            }, 1000);
        });

        expect(global).toBe("Good!");
    });
});
