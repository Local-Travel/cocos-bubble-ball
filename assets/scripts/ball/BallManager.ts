import { _decorator, Component, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, Vec3 } from 'cc';
import { Constants } from '../util/Constant';
import { Ball } from './Ball';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    prefab: Prefab = null

    ballList: Ball[] = []

    private _skinStyle: string = ''
    private _ballSkin = null

    onLoad() {
        this._skinStyle = 'Style1'
        this._ballSkin = Constants.BALL_SKIN[this._skinStyle]
    }

    start() {
        // this.createBallList(2);
    }

    onDestroy() {
        this.clearBallList()
    }

    setBallMaterial(ball: Node, texture: string) {
        const ballTextPath = this._ballSkin.pathDir + texture
        const ballNode = ball ? ball.children[0] : null
        if (ballNode) {
            resources.load(ballTextPath, Material, (err, material) => {
                console.log('load material', err, material)
                ballNode.getComponent(MeshRenderer).material = material;
            });
        }
    }
 
    createBall(pos: Vec3, ballCode: string, visible: boolean = false) {
        const ball = instantiate(this.prefab)
        // const ball = PoolManager.instance().getNode(this.prefab, this.node)
        const texture = this._ballSkin.skin + ballCode
        this.setBallMaterial(ball, texture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(texture, visible)
    
        this.ballList.push(ballComp)
        
        return ballComp
    }

    createBallList(count: number, visible: boolean = false) {
        for(let i = 1; i <= count; i++) {
            const code = math.randomRangeInt(1, 3)
            this.createBall(new Vec3(0, 0, 0), code.toString(), visible)
        }
    }

    // 清空球列表
    clearBallList() {
        this.ballList.forEach(ball => {
            ball.node.destroy()
        })
        this.ballList = []
    }

    // 获取顶部球，并清除
    popBall() {
        return this.ballList.pop()
    }

    // 获取顶部球
    getBall() {
        return this.ballList[this.ballList.length - 1]
    }
}

