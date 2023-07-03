// 响应性系统设计
// 简单的实现

import type { Target, Key } from "../type/responsive.type";
// 收集副作用的桶
const bucket: WeakMap<Object, any> = new WeakMap();

// 清除依赖关系函数
function cleanUp(effectFun: any) {
    for (let i = 0; i < effectFun.deps.length; i++) {
        const deps = effectFun.deps[i];
        deps.delete(effectFun);
    }
    effectFun.deps.length = 0;
}

// 需要注册的副作用函数
let activateEffect: any;

// 副作用函数注册机
export function effect(fn: Function) {
    const effectFn: any = () => {
        cleanUp(effectFn);
        activateEffect = effectFn;
        fn();
    };
    effectFn.deps = [];
    effectFn();
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
    // 把副作用函数与相关的依赖集合关联起来
    activateEffect.deps.push(depSet);
}

// trigger 副作用函数触发
function trigger(target: Target, key: Key) {
    const depMap = bucket.get(target);
    if (!depMap) return;
    const effects = depMap.get(key);
    const effectsToRun = new Set(effects);
    effectsToRun && effectsToRun.forEach((fn: any) => fn());
    // effects && effects.forEach((fn: any) => fn()); // 无限遍历
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
