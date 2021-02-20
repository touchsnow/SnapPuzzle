import { _decorator, Component, Node, LabelComponent, ScrollViewComponent, Tween, find, director, instantiate, AnimationComponent, UIOpacityComponent, game, Game, tween } from 'cc';
import ASCAd from '../ADPlugin/ASCAd';
import { AudioManager } from '../AudioManager';
import { Constants } from '../Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { GlodEffect } from '../Effect/GlodEffect';
import { GameManager } from '../GameManager';
import { GameModeManager } from '../GameModeManager';
import { GameStorage } from '../GameStorage';
import { Level } from '../Level';
import { LevelTap } from '../LevelTap';
import { LevelTapBind } from '../LevelTapBind';
import { MainPageSetting } from '../MainPageSetting';
import AnalyticsManager, { EAnalyticsEvent } from '../Manager/AnalyticsManager';
import { PrefabsMgr } from '../PrefabsMgr';
import { ResMgr } from '../ResMgr';
import { MainPageBase } from './MainPageBase';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('ListPage')
export class ListPage extends MainPageBase {

    /**上一个面板*/
    protected topUI: UIBase
    /** 储存面板中所以的节点*/
    protected NodeDic: Map<string, Node>
    /**关卡Tab根节点 */
    private rootTap: Node = null
    /**加载的时候的UI */
    private loadUI: Node = null
    /**加载Ui的旋转 */
    public loadRotate: Node = null
    /**触摸遮挡 */
    private touchShelter: Node = null
    /**金钱 */
    private moneyLebel: LabelComponent = null
    /**信息提示 */
    private tip: Node = null
    /**增加金币按钮 */
    private addMoneyNode: Node = null
    /**广告提示节点 */
    private adTipNode: Node = null
    /**同意观看视频 */
    private agreeAD: Node = null
    /**拒绝观看视频 */
    private defuseAD: Node = null
    /**同意金钱解锁 */
    private agreeMoney: Node = null
    /**看广告加钱提示 */
    public AddMoneyTipNode: Node = null
    /**看广告加钱按钮 */
    private AddMoneyAD: Node = null
    /**加钱放回按钮 */
    private AddMoneyBack: Node = null
    /**存等级列表 */
    private levelTapList: Array<LevelTap> = new Array<LevelTap>()

    private scrollView: ScrollViewComponent = null
    /**金币不足提示 */
    private TopTip: Node = null

    private topTipFlag: Tween = null

    /**初始化面板*/
    Init(node): void {
        this.NodeDic = new Map<string, Node>()
        this.traverseNode(node)
        //game.off(Game.EVENT_HIDE);
        console.info(cc.game.EVENT_HIDE)
        console.info(Game.EVENT_HIDE)

        game.on(Game.EVENT_HIDE, function () {
            AnalyticsManager.getInstance().login(EAnalyticsEvent.Cancel);
            console.info("EVENT_HIDE")
        })

        game.on(Game.EVENT_HIDE, function () {
            AnalyticsManager.getInstance().login(EAnalyticsEvent.Start);
            console.info("EVENT_SHOW")
        })
    }



