import { _decorator, Component, director, log, Node, ProgressBar, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PageLoading')
export class PageLoading extends Component {
    @property(Node)
    progressRoot: Node = null

    private _progress: number = 0;

    start() {
        this.schedule(this.updateProgressNode, 0.5)
        director.preloadScene("main", function () {
            log("Next scene preloaded");
        });
    }

    update(deltaTime: number) {
        
    }

    // 更新进度
    updateProgressNode() {
        const value = this._progress + 0.3
        this.progressRoot.getComponent(ProgressBar).progress = value
        if (value >= 1) {
            this.unschedule(this.updateProgressNode)
            director.loadScene("main")
        } else {
            this._progress = value
        }
    }
}

