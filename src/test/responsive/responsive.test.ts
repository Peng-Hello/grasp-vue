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

// 函数运行次数计数器
let counter = 0;

// 响应数据
const refData = ref(data);

// 副作用函数注册
effect(() => {
    // 应该运行两次 注册一次，设置属性一次
    console.log("effect run ...");
    counter++;
    global = refData.test;
});

describe("响应性系统", () => {
    it("响应性测试", () => {
        refData.test = "Good!";
        expect(global).toBe("Good!");
    });
    it("无关项测试", async () => {
        // 一个不存在的属性导致副作用函数重新执行了，这不是我们想要的。
        // 发生这个情况就是因为我们桶结构与问题，不能使得属性建立明确关系
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                refData.no = "no";
                resolve(refData);
            }, 1000);
        });
        expect(counter).toBe(2);
    });
    it("分支切换测试", () => {
        const rawData = {
            ok: true,
            text: "text",
        };
        const refData_0 = ref(rawData);

        let fun_count = 0;

        effect(() => {
            console.log("switch running");
            global = refData_0.ok ? refData_0.text : "no";
            fun_count++;
        });

        refData_0.ok = false;

        // 此时对应的 text 和 ok 字段都挂上了 effect 函数
        // 很明显此时,在 ok = false 时 text 怎么改变都不应该改变
        refData_0.text = "Change text";

        expect(fun_count).toBe(2);
    });
});