    start() {
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "场景事件",
            eventName: "关卡场景",
        })
        this.Init(find("Canvas"))
        this.tip = this.getUiNode("Tip")
        //判断游戏模式
        if (GameModeManager.instance().gameMode === Constants.GameMode.UnCoin) {
            this.getUiNode("MoneyNode").active = false
        }

        if (this.isOnline()) {
            this.loadRotate = this.getUiNode("shelter")
            this.rootTap = this.getUiNode("LevelContent")
            this.addMoneyNode = this.getUiNode("AddMoney")
            //看广告加钱UI
            this.adTipNode = this.getUiNode("ADTip")
            this.agreeAD = this.getUiNode("ADAgree")
            this.defuseAD = this.getUiNode("ADBack")
            this.agreeMoney = this.getUiNode("MoneyAgreeOnTip")
            //看广告加钱UI
            this.AddMoneyTipNode = this.getUiNode("AddMoneyTip")
            this.AddMoneyAD = this.getUiNode("MoneyAgree")
            this.AddMoneyBack = this.getUiNode("MoneyBack")
            /////
            this.moneyLebel = this.getUiNode("MoneyLabel").getComponent(LabelComponent)
            this.moneyLebel.string = Level.getInstance().achievement.money.toString()
            AudioManager.getInstance().playBGM("BGM_main")


            this.loadLevelTap()
            this.loadRotate.on(Node.EventType.TOUCH_START, this.shelter, this)
            this.addMoneyNode.on(Node.EventType.TOUCH_END, this.AddMoney, this)
            this.defuseAD.on(Node.EventType.TOUCH_END, this.DefuseAD, this)

            //看广告加钱时间监听
            this.AddMoneyAD.on(Node.EventType.TOUCH_END, this.OnAddMoneyAD, this)
            this.AddMoneyBack.on(Node.EventType.TOUCH_END, this.OnMoneyBack, this)

            this.scrollView = this.getUiNode("ScrollView").getComponent(ScrollViewComponent)

            //金币不足提示
            this.TopTip = this.getUiNode("TopTip")

            CustomEventListener.on("onShelter", this.onShelter, this)
            CustomEventListener.on("showTip", this.showTip, this)
            CustomEventListener.on("showADTip", this.showADTip, this)
            CustomEventListener.on("AddAgreeADOnTouch", this.AddAgreeADOnTouch, this)
            CustomEventListener.on("RemoveAgreeADOnTouch", this.RemoveAgreeADOnTouch, this)
            CustomEventListener.on("playCoinAnim", this.playCoinAnim, this)
            director.preloadScene("GameScene")
            //刷新一下
            this.scheduleOnce(() => {
                this.loadRotate.active = true
            }, 0.02)
            this.scheduleOnce(() => {
                this.loadRotate.active = false
            }, 0.06)
            //展示广告
            ASCAd.getInstance().hideBanner()
            ASCAd.getInstance().showBanner()
            ASCAd.getInstance().hideNavigateSettle()
        }
    }

    setDisable()
    {
        this.selfButton.getChildByName("SellectBg").active = false

        // tween(this.node)
        // .to(0.5,{scale:cc.v3(3,3,3)},{easing:"circOut"})
        // .call(()=>{
            this.node.active = false
        // })
        // .start()

        // tween(this.node.getComponent(UIOpacityComponent))
        // .to(0.4,{opacity:0},{easing:"circOut"})
        // .start()
    }

    setEnable()
    {
        this.selfButton.getChildByName("SellectBg").active = true
        // tween(this.node)
        // .call(()=>{
            this.node.active = true
        // })
        // .to(0.5,{scale:cc.v3(1,1,1)},{easing:"circOut"})
        // .start()

        // tween(this.node.getComponent(UIOpacityComponent))
        // .to(0.4,{opacity:255},{easing:"circOut"})
        // .start()
    }

    /**面板隐藏 */
    Hide(): void {
        this.scheduleOnce(() => {
            this.loadUI.active = false
            this.touchShelter.active = false
            this.node.active = false
        }, 2)
    }
    /**遮挡作用 */
    shelter() { }
    onShelter(state) {
        this.loadRotate.active = state
    }

    loadLevelTap() {

        for (var i = 0; i <= Constants.levelInfo.Level.length - 1; i++) {
            if (this.rootTap.getChildByName(Constants.levelInfo.Level[i].parent) === null) {
                let parentTap = instantiate(ResMgr.Instance.getAsset("Theme/" + Constants.levelInfo.Level[i].parent)) as Node

                let parentContent = instantiate(ResMgr.Instance.getAsset("Theme/" + Constants.levelInfo.Level[i].parent + "Levels")) as Node
                parentTap.setParent(this.rootTap)
                parentContent.setParent(this.rootTap)
                parentTap.getComponent(LevelTapBind).levelContent = parentContent
            }

            var item = instantiate(PrefabsMgr.Instance.getPrefabs("LevelTap-2")) as Node
            item.setParent(this.rootTap.getChildByName(Constants.levelInfo.Level[i].parent + "Levels"))
            let levelTap = item.addComponent(LevelTap)
            this.levelTapList.push(levelTap)
            levelTap.level = Constants.levelInfo.Level[i].level
            levelTap.sprite = Constants.levelInfo.Level[i].sprite
            levelTap.star = Constants.levelInfo.Level[i].star
            levelTap.levelName = Constants.levelInfo.Level[i].levelName
            levelTap.cameraOrthoHeight = Constants.levelInfo.Level[i].orthoHeight
            levelTap.BGColor = Constants.levelInfo.Level[i].BGColor
            levelTap.unlockMoney = Constants.levelInfo.Level[i].UnlcokMoney
            levelTap.isSpecial = Constants.levelInfo.Level[i].isSpecial
            levelTap.atlas = Constants.levelInfo.Level[i].atals
            levelTap.isFree = Constants.levelInfo.Level[i].isFree
            levelTap.levelIndex = i
            levelTap.onlyAD = Constants.levelInfo.Level[i].onlyAD
            levelTap.theme = Constants.levelInfo.Level[i].parent
        }
        GameManager.getInstance().mainPageSetting = GameStorage.instance().getMainPageSetting()
        let setting: MainPageSetting = GameManager.getInstance().mainPageSetting
        if (setting.TabSet.size !== 0) {
            this.rootTap.children.forEach(element => {
                if (setting.TabSet.has(element.name)) {
                    element.active = true
                }
                else {
                    if (element.name.indexOf("Levels") !== -1) {
                        element.active = false
                    }
                }
            })
        }


        for (var i = 0; i < this.rootTap.children.length; i++) {
            if (this.rootTap.children[i].name === Constants.levelInfo.Level[Level.getInstance().levelIndex].parent) {
                this.rootTap.children[i].getComponent(LevelTapBind).onNodeAbel()
                break
            }
        }

    }



    showTip(index: number = null, label: string = null) {

        if (index) {
            this.tip.active = true
            this.tip.children[index + 6].active = true
            this.tip.getChildByName("TipOffButton").on(Node.EventType.TOUCH_END, () => {
                this.tip.active = false
                this.tip.children[index + 6].active = false
                this.tip.getChildByName("TipOffButton").off(Node.EventType.TOUCH_END)
            })
        }
        if (label) {
            this.tip.active = true
            let labelNode = this.tip.getChildByName("Label")
            labelNode.active = true
            this.tip.getChildByName("Label").getComponent(LabelComponent).string = "请完成主题《" + label + "》的所有关卡"
            this.tip.getChildByName("TipOffButton").on(Node.EventType.TOUCH_END, () => {
                this.tip.active = false
                labelNode.active = false
                this.tip.getChildByName("TipOffButton").off(Node.EventType.TOUCH_END)
            })
        }
    }


    onDestroy() {
        game.off(Game.EVENT_HIDE)
        game.off(Game.EVENT_HIDE)
        CustomEventListener.off("onShelter", this.onShelter, this)
        CustomEventListener.off("showTip", this.showTip, this)
        CustomEventListener.off("showADTip", this.showADTip, this)
        CustomEventListener.off("AddAgreeADOnTouch", this.AddAgreeADOnTouch, this)
        CustomEventListener.off("RemoveAgreeADOnTouch", this.RemoveAgreeADOnTouch, this)
        CustomEventListener.off("playCoinAnim", this.playCoinAnim, this)
    }

    isOnline() {
        //检查网络状态
        let isNotOnLine = navigator && !navigator.onLine
        if (isNotOnLine) {
            ASCAd.getInstance().showToast("当前无网络，请连网后重新尝试")
            return false
        }
        else {
            return true
        }
    }

    BackToMenu() {
        AudioManager.getInstance().playSound("Click_01")
        director.loadScene("MenuScene")
    }

    AddMoney() {
        AudioManager.getInstance().playSound("Click_01")
        this.AddMoneyAD.active = true
        this.AddMoneyTipNode.active = true
        this.AddMoneyTipNode.getChildByPath("BG/Logo").active = false
        this.AddMoneyTipNode.getChildByPath("BG/LogoFrame1").active = true
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Start, {
            name: "按钮事件",
            sceneName: "关卡场景",
            eventName: "金币礼包",
        });
    }

    AgreeAD() {
        if (ASCAd.getInstance().getVideoFlag()) {
            var callback = function (isEnd) {
                if (isEnd) {

                    Level.getInstance().achievement.money += 100
                    GameStorage.instance().setAchievement(Level.getInstance().achievement)
                    this.moneyLebel.string = Level.getInstance().achievement.money.toString()
                    AudioManager.getInstance().playBGM("BGM_main")
                    CustomEventListener.dispatchEvent("onShelter", false)
                }
                else {
                    AudioManager.getInstance().playBGM("BGM_main")
                    CustomEventListener.dispatchEvent("showTip", 1)
                }
                this.AddMoneyTipNode.active = false
            }.bind(this)
            //CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
            AudioManager.getInstance().stopBGM()
            ASCAd.getInstance().showVideo(callback)
        }
        //广告没有加载好
        else {
            CustomEventListener.dispatchEvent("showTip", 3)
        }
    }

    DefuseAD() {
        cc.log("DefuseAD");
        this.adTipNode.active = false
        CustomEventListener.dispatchEvent("onShelter", false)
        CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
    }

    AddAgreeADOnTouch(func1, func2, type) {
        this.agreeAD.on(Node.EventType.TOUCH_END, func1, type)
        this.agreeMoney.on(Node.EventType.TOUCH_END, func2, type)
    }

    RemoveAgreeADOnTouch() {
        cc.log("正在移除AD")
        if (this.agreeAD) {
            this.agreeAD.off(Node.EventType.TOUCH_END)
            this.agreeMoney.off(Node.EventType.TOUCH_END)
        }
    }

    showADTip(state) {
        this.adTipNode.active = state
    }

    OnAddMoneyAD() {

        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "关卡场景",
            eventName: "金币礼包"
        })
        if (ASCAd.getInstance().getVideoFlag()) {
            var callback = function (isEnd) {
                if (isEnd) {
                    this.AddMoneyTipNode.getChildByPath("BG/Logo").active = true
                    this.AddMoneyTipNode.getChildByPath("BG/Logo").getComponent(AnimationComponent).play()
                    this.AddMoneyTipNode.getChildByPath("BG/LogoFrame1").active = false
                    this.scheduleOnce(() => {
                        this.AddMoneyTipNode.getComponent(GlodEffect).PalyCionAmin()
                    }, 0.4);
                    this.AddMoneyAD.active = false
                    this.scheduleOnce(() => {
                        this.AddMoneyTipNode.active = false
                        this.moneyLebel.string = Level.getInstance().achievement.money.toString()
                    }, 1.2);
                    Level.getInstance().achievement.money += 100
                    GameStorage.instance().setAchievement(Level.getInstance().achievement)
                    AudioManager.getInstance().playBGM("BGM_main")
                    CustomEventListener.dispatchEvent("onShelter", false)
                    //埋点
                    AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                        name: "广告事件",
                        sceneName: "关卡场景",
                        eventName: "金币礼包",
                    })
                }
                else {
                    this.AddMoneyTipNode.active = false
                    AudioManager.getInstance().playBGM("BGM_main")
                    CustomEventListener.dispatchEvent("showTip", 1)
                }
            }.bind(this)
            //CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
            AudioManager.getInstance().stopBGM()
            ASCAd.getInstance().showVideo(callback)
        }
        //广告没有加载好
        else {
            this.AddMoneyTipNode.active = false
            CustomEventListener.dispatchEvent("showTip", 3)
        }
    }

    OnMoneyBack() {
        this.AddMoneyTipNode.active = false
        CustomEventListener.dispatchEvent("onShelter", false)
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Cancel, {
            name: "按钮事件",
            sceneName: "关卡场景",
            eventName: "金币礼包",
        })
        this.TopTip.getComponent(UIOpacityComponent).opacity = 0
        this.topTipFlag.stop()
    }

    playCoinAnim(num: number, callBack) {
        let node: Node = this.addMoneyNode.parent.getChildByName("CoinAnim")
        //this.addMoneyNode.parent.getComponent()
        node.getChildByName("Label").getComponent(LabelComponent).string = "-" + num.toString()
        this.moneyLebel.string = Level.getInstance().achievement.money.toString()
        cc.tween(node.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.05, { opacity: 255 }, { easing: "sineOut" })
            .to(0.8, { opacity: 255 }, { easing: "sineOut" })
            .to(0.05, { opacity: 0 }, { easing: "sineOut" })
        ).start()
        cc.tween(node).repeat(1, cc.tween()
            .to(0.9, { position: cc.v3(0, -120, 0) }, { easing: "sineOut" })
            .call(() => {
                callBack()
            })
        ).start()
    }

    addMoneyTip() {

        this.topTipFlag = cc.tween(this.TopTip.getComponent(UIOpacityComponent))
            .call(() => {
                this.TopTip.active = true
            })
            .to(0.1, { opacity: 255 }, { easing: "sineOut" })
            .call(() => {
                this.AddMoney()
            })
            .to(1, { opacity: 255 }, { easing: "sineOut" })
            .to(1.5, { opacity: 0 }, { easing: "sineOut" })
            .call(() => { this.TopTip.active = false })
            .start()
    }


    /**
 * 根据节点名字获取UI节点
 * @param nodeName 节点名字
 */
    getUiNode(nodeName: string): Node {
        if (this.NodeDic.has(nodeName)) {
            return this.NodeDic.get(nodeName)
        }
        console.error("没有这个Node:" + nodeName)
        return null
    }

    /**
     * 遍历指定UI节点，将所有节点存储在map以便后续获取
     * @param node 节点
     */
    traverseNode(node: Node): void {
        node.children.forEach(element => {
            this.NodeDic.set(element.name, element)
            this.traverseNode(element)
        })
    }

}
