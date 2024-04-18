import {
  _decorator,
  Camera,
  Component,
  director,
  ERaycast2DType,
  EventTouch,
  geometry,
  Graphics,
  Material,
  Node,
  PhysicsSystem2D,
  resources,
  UITransform,
  v2,
  v3,
  Vec2,
  view,
} from "cc";
import { BallManager } from "./ball/BallManager";
import { Constants } from "./util/Constant";
import { Utils } from "./util/Utils";
const { ccclass, property } = _decorator;

@ccclass("Joystick")
export class Joystick extends Component {
  @property(Node)
  stick: Node = null;

  @property(Camera)
  camera: Camera = null;

  @property
  maxR: number = 0;

  @property(BallManager)
  ballManager: BallManager = null;

  public direction: Vec2 = new Vec2(0, 0);
  public ballPosList: Vec2[] = [];

  private _uiTransform: UITransform = null;
  private _g: Graphics = null;

  // 2dRay
  private _cur_len: number = 0;

  onLoad() {
    PhysicsSystem2D.instance.enable = true;
    this._uiTransform = this.node.getComponent(UITransform);
    this._g = this.getComponent(Graphics);
  }

  start() {
    this.stick.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.stick.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.stick.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.stick.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    // director.on(Constants.EVENT_TYPE.NEXT_SHOOT_BALL, this.listenCreateShootBall, this)
  }

  update(deltaTime: number) {

  }

  onDestroy() {
    this.stick.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.stick.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.stick.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.stick.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    // director.off(Constants.EVENT_TYPE.NEXT_SHOOT_BALL, this.listenCreateShootBall, this)
  }

  onTouchStart(event: EventTouch) {
    // 处理触摸开始事件
    this.direction.x = this.direction.y = 0;
    this._cur_len = 0;
    this.ballPosList = [];
    // this.showShootBall();
  }

  onTouchMove(event: EventTouch) {
    // if (Constants.gameManager.ballState !== Constants.BALL_SHOOT_STATE.READY) return

    this.clearLine();
    this._cur_len = 0;
    this.ballPosList = [];
    // 处理触摸移动事件
    const screenPos: Vec2 = event.getLocation();
    // 摄像机，把世界坐标转换到屏幕坐标
    const wPos = this.camera.screenToWorld(v3(screenPos.x, screenPos.y, 0));
    // 把世界坐标转换成节点坐标
    const nPos = this._uiTransform.convertToNodeSpaceAR(wPos);
    nPos.z = 0;

    let len = nPos.length();
    if (len > this.maxR) {
      nPos.x = (nPos.x / len) * this.maxR;
      nPos.y = (nPos.y / len) * this.maxR;
      len = this.maxR;
    }
    this.direction.x = nPos.x / len;
    this.direction.y = nPos.y / len;
    this.stick.setPosition(nPos);
    const pos = this.stick.worldPosition;
    // const signAngle = this.direction.signAngle(v2(0, 1));// [-3.14,3.14)
    const angle = Utils.getAngle(this.direction);
  
    // console.log('signAngle', signAngle, angle)
    const startPos = v2(pos.x, pos.y)
    const vec = this.direction.clone();
    
    // if (signAngle > Constants.RAY_ANGLE) {
    //   //  {x: 0.8484285425260061, y: 0.5293099358855802}
    //   vec.x = 0.848
    //   vec.y = 0.529
    // } else if (signAngle < -Constants.RAY_ANGLE) {
    //   // {x: -0.8488873267103428, y: 0.5285738420983086}
    //   vec.x = -0.848
    //   vec.y = 0.529
    // }

    // if (Math.abs(signAngle) > Math.PI * 8) return
    // console.log('vec', vec)
    // console.log('angle', angle)
    if (angle < 30 || angle > 150) return

    this.drawRayCast2D(startPos, vec)
  }

