import { _decorator, Component, Contact2DType, math, Node, Prefab, v2, v3, Vec2, Vec3 } from 'cc';
import { PageEndlessGame } from '../../page/PageEndlessGame';
import { Constants } from '../../util/Constant';
import { EndlessBall } from './EndlessBall';
import { Utils } from '../../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('EndlessBallManager')
export class EndlessBallManager extends Component {
    @property(Prefab)
    endlesssBallPrefab: Prefab = null

    @property(PageEndlessGame)
    pageEndlessGame: PageEndlessGame = null

    // @property(EndlesssBallControl)
    // endlesssBallControl: EndlesssBallControl = null

    maxColumn: number = Math.floor(375 / (Constants.BALL_ENDLESS_RADIUS * 2))
    bubbleBallList: (EndlessBall | null)[][] = []

    private _ballSkin: any = {}
    private _moveY: number = 0

    start() { }

    update(deltaTime: number) {
        // this._moveY += Constants.BALL_MOVE_SPEED
        // if (this._moveY >= 2 * Constants.BALL_ENDLESS_RADIUS) {
        //     this._moveY = 0
        //     this.createBatchBall(2)
        // }
    }

    protected onDestroy(): void {
        this.clearBubbleBallList()
    }

    /**
     * 初始化
     * @param
     */
    init(ballSkin: string) {
        this._ballSkin = Constants.BALL_SKIN[ballSkin] || {}
        // 注意：要生成偶数行，Utils.convertToPos从0行开始算的
        this.clearBubbleBallList()
        this.createBatchBall(10)
    }

    createBatchBall(row: number) {
        const score = Constants.endlessGameManager.curScore
        const skinCount = this.getSkinCountByScore(score)
        const list = this.createBubbleBallList(row, skinCount)
        if (this.bubbleBallList.length) {
            for(let i = 0; i < this.bubbleBallList.length; i++) {
                const obj = this.bubbleBallList[i]
                for(let j = 0; j < obj.length; j++) {
                    const ball = obj[j]
                    if (ball) {
                        const pos = Utils.convertToPos(i + row, j, Constants.BALL_ENDLESS_RADIUS)
                        ball.setBallPosition(pos)
                    }
                }
            }
        }
        this.bubbleBallList.unshift(...list)
        console.log('this.bubbleBallList', this.bubbleBallList)
    }

    createBubbleBallList(row: number, skinCount: number) {
        const ballList = []
        for (let i = 0; i < row; i++) {
            let emptyCount = math.randomRangeInt(0, 4)
            ballList[i] = []
            for (let j = 0; j < this.maxColumn; j++) {
                const skinCode = math.randomRangeInt(1, skinCount + 1)
                if (emptyCount > 0) {
                    const empty = math.randomRangeInt(0, 2)
                    if (empty === 0) {
                        emptyCount--
                        ballList[i][j] = null
                        continue
                    }
                }

                const pos = Utils.convertToPos(i, j, Constants.BALL_ENDLESS_RADIUS)
                // const y = pos.y + 100
                const y = pos.y
                const ball = Constants.endlessGameManager.endlesssBallControl.createBall(this.endlesssBallPrefab, v3(pos.x, y, 0), skinCode.toString(), false)
                // console.log('ball', ball)
                ballList[i][j] = ball
            }
        }
        return ballList
    }

    findCollisionBall(shootBall: EndlessBall) {
        const targetBalls = []
        for (let i = 0; i < this.bubbleBallList.length; i++) {
            if (!this.bubbleBallList[i]) continue
            for (let j = 0; j < this.bubbleBallList[i].length; j++) {
                const ball = this.bubbleBallList[i][j]
                if (ball && ball.checkBallCollision(shootBall)) {
                    targetBalls.push({ ball, row: i, col: j })
                }
            }
        }
        // 查找颜色相同的
        return targetBalls
    }

    findSameColorAndCollision(shootBall: EndlessBall) {
        const list = this.findCollisionBall(shootBall)
        if (!list.length) return null
        const target = list.find(({ ball }) => shootBall.texture === ball.texture)
        if (target) return target
        return list[0]
    }

    getSkinCountByScore(score: number) {
        const skinCount = this._ballSkin.skinCount || 1
        if (score > 5000) {
            return skinCount
        }
        if (score > 2000) {
            return Math.min(4, skinCount)
        }
        if (score > 1000) {
            return Math.min(3, skinCount)
        }
        return Math.min(2, skinCount)
    }

    /** 消除泡泡球-携带技能 */
    eliminateBallBySkill(shootingBall: EndlessBall, endPos: Vec2, row: number, col: number) {
        if (!shootingBall || !endPos) {
            this.nextShootBall()
            return
        }
        let targetList = []

        switch (shootingBall.skillType) {
            case Constants.PROPS_NAME.BOMB:
                const bombRadius = Constants.BOMB_RADIUS
                targetList = this.getBombBallList(row, col, bombRadius)
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
                break;
            case Constants.PROPS_NAME.COLOR:
                targetList = this.getColorBallList(row, col)
                targetList.forEach(({ ball, row, col }) => {
                    if (ball && ball.node) {
                        Constants.endlessGameManager.endlesssBallControl.setBallSkin(ball.node, shootingBall.texture)
                        ball.setTexture(shootingBall.texture)
                    }
                })
                shootingBall.playBallExplosion()
                this.nextShootBall()
                break;
            default:
                break;
        }
    }

