import { Vec2, misc, log } from "cc";
import { WECHAT, BYTEDANCE, BAIDU } from "cc/env"
import { Constants } from "./Constant";

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
        return Math.floor((Math.abs(Constants.SCREEN_TOP_X) * 2 - Constants.BALL_RADIUS * 2) / (Constants.BALL_RADIUS * 2));
    }

    /**
     * 获取最大行数
     */
    static getMaxRow(): number {
        return Math.floor((Math.abs(Constants.SCREEN_TOP_Y * 2) - Constants.BALL_RADIUS) / (Constants.BALL_RADIUS * Math.sqrt(3)));
    }

    /**
     * 根据行列号转换为坐标
     * @param row 
     * @param col 
     */
    static convertToPos(row: number, col: number): Vec2 {
        // 奇数行特殊处理
        const x = -Constants.SCREEN_TOP_X + col * Constants.BALL_RADIUS * 2 + Constants.BALL_RADIUS * (row % 2 + 1);
        const y = Constants.SCREEN_TOP_Y - (Constants.BALL_RADIUS + row * Constants.BALL_RADIUS * Math.sqrt(3));
        return new Vec2(x, y);
    }

    /**
     * 根据位置转换为行列
     * @param pos 
     */
    static convertToRowCol(pos: Vec2): { row: number, col: number } {
        const row = Math.round(Math.abs(Constants.SCREEN_TOP_Y - pos.y - Constants.BALL_RADIUS) / (Constants.BALL_RADIUS * Math.sqrt(3)));
        const col = Math.round(Math.abs(pos.x + Constants.SCREEN_TOP_X - Constants.BALL_RADIUS * (row % 2 + 1)) / (Constants.BALL_RADIUS * 2));
        return { row, col };
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