import { _decorator, Vec3 } from "cc";
import { GameManager } from "../GameManager";

// 球皮肤管理
const BALL_SKIN = {
  Style1: {
    /** 路径前缀 */
    pathDir: 'material/ball/',
    /** 皮肤前缀 */
    skin: 'style1_ball'
  },
}

// 坐标类型
enum POSITION_TYPE {
    /** 世界坐标 */
    worldPosition = 'worldPosition',

    /** 节点坐标 */
    position = 'position',
}

// 事件
enum EVENT_TYPE {
  /** 球发射 */
  BALL_SHOOT = 'ball-shoot',

  /** 下一个发球 */
  NEXT_SHOOT_BALL = 'next-shoot-ball',

  /** stick注册成功 */
  STICK_REGISTER_SUCCESS = 'stick-register-success',
}

// 球类型
enum BALL_TYPE {
  /** 球发射 */
  SHOOT_BALL = 'shoot-ball',

  /** 气泡球 */
  BUBBLE_BALL = 'bubble-ball',
}

/** 球射击状态 */
enum BALL_SHOOT_STATE {
  /** 准备中 */
  READY = 'ready',

  /** 发射中 */
  SHOOTING = 'shooting',

  /** 撞击了球 */
  HIT_BALL = 'hit-ball',
}
export class Constants {
  static gameManager: GameManager;
//   static tipManager: TipManager;
//   static audioManager: AudioManager;

  // screen
  static HEADER_HEIGHT = 70; // 头部高度
  static SCREEN_TOP_X = 375 / 2; // 屏幕左上角X位置
  static SCREEN_TOP_Y = 667 / 2 - this.HEADER_HEIGHT; // 屏幕左上角Y位置

  // stick
  static STICK_RADIUS = 40; // 球杆半径

  // ball
  static BALL_RADIUS = 16; // 球的半径
  static BALL_SKIN = BALL_SKIN // 球运动类型
  static POSITION_TYPE = POSITION_TYPE // 坐标类型
  static BALL_TYPE = BALL_TYPE // 球类型
  static BALL_REMOVE_COUNT = 3;// 可消除球的数量
  static BALL_SHOOT_STATE = BALL_SHOOT_STATE // 球射击状态

  // 射线
  static RAY_LENGTH = 600; // 射线长度
  static RAY_ANGLE = 1; // 射线角度(0-3.14)

  // 事件
  static EVENT_TYPE = EVENT_TYPE; // 事件监听类型

}