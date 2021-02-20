import { _decorator, Component, Node, director, find, LabelComponent, UIOpacityComponent } from 'cc';
import { UIBase } from './UIBase';
import { GameStorage } from '../GameStorage';
import { Achievement } from '../Achievement';
import { AudioManager } from '../AudioManager';
import { Level } from '../Level';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { GlodEffect } from '../Effect/GlodEffect';
import { GameManager } from '../GameManager';
import ASCAd from '../ADPlugin/ASCAd';
const { ccclass, property } = _decorator;

@ccclass('MenuUI')
export class MenuUI extends UIBase {

    /**开始按钮 */
    private StartButton: Node = null
    private MoneyLabel: LabelComponent = null
    private AddMoneyNode: Node = null
    /**看广告加钱提示 */
    private AddMoneyTipNode: Node = null
    /**看广告加钱按钮 */
    private AddMoneyAD: Node = null
    /**加钱放回按钮 */
    private AddMoneyBack: Node = null
    /**暂不加钱按钮 */
    private AddMoneyRefuse: Node = null
    private tip: Node = null
    /**触摸遮挡 */
    private touchShelter: Node = null



    start() {
        super.Init(find("Canvas"))
        this.tip = this.getUiNode("Tip")
        this.touchShelter = this.getUiNode("shelter")
        this.AddMoneyNode = this.getUiNode("AddMoney")
        //看广告加钱UI
        this.AddMoneyTipNode = this.getUiNode("AddMoneyTip")
        this.AddMoneyAD = this.getUiNode("MoneyAgree")
        this.AddMoneyBack = this.getUiNode("MoneyBack")
        this.AddMoneyRefuse = this.getUiNode("MoneyRefuse")
        //看广告加钱时间监听
        this.AddMoneyNode.on(Node.EventType.TOUCH_END, this.AddMoney, this)
        this.AddMoneyAD.on(Node.EventType.TOUCH_END, this.OnAddMoneyAD, this)
        this.AddMoneyBack.on(Node.EventType.TOUCH_END, this.OnMoneyBack, this)
        this.AddMoneyRefuse.on(Node.EventType.TOUCH_END, this.OnMoneyBack, this)

        this.touchShelter.on(Node.EventType.TOUCH_START, this.shelter, this)
        this.MoneyLabel = find("Canvas/Money/MoneyLabel").getComponent(LabelComponent)
        let moneyCount = (GameStorage.instance().getAchievement() as Achievement).money
        this.MoneyLabel.string = moneyCount.toString()
        this.StartButton = this.getUiNode("StartButton")
        this.StartButton.on(Node.EventType.TOUCH_END, this.onStart, this)
        // AudioManager.getInstance().initAudio()
        // AudioManager.getInstance().playBGM("BGM_main")

        //原生Icon广告
        // if(ASCAd.getInstance().getNativeIconFlag())
        // {
        //     ASCAd.getInstance().showNativeIcon(128, 128, (cc.winSize.width-128)/2-50,(cc.winSize.height-128)/2-cc.winSize.height/3)
        // }

        // if (GameManager.getInstance().isFirstOpenGame) {
        //     GameManager.getInstance().isFirstOpenGame = false
        //     director.loadScene("MainScene")
        // }
        // else {
        ASCAd.getInstance().hideNavigateIcon()
        if (ASCAd.getInstance().getNavigateIconFlag()) {
            ASCAd.getInstance().showNavigateIcon(128, 128, (cc.winSize.width - 128) / 2 - 50, (cc.winSize.height - 128) / 2 - cc.winSize.height / 3)
        }
        ASCAd.getInstance().hideBanner()
        ASCAd.getInstance().showBanner()
        //}
    }

    onStart() {
        AudioManager.getInstance().playSound("Click_01")
        director.loadScene("MainScene")

        // if(GameManager.getInstance().isFirstOpenGame)
        // {
        //     GameManager.getInstance().isFirstOpenGame = false
        //     director.loadScene("GameScene")

        // }
        // else
        // {
        //     director.loadScene("MainScene")
        // }
    }

    OnAddMoneyAD() {
        if (ASCAd.getInstance().getVideoFlag()) {
            var callback = function (isEnd) {
                if (isEnd) {

                    this.AddMoneyTipNode.getComponent(GlodEffect).PalyCionAmin()
                    this.AddMoneyAD.active = false
                    this.scheduleOnce(() => {
                        this.AddMoneyTipNode.active = false
                        this.MoneyLabel.string = Level.getInstance().achievement.money.toString()
                    }, 0.8);
                    Level.getInstance().achievement.money += 100
                    GameStorage.instance().setAchievement(Level.getInstance().achievement)
                    AudioManager.getInstance().playBGM("BGM_main")
                }
                else {
                    this.AddMoneyTipNode.active = false
                    AudioManager.getInstance().playBGM("BGM_main")
                    this.showTip()
                }
            }.bind(this)
            AudioManager.getInstance().stopBGM()
            ASCAd.getInstance().showVideo(callback)
        }
        else {
            this.AddMoneyTipNode.active = false
            this.showTip()
        }
    }

    OnMoneyBack() {
        this.AddMoneyTipNode.active = false
    }

    AddMoney() {
        AudioManager.getInstance().playSound("Click_01")
        this.AddMoneyAD.active = true
        this.AddMoneyTipNode.active = true
    }


    showTip() {
        this.onShelter(true)
        this.scheduleOnce(() => { this.onShelter(false) }, 4)
        cc.tween(this.tip.getComponent(UIOpacityComponent)).repeat(1,
            cc.tween()
                .to(1, { opacity: 255 }, { easing: "sineOut" })
                .to(2, { opacity: 255 }, { easing: "sineIn" })
                .to(1, { opacity: 0 }, { easing: "sineIn" })
        )
            .start()
    }

    shelter() { }
    onShelter(state) {

        this.touchShelter.active = state
    }
}
