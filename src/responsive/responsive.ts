// 响应性系统设计
// 简单的实现

// 收集副作用的桶
const bucket: Set<any> = new Set();

// 需要注册的副作用函数
let activateEffect: any;

// 副作用函数注册机
export function effect(fn: Function) {
    activateEffect = fn; // 注册
    fn(); // 执行，触发读取
}

// 代理实现响应性
export function ref(data: any) {
    return new Proxy(data, {
        get(
            target: {
                [key: string | symbol]: any;
            },
            key
        ) {
            // 把副作用函数注册
            // 这种方式是写死的注册不是那么好。思考一下怎么才能让他不写死特定副作用函数？
            // 答案是：用变量的形式代替写死的 effect ! 然后抽一个函数进行注册
            if (activateEffect) {
                bucket.add(activateEffect);
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            bucket.forEach((fn) => fn()); // 把副作用函数拿出来执行
            return true;
        },
    });
}
