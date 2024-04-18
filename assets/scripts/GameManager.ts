import { _decorator, Collider2D, Component, Contact2DType, Node, PhysicsSystem2D, Vec2 } from 'cc';
import { Constants } from './util/Constant';
import { BallManager } from './ball/BallManager';
import { Ball } from './ball/Ball';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(BallManager)
    ballManager: BallManager = null;

    public ballState: string = null;

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
        this.setShootBallState();
    }

    setShootBallState(state: string = Constants.BALL_SHOOT_STATE.READY) {
        this.ballState = state;
    }

    shootBallAction(posList: Vec2[]) {
        if (this.ballState === Constants.BALL_SHOOT_STATE.READY && posList.length) {
            this.ballState = Constants.BALL_SHOOT_STATE.SHOOTING;
            this.ballManager.shootBallAction(posList);
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
            this.ballManager.handleHitBall(hitBall, shootBall);
        }
    }
}

