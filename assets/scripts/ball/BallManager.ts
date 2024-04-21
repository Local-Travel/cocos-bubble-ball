import { _decorator, Component, director, instantiate, Material, math, MeshRenderer, Node, Prefab, resources, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { Constants } from '../util/Constant';
import { Ball } from './Ball';
import { Utils } from '../util/Utils';
import { PageGame } from '../page/PageGame';
import { BallControl } from './BallControl';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null

    @property(PageGame)
    pageGame: PageGame = null
    @property(BallControl)
    ballControl: BallControl = null

    bubbleBallList: (Ball|null)[][] = []

    start() {

    }

    onDestroy() {
        this.clearBubbleBallList()
    }


    /**
     * 初始化
     * @param col 生成列数量
     * @param list 生成泡泡的参考列表
     */
    init(col: number, list: number[]) {
        this.clearBubbleBallList()
        this.createBubbleBallList(col, list)
    }

    createBubbleBallList(col: number, list: number[]) {
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
                const ball = this.ballControl.createBall(this.ballPrefab, v3(pos.x, pos.y, 0), code.toString(), true)
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
        if (!this.checkBallNotNull(row, col)) return
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

    /** 消除泡泡球-携带技能 */
    eliminateBallBySkill(shootingBall: Ball, endPos: Vec3) {
        if (!shootingBall || !endPos) {
            this.nextShootBall()
            return
        }
        const { row, col } = Utils.convertToRowCol(v2(endPos.x, endPos.y))
        // console.log('endPos', row, col)
        let targetList = []

        switch(shootingBall.skillType) {
            case Constants.PROPS_NAME.BOMB:
                const bombRadius = Constants.BOMB_RADIUS
                targetList = this.getBombBallList(row, col, bombRadius)
                break;
            case Constants.PROPS_NAME.LIGHTNING:
                targetList = this.getLightningBallList(row, col)
                break;
            case Constants.PROPS_NAME.RAINBOW:
                targetList = this.getRainbowBallList(row, col)
                break;
            default:
                break;
        }
        console.log('targetList', targetList, shootingBall.skillType)
        targetList.forEach(({ ball, row, col }) => {
            if (ball) {
                // 球爆炸
                ball.playBallExplosion()
                this.bubbleBallList[row][col] = null
            }
        })
        shootingBall.playBallExplosion()
        // 处理悬空的球
        const hangCount = this.handleHangBubbleBallList()
        const bombCount = targetList.length

        this.nextShootBall(bombCount, hangCount)
    }

    /** 获取炸弹范围内的球 */
    getBombBallList(row: number, col: number, radius: number) {
        const ballList = []
        for(let i = row - radius; i <= row + radius; i++) {
            if (i < 0 || i >= this.bubbleBallList.length) continue
            for(let j = col - radius; j <= col + radius; j++) {
                if (j < 0 || j >= this.bubbleBallList[i].length) continue
                const ball = this.bubbleBallList[i][j]
                if (ball) {
                    ballList.push({ ball, row: i, col: j })
                }
            }
        }
        return ballList
    }

    /** 获取闪电范围内的球 */
    getLightningBallList(row: number, col: number) {
        const ballList = []
        let newRow = row
        if (!this.bubbleBallList[row]) {// 不存在，取上一行
            newRow = row - 1
        }
        const len = this.bubbleBallList[0] ? this.bubbleBallList[0].length : 0
        for(let j = 0; j < len; j++) {
            const ball = this.bubbleBallList[newRow][j]
            if (ball) {
                ballList.push({ ball, row: newRow, col: j })
            }
        }
        return ballList
    }
    
    /** 获取彩虹球范围内的球 */
    getRainbowBallList(row: number, col: number) {
        let ballList = []
        // 上下左右都检查一遍
        const leftTop = row % 2 === 1 ? col : col - 1
        let textureBall = null
        // 左上
        if (this.checkBallNotNull(row - 1, leftTop) && !textureBall) {
            textureBall = this.bubbleBallList[row - 1][leftTop]
        }
        // 右上
        if (this.checkBallNotNull(row - 1, leftTop + 1) && !textureBall) {
            textureBall = this.bubbleBallList[row - 1][leftTop + 1]
        }
        // 左
        if (this.checkBallNotNull(row, col - 1) && !textureBall) {
            textureBall = this.bubbleBallList[row][col - 1]
        }
        // 右
        if (this.checkBallNotNull(row, col + 1) && !textureBall) {
            textureBall = this.bubbleBallList[row][col + 1]
        }
        // 左下
        if (this.checkBallNotNull(row + 1, leftTop) && !textureBall) {
            textureBall = this.bubbleBallList[row + 1][leftTop]
        }
        // 右下
        if (this.checkBallNotNull(row + 1, leftTop + 1) && !textureBall) {
            textureBall = this.bubbleBallList[row + 1][leftTop + 1]
        }
        if (textureBall) {
            ballList = this.getSameBallList(row, col, textureBall.texture)
        }
        return ballList
    }

    /** 获取同材质球 */
    getSameBallList(row: number, col: number, texture: string) {
        const ballList = []
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
                    ballList.push({ ball, row: i, col: j })
                }
            }
        }
        return ballList
    }

    /** 消除泡泡球-普通消除 */
    eliminateSameBallNormal(shootingBall: Ball, endPos: Vec3) {
        console.log('eliminateSameBallNormal')
        if (!shootingBall || !endPos) {
            this.nextShootBall()
            return
        }
        const { row, col } = Utils.convertToRowCol(v2(endPos.x, endPos.y))
        // console.log('endPos', row, col)
        const texture = shootingBall.texture
        
        const sameBallList = this.getSameBallList(row, col, texture)
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
            // 处理悬空的球
            const hangCount = this.handleHangBubbleBallList()
            const bombCount = sameBallList.length

            this.nextShootBall(bombCount, hangCount)
        } else {
            this.becomeBubbleBall(shootingBall, row, col)
        }
    }

    /** 射击球成为气泡球 */
    becomeBubbleBall(ball: Ball, row: number, col: number) {
        // const pos = ball.getBallPosition()
        // console.log('shooting pos', pos)
        // const { row, col } = Utils.convertToRowCol(v2(pos.x, pos.y))
        const newPos = Utils.convertToPos(row, col)
        ball.setBallPosition(newPos)
        let isBubble = false
        const len = this.bubbleBallList.length
        if (!this.bubbleBallList[row] && row <= len) {
            this.bubbleBallList[row] = []
            for(let j = 0; j < this.bubbleBallList[0].length; j++) {
                this.bubbleBallList[row][j] = null
            }
        }
        if (this.bubbleBallList[row] && !this.bubbleBallList[row][col]) {
            let isLinked = false
            if (row !== 0) {
                // 处理悬空的球
                const leftTop = row % 2 === 1 ? col : col - 1
                // 左上
                if (this.checkBallNotNull(row - 1, leftTop)) {
                    isLinked = true
                }            
                // 右上
                if (this.checkBallNotNull(row - 1, leftTop + 1)) {
                    isLinked = true
                }
                // 左
                if (this.checkBallNotNull(row, col - 1)) {
                    isLinked = true
                }
                // 右
                if (this.checkBallNotNull(row, col + 1)) {
                    isLinked = true
                }
                // 左下
                if (this.checkBallNotNull(row + 1, leftTop)) {
                    isLinked = true
                }
                // 右下
                if (this.checkBallNotNull(row + 1, leftTop + 1)) {
                    isLinked = true
                }
            }
            if (isLinked || row === 0) {
                this.bubbleBallList[row][col] = ball
                isBubble = true
            }
        }
        if (!isBubble) {
            ball.playBallExplosion()
        }
        
        this.nextShootBall()
    }

    checkHangBall(row: number, col: number) {
        if (!this.checkBallNotNull(row, col)) return
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

    checkBallNotNull(row: number, col: number) {
        if (!this.bubbleBallList[row] || !this.bubbleBallList[row][col]) return false
        return true
    }

    /**
     * 检测空悬挂的球
     */
    handleHangBubbleBallList(): number {
        if (this.bubbleBallList.length === 0) return 0
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
                    hangBubbleList.push({ ball, row: i, col: j })
                } else {
                    ball.setIsMark(false)
                }
            }
        }
        // 使球下落
        hangBubbleList.forEach(({ ball, row, col }) => {
            if (ball) {
                ball.playBallFall()
                this.bubbleBallList[row][col] = null
            }
        })
        return hangBubbleList.length
    }

    nextShootBall(bombCount: number = 0, hangCount: number = 0) {
        this.pageGame.calcScore(bombCount, hangCount)
        // 清除末端的空数组
        const len = this.bubbleBallList.length
        for(let i = len - 1; i >= 0; i--) {
            const arr = this.bubbleBallList[i]
            const isEmpty = arr.every(ball => !ball)
            if (isEmpty) {
                this.bubbleBallList.pop()
            } else {
                break
            }
        }
        // 如果末端的长度数据
        Constants.gameManager.checkBubbleListLength(this.bubbleBallList.length)
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
}

