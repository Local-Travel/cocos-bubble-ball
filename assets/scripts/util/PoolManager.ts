import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

interface IDictPool {
    [name: string]: NodePool
}

interface IDictPrefab {
    [name: string]: Prefab
}

@ccclass('PoolManager')
export class PoolManager {
    private _dictPool: IDictPool = {}
    private _dictPrefab: IDictPrefab = {}
    private static _instance: PoolManager = null

    public static instance() {
        if (!this._instance) {
            this._instance = new PoolManager()
        }
        return this._instance
    }

    public getNode(prefab: Prefab, parent: Node) {
        const { name } = prefab.data
        // console.log('getNode ', name)
        let node: Node = null
        this._dictPrefab[name] = prefab
        const pool = this._dictPool[name] 
        if (pool) {
            if (pool.size()) {
                node = pool.get()
            } else {
                node = instantiate(prefab)
            }
        } else {
            this._dictPool[name] = new NodePool()
            node = instantiate(prefab)
        }
        node.parent = parent
        node.active = true
        return node
    }

    public putNode(node: Node) {
        const { name } = node
        node.active = false
        // console.log('putNode ', name)
        if (!this._dictPool[name]) {
            this._dictPool[name] = new NodePool()
        }
        this._dictPool[name].put(node)
    }
}