  onTouchEnd(event: EventTouch) {
    // 处理触摸结束事件
    Constants.gameManager.shootBallAction(this.ballPosList);
    this.direction.x = this.direction.y = 0;
    this.stick.setPosition(0, 0);
    this.clearLine();
    this._cur_len = 0;
  }

  listenCreateShootBall(data: any) {
    // this.showShootBall();
  }


  clearLine() {
    this._g.clear();
  }

  drawRayCast2D(initPos: Vec2, vec: Vec2) {
    // 剩余长度
    const leftLen = Constants.RAY_LENGTH - this._cur_len;
    if (leftLen <= 0) return;
    const startPos = initPos.clone();
    const newStartPos = startPos.clone();
    const vecDir = vec.clone();
    // 计算线的终点位置
    const endPos = newStartPos.add(vecDir.multiply(v2(leftLen, leftLen)));

    // 射线测试
    const results = PhysicsSystem2D.instance.raycast(
      startPos,
      endPos,
      ERaycast2DType.Closest
    );

    if (results.length > 0) {
      // 射线碰撞到了
      const result = results[0];
      // console.log("射线碰撞到了", results, result);
      const collider = result.collider;
      // 碰撞点
      const point = result.point;
      const hitPoint = point.clone();
      // 照射的节点
      const name = collider.node.name;
      console.log('collider.node.name', name)
      if (name === 'stick') {
        return;
      }
      // 画射线
      this.drawTraceByRayCast2D(startPos, point);
      if (name === 'ball' || name === 'shootBall') {
        return;
      }
      // 当前长度
      const len = hitPoint.subtract(startPos).length();
      // 更新当前长度
      this._cur_len += len;
      // 碰撞表面法向量
      const normal = result.normal;
      // const vecDir2 = vec.clone();
      const inVec = vecDir.clone();
      // 反向向量
      const backVec = inVec.subtract(normal.multiply(v2(2 * inVec.dot(normal), 2 * inVec.dot(normal))));
      // 计算下一段反弹
      this.drawRayCast2D(point, backVec);
    } else {
      console.log("射线没碰撞到");
      // 画射线
      this.drawTraceByRayCast2D(startPos, endPos)
    }
  }

  drawTraceByRayCast2D(startPos: Vec2, endPos: Vec2) {
    // const distance = Vec2.distance(startPos, endPos);
    // console.log('distance', distance)
    // if (distance < 1) return;
    if (!this.ballPosList.length) {  
      this.pushPosList(v2(this.node.position.x, this.node.position.y))
    } else {
      this.pushPosList(startPos)
    }
    this.pushPosList(endPos)
    // 把世界坐标转换成节点坐标
    const nPos = this._uiTransform.convertToNodeSpaceAR(v3(startPos.x, startPos.y, 0));
    this._g.moveTo(nPos.x, nPos.y)
    const destPos = endPos.clone();

    // 间隔
    const delta = 20;
    // 方向
    let vecDir = destPos.subtract(startPos);
    // 计算线段数量
    const segNum = Math.round(vecDir.length() / delta);
    const segCount = segNum > 100 ? 100 : segNum;// 大于100为非正常
    // 每次间隔向量
    vecDir.normalize().multiply(v2(delta, delta));
    // console.log('vecDir', vecDir, 'segNum', segNum)
    for(let i = 0; i < segCount; i++) {
      nPos.add(v3(vecDir.x, vecDir.y, 0));
      this._g.circle(nPos.x, nPos.y, 2)
    }

    this._g.stroke();
    this._g.close();
    this._g.fill();
  }

  pushPosList(pos: Vec2) {
    const len = this.ballPosList.length
    if (len) {
      const lastPos = this.ballPosList[len - 1];
      if (lastPos.x === pos.x && lastPos.y === pos.y) return;
    }
    // console.log('pos', pos, this.node.worldPosition.y)
    if (pos.y < this.node.worldPosition.y + 30) return;
    this.ballPosList.push(pos);
  }
}
