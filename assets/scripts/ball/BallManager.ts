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
    bubbleBallList: (Ball|null)[][] = []

    private _skinStyle: string = ''
    private _ballSkin = null

    onLoad() {
        this._skinStyle = 'Style1'
        this._ballSkin = Constants.BALL_SKIN[this._skinStyle]
    }

    start() {
        this.createShootBallList(6);
        this.createBubbleBallList()
        director.emit(Constants.EVENT_TYPE.NEXT_SHOOT_BALL)
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
        
        return ballComp
    }

    createShootBallList(count: number, visible: boolean = false) {
        for(let i = 1; i <= count; i++) {
            const code = math.randomRangeInt(1, 3)
            const ballComp = this.createBall(Constants.BALL_TYPE.SHOOT_BALL, v3(0, 0, 0), code.toString(), visible)
            this.shootBallList.push(ballComp)
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
                    ballList[i][j] = null
                    continue
                }
                const pos = Utils.convertToPos(i, j)
                const ball = this.createBall(Constants.BALL_TYPE.BUBBLE_BALL, v3(pos.x, pos.y, 0), code.toString(), true)
                ballList[i][j] = ball
            }
        }
        this.bubbleBallList = ballList
    }

    /**
     * 标记同材质球
     * @param row 
     * @param col 
     * @param texture 
     * @returns 
     */
    checkSameTextureBall(row: number, col: number, texture: string) {
        if (!this.bubbleBallList[row] || !this.bubbleBallList[row][col]) return
        const ball = this.bubbleBallList[row][col]
        // 是否同材质
        if (ball.texture !== texture) return
        // 是否标记过
        if (ball.isSameMark) return
        // 符合条件
        ball.setIsSameMark(true)

        // 标记同材质球
        // 上
        this.checkSameTextureBall(row - 1, col, texture)
        // 下
        this.checkSameTextureBall(row + 1, col, texture)
        // 左
        this.checkSameTextureBall(row, col - 1, texture)
        // 右
        this.checkSameTextureBall(row, col + 1, texture)

        if (row % 2 === 0) {// 偶数行
            // 右上
            this.checkSameTextureBall(row - 1, col + 1, texture)
            // 右下
            this.checkSameTextureBall(row + 1, col + 1, texture)
        } else {// 奇数行
            // 左上
            this.checkSameTextureBall(row - 1, col - 1, texture)
            // 左下
            this.checkSameTextureBall(row + 1, col - 1, texture)
        }
    }

    /**
     * 消除同材质球
     */
    handleHitBall(hitBall: Ball | null, shootBall: Ball) {
        if (!hitBall && !shootBall) return
        // 获取它的行列
        if (hitBall) {
            const pos = hitBall.getBallPosition()
            const { row, col } = Utils.convertToRowCol(v2(pos.x, pos.y))
            const texture = shootBall.texture
            // 标记同材质球
            this.checkSameTextureBall(row, col, texture)
            // 记录标记同材球
            let sameBallList = []
            for(let i = 0; i < this.bubbleBallList.length; i++) {
                for(let j = 0; j < this.bubbleBallList[i].length; j++) {
                    const ball = this.bubbleBallList[i][j]
                    if (!ball) continue
                    if (ball.isSameMark) {
                        ball.setIsSameMark(false)
                        sameBallList.push({ ball, row: i, col: j })
                    }
                }
            }
            console.log('sameBallList', sameBallList)
            // 消除同材质球
            if (sameBallList.length >= Constants.BALL_REMOVE_COUNT) {
                sameBallList.forEach(({ ball, row, col }) => {
                    if (ball) {
                        // 球爆炸
                        ball.playBallExplosion()
                        this.bubbleBallList[row][col] = null
                    }
                })
                shootBall.playBallExplosion()
                this.nextShootBall()
            } else {
                this.becomeBubbleBall(shootBall)
            }
        } else {
            this.becomeBubbleBall(shootBall)
        }
    }

    /** 射击球成为气泡球 */
    becomeBubbleBall(ball: Ball) {
        const pos = ball.getBallPosition()
        const { row, col } = Utils.convertToRowCol(v2(pos.x, pos.y))
        const newPos = Utils.convertToPos(row, col)
        ball.setBallPosition(newPos)
        if (!this.bubbleBallList[row]) {
            this.bubbleBallList[row] = []
            for(let j = 0; j < this.bubbleBallList[0].length; j++) {
                this.bubbleBallList[row][j] = null
            }
        }
        if (!this.bubbleBallList[row][col]) {
            this.bubbleBallList[row][col] = ball
        } else {
            console.log('气泡球位置已被占用', this.bubbleBallList[row][col])
            // ball.node.destroy()
            ball.playBallExplosion()
        }
        
        console.log('成为气泡球', newPos, row, col)
        this.nextShootBall()
    }

    nextShootBall() {
        if (this.shootBallList.length === 0) {
            console.log('没有射击球了')
            return
        }
        // 下一次射击
        director.emit(Constants.EVENT_TYPE.NEXT_SHOOT_BALL)
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

    /** 获取顶部球 */
    getShootBall() {
        return this.shootBallList[this.shootBallList.length - 1]
    }

    /** 弹出顶部球 */
    popShootBall() {
        const ball = this.getShootBall()
        this.scheduleOnce(() => {
            this.shootBallList.splice(-1, 1)
        }, 1);
        return ball
    }
}

