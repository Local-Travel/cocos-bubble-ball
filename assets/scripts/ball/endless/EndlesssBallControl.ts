import { _decorator, Component, director, instantiate, Layers, math, Node, Prefab, resources, Size, Sprite, SpriteFrame, UITransform, v3, Vec2, Vec3 } from 'cc';
import { EndlessBallManager } from './EndlessBallManager';
import { EndlessBall } from './EndlessBall';
import { Constants } from '../../util/Constant';
import { PoolManager } from '../../util/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('EndlesssBallControl')
export class EndlesssBallControl extends Component {
    @property(Prefab)
    shootBallPrefab: Prefab = null

    @property(EndlessBallManager)
    endlessBallManager: EndlessBallManager = null

    curBall: EndlessBall = null
    nextBall: EndlessBall = null
    shootingBall: EndlessBall = null

    private _ballSkin = null
    private _popPos = null

    onLoad() {
        director.on(Constants.EVENT_TYPE.STICK_REGISTER_SUCCESS, this.listenJoyStickPosition, this)
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.destroyShootBall()
        director.off(Constants.EVENT_TYPE.STICK_REGISTER_SUCCESS, this.listenJoyStickPosition, this)
    }

    init(ballSkin: string = 'Style2') {
        this.curBall = null
        this.nextBall = null
        this.shootingBall = null
        this._ballSkin = Constants.BALL_SKIN[ballSkin] || {}
        this.destroyShootBall()
        this.endlessBallManager.init(ballSkin)
    }

    listenJoyStickPosition(pos: Vec3) {
        console.log('listenJoyStickPosition', pos)
        this._popPos = pos
        this.initShootBall()
    }

    initShootBall() {
        this.nextBall = this.createShootBallOne()
        this.createShootBallNext()
    }

    destroyShootBall() {
        if (this.curBall && this.curBall.node) {
            this.curBall.node.destroy()
        }
        if (this.nextBall && this.nextBall.node) {
            this.nextBall.node.destroy()
        }
        if (this.shootingBall && this.shootingBall.node) {
            this.shootingBall.node.destroy()
        } 
    }

    setBallSkin(ball: Node, texture: string) {
        const ballTextPath = this._ballSkin.spriteDir + texture + '/spriteFrame'
        if (ball) {
            resources.load(ballTextPath, SpriteFrame, (err, spriteFrame) => {
                // console.log(err, spriteFrame)
                if (spriteFrame) {
                    const newNodeName = 'skin'
                    let spriteNode = ball.getChildByName(newNodeName)
                    if (spriteNode) {
                        spriteNode.getComponent(Sprite).spriteFrame = spriteFrame
                    }
                }
            })
        }
    }

    createBall(ballPrefab: Prefab, pos: Vec3, ballCode: string, isShootBall: boolean = false) {
        const ball = instantiate(ballPrefab)
        // const ball = PoolManager.instance().getNode(ballPrefab, this.node)
        const texture = this._ballSkin.namePrefix + ballCode
        this.setBallSkin(ball, texture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        ball.active = true
        const ballComp = ball.getComponent(EndlessBall)
        ballComp.setBallProp(texture, isShootBall)
        
        return ballComp
    }

    createShootBallOne() {
        const score = Constants.endlessGameManager.curScore
        let skinCount = this.endlessBallManager.getSkinCountByScore(score)
        skinCount = skinCount < 2 ? 2 : skinCount
        const pos = this._popPos
        const code = math.randomRangeInt(1, skinCount + 1)
        const ball = this.createBall(this.shootBallPrefab, v3(pos.x, pos.y - Constants.STICK_RADIUS2, 0), code.toString(), true)
        return ball
    }

    /** 置换球，并生成新的射球 */
    createShootBallNext() {
        this.curBall = this.nextBall
        if (this.curBall) {
            console.log('置换球', this.curBall.texture)
            this.curBall.playShootBallChange(() => {
                const ball = this.createShootBallOne()
                this.nextBall = ball
            })
        }
    }

    shootBallAction(posList: Vec2[], endPos: Vec2, row: number, col: number, callback: Function) {
        if (posList.length === 0 || !this.curBall) return
        this.curBall.playShootAction(posList, () => {
            this.shootingBall = this.curBall
            this.createShootBallNext()
            callback()
        }, () => {
            if (this.shootingBall.skillType) {
                this.endlessBallManager.eliminateBallBySkill(this.shootingBall, endPos, row, col) 
            } else {
                this.endlessBallManager.eliminateSameBallNormal(this.shootingBall, endPos, row, col) 
            }
        })
    }

    grantSkillToShootBall(skillName: string) {
        // 当前的准备射击的球要赋予技能
        switch(skillName) {
            case Constants.PROPS_NAME.BOMB:
            case Constants.PROPS_NAME.COLOR:
                this.addSkillSkinToBall(skillName, this.curBall)
                this.curBall.setSkillType(skillName)
                break;
            default:
                break;
        }
    }

    /** 换上技能皮肤 */
    addSkillSkinToBall(skillName: string, ball: EndlessBall) {
        const url = `texture/game-props/${skillName}/spriteFrame`
        resources.load(url, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            console.log(err, spriteFrame)
            if (spriteFrame && ball && ball.node) {
                // this.musicRoot.getChildByName('icon').getComponent(Sprite).spriteFrame = spriteFrame;
                const newNodeName = 'skin'
                let spriteNode = ball.node.getChildByName(newNodeName)
                if (spriteNode) {
                    spriteNode.getComponent(Sprite).spriteFrame = spriteFrame
                } else {
                    const skillNode = new Node(newNodeName)
                    skillNode.layer = Layers.Enum.UI_2D
                    const spriteComp = skillNode.addComponent(Sprite)
                    spriteComp.sizeMode = Sprite.SizeMode.CUSTOM
                    spriteComp.type = Sprite.Type.SIMPLE
                    spriteComp.spriteFrame = spriteFrame
                    const uiTransform = skillNode.addComponent(UITransform)
                    uiTransform.setContentSize(new Size(1, 1))
                    ball.node.addChild(skillNode)
                    // console.log('add skillNode', ball)
                }
            }
        });
    }
}

