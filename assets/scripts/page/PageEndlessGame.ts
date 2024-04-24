import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { Constants } from '../util/Constant';
import { User } from '../data/User';
const { ccclass, property } = _decorator;

@ccclass('PageEndlessGame')
export class PageEndlessGame extends Component {
    // 顶部
    /** 设置 */
    @property(Node)
    settingRoot: Node = null

    /** 生命进度条 */
    @property(Node)
    progressRoot: Node = null
    /** 分数 */
    @property(Node)
    scoreRoot: Node = null

    // 底部
    @property(Node)
    btnBombRoot: Node = null
    @property(Node)
    btnColorRoot: Node = null

    // 当前生命值
    private _curLifeVal: number = 10
    private _totalLifeVal: number = 10
    private _val: number = 0
    
    protected onEnable(): void {
        this.settingRoot.on(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.on(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnColorRoot.on(Node.EventType.TOUCH_END, this.onClickColor, this)
    }

    protected onDisable(): void {
        this.settingRoot.off(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.off(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnColorRoot.off(Node.EventType.TOUCH_END, this.onClickColor, this)
    }

    start() {
        
    }

    update(deltaTime: number) {
        // console.log('update', deltaTime)
        this._val += deltaTime * 0.05

        if (this._val > 0.05) {
            this._curLifeVal -= this._val
            this._val = 0
            this.updateProgress(this._curLifeVal, this._totalLifeVal)
        }
        if (this._curLifeVal <= 0) {
            Constants.endlessGameManager.gameOver(Constants.GAME_OVER_TYPE.LOSE)
            return
        }
    }

    /**
     * 初始化页面
     * @param levelName 关卡
     * @param bubbleCount 剩余射击泡泡数量
     * @param totalScore 总分
     */
    init() {
        this._val = 0
        this._curLifeVal = 10
        this._totalLifeVal = 10
        this.updateScore(0)
        this.updateProgress(this._curLifeVal, this._totalLifeVal)
    }

    onClickSetting() {
        // 显示设置界面
        Constants.dialogManager.showSetting()
    }


    /** 点击爆炸技能 */
    onClickBomb() {
        this.grantSkill(Constants.PROPS_NAME.BOMB)
    }

    /** 点击彩虹技能 */
    onClickColor() {
        this.grantSkill(Constants.PROPS_NAME.COLOR)
    }

    grantSkill(skillName: string) {
        const count = User.instance().getGameProps(skillName)
        if (count <= 0) {
            // TODO: 弹框
            Constants.dialogManager.showTipLabel('道具不足，分享可免费获得该技能')
            return
        }
        Constants.endlessGameManager.grantSkillToShootBall(skillName)
    }

    resetLifeValue() {
        this._curLifeVal = 10
        this._totalLifeVal = 10
        this.updateProgress(this._curLifeVal, this._totalLifeVal)
    }

    reduceLifeValue(lifeVal: number) {
        this._curLifeVal -= lifeVal
        if (this._curLifeVal <= 0) {
            Constants.endlessGameManager.gameOver(Constants.GAME_OVER_TYPE.LOSE)
        }
        this.updateProgress(this._curLifeVal, this._totalLifeVal)
    }

    // 更新分数
    updateScore(score: number) {
        User.instance().setHistScore(score)
        this.scoreRoot.getComponent(Label).string = `${score}`
    }

    /** 更新页面显示数据 */
    updateProgress(value: number, total: number) {
        const r = total > 0 ? value / total : 0
        this.progressRoot.getComponent(ProgressBar).progress = r
    }
}

