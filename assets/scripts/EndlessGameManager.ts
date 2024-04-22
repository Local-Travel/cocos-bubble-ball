import { _decorator, Component, Node, Vec2 } from 'cc';
import { EndlesssBallControl } from './ball/endless/EndlesssBallControl';
import { PageEndlessGame } from './page/PageEndlessGame';
import { Constants } from './util/Constant';
import { User } from './data/User';
import { getLevelData } from './data/LevelData';
const { ccclass, property } = _decorator;

@ccclass('EndlessGameManager')
export class EndlessGameManager extends Component {
    @property(EndlesssBallControl)
    endlesssBallControl: EndlesssBallControl = null;

    @property(PageEndlessGame)
    pageEndlessGame: PageEndlessGame = null;


    public ballState: string = null;
    public gameStatus: string = null;

    // 当前分数
    public curScore: number = 0

    protected __preload(): void {
        Constants.endlessGameManager = this;
    }

    start() {
        localStorage.setItem('scene', 'EndlessGameManager')
        this.init();
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        
    }

    init() {
        // const user = User.instance();
        // const ballSkin = user.getBallSkin();
        const ballSkin = 'Style2';

        this.pageEndlessGame.init();
        this.endlesssBallControl.init(ballSkin);
        this.gameStatus = Constants.GAME_STATE.READY;
        this.ballState = Constants.BALL_SHOOT_STATE.READY;
        this.curScore = 0;
    }

    shootBallAction(posList: Vec2[]) {
        if (this.gameStatus !== Constants.GAME_STATE.READY) return
        if (this.ballState === Constants.BALL_SHOOT_STATE.READY && posList.length) {
            this.ballState = Constants.BALL_SHOOT_STATE.SHOOTING;
            this.endlesssBallControl.shootBallAction(posList, () => {});
        }
    }

    // 赋予技能给球
    grantSkillToShootBall(skill: string) {
        if (this.gameStatus !== Constants.GAME_STATE.READY || this.ballState !== Constants.BALL_SHOOT_STATE.READY) return 
        this.endlesssBallControl.grantSkillToShootBall(skill);
    }


    gameOver(type: string) {
        switch(type) {
            case Constants.GAME_OVER_TYPE.LOSE:
                console.log('game fail')
                Constants.dialogManager.showFail()
                break;
            default:
                console.log('game pass')
                Constants.dialogManager.showSuccess()
                // 游戏通关
                break;
        }
        this.gameStatus = Constants.GAME_STATE.OVER;
    }

    reduceLifeValue(val: number) {
        this.pageEndlessGame.reduceLifeValue(val);
    }

    // 计算分数
    calcScore(bombCount: number, dropCount: number) {
        const score = bombCount * Constants.BOMB_BALL_SCORE + dropCount * Constants.DROP_BALL_SCORE
        this.curScore += score;
        this.pageEndlessGame.updateScore(this.curScore);
        // 游戏继续
        this.ballState = Constants.BALL_SHOOT_STATE.READY;
    }
}



