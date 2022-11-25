// 定义有限状态自动机的状态
export enum State {
    initial = 1, // 初始状态
    tagStart = 2, // 标签开始状态
    tagName = 3, // 标签名称状态
    text = 4, // 文本状态
    tagEnd = 5, // 标签结束状态
    tagEndName = 6, // 标签名称结束状态
}

// 定义 tokenize 返回值的内容类型
export type TokenItem = {
    type: string;
    name?: string;
    content?: string;
};
