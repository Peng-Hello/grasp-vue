import tokenize from "./tokenize"; // 引入 tokenize 函数
import { ParseItem } from "./type/parse.type"; // 导入 Parse item 的类型

// 解析函数
function parse(html_str: string): ParseItem {
    // 把 html 字符进行标志化
    const tokenList = tokenize(html_str);
    // 定义 root 元素
    const root: ParseItem = {
        type: "root",
        children: [],
    };
    // 元素栈 (用于维护 token List 里面的父子关系)
    const elementStack: ParseItem[] = [root];
    // 对标志化结果进行处理 当数组为 0是停止
    while (tokenList.length) {
        // elementStack 的栈顶元素为父亲
        const parent = elementStack[elementStack.length - 1];
        // 当前扫描的 token
        const currentToken = tokenList[0];
        // 根据不同的 token type 来进行不同操作
        switch (currentToken.type) {
            case "tag":
                // 现在的 token 类型为标签开始
                // 构建 element 节点
                const elementNode: ParseItem = {
                    type: "Element",
                    tag: currentToken.name,
                    children: [],
                };
                // 把新的 element 节点加入到父亲节点
                parent.children?.push(elementNode);
                // 现在的 token 进行压栈操作
                elementStack.push(elementNode);
                break;
            case "text":
                // 现在的 token 类型为文本
                // 构建 element 节点
                const textNode: ParseItem = {
                    type: "Text",
                    content: currentToken.content,
                };
                // 把新的文本节点加入到 父亲元素里面
                parent.children?.push(textNode);
                break;
            case "tagEnd":
                // 将栈顶元素进行弹出
                elementStack.pop();
                break;
        }
        // 消费 tokenList 的栈顶元素
        tokenList.shift();
    }
    return root;
}
export default parse;
