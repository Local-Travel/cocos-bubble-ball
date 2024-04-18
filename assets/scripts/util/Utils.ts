import { Vec2, misc } from "cc";
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

}