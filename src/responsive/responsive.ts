// 响应性系统设计
// 简单的实现

// 收集副作用的桶
const bucket: WeakMap<Object, any> = new WeakMap();

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
            if (!activateEffect) return target[key];

            let depMap = bucket.get(target);

            // 没有找到对应的 Map
            if (!depMap) {
                // 新建一个 Map
                bucket.set(target, (depMap = new Map()));
            }

            let depSet = depMap.get(key);
            // 没有对应的副作用函数的 Set
            if (!depSet) {
                // 新建一个副作用函数 Set
                depMap.set(key, (depSet = new Set()));
            }

            depSet.add(activateEffect);

            return target[key];
        },
        set(target, key, value) {
            target[key] = value;

            const depMap = bucket.get(target);
            if (!depMap) return true;

            const effects = depMap.get(key);

            effects && effects.forEach((fn: any) => fn());

            return true;
        },
    });
}
