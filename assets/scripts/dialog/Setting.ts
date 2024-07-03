import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Texture2D } from 'cc';
import { Constants } from '../util/Constant';
const { ccclass, property } = _decorator;

@ccclass('Setting')
export class Setting extends Component {
    @property(Node)
    musicRoot: Node = null

    @property(Node)
    soundRoot: Node = null

    @property(Node)
    maskRoot: Node = null

    private _isMusicPlay: boolean = false
    private _isSoundPlay: boolean = true

    start() {

    }

    protected onEnable(): void {
        this.musicRoot.on(Node.EventType.TOUCH_END, this.handleMusicPlay, this)
        this.soundRoot.on(Node.EventType.TOUCH_END, this.handleSoundPlay, this)
        this.maskRoot.on(Node.EventType.TOUCH_END, this.hideNode, this)
    }

    protected onDisable(): void {
        this.musicRoot.off(Node.EventType.TOUCH_END, this.handleMusicPlay, this)
        this.soundRoot.off(Node.EventType.TOUCH_END, this.handleSoundPlay, this)
        this.maskRoot.off(Node.EventType.TOUCH_END, this.hideNode, this)
    }

    handleMusicPlay() {
        // 背景音乐播放
        let url = 'texture/icon/icon_music_on/spriteFrame';
        if (this._isMusicPlay) {
            this._isMusicPlay = false
            url = 'texture/icon/icon_music_off/spriteFrame';
            // 音乐关闭
            Constants.audioManager.stopBgm()
        } else {
            this._isMusicPlay = true

            // 音乐打开
            Constants.audioManager.playBgm()
        }
        resources.load(url, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            // console.log(err, spriteFrame)
            if (spriteFrame) {
                this.musicRoot.getChildByName('icon').getComponent(Sprite).spriteFrame = spriteFrame;
            }
        });
    }

    handleSoundPlay() {
        // 声音关闭或打开
        let url = 'texture/icon/icon_sound_on/spriteFrame';
        if (this._isSoundPlay) {
            this._isSoundPlay = false
            url = 'texture/icon/icon_sound_off/spriteFrame';
            // 禁用所有声音
            Constants.audioManager.offSound()
            // 已经打开的背景音乐要关闭
            if (this._isMusicPlay) {
                this.handleMusicPlay()
            }
        } else {
            this._isSoundPlay = true
            // 打开声音
            Constants.audioManager.onSound()

            // 已经打开的背景音乐要播放
            if (this._isMusicPlay) {
                Constants.audioManager.playBgm()
            }
        }

        resources.load(url, SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            // console.log(err, spriteFrame)
            if (spriteFrame) {
                this.soundRoot.getChildByName('icon').getComponent(Sprite).spriteFrame = spriteFrame;
            }
        });
    }

    showNode() {
        this.node.active = true
    }

    hideNode() {
        this.node.active = false
    }
}

