import { _decorator, Component, Node } from 'cc';
import { User } from '../data/User';
import { Utils } from '../util/Utils';
import { Constants } from '../util/Constant';
const { ccclass, property } = _decorator;

@ccclass('Fail')
export class Fail extends Component {
    @property(Node)
    prizeRoot: Node = null

    @property(Node)
    giveUpRoot: Node = null

    start() {

    }

    protected onEnable(): void {
        this.prizeRoot.on(Node.EventType.TOUCH_END, this.onReceive, this)
        this.giveUpRoot.on(Node.EventType.TOUCH_END, this.onGiveUp, this)
    }

    protected onDisable(): void {
        this.prizeRoot.off(Node.EventType.TOUCH_END, this.onReceive, this)
        this.giveUpRoot.off(Node.EventType.TOUCH_END, this.onGiveUp, this)
    }

    update(deltaTime: number) {
        
    }

    onGiveUp() {
        this.hideNode()
    }

    onReceive() {
        // 调用分享接口
        Utils.activeShare('failBox')
        // 炸弹道具
        const propsName = Constants.PROPS_NAME.BOMB
        const user = User.instance()
        const count = user.getGameProps(propsName)
        user.setGameProps(propsName, count + 1)
        this.hideNode()
    }

    showNode() {
        this.node.active = true
    }

    hideNode() {
        Constants.gameManager.init()
        this.node.active = false
    }
}

