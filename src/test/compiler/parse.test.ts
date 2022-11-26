import parse from "../../compiler/parse";
import { describe, it, expect } from "vitest";
// 测试用例
const useCase = {
    case1: {
        input: "<div>Hi!<p>Vue</p></div>",
        output: {
            type: "root",
            children: [
                {
                    type: "Element",
                    tag: "div",
                    children: [
                        { type: "Text", content: "Hi!" },
                        {
                            type: "Element",
                            tag: "p",
                            children: [{ type: "Text", content: "Vue" }],
                        },
                    ],
                },
            ],
        },
    },
};
describe("编译模块", () => {
    const { case1 } = useCase;
    it("parse 函数测试: case 1", () => {
        expect(parse(useCase.case1.input)).toStrictEqual(useCase.case1.output);
    });
});
