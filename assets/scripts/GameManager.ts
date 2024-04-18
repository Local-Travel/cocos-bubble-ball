import { _decorator, Collider2D, Component, Contact2DType, Node, PhysicsSystem2D } from 'cc';
import { Constants } from './util/Constant';
import { BallManager } from './ball/BallManager';
import { Ball } from './ball/Ball';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(BallManager)
    ballManager: BallManager = null;

    private _shootBallState: string = Constants.BALL_SHOOT_STATE.READY;

    protected __preload(): void {
        Constants.gameManager = this;
    }

    start() {
        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.init();
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        // 取消注册全局碰撞回调函数 
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    init() {
        this.setShootBallState();
    }

    setShootBallState() {
        this._shootBallState = Constants.BALL_SHOOT_STATE.READY;
        console.log('setShootBallState')
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact', selfCollider, otherCollider);
        // 撞击球检测
        if (this._shootBallState === Constants.BALL_SHOOT_STATE.HIT_BALL || !otherCollider.node || !selfCollider.node) {
            return;
        }
        if (otherCollider.node.name === 'shootBall' && selfCollider.node.name === 'ball') {
            // 球与球碰撞
            this._shootBallState = Constants.BALL_SHOOT_STATE.HIT_BALL;
            const hitBall = selfCollider.node.getComponent(Ball);
            const shootBall = otherCollider.node.getComponent(Ball);
            this.ballManager.handleHitBall(hitBall, shootBall);
        }
    }
}

