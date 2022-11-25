import isAlpha from "../tools/isAlpha"; // 辅助函数 判断字符是否为字母
// 定义有限状态自动机的状态
enum State {
    initial = 1, // 初始状态
    tagStart = 2, // 标签开始状态
    tagName = 3, // 标签名称状态
    text = 4, // 文本状态
    tagEnd = 5, // 标签结束状态
    tagEndName = 6, // 标签名称结束状态
}

// 定义 tokenize 返回值的内容类型
type TokenItem = {
    type: string;
    name?: string;
    content?: string;
};

// 标志化函数
function tokenize(html_str: string) {
    // 当前状态
    let currentState: State = 1; // 默认处在初始化状态
    // 字符缓冲数组
    const buffer = [];
    // 生成的 token 数组
    const token: TokenItem[] = [];
    // 循环状态跳跃
    while (html_str) {
        // 取 html_str 的第一个字符
        const char = html_str[0];

        switch (currentState) {
            // 初始状态
            case State.initial:
                if (char === "<") {
                    // 切换为标签开始状态
                    currentState = State.tagStart;
                    // 消费字符
                    html_str = html_str.slice(1);
                } else if (isAlpha(char)) {
                    // 切换为文本状态
                    currentState = State.text;
                    // 把读到的字符放入字符缓冲数组
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
            // 标签开始状态
            case State.tagStart:
                if (isAlpha(char)) {
                    // 切换为标签名称状态
                    currentState = State.tagName;
                    // 把标签名称缓冲进去
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                } else if (char === "/") {
                    // 切换为标签结束状态
                    currentState = State.tagEnd;
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
            // 标签名称状态
            case State.tagName:
                if (isAlpha(char)) {
                    // 字母不切换状态，但是需要把字符加入缓冲
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                } else if (char === ">") {
                    // 切换到初始状态
                    currentState = State.initial;
                    // 创建一个 toekn 标签放入 token 数组中
                    token.push({
                        type: "tag",
                        name: buffer.join(""),
                    });
                    // 清空缓冲
                    buffer.length = 0;
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
            // 文本状态
            case State.text:
                if (char === "<") {
                    // 切换为标签开始状态
                    currentState = State.tagStart;
                    // 创建文本 token
                    token.push({
                        type: "text",
                        content: buffer.join(""),
                    });
                    // 清空 buffer 里面的字符
                    buffer.length = 0;
                    // 消费字符
                    html_str = html_str.slice(1);
                } else {
                    // 取消是否是字母的判断条件，防止遇到其他符号循环卡住在文本状态 （见以前的 git 记录）
                    // 把文本缓冲进 buffer 数组里面
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
            // 标签结束状态
            case State.tagEnd:
                if (isAlpha(char)) {
                    // 切换为标签名称结束状态
                    currentState = State.tagEndName;
                    // 将当前的字符放进 char buffer 数组里面（因为下个状态会失去这个状态）
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
            // 结束标签名称状态
            case State.tagEndName:
                if (isAlpha(char)) {
                    // 现在缓冲结束标签名称 (状态维持)
                    buffer.push(char);
                    // 消费字符
                    html_str = html_str.slice(1);
                } else if (char === ">") {
                    // 切换为初始状态
                    currentState = State.initial;
                    // 生成 token 加入 token List
                    token.push({
                        type: "tagEnd",
                        name: buffer.join(""),
                    });
                    // 清空 buffer 数组
                    buffer.length = 0;
                    // 消费字符
                    html_str = html_str.slice(1);
                }
                break;
        }
    }
    return token;
}

export default tokenize;
