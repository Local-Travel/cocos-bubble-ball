import { Vec2 } from "cc";
import { Constants } from "./Constant";

export class Utils {
    /**
     * 获取最大列数
     * @returns 
     */
    static getMaxCol(): number {
        return Math.floor((Math.abs(Constants.SCREEN_TOP_LEFT_X) * 2 - Constants.BALL_RADIUS * 2) / (Constants.BALL_RADIUS * 2));
    }

    /**
     * 获取最大行数
     */
    static getMaxRow(): number {
        return Math.floor((Math.abs(Constants.SCREEN_TOP_LEFT_Y) - 100 - Constants.BALL_RADIUS) / (Constants.BALL_RADIUS * Math.sqrt(3)));
    }

    /**
     * 根据行列号转换为坐标
     * @param row 
     * @param col 
     */
    static convertToPos(row: number, col: number): Vec2 {
        // 奇数行特殊处理
        const x = Constants.SCREEN_TOP_LEFT_X + col * Constants.BALL_RADIUS * 2 + Constants.BALL_RADIUS * (row % 2 + 1);
        const y = Constants.SCREEN_TOP_LEFT_Y - (Constants.BALL_RADIUS + row * Constants.BALL_RADIUS * Math.sqrt(3));
        return new Vec2(x, y);
    }

    /**
     * 根据位置转换为行列
     * @param pos 
     */
    static convertToRowCol(pos: Vec2): { row: number, col: number } {
        const row = Math.floor((pos.y - Constants.BALL_RADIUS) / (Constants.BALL_RADIUS * Math.sqrt(3)));
        const col = Math.floor((pos.x - Constants.BALL_RADIUS * (row % 2 + 1)) / (Constants.BALL_RADIUS * 2));
        return { row, col };
    }

}