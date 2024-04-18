import { _decorator, Component, director, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, v2, v3, Vec2, Vec3 } from 'cc';
import { Constants } from '../util/Constant';
import { Ball } from './Ball';
import { Utils } from '../util/Utils';
import { getLevelData } from '../data/levelData';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null
    @property(Prefab)
    shootBallPrefab: Prefab = null

    shootBallList: Ball[] = []
    bubbleBallList: Ball|null[][] = []

    private _skinStyle: string = ''
    private _ballSkin = null

    onLoad() {
        this._skinStyle = 'Style1'
        this._ballSkin = Constants.BALL_SKIN[this._skinStyle]
    }

    start() {
        this.createShootBallList(2);
        this.createBubbleBallList()
        director.emit(Constants.EVENT_TYPE.CREATE_SHOOT_BALL, this.shootBallList)
    }

    onDestroy() {
        this.clearShootBallList()
        this.clearBubbleBallList()
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
 
    createBall(ballType: string, pos: Vec3, ballCode: string, visible: boolean = false) {
        let ball = null
        if (ballType === Constants.BALL_TYPE.SHOOT_BALL) {
            ball = instantiate(this.shootBallPrefab)
        } else {
            ball = instantiate(this.ballPrefab)
        }
        // const ball = PoolManager.instance().getNode(this.prefab, this.node)
        const texture = this._ballSkin.skin + ballCode
        this.setBallMaterial(ball, texture)
        ball.setParent(this.node)
        ball.setPosition(pos)
        const ballComp = ball.getComponent(Ball)
        ballComp.setBallProp(texture, visible)
    
        this.shootBallList.push(ballComp)
        
        return ballComp
    }

    createShootBallList(count: number, visible: boolean = false) {
        for(let i = 1; i <= count; i++) {
            const code = math.randomRangeInt(1, 4)
            this.createBall(Constants.BALL_TYPE.SHOOT_BALL, v3(0, 0, 0), code.toString(), visible)
        }
    }

    createBubbleBallList() {
        // const colmaxCol = Utils.getMaxCol();
        const level = 1;
        const { col, list } = getLevelData(level);
        const ballList = []
        const row = Math.round(list.length / col)
        for(let i = 0; i < row; i++) {
            ballList[i] = []
            for(let j = 0; j < col; j++) {
                const code = list[i * col + j]
                if (code === 0) {
                    continue
                }
                const pos = Utils.convertToPos(i, j)
                const ball = this.createBall(Constants.BALL_TYPE.BUBBLE_BALL, v3(pos.x, pos.y, 0), code.toString(), true)
                ballList[i][j] = ball
            }
        }
        this.bubbleBallList = ballList
    }

    // 清空球列表
    clearShootBallList() {
        this.shootBallList.forEach(ball => {
            if (ball && ball.node) {
                ball.node.destroy()
            }
        })
        this.shootBallList = []
    }

    clearBubbleBallList() {
        if (Array.isArray(this.bubbleBallList)) {
            this.bubbleBallList.forEach(row => {
                if (row) {
                    row.forEach((ball: any) => {
                        if (ball && ball.node) {
                            ball.node.destroy()
                        }
                    })
                }
            })
        }
        this.bubbleBallList = []
    }

    // 获取顶部球
    getShootBall() {
        return this.shootBallList[this.shootBallList.length - 1]
    }
}

