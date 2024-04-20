import { _decorator, Component, Node } from 'cc';
import { Utils } from '../util/Utils';
import { Constants } from '../util/Constant';
import { User } from '../data/User';
const { ccclass, property } = _decorator;

@ccclass('Chest')
export class Chest extends Component {
    @property(Node)
    receiveRoot: Node = null

    @property(Node)
    giveUpRoot: Node = null

    start() {

    }

    protected onEnable(): void {
        this.receiveRoot.on(Node.EventType.TOUCH_END, this.onReceive, this)
        this.giveUpRoot.on(Node.EventType.TOUCH_END, this.onGiveUp, this)
    }

    protected onDisable(): void {
        this.receiveRoot.off(Node.EventType.TOUCH_END, this.onReceive, this)
        this.giveUpRoot.off(Node.EventType.TOUCH_END, this.onGiveUp, this)
    }

    update(deltaTime: number) {
        
    }

    onGiveUp() {
        this.hideNode()
    }

    onReceive() {
        // 调用分享接口
        // TODO: 这里需要处理是从宝箱分享出去的，返回的逻辑要处理
        Utils.activeShare('chestBox')
        // 先给个彩虹的道具
        const propsName = Constants.PROPS_NAME.LIGHTNING
        const user = User.instance()
        const count = user.getGameProps(propsName)
        user.setGameProps(propsName, count + 1)
        // TODO: 处理完再关闭宝箱
        this.hideNode()
    }

    showNode() {
        this.node.active = true
    }

    hideNode() {
        this.node.active = false
    }
}