    /** 获取炸弹范围内的球 */
    getBombBallList(row: number, col: number, radius: number) {
        const ballList = []
        for (let i = row - radius; i <= row + radius; i++) {
            if (i < 0 || i >= this.bubbleBallList.length) continue
            for (let j = col - radius; j <= col + radius; j++) {
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
    getColorBallList(row: number, col: number) {
        const ballList = []
        const rowCount = 2
        let newRow = row
        if (!this.bubbleBallList[row]) {// 不存在，取上一行
            newRow = row - 1
        }
        const len = this.bubbleBallList[0] ? this.bubbleBallList[0].length : 0
        for (let i = 0; i < rowCount; i++) {
            if (!this.bubbleBallList[newRow - i]) break
            for (let j = 0; j < len; j++) {
                const ball = this.bubbleBallList[newRow - i][j]
                if (ball) {
                    ballList.push({ ball, row: newRow - i, col: j })
                }
            }
        }
        return ballList
    }

    /** 消除泡泡球-普通消除 */
    eliminateSameBallNormal(shootingBall: EndlessBall, endPos: Vec2, row: number, col: number) {
        console.log('eliminateSameBallNormal')
        if (!shootingBall || !endPos) {
            this.nextShootBall()
            return
        }
        // const target = this.findSameColorAndCollision(shootingBall)
        // if (!target) {// 顶部要特殊处理
        //     if (endPos.y >= Constants.SCREEN_TOP_Y - Constants.BALL_ENDLESS_RADIUS) {
        //         // 顶部
        //         const { row, col } = Utils.convertToRowCol(v2(endPos.x, endPos.y), Constants.BALL_ENDLESS_RADIUS)
        //         let c = -1
        //         if (!this.bubbleBallList[row][col]) {
        //             c = col
        //         } else if (!this.bubbleBallList[row][col - 1]) {
        //             c = col - 1
        //         } else if (!this.bubbleBallList[row][col + 1]) {
        //             c = col + 1
        //         }
        //         if (c > -1) {
        //             this.bubbleBallList[row][c] = shootingBall
        //             const pos = Utils.convertToPos(row, c, Constants.BALL_ENDLESS_RADIUS)
        //             shootingBall.setBallPosition(pos)
        //             this.nextShootBall()
        //             return
        //         }
        //     }
        //     shootingBall.playBallExplosion()
        //     this.nextShootBall()
        //     return
        // }
        // const { row, col } = Utils.convertToRowCol(v2(endPos.x, endPos.y), Constants.BALL_ENDLESS_RADIUS)
        // const { row, col, ball: targetBall } = target
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
            if (!this.bubbleBallList[row]) {
                this.bubbleBallList[row] = []
                for(let j = 0; j < this.bubbleBallList[0].length; j++) {
                    this.bubbleBallList[row][j] = null
                }
            }
            this.bubbleBallList[row][col] = shootingBall

            this.nextShootBall()
        }
    }

    nextShootBall(bombCount: number = 0, dropCount: number = 0) {
        // 清除末端的空数组
        const len = this.bubbleBallList.length
        for (let i = len - 1; i >= 0; i--) {
            const arr = this.bubbleBallList[i]
            const isEmpty = arr.every(ball => !ball)
            if (isEmpty) {
                this.bubbleBallList.splice(i, 1)
            } else {
                break
                // const ball = arr.find(b => b)
                // if (!ball.isInView()) {
                //     arr.forEach((ball, j) => {
                //         if (ball) {
                //             ball.playBallExplosion()
                //             this.bubbleBallList[i][j] = null
                //         }
                //     })
                //     this.bubbleBallList.splice(i, 1)
                // } else {
                //     break
                // }
            }
        }
        if (this.bubbleBallList.length <= 3) {
            this.createBatchBall(10)
            this.pageEndlessGame.resetLifeValue()
        }
        Constants.endlessGameManager.calcScore(bombCount, dropCount)
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
        for (let i = 0; i < this.bubbleBallList.length; i++) {
            if (!this.bubbleBallList[i]) {
                console.warn('this.bubbleBallList[i] is null', i, this.bubbleBallList[i])
                continue
            }
            for (let j = 0; j < this.bubbleBallList[i].length; j++) {
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
        for (let j = 0; j < colList.length; j++) {
            const ball = this.bubbleBallList[0][j]
            if (!ball) continue
            this.checkHangBall(0, j)
        }

        // 没有被标记的即为悬空的球
        for (let i = 0; i < this.bubbleBallList.length; i++) {
            if (!this.bubbleBallList[i]) {
                console.warn('this.bubbleBallList[i] is null', i, this.bubbleBallList[i])
                continue
            }
            for (let j = 0; j < this.bubbleBallList[i].length; j++) {
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

