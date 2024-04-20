import { _decorator, Component, Label, Node, ProgressBar, Sprite } from 'cc';
import { Constants } from '../util/Constant';
import { getLevelData } from '../data/LevelData';
import { User } from '../data/User';
const { ccclass, property } = _decorator;

@ccclass('PageGame')
export class PageGame extends Component {
    // 顶部
    /** 关卡 */
    @property(Node)
    levelRoot: Node = null
    /** 设置 */
    @property(Node)
    settingRoot: Node = null

    /** 进度条 */
    @property(Node)
    progressRoot: Node = null
    /** 星星 */
    @property(Node)
    starRoot: Node = null
    /** 分数 */
    @property(Node)
    scoreRoot: Node = null

    // 中间
    @property(Node)
    remainBallRoot: Node = null

    // 底部
    @property(Node)
    btnBombRoot: Node = null
    @property(Node)
    btnRainbowRoot: Node = null
    @property(Node)
    btnLightningRoot: Node = null

    // 当前分数
    private _curScore: number = 0
    private _totalScore: number = 0
    
    protected onEnable(): void {
        this.settingRoot.on(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.on(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnRainbowRoot.on(Node.EventType.TOUCH_END, this.onClickRainBow, this)
        this.btnLightningRoot.on(Node.EventType.TOUCH_END, this.onClickLightning, this)
    }

    protected onDisable(): void {
        this.settingRoot.off(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.off(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnRainbowRoot.off(Node.EventType.TOUCH_END, this.onClickRainBow, this)
        this.btnLightningRoot.off(Node.EventType.TOUCH_END, this.onClickLightning, this)
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    /**
     * 初始化页面
     * @param levelName 关卡
     * @param bubbleCount 剩余射击泡泡数量
     * @param totalScore 总分
     */
    init(levelName: string, bubbleCount: number, totalScore: number) {
        this._curScore = 0
        this._totalScore = totalScore
        // 更新对应的数据
        this.updateLevel(levelName)
        this.updateShootBallCount(bubbleCount)
        this.calcScore(0, 0)
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
    onClickRainBow() {
        this.grantSkill(Constants.PROPS_NAME.RAINBOW)
    }

    /** 点击闪电技能 */
    onClickLightning() {
        this.grantSkill(Constants.PROPS_NAME.LIGHTNING)
    }

    grantSkill(skillName: string) {
        const count = User.instance().getGameProps(skillName)
        if (count <= 0) {
            // TODO: 弹框
            Constants.dialogManager.showTipLabel('道具不足，分享可免费获得该技能')
            return
        }
        Constants.gameManager.grantSkillToShootBall(skillName)
    }

    // 计算分数
    calcScore(bombCount: number, dropCount: number) {
        const score = bombCount * Constants.BOMB_BALL_SCORE + dropCount * Constants.DROP_BALL_SCORE
        this._curScore += score
        this.updateScore()
        this.updateProgressData(this._curScore, this._totalScore)
    }

    // 关卡数据
    updateLevel(levelName: string) {
        this.levelRoot.getComponent(Label).string = levelName
    }

    // 更新可射球的数量
    updateShootBallCount(count: number) {
        this.remainBallRoot.getComponent(Label).string = `${count}`
    }

    // 更新分数
    updateScore() {
        this.scoreRoot.getComponent(Label).string = `${this._curScore}`
    }

    /** 更新页面显示数据 */
    updateProgressData(value: number, total: number) {
        const r = total > 0 ? value / total : 0
        this.scoreRoot.getComponent(Label).string = `${value}`
        this.progressRoot.getComponent(ProgressBar).progress = r

        if (value === 0) {
            // 将星星全部置灰
            this.inActiveAllStar()
        } else {
            if (r > 0.2) {
                this.activeStar(0, true)
            }
            if (r > 0.5) {
                this.activeStar(1, true)
            }
            if (r >= 1) {
                this.activeStar(2, true)
                Constants.gameManager.gameOver(Constants.GAME_OVER_TYPE.WIN)
            }
        }
    }

    inActiveAllStar() {
        for (let i = 0; i < 3; i++) {
            this.activeStar(i, false)
        }
    }

    activeStar(index: number, isActive: boolean) {
        const keyName = 'star' + (index + 1)
        const startNode = this.starRoot.getChildByName(keyName)
        startNode.getChildByName('burst').active = isActive
        startNode.getChildByName('icon-star').getComponent(Sprite).grayscale = !isActive
    }
}

