import { _decorator, Vec3 } from "cc";

// 球皮肤管理
const BALL_SKIN = {
  Style1: {// 类型1
     pathDir: 'material/ball/',
     skin: 'style1_ball'
  },
}

// 坐标类型
const POSITION_TYPE = {
    worldPosition: 'worldPosition',// 世界坐标
    position: 'position',// 节点坐标
}

export class Constants {
//   static gameManager: GameManager;
//   static tipManager: TipManager;
//   static audioManager: AudioManager;

  // ball
  static BALL_RADIUS = 1.5; // 球的半径
  static BALL_SKIN = BALL_SKIN // 球运动类型
  static POSITION_TYPE = POSITION_TYPE // 坐标类型


}