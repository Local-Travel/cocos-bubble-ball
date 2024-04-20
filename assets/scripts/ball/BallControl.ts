import { _decorator, Component, director, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, UITransform, v3, Vec2, Vec3 } from 'cc';
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
    private _joyStickPos = null

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

    init(createBallCount: number, col: number, list: number[], ballSkin: string = 'Style1') {
        this.curBall = null
        this.nextBall = null
        this.shootingBall = null
        this._ballSkin = Constants.BALL_SKIN[ballSkin] || {}

        this._remainCreateCount = createBallCount

        this.destroyShootBall()
        this.initShootBall()
        this.ballManager.init(col, list)
    }

    listenJoyStickPosition(pos: Vec3) {
        console.log('listenJoyStickPosition', pos)
        this._joyStickPos = pos
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

    setBallMaterial(ball: Node, texture: string) {
        const ballTextPath = this._ballSkin.pathDir + texture
        const ballNode = ball ? ball.children[0] : null
        if (ballNode) {
            resources.load(ballTextPath, Material, (err, material) => {
                // console.log('load material', err, material)
                ballNode.getComponent(MeshRenderer).material = material;
            });
        }
    }

    createBall(ballPrefab: Prefab, pos: Vec3, ballCode: string, visible: boolean = false) {
        const ball = instantiate(ballPrefab)
        const texture = this._ballSkin.skin + ballCode
        this.setBallMaterial(ball, texture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(texture, visible)
        
        return ballComp
    }

    createShootBallOne() {
        this._remainCreateCount--
        if (this._remainCreateCount < 0) return null
        const pos = this._joyStickPos || v3(0, -156, 0)
        const code = math.randomRangeInt(1, 3)
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

    shootBallAction(posList: Vec2[], callback: Function) {
        if (posList.length === 0 || !this.curBall) return
        this.curBall.playShootAction(posList, () => {
            this.shootingBall = this.curBall
            this.createShootBallNext()
            callback()
        }, () => {
            // 将世界坐标转换为节点坐标
            const wPos = posList[posList.length - 1]
            const uiTransform = this.node.getComponent(UITransform);
            const nPos = uiTransform.convertToNodeSpaceAR(v3(wPos.x, wPos.y, 0));
            console.log('shootingBallEnd pos', wPos, nPos)
            this.ballManager.declareSameBall(this.shootingBall, nPos)
        })
    }


}

