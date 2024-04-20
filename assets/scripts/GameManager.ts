import { _decorator, Collider2D, Component, Contact2DType, Node, PhysicsSystem2D, Vec2 } from 'cc';
import { Constants } from './util/Constant';
import { BallManager } from './ball/BallManager';
import { Ball } from './ball/Ball';
import { PageGame } from './page/PageGame';
import { Utils } from './util/Utils';
import { User } from './data/User';
import { getLevelData } from './data/LevelData';
import { BallControl } from './ball/BallControl';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(BallControl)
    ballControl: BallControl = null;

    @property(PageGame)
    pageGame: PageGame = null;

    @property
    userLevelTest: number = 0;


    public ballState: string = null;
    public gameStatus: string = null;

    // 剩余球的数量
    private _remainBallCount: number = 0;
    // 最大的球列表长度
    private _bubbleListMaxLen: number = 0;

    protected __preload(): void {
        Constants.gameManager = this;
    }

    start() {
        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onEndContact, this);
        }
        this.init();
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        // 取消注册全局碰撞回调函数 
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.off(Contact2DType.BEGIN_CONTACT, this.onEndContact, this);
        }
    }

    init() {
        const user = User.instance();
        const userLevel = this.userLevelTest || user.getLevel();
        const ballSkin = user.getBallSkin();
        const { col, list, data } = getLevelData(userLevel);
        console.log('userLevel', userLevel)

        this.pageGame.init(data.name, data.bubbleCount, data.score);
        this.ballControl.init(data.bubbleCount, col, list, ballSkin);
        this.gameStatus = Constants.GAME_STATE.READY;
        this.ballState = Constants.BALL_SHOOT_STATE.READY;
        this._remainBallCount = data.bubbleCount;
        this._bubbleListMaxLen = data.maxLen;
    }

    shootBallAction(posList: Vec2[]) {
        if (this.gameStatus !== Constants.GAME_STATE.READY) return
        if (this.ballState === Constants.BALL_SHOOT_STATE.READY && posList.length) {
            this.ballState = Constants.BALL_SHOOT_STATE.SHOOTING;
            this.ballControl.shootBallAction(posList, () => {
                // 成功发射球
                this._remainBallCount--
                this.pageGame.updateShootBallCount(this._remainBallCount)
                if (this._remainBallCount <= 0) {
                    this.gameOver(Constants.GAME_OVER_TYPE.LOSE);
                }
            });
        }
    }

    // 赋予技能给球
    grantSkillToShootBall(skill: string) {
        if (this.gameStatus !== Constants.GAME_STATE.READY || this.ballState !== Constants.BALL_SHOOT_STATE.READY) return 
    }


    gameOver(type: string) {
        switch(type) {
            case Constants.GAME_OVER_TYPE.LOSE:
                console.log('game fail')
                Constants.dialogManager.showFail()
                break;
            default:
                console.log('game pass')
                Constants.dialogManager.showSuccess()
                // 游戏通关
                break;
        }
        this.gameStatus = Constants.GAME_STATE.OVER;
    }

    // 检查球列表是否超长
    checkBubbleListLength(len: number) {
        if (len >= this._bubbleListMaxLen) {
            this.gameOver(Constants.GAME_OVER_TYPE.LOSE);
        } else {
            // 游戏继续
            this.ballState = Constants.BALL_SHOOT_STATE.READY;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onEndContact', selfCollider, otherCollider);
        // 撞击球检测
        if (this.ballState !== Constants.BALL_SHOOT_STATE.READY || !otherCollider.node || !selfCollider.node) {
            return;
        }
        if (otherCollider.node.name === 'shootBall' && selfCollider.node.name === 'ball') {
            // 球与球碰撞
            this.ballState = Constants.BALL_SHOOT_STATE.HIT_BALL;
            const hitBall = selfCollider.node.getComponent(Ball);
            const shootBall = otherCollider.node.getComponent(Ball);
            // this.ballManager.handleHitBall(hitBall, shootBall);
        }
    }
}

