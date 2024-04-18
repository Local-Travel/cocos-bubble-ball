import { _decorator, Component, director, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
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

    bubbleBallList: (Ball|null)[][] = []

    curBall: Ball = null
    nextBall: Ball = null
    shootingBall: Ball = null

    private _skinStyle: string = ''
    private _ballSkin = null
    private _endPos = null

    onLoad() {
        this._skinStyle = 'Style1'
        this._ballSkin = Constants.BALL_SKIN[this._skinStyle]
    }

    start() {
        this.createBubbleBallList()
        this.initShootBall()
        director.emit(Constants.EVENT_TYPE.NEXT_SHOOT_BALL)
    }

    onDestroy() {
        this.curBall.node.destroy()
        this.nextBall.node.destroy()
        this.clearBubbleBallList()
    }

    initShootBall() {
        this.nextBall = this.createShootBallOne()
        this.createShootBallNext()
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

    createShootBallOne() {
        const code = math.randomRangeInt(1, 3)
        const ball = this.createBall(Constants.BALL_TYPE.SHOOT_BALL, v3(0, -280, 0), code.toString(), true)
        return ball
    }

    /** 置换球，并生成新的射球 */
    createShootBallNext() {
        this.curBall = this.nextBall
        console.log('置换球', this.curBall.texture)
        const pos = this.curBall.getBallPosition()
        this.curBall.setBallPosition(v2(pos.x, pos.y + Constants.BALL_RADIUS * 2 + 10))
        const ball = this.createShootBallOne()
        this.nextBall = ball
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
        if (ball.isMark) return
        // 符合条件
        ball.setIsMark(true)

        const leftTop = row % 2 === 1 ? col : col - 1
        // 左上
        this.checkSameTextureBall(row - 1, leftTop, texture)
        // 右上
        this.checkSameTextureBall(row - 1, leftTop + 1, texture)
        // 左
        this.checkSameTextureBall(row, col - 1, texture)
        // 右
        this.checkSameTextureBall(row, col + 1, texture)
        // 左下
        this.checkSameTextureBall(row + 1, leftTop, texture)
        // 右下
        this.checkSameTextureBall(row + 1, leftTop + 1, texture)

        // // 标记同材质球
        // // 上
        // this.checkSameTextureBall(row - 1, col, texture)
        // // 下
        // this.checkSameTextureBall(row + 1, col, texture)
        // // 左
        // this.checkSameTextureBall(row, col - 1, texture)
        // // 右
        // this.checkSameTextureBall(row, col + 1, texture)

        // if (row % 2 === 0) {// 偶数行
        //     // 右上
        //     this.checkSameTextureBall(row - 1, col + 1, texture)
        //     // 右下
        //     this.checkSameTextureBall(row + 1, col + 1, texture)
        // } else {// 奇数行
        //     // 左上
        //     this.checkSameTextureBall(row - 1, col - 1, texture)
        //     // 左下
        //     this.checkSameTextureBall(row + 1, col - 1, texture)
        // }
    }

    /**
     * 消除同材质球
     */
    handleHitBall(hitBall: Ball | null, shootingBall: Ball) {
        // const curBall = this.popShootBall()
        if (!hitBall && !shootingBall) return
        // 获取它的行列
        if (hitBall) {
            const pos = hitBall.getBallPosition()
            const { row, col } = Utils.convertToRowCol(v2(pos.x, pos.y))
            console.log('hitBall', row, col)
            const texture = shootingBall.texture
            // 标记同材质球
            this.checkSameTextureBall(row, col, texture)
            // 记录标记同材球
            let sameBallList = []
            for(let i = 0; i < this.bubbleBallList.length; i++) {
                for(let j = 0; j < this.bubbleBallList[i].length; j++) {
                    const ball = this.bubbleBallList[i][j]
                    if (!ball) continue
                    if (ball.isMark) {
                        ball.setIsMark(false)
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
                shootingBall.playBallExplosion()
                this.nextShootBall()
            } else {
                // this.becomeBubbleBall(shootingBall)
            }
        } else {
            // this.becomeBubbleBall(shootingBall)
        }
    }

    /** 消除同材质球 */
    declareSameBall() {
        if (!this.shootingBall || !this._endPos) {
            this.nextShootBall()
            return
        }
        const { row, col } = Utils.convertToRowCol(v2(this._endPos.x, this._endPos.y))
        console.log('endPos', row, col)
        const texture = this.shootingBall.texture

        // 标记同材质球
        if (this.bubbleBallList[row] && this.bubbleBallList[row][col]) {
            // 已存在
            this.checkSameTextureBall(row, col, texture)
        } else {
            // 不存在需要上下左右都检查一遍
            const leftTop = row % 2 === 1 ? col : col - 1
            // 左上
            this.checkSameTextureBall(row - 1, leftTop, texture)
            // 右上
            this.checkSameTextureBall(row - 1, leftTop + 1, texture)
            // 左
            this.checkSameTextureBall(row, col - 1, texture)
            // 右
            this.checkSameTextureBall(row, col + 1, texture)
            // 左下
            this.checkSameTextureBall(row + 1, leftTop, texture)
            // 右下
            this.checkSameTextureBall(row + 1, leftTop + 1, texture)
        }

        // 记录标记同材球
        let sameBallList = []
        for(let i = 0; i < this.bubbleBallList.length; i++) {
            if (!this.bubbleBallList[i]) {
                console.warn('this.bubbleBallList[i] is null', i, this.bubbleBallList[i])
                continue
            }
            for(let j = 0; j < this.bubbleBallList[i].length; j++) {
                const ball = this.bubbleBallList[i][j]
                if (!ball) continue
                if (ball.isMark) {
                    ball.setIsMark(false)
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
            this.shootingBall.playBallExplosion()
            // 处理悬空的球
            this.handleHangBubbleBallList()

            this.nextShootBall()
        } else {
            this.becomeBubbleBall(this.shootingBall, row, col)
        }
    }

    /** 射击球成为气泡球 */
    becomeBubbleBall(ball: Ball, row: number, col: number) {
        // const pos = ball.getBallPosition()
        // console.log('shooting pos', pos)
        // const { row, col } = Utils.convertToRowCol(v2(pos.x, pos.y))
        const newPos = Utils.convertToPos(row, col)
        ball.setBallPosition(newPos)
        const len = this.bubbleBallList.length
        if (!this.bubbleBallList[row] && row <= len) {
            this.bubbleBallList[row] = []
            for(let j = 0; j < this.bubbleBallList[0].length; j++) {
                this.bubbleBallList[row][j] = null
            }
        }
        if (this.bubbleBallList[row] && !this.bubbleBallList[row][col]) {
            console.log('成为气泡球', this._endPos, row, col)
            this.bubbleBallList[row][col] = ball
        } else {
            console.log('气泡球位置已被占用或非法', this.bubbleBallList, row, col)
            // ball.node.destroy()
            ball.playBallExplosion()
        }

        // 处理悬空的球
        this.handleHangBubbleBallList()

        this.nextShootBall()
    }

    checkHangBall(row: number, col: number) {
        if (!this.bubbleBallList[row] || !this.bubbleBallList[row][col]) return
        const ball = this.bubbleBallList[row][col]
        // 是否标记过
        if (ball.isMark) return
        // 符合条件
        ball.setIsMark(true)

        const leftTop = row % 2 === 1 ? col : col - 1
        // 左上
        this.checkHangBall(row - 1, leftTop)
        // 右上
        this.checkHangBall(row - 1, leftTop + 1)
        // 左
        this.checkHangBall(row, col - 1)
        // 右
        this.checkHangBall(row, col + 1)
        // 左下
        this.checkHangBall(row + 1, leftTop)
        // 右下
        this.checkHangBall(row + 1, leftTop + 1)
    }

    /**
     * 检测空悬挂的球
     */
    handleHangBubbleBallList() {
        if (this.bubbleBallList.length === 0) return
        const hangBubbleList = []
        const colList = this.bubbleBallList[0]
        // 标记与第一行有接触的球
        for(let j = 0; j < colList.length; j++) {
            const ball = this.bubbleBallList[0][j]
            if (!ball) continue
            this.checkHangBall(0, j)
        }
        
        // 没有被标记的即为悬空的球
        for(let i = 0; i < this.bubbleBallList.length; i++) {
            if (!this.bubbleBallList[i]) {
                console.warn('this.bubbleBallList[i] is null', i, this.bubbleBallList[i])
                continue
            }
            for(let j = 0; j < this.bubbleBallList[i].length; j++) {
                const ball = this.bubbleBallList[i][j]
                if (!ball) continue
                if (!ball.isMark) {
                    hangBubbleList.push(ball)
                } else {
                    ball.setIsMark(false)
                }
            }
        }
        // 使球下落
        hangBubbleList.forEach((ball) => {
            if (ball) {
                ball.playBallFall()
            }
        })
    }

    nextShootBall() {
        // if (this.shootBallList.length === 0) {
        //     console.log('没有射击球了')
        //     return
        // }
        // 下一次射击
        // director.emit(Constants.EVENT_TYPE.NEXT_SHOOT_BALL)
        this.shootingBall = null
        this._endPos = null
        Constants.gameManager.setShootBallState()
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

    shootBallAction(posList: Vec2[]) {
        if (posList.length === 0) return
        this.curBall.playShootAction(posList, () => {
            this.shootingBall = this.curBall
            this.createShootBallNext()
        }, () => {
            // 将世界坐标转换为节点坐标
            const wPos = posList[posList.length - 1]
            const uiTransform = this.node.getComponent(UITransform);
            const nPos = uiTransform.convertToNodeSpaceAR(v3(wPos.x, wPos.y, 0));
            this._endPos = nPos
            console.log('shootingBallEnd pos', wPos, nPos)
            this.declareSameBall()
        })
    }
}

