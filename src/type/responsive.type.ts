export type Key = string | symbol;

// Target 的类型
export interface Target {
    [key: Key]: any;
}
