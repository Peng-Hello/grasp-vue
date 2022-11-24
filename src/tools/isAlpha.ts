// 判断是否字符为字母
// 用于有限自动状态机
export default function isAlpha(char: string) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
