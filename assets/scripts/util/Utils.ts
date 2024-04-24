import { Vec2, misc, log, Prefab, Node, v3, UITransform, v2 } from "cc";
import { WECHAT, BYTEDANCE, BAIDU } from "cc/env"
import { Constants } from "./Constant";
import { PoolManager } from "./PoolManager";

export class Utils {
    /**
     * 获取角度
     */
    static getAngle(vec: Vec2): number {
        const comVec = new Vec2(1, 0);
        const radian = comVec.signAngle(vec);
        const angle = misc.radiansToDegrees(radian);
        return angle;
    }

    /**
     * 获取最大列数
     * @returns 
     */
    static getMaxCol(): number {
        return Math.floor(Constants.SCREEN_WIDTH / (Constants.BALL_RADIUS * 2));
    }

    /**
     * 根据行列号转换为坐标
     * @param row 
     * @param col 
     */
    static convertToPos(row: number, col: number, r: number = Constants.BALL_RADIUS): Vec2 {
        // 奇数行特殊处理
        const x = -Constants.SCREEN_TOP_X + col * r * 2 + r * (row % 2 + 1);
        const y = Constants.SCREEN_TOP_Y - (r + row * r * Math.sqrt(3));
        return new Vec2(x, y);
    }

    /**
     * 根据位置转换为行列
     * @param pos 
     */
    static convertToRowCol(pos: Vec2, r: number = Constants.BALL_RADIUS, bubbleBallList: any[]): { row: number, col: number } {
        const rx = Math.abs(Constants.SCREEN_TOP_Y - pos.y - r) / (r * Math.sqrt(3))
        let row = Math.round(rx);
        const cy = Math.abs(pos.x + Constants.SCREEN_TOP_X - r * (row % 2 + 1)) / (r * 2)
        let col = Math.round(cy)
        console.log(rx, cy)
        if (bubbleBallList[row] && bubbleBallList[row][col] && col > 0) {
          col -= 1
        }
        if (col >= Utils.getMaxCol()) {
          col -= 1
        }
        if (bubbleBallList[row] 
          && bubbleBallList[row][col]
          && (!bubbleBallList[row + 1] || !bubbleBallList[row + 1][col]) 
          ) {
            row += 1
        }
        return { row, col };
    }

    /** 根据位置显示预制小球 */
    static showPreBallByPos(pos: Vec2, r: number = Constants.BALL_RADIUS, ballPrefab: Prefab, parent: Node, bubbleBallList: any[]) {
      const nodePos = parent.getComponent(UITransform).convertToNodeSpaceAR(v3(pos.x, pos.y, 0));
      const { row, col } = Utils.convertToRowCol(v2(nodePos.x, nodePos.y), r, bubbleBallList);
      const nPos = Utils.convertToPos(row, col, r);
      const preBall = PoolManager.instance().getNode(ballPrefab, parent);
      preBall.setPosition(v3(nPos.x, nPos.y, 0));
      return { preBall, nPos, row, col };
    }

    /** 隐藏预制小球 */
    static hidePreBall(preBall: Node) {
      PoolManager.instance().putNode(preBall);
    }
  
  /**
   * 设置本地数据
   * @param key 
   * @param data 
   */
  static setLocalStorage(key: string, data: any) {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
        console.error(e)
    }
  }
  
  /**
   * 获取本地数据
   * @param key 
   */
  static getLocalStorage(key: string) {
    try {
      const dataStr = localStorage.getItem(key)
      if (dataStr) {
          const data = JSON.parse(dataStr)
          return data
      }
    } catch(e) {
      console.error(e)
    }
    return null
  }

  /**
 * 调用振动效果
 */
  static vibrateShort() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      (<any>window).wx.vibrateShort({
        type: 'heavy',
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
    if (BYTEDANCE && typeof (<any>window).tt !== undefined) {// 字节
      (<any>window).tt.vibrateShort({
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
    if (BAIDU && typeof (<any>window).swan !== undefined) {// 百度
      (<any>window).swan.vibrateShort({
        success: () => log('调用振动成功'),
        fail: (err) => log('调用振动失败', err),
      });
    }
  }
  
  /**
   * 调用主动分享
   */
  static activeShare(shareStr: string = 'share user1') {
    // 主动分享按钮
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      (<any>window).wx.shareAppMessage({
        // imageUrl: '',
        query: 'shareMsg=' + shareStr  // query最大长度(length)为2048
      });
    }
  }
  
  /**
   * 被动分享
   */
  static passiveShare() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      // 显示当前页面的转发按钮
      (<any>window).wx.showShareMenu({
        withShareTicket: false,
        menus: ['shareAppMessage', 'shareTimeline'],
        success: (res) => {
            console.log('开启被动转发成功！');
        },
        fail: (res) => {
            console.log(res);
            console.log('开启被动转发失败！');
        }
      });
      
      // 监听用户点击右上角分享按钮
      (<any>window).wx.onShareAppMessage((res) => {
          console.log('用户点击右上角分享按钮', res);
          return {
            // title: '',
            query: 'shareMsg='+'share user2'  // query最大长度(length)为2048
          }
      })
      // 监听用户点击右上角分享按钮
      (<any>window).wx.onShareTimeline((res) => {
          console.log('用户点击右上角分享按钮', res);
          return {
            // title: '', 
            query: 'shareMsg='+'share user3'  // query最大长度(length)为2048
          }
      })
    }
  }
  
  /**
   * 获取微信分享数据
   * 当其他玩家从分享卡片上点击进入时，获取query参数
   * @returns 
   */
  static getWXQuery() {
    if (WECHAT && typeof (<any>window).wx !== undefined) {// 微信
      let object = (<any>window).wx.getLaunchOptionsSync();
      let shareMsg = object.query['shareMsg'];
      console.log(shareMsg);
      return shareMsg;
    }
  }

}