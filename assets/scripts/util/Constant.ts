import { _decorator, Vec3 } from "cc";
import { GameManager } from "../GameManager";
import { DialogManager } from "../dialog/DialogManager";
import { AudioManager } from "../audio/AudioManager";

// 球皮肤管理
const BALL_SKIN = {
  Style1: {
    /** 路径前缀 */
    pathDir: 'material/ball/style1/',
    /** 皮肤前缀 */
    skin: 'style1_ball'
  },
  Style2: {
    /** 路径前缀 */
    pathDir: 'material/ball/style2/',
    /** 皮肤前缀 */
    skin: 'style2_ball'
  },
}

// 坐标类型
enum POSITION_TYPE {
    /** 世界坐标 */
    worldPosition = 'worldPosition',

    /** 节点坐标 */
    position = 'position',
}

// 游戏状态
enum GAME_STATE {
  /** 准备中 */
  READY = 'ready',

  /** 游戏中 */
  PLAYING = 'playing',

  /** 游戏结束 */
  OVER = 'over',
}

// 游戏终止类型
enum GAME_OVER_TYPE {
  /** 游戏胜利 */
  WIN = 'win',

  /** 游戏失败 */
  LOSE = 'lose',
}

// 事件
enum EVENT_TYPE {
  /** 更新剩余的球 */
  UPDATE_BALL_COUNT = 'update-ball-count',

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

/** 道具名称 */
enum PROPS_NAME {
  /** 炸弹球 */
  BOMB = 'bomb',

  /** 彩虹球 */
  RAINBOW = 'rainbow',

  /** 闪电球 */
  LIGHTNING = 'lightning',
}

/** 道具类型 */
const PROPS_TYPE = {
  /** 炸弹球 */
  bomb: {
    name: PROPS_NAME.BOMB,
    desc: '炸弹泡泡可以消除方圆内的泡泡',
    value: 1,
  },

  /** 彩虹球 */
  rainbow: {
    name: PROPS_NAME.RAINBOW,
    desc: '彩虹泡泡会不受限制消除同一颜色的泡泡',
    value: 1,
  },

  /** 闪电球 */
  lightning: {
    name: PROPS_NAME.LIGHTNING,
    desc: '闪电泡泡会消除同一行的所有泡泡',
    value: 1,
  },
}

export class Constants {
  static gameManager: GameManager;
  static dialogManager: DialogManager;
  static audioManager: AudioManager;

  // screen
  static HEADER_HEIGHT = 70; // 头部高度
  static SCREEN_TOP_X = 375 / 2; // 屏幕左上角X位置
  static SCREEN_TOP_Y = 667 / 2 - this.HEADER_HEIGHT; // 屏幕左上角Y位置

  // game
  static GAME_STATE = GAME_STATE; // 游戏状态
  static GAME_OVER_TYPE = GAME_OVER_TYPE; // 游戏终止类型
  static DROP_BALL_SCORE = 10; // 掉落泡泡的分数
  static BOMB_BALL_SCORE = 15; // 炸弹泡泡的分数

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

  // 道具
  static PROPS_NAME = PROPS_NAME; // 道具名称
  static PROPS_TYPE = PROPS_TYPE; // 道具类型

}