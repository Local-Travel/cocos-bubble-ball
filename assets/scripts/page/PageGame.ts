import { _decorator, Component, Label, Node, ProgressBar, resources, Sprite, SpriteFrame, tween } from 'cc';
import { Constants } from '../util/Constant';
import { User } from '../data/User';
import { Utils } from '../util/Utils';
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


    /** 解救目标 */
    @property(Node)
    targetRoot: Node = null
    /** 解救目标 */
    @property(Node)
    targetLabel: Node = null
    @property(Node)
    targetIcon: Node = null

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
    @property(Node)
    btnRetryRoot: Node = null
    // label
    @property(Node)
    bombCountLabel: Node = null
    @property(Node)
    hammerCountLabel: Node = null
    @property(Node)
    lightningCountLabel: Node = null

    // 当前分数
    private _curScore: number = 0
    private _totalScore: number = 0
    private _curTargetCount: number = 0
    private _targetTotalCount: number = 0
    private _progress: number = 0

    private _timeoutId: number = 0
    
    protected onEnable(): void {
        this.settingRoot.on(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.on(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnRainbowRoot.on(Node.EventType.TOUCH_END, this.onClickHammer, this)
        this.btnLightningRoot.on(Node.EventType.TOUCH_END, this.onClickLightning, this)
        this.btnRetryRoot.on(Node.EventType.TOUCH_END, this.onRetry, this)
    }

    protected onDisable(): void {
        this.settingRoot.off(Node.EventType.TOUCH_END, this.onClickSetting, this)
        this.btnBombRoot.off(Node.EventType.TOUCH_END, this.onClickBomb, this)
        this.btnRainbowRoot.off(Node.EventType.TOUCH_END, this.onClickHammer, this)
        this.btnLightningRoot.off(Node.EventType.TOUCH_END, this.onClickLightning, this)
        this.btnRetryRoot.off(Node.EventType.TOUCH_END, this.onRetry, this)
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
    init(levelName: string, bubbleCount: number, totalScore: number, targetCount: number = 0, targetIcon: string = '') {
        this._curScore = 0
        this._totalScore = totalScore
        this._curTargetCount = 0
        this._targetTotalCount = targetCount
        // 更新对应的数据
        this.updateLevel(levelName)
        this.updateShootBallCount(bubbleCount)
        this.calcScore(0, 0)

        // 更新技能数量
        this.updateSkillCount(Constants.PROPS_NAME.BOMB)
        this.updateSkillCount(Constants.PROPS_NAME.HAMMER)
        this.updateSkillCount(Constants.PROPS_NAME.LIGHTNING)

        if (targetCount) {
            this.targetRoot.active = true
            this.updateTargetCount(0)
            this.setTragetIcon(targetIcon)
        } else {
            this.targetRoot.active = false
        }
    }

    onClickSetting() {
        // 显示设置界面
        Constants.dialogManager.showSetting()
    }


    /** 点击爆炸技能 */
    onClickBomb() {
        this.grantSkill(Constants.PROPS_NAME.BOMB)
    }

    /** 点击锤子技能 */
    onClickHammer() {
        this.grantSkill(Constants.PROPS_NAME.HAMMER)
    }

    /** 点击闪电技能 */
    onClickLightning() {
        this.grantSkill(Constants.PROPS_NAME.LIGHTNING)
    }

    /** 重试 */
    onRetry() {
        Constants.gameManager.init()
    }

    grantSkill(skillName: string) {
        const count = User.instance().getGameProps(skillName)
        if (count <= 0) {
            // TODO: 弹框
            // Constants.dialogManager.showTipLabel('道具不足，分享可免费获得该技能')
            Utils.activeShare('useSkill-' + skillName)

            this._timeoutId && clearTimeout(this._timeoutId)
            this._timeoutId = setTimeout(() => {
                User.instance().setGameProps(skillName, count + 1)
                this.updateSkillCount(skillName)
            }, 1000)
            return
        }
        User.instance().setGameProps(skillName, count - 1)
        this.updateSkillCount(skillName)
        Constants.gameManager.grantSkillToShootBall(skillName)
    }

    // 更新技能的数量
    updateSkillCount(skillName: string) {
        const count = User.instance().getGameProps(skillName)
        console.log('更新技能数量', skillName, count)
        switch (skillName) {
            case Constants.PROPS_NAME.BOMB:
                this.bombCountLabel.getComponent(Label).string = `${count}`
                break
            case Constants.PROPS_NAME.HAMMER:
                this.hammerCountLabel.getComponent(Label).string = `${count}`
                break
            case Constants.PROPS_NAME.LIGHTNING:
                this.lightningCountLabel.getComponent(Label).string = `${count}`
                break
            default:
                break
        }
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
                if (this._curTargetCount >= this._targetTotalCount) {
                    Constants.gameManager.gameOver(Constants.GAME_OVER_TYPE.WIN)
                }
            }
        }
        this._progress = r
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

    setTragetIcon(code: string) {
        const path = Constants.BALL_EXTEND_DIR + code + '/spriteFrame'
        resources.load(path, SpriteFrame, (err, spriteFrame) => {
            // console.log(err, spriteFrame)
            if (spriteFrame) {
                if (this.targetIcon) {
                    this.targetIcon.getComponent(Sprite).spriteFrame = spriteFrame
                }
            }
        })
    }

    updateTargetCount(count: number) {
        this._curTargetCount += count
        this.targetLabel.getComponent(Label).string = `${this._curTargetCount}/${this._targetTotalCount}`
        if (this._curTargetCount >= this._targetTotalCount && this._progress >= 1) {
            Constants.gameManager.gameOver(Constants.GAME_OVER_TYPE.WIN)
        }
    }
}

