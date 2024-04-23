import { _decorator, Component, director, Label, Node } from 'cc';
import { Utils } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('TryOtherMode')
export class TryOtherMode extends Component {
    @property(Node)
    receiveRoot: Node = null

    @property(Node)
    giveUpRoot: Node = null

    @property(Node)
    modeRoot: Node = null

    start() {

    }

    protected onEnable(): void {
        director.preloadScene("endless", function () {
            // log("Next scene preloaded");
        });
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
        if (Utils.getLocalStorage('scene') == 'GameManager') {
            director.loadScene("endless")
        } else {
            director.loadScene("main")
        }
        this.hideNode()
    }

    showNode() {
        this.node.active = true
    }

    hideNode() {
        this.node.active = false
    }
}

