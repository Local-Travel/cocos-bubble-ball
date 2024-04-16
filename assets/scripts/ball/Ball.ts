import { _decorator, Component, Node, RigidBody2D, tween, v3, Vec2, Vec3 } from 'cc';
import { Joystick } from '../Joystick';
import { Constants } from '../util/Constant';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    // @property(Joystick)
    // joystick: Joystick = null;

    // private _vx: number = 0;
    // private _vy: number = 0;

    // delayTime: number = 100;

    // playTime: number = 5;

    public texture: string = null;

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
        // if (this.joystick.direction.x === 0 && this.joystick.direction.y === 0) return
        // // 计算小球的速度
        // const speed = 100;
        // this._vx = this.joystick.direction.x * speed;
        // this._vy = this.joystick.direction.y * speed;

        // // 更新小球的位置
        // const pos = this.node.getPosition();
        // pos.x += this._vx * deltaTime;
        // pos.y += this._vy * deltaTime;
        // this.node.setPosition(pos);
        // console.log('pos', pos);
    }

    setBallProp(texture: string, visible: boolean = false) {
        this.texture = texture
        this.node.active = visible
        // this.setSleep(true)
    }

    setVisible(visible: boolean) {
        this.node.active = visible
    }

    setSleep(sleep: boolean) {
        if (sleep) {
            this.node.children[0].getComponent(RigidBody2D).sleep()
        } else {
            this.node.children[0].getComponent(RigidBody2D).wakeUp()
        }
    }

    setBallPosition(pos: Vec2) {
        this.node.setPosition(v3(pos.x, pos.y, 0));
    }

    getBallPosition() {
        return this.node.position;
    }

    moveTrace(posList: Vec2[], type: string = Constants.POSITION_TYPE.worldPosition) {
        if (posList.length === 0) return
        const taskList = []
        for(let i = 0; i < posList.length; i++) {
            const t = tween(this.node).to(0.5, {[type]: v3(posList[i].x, posList[i].y, 0)});
            taskList.push(t);
        }
        tween(this.node).sequence(...taskList).start();
    }
}

