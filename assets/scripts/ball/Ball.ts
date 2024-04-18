import { _decorator, Component, Node, RigidBody2D, tween, v3, Vec2, Vec3 } from 'cc';
import { Constants } from '../util/Constant';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    /** 材质颜色 */
    public texture: string = null;
    /** 是否出现在视野中 */
    public isInView: boolean = false;
    /** 是否标记为同材质 */
    public isSameMark: boolean = false;

    start () {
        // setTimeout(()=>{
        //     this.playfruitsTween();
        // }, this.delayTime)
    }

    // playfruitsTween () {
    //     var fruit = this.node;
    //     var startPos = fruit.position;
    //     var startAngle = fruit.eulerAngles;
    //     var fruitTween = tween(startPos);
    //     const mixY = 6;
    //     const maxY = 12;
    //     const mixX = 0;
    //     const maxX = 0;
    //     var progressX = function (start, end, current, t) {
    //         //@ts-ignore
    //         current = cc.bezier(start, mixX, maxX, end, t);
    //         return current;
    //     };
    //     var progressY = function (start, end, current, t) {
    //         //@ts-ignore
    //         current = cc.bezier(start, mixY, maxY, end, t);
    //         return current;
    //     };

    //     fruitTween.parallel(
    //         tween().to( this.playTime, {x: -fruit.position.x}, {progress: progressX, easing: "smooth", onUpdate: ()=>{
    //             fruit.setPosition(startPos);
    //         }}),
    //         tween().to( this.playTime, {y: 0}, { progress: progressY, easing: "smooth", onUpdate: ()=>{
    //             fruit.setPosition(startPos);
    //         }}),
    //     ).start();
    //     tween(startAngle).to( this.playTime, {z: 360}, {onUpdate: ()=>{
    //         fruit.eulerAngles = startAngle;
    //     }}).start();
    // }


    update(deltaTime: number) {
 
    }

    setBallProp(texture: string, visible: boolean = false) {
        this.texture = texture
        this.node.active = visible
        // this.setSleep(true)
    }

    setVisible(visible: boolean) {
        this.node.active = visible
    }

    setInView(inView: boolean) {
        this.isInView = inView
    }

    setIsSameMark(mark: boolean) {
        this.isSameMark = mark
    }

    setSleep(sleep: boolean) {
        if (sleep) {
            this.node.getComponent(RigidBody2D).sleep()
        } else {
            this.node.getComponent(RigidBody2D).wakeUp()
        }
    }

    setBallPosition(pos: Vec2) {
        this.node.setPosition(v3(pos.x, pos.y, 0));
    }

    getBallPosition() {
        return this.node.position;
    }

    /** 发射球移动轨迹 */
    playShootAction(posList: Vec2[], cb: Function) {
        if (posList.length === 0) return cb()
        const taskList = []
        for(let i = 0; i < posList.length; i++) {
            const t = tween(this.node).to(0.3, {worldPosition: v3(posList[i].x, posList[i].y, 0)});
            taskList.push(t);
        }
        tween(this.node).sequence(...taskList).call(() => {
            cb()
        }).start();
    }

    /** 球爆炸 */
    playBallExplosion() {
        // 球消失
        tween(this.node).to(0.5, {scale: v3(0, 0, 0)}, { easing: "smooth" }).call(()=>{
            this.node.destroy()
        }).start();
    }

    /** 球下坠 */
    playBallFall() {
        tween(this.node).to(0.5, { 
            worldPosition: v3(this.node.position.x, -200, 0) }, { easing: "smooth" }
        ).start(); 
    }
}

