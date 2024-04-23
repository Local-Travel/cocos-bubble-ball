import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { Constants } from '../util/Constant';
import { Chest } from './Chest';
import { Setting } from './Setting';
import { Success } from './Success';
import { Fail } from './Fail';
import { TryOtherMode } from './TryOtherMode';
import { EndlessSuccess } from './EndlessSuccess';
import { EndlessFail } from './EndlessFail';
import { Utils } from '../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('DialogManager')
export class DialogManager extends Component {
    @property(Node)
    MsgTip: Node = null

    @property(Node)
    LevelTip: Node = null

    @property(Chest)
    chest: Chest = null

    @property(Setting)
    setting: Setting = null

    @property(Success)
    success: Success = null

    @property(Fail)
    fail: Fail = null

    @property(EndlessSuccess)
    endlessSuccess: EndlessSuccess = null

    @property(EndlessFail)
    endlessFail: EndlessFail = null

    @property(TryOtherMode)
    otherMode: TryOtherMode = null

    __preload () {
        Constants.dialogManager = this
    }

    start() {
        this.hideLevelTip()
    }

    update(deltaTime: number) {
        
    }

    showChest() {
        this.chest.showNode()
    }

    showSetting() {
        this.setting.showNode()
    }

    showSuccess() {
        if (Utils.getLocalStorage('scene') == 'GameManager') {
            this.success.showNode()
        } else {
            this.endlessSuccess.showNode()
        }
    }

    showFail() {
        if (Utils.getLocalStorage('scene') == 'GameManager') {
            this.fail.showNode()
        } else {
            this.endlessFail.showNode()
        }
    }

    showOtherMode() {
        this.otherMode.showNode()
    }

    showTipLabel(tip: string, cb: Function = () => {}) {
        const label = this.MsgTip.getComponent(Label)
        label.string = tip
        
        tween(this.MsgTip)
        .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }) 
        .call(() => {
            this.MsgTip.active = true
            this.hideTipLabel(cb)
        })
        .start()
    }
    
    hideTipLabel(cb: Function = () => {}) {
        tween(this.MsgTip)
        .delay(1)
        .to(0.5, { position: new Vec3(0, 30, 0), scale: new Vec3(0, 0, 0) }, { 
            easing: "fade",
        }) 
        .call(() => {
            this.MsgTip.active = false
            cb()
        })
        .start()
    }

    showLevelTip(level: number) {
        const label = this.LevelTip.getChildByName('Level').getComponent(Label)
        label.string = `关卡 ${level}`
        
        tween(this.LevelTip)
        .to(0.01, { position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) }) 
        .call(() => {
            this.LevelTip.active = true
            this.hideLevelTip()
        })
        .start()
    }

    hideLevelTip() {
        tween(this.LevelTip)
        .delay(1.2)
        .to(0.2, { position: new Vec3(500, 0, 0), scale: new Vec3(0.1, 0.1, 0.1) }, { 
            easing: "smooth",
        }) 
        .call(() => {
            this.LevelTip.active = false
        })
        .start()
    }
}

