import { _decorator, sys, Vec3 } from "cc";
import { GameManager } from "../GameManager";
import { DialogManager } from "../dialog/DialogManager";
import { AudioManager } from "../audio/AudioManager";
import { EndlessGameManager } from "../EndlessGameManager";

// 球皮肤管理
const BALL_SKIN = {
  Style1: {
    /** 皮肤数量 */
    skinCount: 15,
    /** 路径前缀2 */
    spriteDir: 'texture/ball/style1/',
    /** 皮肤名前缀 */
    namePrefix: 'style1_ball_skin'
  },
  Style2: {
    /** 皮肤数量 */
    skinCount: 6,
    /** 路径前缀2 */
    spriteDir: 'texture/ball/style2/',
    /** 皮肤名前缀 */
    namePrefix: 'skin'
  },
}

// 球内扩展地址
const BALL_EXTEND_DIR = 'texture/ball-extend/';

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

/** 
 * 道具名称
 * 注意：需要与resources/texture/game-props/下的文件名对应
 */
enum PROPS_NAME {
  /** 炸弹球 */
  BOMB = 'bomb',

  /** 染色球 */
  COLOR = 'color',

  /** 彩虹球 */
  RAINBOW = 'rainbow',

  /** 锤子 */
  HAMMER = 'hammer',

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

  /** 染色球 */
  color: {
    name: PROPS_NAME.COLOR,
    desc: '染色泡泡会将前3行的泡泡染上相同颜色',
    value: 1,
  },

  /** 彩虹球 */
  rainbow: {
    name: PROPS_NAME.RAINBOW,
    desc: '彩虹泡泡会不受限制消除同一颜色的泡泡',
    value: 1,
  },

  /** 锤子 */
  hammer: {
    name: PROPS_NAME.HAMMER,
    desc: '锤子泡泡拥有隔山打牛的功效',
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
  static endlessGameManager: EndlessGameManager;
  static gameManager: GameManager;
  static dialogManager: DialogManager;
  static audioManager: AudioManager;

  // screen
  static SCREEN_WIDTH = 375; // 屏幕宽度
  static SCREEN_HEIGHT = 667; // 屏幕高度
  static HEADER_HEIGHT = 50; // 头部高度
  static TOP_LINE_HEIGHT = 15; // 顶部线的高度
  static SCREEN_TOP_X = this.SCREEN_WIDTH / 2; // 屏幕左上角X位置
  static SCREEN_TOP_Y = this.SCREEN_HEIGHT / 2 - this.HEADER_HEIGHT - this.TOP_LINE_HEIGHT; // 屏幕左上角Y位置

  // game
  static GAME_STATE = GAME_STATE; // 游戏状态
  static GAME_OVER_TYPE = GAME_OVER_TYPE; // 游戏终止类型
  static DROP_BALL_SCORE = 15; // 掉落泡泡的分数
  static BOMB_BALL_SCORE = 10; // 炸弹泡泡的分数

  // stick
  static STICK_RADIUS = 40; // 球杆半径
  static STICK_RADIUS2 = 30; // 球杆半径


  // ball
  static BALL_RADIUS = 17.5; // 球的半径
  static BALL_ENDLESS_RADIUS = 17.5; // 无尽模式下球的半径
  static BALL_SKIN = BALL_SKIN // 球皮肤
  static POSITION_TYPE = POSITION_TYPE // 坐标类型
  static BALL_TYPE = BALL_TYPE // 球类型
  static BALL_REMOVE_COUNT = 3;// 可消除球的数量
  static BALL_SHOOT_STATE = BALL_SHOOT_STATE // 球射击状态
  static BALL_MOVE_SPEED = 0.05; // 无尽模式下球移动的速度
  static BALL_COLLISION_DISTANCE = 35 // 球碰撞距离(通常是半径的2倍)
  static BALL_EXTEND_DIR = BALL_EXTEND_DIR // 球扩展路径

  // 射线
  static RAY_LENGTH = 600; // 射线长度
  static RAY_ANGLE = 1; // 射线角度(0-3.14)

  // 事件
  static EVENT_TYPE = EVENT_TYPE; // 事件监听类型

  // 道具
  static PROPS_NAME = PROPS_NAME; // 道具名称
  static PROPS_TYPE = PROPS_TYPE; // 道具类型
  static BOMB_RADIUS = 3; // 炸弹泡泡的半径
  static LIGHTNING_RADIUS = 1; // 闪电泡泡的半径

}