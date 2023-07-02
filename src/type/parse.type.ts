// 定义 children 里面元素的类型
export type ParseItem = {
    type: string;
    tag?: string;
    content?: string;
    children?: ParseItem[];
};
