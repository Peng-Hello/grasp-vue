// 响应性系统设计
// 简单的实现

import type { Target, Key } from "../type/responsive.type";
// 收集副作用的桶
const bucket: WeakMap<Object, any> = new WeakMap();

// 需要注册的副作用函数
let activateEffect: any;

// 副作用函数注册机
export function effect(fn: Function) {
    activateEffect = fn; // 注册
    fn(); // 执行，触发读取
}

// track 函数追踪变化
function track(target: Target, key: Key) {
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
}

// trigger 副作用函数触发
function trigger(target: Target, key: Key) {
    const depMap = bucket.get(target);
    if (!depMap) return;
    const effects = depMap.get(key);
    effects && effects.forEach((fn: any) => fn());
}

// 代理实现响应性
export function ref(data: any) {
    return new Proxy(data, {
        get(target: Target, key: Key) {
            track(target, key);
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(target, key);
            return true;
        },
    });
}
