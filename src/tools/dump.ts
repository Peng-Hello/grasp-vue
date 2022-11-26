import { ParseItem } from "../compiler/type/parse.type";
// 深度遍历模板 AST 并且输出节点信息
function dump(node: ParseItem, indent: number = 0) {
    const desc =
        node.type === "root"
            ? ""
            : node.type === "Element"
            ? node.tag
            : node.content;
    console.log(`${"-".repeat(indent)}${node.type}:${desc}`);
    // 如果有子节点继续遍历
    if (node.children) {
        node.children.forEach((item) => dump(item, indent + 2));
    }
}
export default dump;
