interface IData {
  /** 等级信息 */
  level?: number;
  /** 通关分数 */
  score: number;
  /** 发射泡泡个数 */
  bubbleCount: number;
  /** 皮肤个数 */
  skinCount: number;
  /** 击落目标个数 */
  targetCount?: number;
  /** 击落目标Icon */
  targetIcon?: number;
  /** 垂直方向满屏的球的限制 */
  maxLen: number;
  /** 名称 */
  name: string;
  /** 描述信息 */
  desc: string;
  /** 显示网格列表，负数表示击落目标皮肤 */
  list: number[][];
}

export default class LevelData {
  /** 
   * 获取关卡数据
   * */
  static getData(level: number) {
    const levelList: IData[] = [
      {
        level: 0,
        score: 600,
        bubbleCount: 10,
        skinCount: 3,
        targetCount: 0,
        targetIcon: 0,
        maxLen: 12,
        name: '关卡 1',
        desc: '',
        list: [
          [1, 2, 1, 3, 2, 1, 3, 2, 0, 0],
          [1, 2, 1, 3, 2, 1, 3, 2, 0, 0],
          [0, 1, 2, 1, 3, 2, 1, 3, 2, 0],
          [0, 1, 2, 1, 3, 2, 1, 3, 2, 0],
          [0, 0, 1, 2, 1, 3, 2, 1, 3, 2],
          [0, 1, 2, 1, 3, 2, 1, 3, 2, 0],
          [0, 1, 2, 1, 3, 2, 1, 3, 2, 0],
          [1, 2, 1, 3, 2, 1, 3, 2, 0, 0],
          [1, 2, 1, 3, 2, 1, 3, 2, 0, 0],
        ]
      },
      {
        level: 0,
        score: 930,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 4,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 2',
        desc: '',
        list: [
          [0, 0, 0, 2, 2, 0, 0, 2, 2, 0],
          [0, 1, 1, -1, 2, -1, 2, 1, 1, 0],
          [0, 1, 1, 0, 0, 2, 2, 0, 1, 1],
          [1, 1, 0, -1, 0, 2, 0, -1, 1, 1],
          [0, 3, 3, 3, 3, 2, 2, 3, 3, 3],
          [3, 4, 4, 4, 4, 2, 1, 1, 1, 3],
          [0, 3, 4, 4, 4, 2, 1, 1, 1, 3],
          [0, 3, 3, 3, 2, 2, 3, 3, 3, 0],
        ]
      },
      {
        level: 0,
        score: 600,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 2,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 4',
        desc: '',
        list: [
          [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
          [0, 0, 0, 0, -2, 0, 0, 0, 0, 0],
          [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
          [0, 0, 2, 1, 1, 1, 2, 0, 0, 0],
          [0, 0, 2, 1, 1, 1, 1, 2, 0, 0],
          [0, 4, 4, 4, -2, 4, 4, 4, 0, 0],
          [0, 0, 4, 2, 2, 2, 2, 4, 0, 0],
          [0, 0, 3, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 1000,
        bubbleCount: 25,
        skinCount: 4,
        targetCount: 4,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 5',
        desc: '',
        list: [
          [1, 1, 1, 3, 3, -1, 3, 2, 2, 2],
          [1, 2, 2, 2, 3, 3, 1, 1, 1, 2],
          [1, 2, 1, 1, 2, 3, 1, 2, 2, 1],
          [2, 1, -1, 1, 2, 1, 2, -1, 2, 1],
          [4, 2, 1, 1, 2, 4, 1, 2, 2, 1],
          [4, 2, 2, 2, 4, 4, 1, 1, 1, 4],
          [4, 4, 4, 4, 4, -1, 4, 4, 4, 4],
          [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        ]
      },
      {
        level: 0,
        score: 1100,
        bubbleCount: 20,
        skinCount: 4,
        targetCount: 2,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 6',
        desc: '',
        list: [
          [0, 0, 0, 1, 3, 3, 1, 0, 0, 0],
          [0, 0, 3, 4, -1, 4, 3, 0, 0, 0],
          [0, 0, 3, 4, 2, 2, 4, 3, 0, 0],
          [0, 3, 4, 1, 1, 1, 4, 3, 0, 0],
          [0, 2, 4, 1, 1, 1, 1, 4, 2, 0],
          [0, 3, 4, 4, -1, 4, 4, 3, 0, 0],
          [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
          [0, 0, 3, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 710,
        bubbleCount: 5,
        skinCount: 4,
        targetCount: 1,
        targetIcon: -2,
        maxLen: 11,
        name: '关卡 33',
        desc: '挑战难度提升了哟，通关有神秘宝箱',
        list: [
          [0, 0, 0, 3, 2, 2, 3, 0, 0, 0],
          [0, 0, 3, 4, 4, 4, 3, 0, 0, 0],
          [0, 0, 3, 4, 2, 2, 4, 3, 0, 0],
          [0, 3, 4, 1, 1, 1, 4, 3, 0, 0],
          [0, 3, 4, 1, 1, 1, 1, 4, 3, 0],
          [0, 3, 4, 4, -2, 4, 4, 3, 0, 0],
          [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
          [0, 0, 3, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 25,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 7',
        desc: '',
        list: [
          [0, 0, 0, 0, 1, 1, -2, 3, 3, 0],
          [0, 0, 0, 1, 1, 1, 3, 3, 0, 0],
          [0, 0, 2, 2, -2, 1, 3, 3, 0, 0],
          [0, 1, 1, 1, 1, 3, 3, 0, 0, 0],
          [0, 0, 0, 1, 1, 2, -2, 0, 0, 0],
          [0, 4, 4, 4, 4, 2, 3, 3, 0, 0],
          [0, 4, 4, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 4, 4, 2, 3, 0, 0, 0, 0],
          [0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 700,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 2,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 8',
        desc: '',
        list: [
          [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
          [0, 0, 2, 2, -2, 2, 2, 0, 0, 0],
          [0, 0, 2, 0, 2, 2, 0, 2, 0, 0],
          [0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
          [0, 2, 0, 0, 1, 1, 0, 0, 2, 0],
          [2, 0, 0, 1, -2, 1, 0, 0, 2, 0],
          [2, 0, 0, 1, 1, 1, 1, 0, 0, 2],
          [3, 3, 3, 0, 0, 0, 4, 4, 4, 0],
          [0, 3, 3, 0, 0, 0, 0, 4, 4, 0],
          [0, 3, 0, 0, 0, 0, 0, 4, 0, 0],
        ]
      },
      {
        level: 0,
        score: 850,
        bubbleCount: 25,
        skinCount: 5,
        targetCount: 4,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 9',
        desc: '',
        list: [
          [0, 0, 0, 5, 5, -1, 5, 5, 0, 0],
          [0, 0, 4, 5, 5, 5, 5, 3, 0, 0],
          [0, 0, 4, 4, 5, 5, 5, 3, 3, 0],
          [0, 4, -1, 4, 5, 5, 3, -1, 3, 0],
          [0, 4, 4, 4, 4, 5, 3, 3, 3, 3],
          [4, 4, 4, 4, 4, 3, 3, 3, 3, 3],
          [0, 5, 5, 5, 5, -1, 4, 4, 4, 4],
          [0, 5, 5, 5, 5, 5, 4, 4, 4, 0],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 20,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 10',
        desc: '',
        list: [
          [0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
          [0, 0, 4, 0, 5, 5, 0, 3, 0, 0],
          [0, 0, 4, 4, 5, -1, 5, 3, 3, 0],
          [0, 4, -1, 4, 0, 0, 3, -1, 3, 0],
          [0, 4, 4, 4, 4, 0, 3, 3, 3, 3],
          [4, 4, 4, 4, 4, 3, 3, 3, 3, 3],
          [0, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 20,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 11',
        desc: '',
        list: [
          [0, 0, 4, 4, 0, 0, 0, 3, 3, 0],
          [0, 0, -2, 0, 0, 0, 0, -2, 0, 0],
          [0, 0, 4, 4, 0, 0, 0, 3, 3, 0],
          [0, 4, 4, 4, 0, 0, 3, 3, 3, 0],
          [0, 4, 4, 4, 4, -2, 3, 3, 3, 3],
          [4, 4, 4, 4, 4, 3, 3, 3, 3, 3],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [5, 5, 5, 0, 0, 0, 0, 5, 5, 5],
          [0, 5, 5, 0, 0, 0, 0, 0, 5, 5],
          [0, 5, 0, 0, 0, 0, 0, 0, 5, 0],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 15,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 12',
        desc: '',
        list: [
          [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
          [0, -2, 0, 5, -2, 5, 0, -2, 0, 0],
          [4, 4, 4, 4, 5, 5, 3, 3, 3, 3],
          [4, 4, 4, 0, 5, 0, 3, 3, 3, 0],
          [0, 4, 4, 0, 0, 0, 0, 3, 3, 0],
          [0, 4, 0, 0, 0, 0, 0, 3, 0, 0],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [5, 5, 5, 0, 0, 0, 0, 5, 5, 5],
          [0, 5, 5, 0, 0, 0, 0, 0, 5, 5],
          [0, 5, 0, 0, 0, 0, 0, 0, 5, 0],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 15,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 13',
        desc: '',
        list: [
          [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
          [0, -2, 0, 5, -2, 5, 0, -2, 0, 0],
          [4, 4, 4, 4, 5, 5, 3, 3, 3, 3],
          [4, 4, 4, 1, 5, 1, 3, 3, 3, 0],
          [0, 4, 4, 1, 1, 1, 1, 3, 3, 0],
          [0, 4, 1, 1, 1, 1, 1, 3, 0, 0],
          [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
          [5, 5, 5, 0, 0, 0, 5, 5, 5, 0],
          [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
          [0, 5, 0, 0, 0, 0, 0, 5, 0, 0],
        ]
      },
      {
        level: 0,
        score: 600,
        bubbleCount: 12,
        skinCount: 4,
        targetCount: 4,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 14',
        desc: '',
        list: [
          [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
          [0, 0, 0, 3, -2, 3, 0, 0, 0, 0],
          [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
          [0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 4, 0, 1, -2, 1, 0, 4, 0, 0],
          [0, 4, 4, 1, 1, 1, 1, 4, 4, 0],
          [4, -2, 4, 0, 0, 0, 4, -2, 4, 0],
          [4, 4, 4, 4, 0, 0, 4, 4, 4, 4],
        ]
      },
      {
        level: 0,
        score: 800,
        bubbleCount: 15,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 15',
        desc: '',
        list: [
          [0, 0, 4, 2, 2, 2, 2, 3, 0, 0],
          [0, 4, 4, 2, 2, 2, 3, 3, 0, 0],
          [0, 4, -2, 4, 2, 2, 3, -2, 3, 0],
          [4, 4, 4, 4, 2, 3, 3, 3, 3, 0],
          [2, 2, 0, 0, 1, 1, 0, 0, 2, 2],
          [2, 2, 0, 1, -2, 1, 0, 0, 2, 2],
          [2, 2, 0, 1, 1, 1, 1, 0, 2, 2],
          [5, 5, 5, 0, 0, 0, 5, 5, 5, 0],
          [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
          [0, 5, 0, 0, 0, 0, 0, 5, 0, 0],
        ]
      },
      {
        level: 0,
        score: 1000,
        bubbleCount: 25,
        skinCount: 5,
        targetCount: 4,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 16',
        desc: '',
        list: [
          [1, 1, 1, 1, 5, -1, 5, 2, 2, 2],
          [1, 1, 4, 2, 5, 5, 1, 3, 2, 2],
          [1, 1, 4, 4, 2, 5, 1, 3, 3, 2],
          [1, 4, -1, 4, 2, 1, 3, -1, 3, 2],
          [1, 4, 4, 4, 4, 1, 3, 3, 3, 3],
          [4, 4, 4, 4, 4, 3, 3, 3, 3, 3],
          [0, 5, 5, 5, 5, -1, 4, 4, 4, 4],
          [0, 5, 5, 5, 5, 5, 4, 4, 4, 0],
        ]
      },
      {
        level: 0,
        score: 750,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 17',
        desc: '',
        list: [
          [1, 0, 0, 2, 2, 2, 2, 0, 0, 1],
          [1, -2, 2, 2, 2, 2, 2, -2, 1, 0],
          [0, 1, 2, 0, 2, 2, 0, 2, 1, 0],
          [0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
          [0, 2, 0, 0, 1, 1, 0, 0, 2, 0],
          [2, 3, 0, 1, -2, 1, 0, 4, 2, 0],
          [2, 3, 3, 1, 1, 1, 1, 4, 4, 2],
          [3, 3, 3, 0, 0, 0, 4, 4, 4, 0],
          [0, 3, 3, 0, 0, 0, 0, 4, 4, 0],
          [0, 3, 0, 0, 0, 0, 0, 4, 0, 0],
        ]
      },
      {
        level: 0,
        score: 700,
        bubbleCount: 20,
        skinCount: 5,
        targetCount: 2,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 18',
        desc: '',
        list: [
          [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
          [0, 0, 2, 2, -2, 2, 2, 0, 0, 0],
          [0, 0, 2, 0, 2, 2, 0, 2, 0, 0],
          [0, 2, 0, 0, 5, 0, 0, 2, 0, 0],
          [0, 2, 0, 0, 5, 5, 0, 0, 2, 0],
          [0, 3, 0, 5, -2, 5, 0, 4, 0, 0],
          [0, 3, 3, 5, 5, 5, 5, 4, 4, 0],
          [3, 3, 3, 0, 0, 0, 4, 4, 4, 0],
        ]
      },
      {
        level: 0,
        score: 600,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 19',
        desc: '',
        list: [
          [0, 0, 0, 0, -2, -2, 0, 0, 0, 0],
          [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
          [4, 0, 0, 2, 2, 2, 0, 0, 1, 0],
          [0, 4, 0, 2, 2, 2, 2, 0, 1, 0],
          [0, 4, 4, 4, -2, 1, 1, 1, 0, 0],
          [0, 0, 4, 4, 4, 1, 1, 1, 0, 0],
          [0, 0, 4, 4, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 4, 0, 0, 1, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 1000,
        bubbleCount: 25,
        skinCount: 4,
        targetCount: 4,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 20',
        desc: '',
        list: [
          [0, 0, 0, 0, 3, -1, 3, 0, 0, 0],
          [0, 2, 2, 2, 3, 3, 1, 1, 1, 0],
          [0, 2, 5, 5, 2, 3, 1, 4, 4, 1],
          [2, 5, -1, 5, 2, 1, 4, -1, 4, 1],
          [0, 2, 5, 5, 2, 4, 1, 4, 4, 1],
          [0, 2, 2, 2, 4, 4, 1, 1, 1, 0],
          [0, 0, 3, 0, 4, -1, 4, 0, 3, 0],
          [0, 3, 3, 4, 4, 4, 4, 3, 3, 0],
          [0, 3, 3, 3, 0, 0, 0, 3, 3, 3],
        ]
      },
      {
        level: 0,
        score: 900,
        bubbleCount: 20,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -1,
        maxLen: 12,
        name: '关卡 21',
        desc: '',
        list: [
          [3, 2, 1, 3, -1, 1, 3, 2, 0, 0],
          [3, 2, 1, 3, 2, 1, 3, 2, 0, 0],
          [0, 3, 2, 1, 3, 2, 1, 3, 2, 0],
          [0, 3, 2, 1, 3, 2, 1, 3, 2, 0],
          [0, 0, 1, -1, 1, 3, 2, 4, -1, 0],
          [0, 1, 2, 0, 0, 0, 4, 3, 0, 0],
          [0, 1, 2, 1, 0, 0, 4, 3, 4, 0],
          [1, 2, 1, 2, 0, 4, 3, 4, 3, 0],
          [1, 2, 1, 2, 1, 4, 3, 4, 3, 4],
        ]
      },
      {
        level: 0,
        score: 730,
        bubbleCount: 10,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 11,
        name: '关卡 22',
        desc: '',
        list: [
          [-2, 0, 0, 5, 5, 5, 5, 0, 0, -2],
          [5, 0, 5, 4, 1, 4, 5, 0, 5, 0],
          [0, 5, 5, 4, 1, 1, 4, 5, 5, 0],
          [0, 3, 4, 1, 1, 1, 4, 3, 0, 0],
          [0, 3, 4, 1, 1, 1, 1, 4, 3, 0],
          [0, 3, 4, 4, -2, 4, 4, 3, 0, 0],
          [0, 0, 3, 4, 2, 2, 4, 3, 0, 0],
          [0, 0, 3, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
        ]
      },
      {
        level: 0,
        score: 600,
        bubbleCount: 15,
        skinCount: 4,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 23',
        desc: '',
        list: [
          [0, 0, 0, -2, 2, 2, -2, 0, 0, 0],
          [0, 0, 3, 2, 2, 2, 3, 0, 0, 0],
          [0, 0, 2, 0, 2, 2, 0, 2, 0, 0],
          [0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
          [0, 2, 0, 0, 1, 1, 0, 0, 2, 0],
          [2, 4, 0, 1, -2, 1, 0, 4, 2, 0],
          [2, 4, 4, 1, 1, 1, 1, 4, 4, 2],
          [4, 4, 4, 0, 0, 0, 4, 4, 4, 0],
          [0, 4, 4, 0, 0, 0, 0, 4, 4, 0],
          [0, 4, 0, 0, 0, 0, 0, 4, 0, 0],
        ]
      },
      {
        level: 0,
        score: 700,
        bubbleCount: 12,
        skinCount: 5,
        targetCount: 3,
        targetIcon: -2,
        maxLen: 12,
        name: '关卡 24',
        desc: '',
        list: [
          [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
          [0, -2, 0, 2, 2, 2, 0, -2, 0, 0],
          [0, 4, 4, 0, 2, 2, 0, 3, 3, 0],
          [4, 4, 4, 4, -2, 3, 3, 3, 3, 0],
          [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
          [5, 5, 5, 0, 0, 0, 5, 5, 5, 0],
          [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
          [0, 5, 0, 0, 0, 0, 0, 5, 0, 0],
        ]
      },
      {
        level: 0,
        score: 1200,
        bubbleCount: 8,
        skinCount: 3,
        targetCount: 5,
        targetIcon: -2,
        maxLen: 10,
        name: '关卡 25',
        desc: '',
        list: [
          [0, -2, 3, 3, 3, 3, 3, 3, -2, 0],
          [0, 3, 3, 3, 3, 3, 3, 3, 0, 0],
          [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
          [0, 0, 3, 3, 3, 3, 3, 0, 0, 0],
          [0, 0, 2, 3, 3, 3, 3, 1, 0, 0],
          [0, 2, 2, 3, 3, 3, 1, 1, 0, 0],
          [0, 2, -2, 2, 3, 3, 1, -2, 1, 0],
          [2, 2, 2, 2, -2, 1, 1, 1, 1, 0],
          [2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        ]
      },
    ]

    const col = 10
    let data = levelList[0]
    if (level <= levelList.length && level > 0) {
      data = levelList[level - 1]
      data.level = level
    }

    return {
      col,
      list: data.list,
      data,
    }
  }
} 