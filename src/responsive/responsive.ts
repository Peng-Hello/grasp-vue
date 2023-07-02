// 响应性系统设计
// 简单的实现

// 测试的对象
const data: {
    test: string;
} = {
    test: "Hello World",
};

// 全局变量
export let global = "This is global variable";

// 副作用函数
function effect() {
    global = data.test;
}

// 收集副作用的桶
const bucket: Set<any> = new Set();

// 代理实现响应性
export const obj = new Proxy(data, {
    get(
        target: {
            [key: string | symbol]: any;
        },
        key
    ) {
        // 把副作用函数注册
        bucket.add(effect); // 这种方式是写死的注册不是那么好。思考一下怎么才能让他不写死特定副作用函数？
        return target[key];
    },
    set(target, key, value) {
        target[key] = value;
        bucket.forEach((fn) => fn()); // 把副作用函数拿出来执行
        return true;
    },
});
