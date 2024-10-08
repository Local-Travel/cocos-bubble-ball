import { _decorator, Component, director, instantiate, Layers, Material, math, MeshRenderer, Node, Prefab, resources, Size, Sprite, SpriteFrame, UITransform, v3, Vec2, Vec3 } from 'cc';
import { Ball } from './Ball';
import { Constants } from '../util/Constant';
import { BallManager } from './BallManager';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component {
    @property(Prefab)
    shootBallPrefab: Prefab = null

    @property(BallManager)
    ballManager: BallManager = null

    curBall: Ball = null
    nextBall: Ball = null
    shootingBall: Ball = null

    private _ballSkin = null
    private _popPos = null

    // 当前可创建球的数量
    private _remainCreateCount: number = 0

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

    init(createBallCount: number, list: number[][], ballSkin: string = 'Style1') {
        this.destroyShootBall()
        this.curBall = null
        this.nextBall = null
        this.shootingBall = null
        this._ballSkin = Constants.BALL_SKIN[ballSkin] || {}

        this._remainCreateCount = createBallCount
        
        this.ballManager.init(list)
        if (this._popPos && !this.nextBall) {
            this.initShootBall()
        }
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

    // setBallMaterial(ball: Node, texture: string) {
    //     const ballTextPath = this._ballSkin.pathDir + texture
    //     const ballNode = ball ? ball.children[0] : null
    //     if (ballNode) {
    //         resources.load(ballTextPath, Material, (err, material) => {
    //             // console.log('load material', err, material)
    //             ballNode.getComponent(MeshRenderer).material = material;
    //         });
    //     }
    // }

    getTextureName(texture: string) {
        return this._ballSkin.namePrefix + texture
    }

    setBallSkin(ball: Node, texture: string, extendPath: string = '') {
        const ballTextPath = extendPath || (this._ballSkin.spriteDir + texture + '/spriteFrame')
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

    createBall(ballPrefab: Prefab, pos: Vec3, ballCode: string, visible: boolean = false) {
        const ball = instantiate(ballPrefab)
        const texture = this.getTextureName(ballCode)
        this.setBallSkin(ball, texture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        ball.active = true
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(texture, visible)
        
        return ballComp
    }

    createShootBallOne() {
        this._remainCreateCount--
        if (this._remainCreateCount < 0) return null
        const pos = this._popPos
        let skinCount = Constants.gameManager.levelData.skinCount
        skinCount = skinCount < 2 ? 2 : skinCount
        const code = math.randomRangeInt(1, skinCount + 1)
        const ball = this.createBall(this.shootBallPrefab, v3(pos.x, pos.y - Constants.STICK_RADIUS, 0), code.toString(), true)
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
                this.ballManager.eliminateBallBySkill(this.shootingBall, endPos, row, col) 
            } else {
                this.ballManager.eliminateSameBallNormal(this.shootingBall, endPos, row, col) 
            }
        })
    }

    grantSkillToShootBall(skillName: string) {
        console.log('grantSkillToShootBall', skillName)
        // 当前的准备射击的球要赋予技能
        switch(skillName) {
            case Constants.PROPS_NAME.BOMB:
            case Constants.PROPS_NAME.LIGHTNING:
            case Constants.PROPS_NAME.HAMMER:
                this.addSkillSkinToBall(skillName, this.curBall)
                this.curBall.setSkillType(skillName)
                break;
            default:
                break;
        }
    }

    /** 换上技能皮肤 */
    addSkillSkinToBall(skillName: string, ball: Ball) {
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

