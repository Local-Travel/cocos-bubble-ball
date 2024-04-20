import { _decorator, Component, Node } from 'cc';
import { Utils } from '../util/Utils';
import { User } from '../data/User';
import { Constants } from '../util/Constant';
const { ccclass, property } = _decorator;

@ccclass('Success')
export class Success extends Component {
    // @property(Node)
    // public tipLabel: Node = null

    @property(Node)
    prizeRoot: Node = null

    @property(Node)
    giveUpRoot: Node = null

    start() {

    }

    protected onEnable(): void {
        // 显示本局最少使用射击球的数量
        // this.tipLabel.getComponent(Label).string = `太棒了，本局共用了 ${step} 步`
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
        const user = User.instance()
        user.setLevel(user.getLevel() + 1)
        this.hideNode()
    }

    onReceive() {
        // 调用分享接口
        Utils.activeShare('successBox')
        // 炸弹道具
        const propsName = Constants.PROPS_NAME.BOMB
        const user = User.instance()
        const count = user.getGameProps(propsName)
        user.setGameProps(propsName, count + 1)
        user.setLevel(user.getLevel() + 1)
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

