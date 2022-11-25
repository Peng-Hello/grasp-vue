import tokenize from "./../../compiler/tokenize";
import { describe, it, expect } from "vitest";
// 测试用例
const useCase = {
    // 一层的情况
    layer1: {
        input: "<div>Vue</div>",
        output: [
            { type: "tag", name: "div" },
            { type: "text", content: "Vue" },
            { type: "tagEnd", name: "div" },
        ],
    },
    // 二层的情况
    layer2: {
        input: "<div>Hi<p>Vue</p></div>",
        output: [
            { type: "tag", name: "div" },
            { type: "text", content: "Hi" },
            { type: "tag", name: "p" },
            { type: "text", content: "Vue" },
            { type: "tagEnd", name: "p" },
            { type: "tagEnd", name: "div" },
        ],
    },
    // 有不是字母的文本时
    layer3: {
        input: "<div>Hi!<p>Vue</p></div>",
        output: [
            { type: "tag", name: "div" },
            { type: "text", content: "Hi!" },
            { type: "tag", name: "p" },
            { type: "text", content: "Vue" },
            { type: "tagEnd", name: "p" },
            { type: "tagEnd", name: "div" },
        ],
    },
};

describe("编译模块", () => {
    const { layer1, layer2, layer3 } = useCase;
    it("tokenize 函数测试: 一层情况", () => {
        expect(tokenize(layer1.input)).toStrictEqual(layer1.output);
    });
    it("tokenize 函数测试: 二层情况", () => {
        expect(tokenize(layer2.input)).toStrictEqual(layer2.output);
    });
    it("tokenize 函数测试: 有不是字母的文本时", () => {
        expect(tokenize(layer3.input)).toStrictEqual(layer3.output);
    });
});
