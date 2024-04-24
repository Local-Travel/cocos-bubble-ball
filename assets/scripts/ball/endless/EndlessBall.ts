import { _decorator, Component, misc, Node, tween, v2, v3, Vec2, Vec3 } from 'cc';
import { Constants } from '../../util/Constant';
import { PoolManager } from '../../util/PoolManager';
import { Utils } from '../../util/Utils';
const { ccclass, property } = _decorator;

@ccclass('EndlessBall')
export class EndlessBall extends Component {
    /** 材质颜色 */
    public texture: string = null;
    /** 是否标记 */
    public isMark: boolean = false;
    /** 是否为发射球 */
    public isShootBall: boolean = false;

    /** 携带技能 */
    public skillType: string = null;

    start () {

    }

    update(deltaTime: number) {
        // if (this.isShootBall || !this.node) return
        // let pos = this.node.position
        // this.node.setPosition(pos.x, pos.y - Constants.BALL_MOVE_SPEED, pos.z)

        // pos = this.node.position
        // if (pos.y < Constants.SCREEN_BOTTOM_Y) {
        //     // 减少生命值
        //     // Constants.endlessGameManager.reduceLifeValue(1)
        // }
    }

    isInView() {
        // const pos = this.node.position
        // if (pos.y < Constants.SCREEN_TOP_Y && pos.y > Constants.SCREEN_BOTTOM_Y) {
        //     return true
        // }
        // return false
    }

    /** 球碰撞检测距离 */
    getCollisionDistance(ball: EndlessBall) {
        const pos1 = this.node.position
        const pos2 = ball.node.position
        const distance = pos1.subtract(pos2).length()
        if (distance <= Constants.BALL_COLLISION_DISTANCE) {
            const radian = v2(pos1.x, pos1.y).signAngle(v2(pos2.x, pos2.y))
            const angle = misc.radiansToDegrees(radian)
            console.log('angle', angle)
        }
        return distance
    }

    /** 球碰撞检测 */
    checkBallCollision(ball: EndlessBall) {
        const distance = this.getCollisionDistance(ball)
        return distance <= Constants.BALL_COLLISION_DISTANCE
    }


    setBallProp(texture: string, isShootBall: boolean) {
        this.texture = texture
        this.isShootBall = isShootBall
    }

    setVisible(visible: boolean) {
        this.node.active = visible
    }

    setTexture(texture: string) {
        this.texture = texture
    }

    setIsShootBall(isShootBall: boolean) {
        this.isShootBall = isShootBall
    }

    setIsMark(mark: boolean) {
        this.isMark = mark
    }

    setSkillType(skillType: string) {
        this.skillType = skillType
    }

    setBallPosition(pos: Vec2) {
        this.node.setPosition(v3(pos.x, pos.y, 0));
    }

    getBallPosition() {
        return this.node.position;
    }

    /** 发射球移动轨迹 */
    playShootAction(posList: Vec2[], cb: Function, callback: Function) {
        if (posList.length === 0) return
        const taskList = []
        for(let i = 0; i < posList.length; i++) {
            const t = tween(this.node).to(0.2, {position: v3(posList[i].x, posList[i].y, 0)});
            if (i === 0) {
                t.call(() => {
                    cb()
                })
            }
            taskList.push(t);
        }
        tween(this.node).sequence(...taskList).call(() => {
            callback()
        }).start();
    }

    /** 球爆炸 */
    playBallExplosion() {
        // 球消失
        tween(this.node).to(0.5, {scale: v3(0, 0, 0)}, { easing: "smooth" }).call(()=>{
            // this.node.active = false
            // this.node.scale = v3(1, 1, 1)
            // PoolManager.instance().putNode(this.node)
            this.node.destroy()
        }).start();
    }

    /** 球下坠 */
    playBallFall() {
        if (!this.node) return
        tween(this.node).to(0.4, { 
            position: v3(this.node.position.x, -200, 0) }, { easing: "smooth" }
        ).to(0.3, {scale: v3(0, 0, 0)}, { easing: "smooth" }).call(() => {
            // this.node.active = false
            // this.node.scale = v3(1, 1, 1)
            // PoolManager.instance().putNode(this.node)
            this.node.destroy()
        }).start(); 
    }

    /** 弹球替换 */
    playShootBallChange(cb: Function) {
        const pos = this.node.position
        tween(this.node)
        .to(0.15, { 
            position: v3(pos.x - Constants.STICK_RADIUS2, pos.y + Constants.STICK_RADIUS2, 0) }, { easing: "smooth" }
        ).to(0.15, {
            position: v3(pos.x, pos.y + Constants.STICK_RADIUS2 * 2, 0) }, { easing: "smooth" }
        ).call(() => {
            cb()
        }).start();
    }
}

