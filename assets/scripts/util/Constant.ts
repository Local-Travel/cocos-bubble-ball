import { _decorator, Vec3 } from "cc";

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
  /** 创建球 */
  CREATE_SHOOT_BALL = 'create-shoot-ball',
}

// 球类型
enum BALL_TYPE {
  /** 球发射 */
  SHOOT_BALL = 'shoot-ball',
  /** 气泡球 */
  BUBBLE_BALL = 'bubble-ball',
}
export class Constants {
//   static gameManager: GameManager;
//   static tipManager: TipManager;
//   static audioManager: AudioManager;

  // screen
  static SCREEN_TOP_LEFT_X = -375 / 2 + 2; // 屏幕左上角X位置
  static SCREEN_TOP_LEFT_Y = 667 / 2 - 2; // 屏幕左上角Y位置

  // ball
  static BALL_RADIUS = 15; // 球的半径
  static BALL_SKIN = BALL_SKIN // 球运动类型
  static POSITION_TYPE = POSITION_TYPE // 坐标类型
  static BALL_TYPE = BALL_TYPE // 球类型

  // 射线
  static RAY_LENGTH = 500; // 射线长度
  static RAY_ANGLE = 1; // 射线角度(0-3.14)

  // 事件
  static EVENT_TYPE = EVENT_TYPE; // 事件监听类型

}