import { _decorator, Node, instantiate, Vec3, ModelComponent, loader, Prefab, UITransformComponent, UIModelComponent, ContainerStrategy, ToggleComponent, ToggleContainerComponent, find, size, AnimationComponent, director, ScrollViewComponent, ProgressBarComponent, LabelComponent, SpriteComponent, UIOpacityComponent, SpriteFrame, Material, Color, CCObject, Vec2, CameraComponent} from 'cc';
import { UIBase } from './UIBase';
import { Slot } from '../Slot';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants, LevelInfo } from '../Constants';
import { Model } from '../Model';
import { Level } from '../Level';
import { AudioManager } from '../AudioManager';
import { GameStorage } from '../GameStorage';
import { CameraCtrl } from '../CameraCtrl';
import { ResMgr } from '../ResMgr';
import { GameData } from '../GameData';
import { PrefabsMgr } from '../PrefabsMgr';
import { FireBGFade } from '../Effect/FireBGFade';
import { GlodEffect } from '../Effect/GlodEffect';
import ASCAd from '../ADPlugin/ASCAd';
import { GameManager } from '../GameManager';
import { Achievement } from '../Achievement';
import { FinishBGEffect } from '../Effect/FinishBGEffect';
import AnalyticsManager, { EAnalyticsEvent } from '../Manager/AnalyticsManager';
import { GameModeManager } from '../GameModeManager';
const { ccclass } = _decorator;

@ccclass('GameUI')
export class GameUI extends UIBase {

    /**格子列表节点 */
    private itemSlotNode:Node = null
    /**ToggleContainer节点 */
    private ToggleContainer:Node = null
    /**第一个Toggle节点 */
    private ToggleNode:Node = null
    /**Toogle绑定Slot */
    private ToggleBindSoltDic :Map<Node,Node> = new Map<Node,Node>();
    /**Toogle绑定Model */
    private ToggleBindModelDic :Map<Node,Node> = new Map<Node,Node>();
    /**翻页目标位置*/
    private moveTarget:Vec3 = new Vec3()
    /**返回主界面的箭头 */
    private backNode:Node = null
    /**触摸移动变化量 */
    private v3:Vec3 = new Vec3()
    /**匹配动画节点 */
    private snapAnim:Node = null
    /**加载动画UI */
    private loadUI:Node = null
    /**左边百分比 */
    private leftProgressLabel:Node = null
    /**完成关卡的粒子特效 */
    private finishParticle:Node = null
    /**下一关卡节点Vivo */
    private nextLevelNodeVivo:Node = null
    /**下一关卡节点Oppo */
    private nextLevelNodeOppo:Node = null
    /**重玩节点 */
    private rePalyNode:Node = null
    /**遮挡 */
    private shelter:Node = null
    /**引导手指1 */
    private finger1:Node = null
    /**引导手指2 */
    private finger2:Node = null
    /**引导词 */
    private guideLetter:Node =  null
    /**引导展示的模型节点 */
    private showModel:Node = null
    /**是否已经显示过加载UI界面 */
    private hadShowLoadUI:boolean = false
    /**加载进度条 */
    private LoadBar:ProgressBarComponent = null
    /**计时器 */
    private timer:number = 0
    /**结算页面 */
    private settlePage:Node = null
    /**在结算页面的返回主页面节点 */
    private backToMianInSettle:Node = null
    /**在结算页面的重玩按钮 */
    private rePlayInSettle:Node = null
    /**看视频双倍奖励 */
    private doubleRewardVivo:Node = null
    /**看视频双倍奖励 */
    private doubleRewardOppo:Node = null
    /**看视频双倍奖励 */
    private receiveRewardVivo:Node = null
    /**看视频双倍奖励 */
    private receiveRewardOppo:Node = null

    /**当前金币 */
    private currentMoneyLabel:LabelComponent = null

    private levelSpriteInSettle:SpriteComponent = null

    private levelLabelInSettle:LabelComponent = null

    private AddMoneyNode:Node = null
    /**看广告加钱提示 */
    private AddMoneyTipNode:Node = null
    /**看广告加钱按钮 */
    private AddMoneyAD:Node = null
    /**加钱放回按钮 */
    private AddMoneyBack:Node = null


    private tip :Node = null

    private specialLevelTip:Node = null

    private specialLevelRefuse:Node = null

    private backInSettle:Node = null

    /**提示按钮 */
    private promptButton:Node = null
    /**被选中的UI模型 */
    private sellectModelUI:Node = null
    /**被选中的模型 */
    public sellectMode:Node = null
    /**选中模型的遮罩 */
    private sellectMask:Node = null

    public isPromotying:boolean = false

    private addDestopButton:Node = null
    
    public promotyList:Array<any> = new Array<any>()
    /**已经提示过的节点 */
    private hasPromotyList:Array<Node> = new Array<Node>()

    /**恢复视野按钮 */
    private recoverViweButton:Node = null
    /**查看模型按钮 */
    private viewLevelModelButton:Node = null    

    /**模型的图片 */
    private viewLevelModel:Node = null
    /**展示页 */
    private showContinuePage:Node = null
    /**继续按钮 */
    private showPageContinueButton:Node = null


    private hadFinishLevel:boolean = false

    private firstIntiSettlePage:boolean = true

    private showPageState:boolean = false

    private settlePageState:boolean = false

   









    onLoad()
    {

        CustomEventListener.on(Constants.EventName.ALLOT_MODEL,this.addItemToSlot,this)
        CustomEventListener.on(Constants.EventName.ALLOT_SUBMODEL,this.addSubItemToSlot,this)
        CustomEventListener.on(Constants.EventName.SWITCH_SLOT,this.switchTogglebyNode,this)
        CustomEventListener.on(Constants.EventName.SHOW_TICK,this.showTick,this)
        CustomEventListener.on(Constants.EventName.FINISH_LEVEL,this.finishLevel,this)
        CustomEventListener.on(Constants.EventName.PLAY_SNAP_ANIM,this.playSnapAnim,this)
        CustomEventListener.on(Constants.EventName.RECOVER_DATA,this.recoverData,this)
        CustomEventListener.on(Constants.EventName.SWITCH_SELLECT_MODEL,this.switchSellectModel,this)
    }


    start () 
    {
        AudioManager.getInstance().initAudio()
        AudioManager.getInstance().playBGM("BGM_paint")
        GameManager.getInstance().gameUI = this
        super.Init(find("Canvas/GameUI"))
        //判断游戏模式进行初始化
        if(GameModeManager.instance().gameMode === Constants.GameMode.UnCoin)
        {
            this.getUiNode("money").active = false
        }
        //获取组件
        this.itemSlotNode = this.getUiNode("SubSlotList")
        this.ToggleContainer =this.getUiNode("ToggleGroup")
        this.backNode = this.getUiNode("Back")
        this.ToggleNode = this.getUiNode("SlotToggle")
        this.snapAnim = this.getUiNode("Snap")
        this.finishParticle = find("FinishParticle")
        this.nextLevelNodeVivo = this.getUiNode("VivoNextLevel")
        this.nextLevelNodeOppo = this.getUiNode("OppoNextLevel")
        this.rePalyNode = this.getUiNode("Replay")
        this.finger1 = this.getUiNode("Finger1")
        this.finger2 = this.getUiNode("Finger2")
        this.shelter = this.getUiNode("Shelder")
        this.guideLetter = this.getUiNode("GuideLetter")
        this.settlePage = this.getUiNode("SettlePage")
        this.rePlayInSettle = this.getUiNode("ReplayInSettle")
        this.doubleRewardVivo = this.getUiNode("VivodoubleReward")
        this.doubleRewardOppo = this.getUiNode("OppodoubleReward")
        this.receiveRewardVivo = this.getUiNode("VivoReceiveReward")
        this.receiveRewardOppo = this.getUiNode("OppoReceiveReward")
        this.currentMoneyLabel = this.getUiNode("currentMoney").getComponent(LabelComponent)
        this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
        this.levelSpriteInSettle = this.getUiNode("LevelSprite").getComponent(SpriteComponent)
        this.levelLabelInSettle = this.getUiNode("LevelLabel").getComponent(LabelComponent)
        this.tip = this.getUiNode("ADTip")
        //看广告加钱UI
        this.AddMoneyNode  = this.getUiNode("SettleAddMoney")
        this.AddMoneyTipNode = this.getUiNode("AddMoneyTip")
        this.AddMoneyAD = this.getUiNode("MoneyAgree")
        this.AddMoneyBack = this.getUiNode("MoneyBack")
        //看广告加钱时间监听
        this.AddMoneyNode.on(Node.EventType.TOUCH_END,this.AddMoney,this)
        this.AddMoneyAD.on(Node.EventType.TOUCH_END,this.OnAddMoneyAD,this)
        this.AddMoneyBack.on(Node.EventType.TOUCH_END,this.OnMoneyBack,this)

        //解锁特殊关卡Tip
        this.specialLevelTip = this.getUiNode("SpecialLevelTip")
        this.specialLevelRefuse = this.getUiNode("SpecialRefuse")
        this.getUiNode("SpecialADAgree").on(Node.EventType.TOUCH_END,this.SpecialADAgree,this)
        this.getUiNode("SpecialADBack").on(Node.EventType.TOUCH_END,this.SpecialADBack,this)
        this.specialLevelRefuse.on(Node.EventType.TOUCH_END,this.SpecialRefuse,this)

        //提示按钮
        if(GameModeManager.instance().gameMode === Constants.GameMode.Coin)
        {
            this.promptButton = this.getUiNode("PromptButtonCoin")
        }
        else
        {
            this.promptButton = this.getUiNode("PromptButtonAD")
        }
        this.promptButton.on(Node.EventType.TOUCH_END,this.promptButtonShow,this)

        //选中模型的遮罩
        this.sellectMask = this.getUiNode("SellectMask")

        //添加桌面按钮
        this.addDestopButton = this.getUiNode("addDestopButton")
        this.addDestopButton.on(Node.EventType.TOUCH_END,this.onAddDestopButton,this)

        //恢复视野按钮
        this.recoverViweButton = this.getUiNode("RecoverViewButton")
        this.recoverViweButton.on(Node.EventType.TOUCH_END,this.onRecoverView,this)

        //查看模型
        this.viewLevelModelButton = this.getUiNode("ViewLevelModelButton")
        this.viewLevelModelButton.on(Node.EventType.TOUCH_END,this.onViewLevelModelButton,this)
        this.viewLevelModel = this.getUiNode("ViewLevelModelNode")
        this.viewLevelModel.on(Node.EventType.TOUCH_END,this.onViewLevelModelDisableButton,this)

        //拼图完成展示页
        this.showContinuePage = this.getUiNode("ShowPage")
        this.showPageContinueButton = this.getUiNode("ShowPageContinueButton")
        this.showPageContinueButton.on(Node.EventType.TOUCH_END,this.onShowPageContinueButton,this)

        this.moveTarget = this.itemSlotNode.position
        this.addToggleToSubItem(this.ToggleContainer.children[0],this.itemSlotNode)
        
        this.ToggleBindModelDic.set(this.ToggleContainer.children[0],find("ModelNode"))
        this.shelter.on(Node.EventType.TOUCH_START,this.shelterOn,this)
        this.backNode.on(Node.EventType.TOUCH_END,this.backToMainUI,this)
        this.ToggleContainer.on(Node.EventType.TOUCH_START,this.toggleTouchMove,this)
        this.nextLevelNodeVivo.on(Node.EventType.TOUCH_END,this.backToMainUI,this)
        this.nextLevelNodeOppo.on(Node.EventType.TOUCH_END,this.backToMainUI,this)

        this.rePalyNode.on(Node.EventType.TOUCH_END,this.repalyLevel,this)
        this.rePlayInSettle.on(Node.EventType.TOUCH_END,this.repalyLevelInSettle,this)
        this.doubleRewardVivo.on(Node.EventType.TOUCH_END,this.WatchAdDoubleReward,this)
        this.doubleRewardOppo.on(Node.EventType.TOUCH_END,this.WatchAdDoubleReward,this)
        this.receiveRewardVivo.on(Node.EventType.TOUCH_END,this.ReceiveReward,this)
        this.receiveRewardOppo.on(Node.EventType.TOUCH_END,this.ReceiveReward,this)
        this.backInSettle = this.getUiNode("BackInSettle")
        this.backInSettle.on(Node.EventType.TOUCH_END,this.backToMainUI,this)
        
        //隐藏暗色字体
        this.ToggleNode.children[1].active = false
        if(!Level.getInstance().gameDate.FinishedLevel)
        {
            this.getUiNode("SlotTap").active = true
            this.getUiNode("SlotList").active = true
            find("FinishBG").active = false
            this.promptButton.active = true
            this.recoverViweButton.active = true
            this.viewLevelModelButton.active = true
            this.getUiNode("TopBG").active = true
        }
        else
        {
            find("FinishBG").getComponent(ModelComponent).material.setProperty("mainColor",Level.getInstance().BGColor)
            find("FinishBG").active = true
        }        
        this.scheduleOnce(() => {
            this.guideProgress()
        }, 2.5)

        //原生Icon
        ASCAd.getInstance().hideNativeIcon()
        if(ASCAd.getInstance().getNativeIconFlag())
        {
            ASCAd.getInstance().showNativeIcon(128, 128, (-cc.winSize.width+128)/2+35,(cc.winSize.height-128)/2-200)
        }
        //展示广告
        ASCAd.getInstance().hideBanner()
        ASCAd.getInstance().showBanner()
        //隐藏结算互推
        ASCAd.getInstance().hideNavigateSettle()
        //获取是否可以添加桌面
        var callback = function(success){
            console.log('getDeskTopFlag',success)
            if(success)
            {
                console.info("可以添加图标")
                this.addDestopButton.active = true
            }
        }.bind(this);
        ASCAd.getInstance().getDeskTopFlag(callback);
        this.hadFinishLevel = GameStorage.instance().getGameData(Level.getInstance().modeleName).hadfinishedLevel
        if(!this.hadFinishLevel)
        {
            // AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            //     name: "计数事件",
            //     info: {
            //         "eventName": "进入关卡",
            //     }
            // });
        }
        console.info("是否完成过"+this.hadFinishLevel)
    }

    /**
     *  给格子添加模型
     * @param node 要添加模型
     */
    public addItemToSlot(node:Node,ItemSlot:Node = this.itemSlotNode):void{
        //是水模型，不进行处理
        if(node.name.indexOf("water") !== -1)
        return
        //如果不是第一次打开且模型已经匹配过了，不把他放进格子
        if(Level.getInstance().gameDate.openCount !== 0)
        {
            if(!Level.getInstance().gameDate.MatchedItem.has(node.name))
            {
                node.getComponent(Model).isMacthed = true
                node.getComponent(Model).phongMat()
                return
            }
        }

        //关卡第一次打开的话，合计模型个数
        if(Level.getInstance().gameDate.openCount === 0)
        {
            Level.getInstance().gameDate.TotalCount++
            Level.getInstance().gameDate.MatchedItem.set(node.name,false)
        }
        let slotModel:Node = instantiate(node)
        slotModel.setRotation(node.worldRotation)
        //找到模型节点，对模型进行初始化
        let itemSize = node.getComponent(Model).getModelSize
        var a = new Vec3()
        Vec3.subtract(a,node.worldPosition,node.getComponent(Model).centerPiont)
        let slot:Node = instantiate(ResMgr.Instance.getAsset("Slot"))
        //let slot:Node = instantiate(ResMgr.Instance.getAsset("Slot"))
        slot.setParent(find("view/ItemSlot",ItemSlot)) 
        slotModel.setParent(slot)
        //判断是否是有子模型的模型
        if(node.name.indexOf("sub") !== -1 || node.name.indexOf("Sub") !== -1)
        {
            //是不是第一次打开，如果不是，判断模型的子模型是否已经完成匹配，如果完成了，恢复为SlolMat
            if(Level.getInstance().gameDate.openCount !== 0)
            {
                var needSubMatch:boolean = false
                node.children.forEach(element => {
                    if(Level.getInstance().gameDate.MatchedItem.has(element.name))
                    {
                        //console.info("需要进行子匹配")
                        needSubMatch = true
                    }
                })
                if(!needSubMatch)
                {
                    slotModel.getComponent(Model).needSubMatch = false
                    node.getComponent(Model).needSubMatch = false
                    slotModel.getComponent(Model).slotMat()
                }
                else
                {
                    slotModel.getComponent(Model).needSubMatch = true
                    node.getComponent(Model).needSubMatch = true
                    slotModel.getComponent(Model).unMatchMat()
                }
            }
        }
            
        slotModel.children.forEach(element => {
            element.addComponent(UITransformComponent)
            element.addComponent(UIModelComponent)
        })
        slotModel.addComponent(UITransformComponent)
        slotModel.addComponent(UIModelComponent)
        let scale = 200/itemSize*node.scale.x*node.parent.scale.x
        slotModel.setScale(new Vec3(scale,scale,scale))
        slot.addComponent(Slot)
        slot.getComponent(Slot).targetItem = node
        //setTimeout(() => {Level.getInstance().LoadedModelCount++}, 2000)//})
        Level.getInstance().LoadedModelCount++
        node.getComponent(Model).initMat()
    }

    /**给格子添加子模型 */
    public addSubItemToSlot(node:Node):void{
        let ItemSlot = instantiate(ResMgr.Instance.getAsset("SubSlotList"))
        //let ItemSlot = instantiate(ResMgr.Instance.getAsset("SubSlotList"))
        ItemSlot.setParent(this.getUiNode("SlotList"))
        node.children.forEach(element => {
            this.addItemToSlot(element,ItemSlot)
        })
        let SlotToggle:Node = instantiate(ResMgr.Instance.getAsset("SlotToggle"))
        SlotToggle.setParent(this.ToggleContainer)
        this.addToggleToSubItem(SlotToggle,ItemSlot)
        this.ToggleBindModelDic.set(SlotToggle,node)
        SlotToggle.children[1].getComponent(LabelComponent).string = this.getLettersByNumber((SlotToggle.parent.children.length-1))
        SlotToggle.children[0].children[0].getComponent(LabelComponent).string = this.getLettersByNumber((SlotToggle.parent.children.length-1))
        node.getComponent(Model).subSlot = ItemSlot
        //如果不是第一次打开，看这个模型的子模型是否都全部拼凑好，如果是，把绿色对勾打上
        if(Level.getInstance().gameDate.openCount !== 0)
        {
            SlotToggle.children[2].active = true
            node.children.forEach(element => {
                if(Level.getInstance().gameDate.MatchedItem.has(element.name))
                {
                    SlotToggle.children[2].active = false
                }
            })
        }
        ItemSlot.active = false
    }

    private addToggleToSubItem(toggleNode:Node,subSlotNode:Node)
    {
        this.ToggleBindSoltDic.set(toggleNode,subSlotNode)
        toggleNode.getComponent(ToggleComponent).toggleGroup = this.ToggleContainer.getComponent(ToggleContainerComponent)
        toggleNode.on(Node.EventType.TOUCH_END,this.switchToggle,this)
    }

    /**切换格子显示 */
    private switchToggle()
    {
        
        AudioManager.getInstance().playSound("Click_01")
        setTimeout(() => {
            this.ToggleBindSoltDic.forEach((value,key) => { 
                if(key.getComponent(ToggleComponent).isChecked)
                {
                    setTimeout(() => {
                        value.active = true
                    }, 200)
                    key.children[1].active = false
                    //缓动动画
                    // cc.tween(value.getComponent(UIOpacityComponent))
                    // .to(0.01, { opacity: 0 })
                    // .to(0.6, { opacity: 255 })
                    // .start()
                    this.itemSlotNode = value
                    
                    this.moveTarget = value.position
                    cc.tween(key)
                        .to(0.05,{scale:cc.v3(1.15,1.15,1.15)},{easing:"sineOut"})
                        .to(0.05,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
                        .start()
                    CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_VIEW,this.ToggleBindModelDic.get(key))
                    CustomEventListener.dispatchEvent(Constants.EventName.DISABLE_NODE,this.ToggleBindModelDic.get(key))

                    if(this.ToggleBindModelDic.get(key).name!=="ModelNode")
                    {
                        find(this.ToggleBindModelDic.get(key).name,find(Level.getInstance().modelNode)).children.forEach
                        (element =>
                        {
                          //  console.info(element.name)
                          //  console.info(element.getComponent(Model).isMacthed)
                            if(element.getComponent(Model).isMacthed)
                            {
                                element.getComponent(Model).phongMat()
                            }
                            else
                            {
                              //  console.info("我初始化了材质")
                                if(element.name.indexOf("water") !== -1)
                                {

                                }
                                else
                                {
                                    element.getComponent(Model).initMat()
                                }
                            }
                        })
                    }
                    else
                    {
                        find(Level.getInstance().modelNode).children.forEach
                        (element =>
                        {
                          //  console.info(element.name)
                          //  console.info(element.getComponent(Model).isMacthed)
                            if(element.getComponent(Model).isMacthed)
                            {
                                element.getComponent(Model).phongMat()
                            }
                            else
                            {
                                if(element.name.indexOf("water") !== -1)
                                {

                                }
                                else
                                {
                                    element.getComponent(Model).initMat()
                                }
                            }
                        })
                    }
                }
                else
                {
                    value.active = false
                    key.children[1].active = true
                }
                setTimeout(()=>{
                    CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)
                    this.toggleSwitchSellectModel()
                },210) 
            })
        }, 200)

    }


    private switchTogglebyNode(node:Node)
    {
        if(this.itemSlotNode.uuid === node.uuid)
        {
            return
        }
        AudioManager.getInstance().playSound("Click_01")
        setTimeout(() => {
        this.ToggleBindSoltDic.forEach((value,key) => { 
            if(value.uuid === node.uuid)
            {
                key.getComponent(ToggleComponent).check()
                cc.tween(key)
                .to(0.05,{scale:cc.v3(0.9,0.9,0.9)},{easing:"sineOut"})
                .to(0.05,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
                .start()
                this.itemSlotNode = value
                
              //  console.info(this.itemSlotNode)
                this.moveTarget = value.position
                setTimeout(() => {
                    value.active = true
                }, 200)
                key.children[1].active = false

                //缓动动画
                // cc.tween(value.getComponent(UIOpacityComponent))
                // .to(0.01, { opacity: 0 })
                // .to(0.6, { opacity: 255 })
                // .start()
                CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_VIEW,this.ToggleBindModelDic.get(key))
                CustomEventListener.dispatchEvent(Constants.EventName.DISABLE_NODE,this.ToggleBindModelDic.get(key))
                if(this.ToggleBindModelDic.get(key).name!=="ModelNode")
                {
                  //  console.info(this.ToggleBindModelDic.get(key).name)
                  //  console.info(find(Level.getInstance().modelNode))
                    find(this.ToggleBindModelDic.get(key).name,find(Level.getInstance().modelNode)).children.forEach
                    (element =>
                    {
                       // console.info(element.getComponent(Model).isMacthed)
                        if(element.getComponent(Model).isMacthed)
                        {
                            element.getComponent(Model).phongMat()
                        }
                        else
                        {
                            if(element.name.indexOf("water") !== -1)
                            {

                            }
                            else
                            {
                                element.getComponent(Model).initMat()
                            }                        
                        }
                    })
                }
                else
                {
                    find(Level.getInstance().modelNode).children.forEach
                    (element =>
                    {
                      //  console.info(element.name)
                      //  console.info(element.getComponent(Model).isMacthed)
                        if(element.getComponent(Model).isMacthed)
                        {
                            element.getComponent(Model).phongMat()
                        }
                        else
                        {
                            if(element.name.indexOf("water") !== -1)
                            {

                            }
                            else
                            {
                                element.getComponent(Model).initMat()
                            }                        
                        }
                    })
                }
            }
            else
            {
                value.active =false
                key.children[1].active = true
            }
        })
        setTimeout(()=>{
            CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)
            this.toggleSwitchSellectModel()
        },210) 
    }, 200)
    }

    private backToMainUI()
    {
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Cancel, {
            name: "关卡事件",
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
            progress: (Level.getInstance().gameDate.MatchCount/Level.getInstance().gameDate.TotalCount).toFixed(2),
        })
        //隐藏结算互推
        ASCAd.getInstance().hideNavigateSettle()
        Level.getInstance().gameDate.isUnLock = true
        GameStorage.instance().saveGameData(Level.getInstance().modeleName,Level.getInstance().gameDate)
        this.shelter.active = true
        AudioManager.getInstance().stopBGM()
        AudioManager.getInstance().playSound("Click_01")
        let showIndex = GameStorage.instance().getCurrentLevelIndex()-1
        if(showIndex<0)
        {
            showIndex = 0
        }
        console.info("预加载"+Constants.levelInfo.Level[showIndex].level)
        var callback = function()
        {
            director.loadScene("MainScene")
        }
        ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[showIndex].level,Prefab,callback)
    }

    shelterOn(){}
    onShelter(state){
       
        this.shelter.active = state
    }

    /**隐藏面板*/
    Hide():void{

        this.getUiNode("ToggleGroup").active = true
        this.getUiNode("SlotList").children.forEach(element =>
            {
                element.destroy() 
            })
        find("Canvas/GameUI/SlotTap/view/ToggleGroup").children.forEach(element =>
            {
                if(element.name === "SlotToggle")
                {
                    element.destroy()
                    this.ToggleBindSoltDic.delete(element)
                    this.ToggleBindModelDic.delete(element)
                }
            })
        let itemSlot =  instantiate(ResMgr.Instance.getAsset("SubSlotList"))
        itemSlot.setParent(this.getUiNode("SlotList"))
        this.itemSlotNode = itemSlot
        let slotToggle = instantiate(ResMgr.Instance.getAsset("SlotToggle"))
        slotToggle.setParent(find("Canvas/GameUI/SlotTap/view/ToggleGroup"))
        this.ToggleNode = slotToggle
        this.addToggleToSubItem(this.ToggleNode,this.itemSlotNode)
        this.ToggleBindModelDic.set(this.ToggleNode,find("ModelNode"))
        this.node.active = false
    }

    /**显示面板*/
    Show(topUi:UIBase):void{
        if(topUi !== null)
        {
            topUi.Hide()
        }
        setTimeout(() => {this.node.active = true},2000)
    }

    toggleTouchMove(e)
    {
        e.getDelta(this.v3)
        this.ToggleContainer.setWorldPosition(this.ToggleContainer.worldPosition.x+this.v3.x,this.ToggleContainer.worldPosition.y ,this.ToggleContainer.worldPosition.z)
    }


    showTick(node:Node)
    {
        this.ToggleBindSoltDic.forEach((value,key) => { 
          //  console.info(value)
            if(value === node)
            {
                key.children[2].active = true
            }
        })
    }

    finishLevel(isFirstFinish:boolean)
    {
        this.finger1.active = false
        this.finger2.active = false
        this.guideLetter.active = false
        this.promptButton.active = false
        this.recoverViweButton.active = false
        this.viewLevelModelButton.active = false
        //this.viewLevelModelButton.active = false
        //如果是第一次完成关卡
        if(isFirstFinish)
        {
            //埋点
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "关卡事件",
                subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                level: Level.getInstance().levelIndex,
            })
            CustomEventListener.dispatchEvent(Constants.EventName.ROTATE_X,true)
            //隐藏原生Icon
            ASCAd.getInstance().hideNativeIcon()
            let finishBg =  find("FinishBG")
            find("FinishBGFire").active = true  
            find("BottomCamera").getComponent(CameraComponent).clearColor = cc.color(0,0,0)
            find("FinishBGFire").addComponent(FireBGFade)
            this.getUiNode("SlotTap").active = false
            this.getUiNode("SlotList").active = false
            this.getUiNode('ButtomBG').active = false
            this.getUiNode("TopBG").active = false
            this.promptButton.active = false
            this.addDestopButton.active = false
            this.finishParticle.active = true
            this.backNode.active = false
            this.rePalyNode.active = false
            this.AddMoneyNode.parent.active = false
            if(Level.getInstance().gameDate.hadfinishedLevel)
            {
                this.receiveRewardOppo.active = false
                this.receiveRewardVivo.active = false
                this.settlePage.getChildByName("ReplayRewardTip").active = true
                this.showNextLevelNode()
            }
            
            this.settlePage.getChildByName("VivoLayout").active = true
            cc.tween(this.doubleRewardVivo).repeatForever(cc.tween()
            .to(0.5,{scale:cc.v3(0.73,0.73,0.73)},{easing:"sineOut"})
            .to(0.5,{scale:cc.v3(0.7,0.7,0.7)},{easing:"sineIn"})
            ).start()
        
        if(Level.getInstance().levelIndex >= Constants.levelInfo.Level.length)
        {
            this.nextLevelNodeVivo.active =false
        }

        Level.getInstance().gameDate.hadfinishedLevel = true
        GameStorage.instance().saveGameData(Level.getInstance().modeleName,Level.getInstance().gameDate)
            this.scheduleOnce(() => {
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                    name: "场景事件",
                    eventName: "模型展示",
                    subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                    level: Level.getInstance().levelIndex,
                })
                this.showContinuePage.active = true
                this.recoverViweButton.active = true
                let finishBg = find("FinishBG")
                finishBg.addComponent(FinishBGEffect)
                finishBg.active = true
            }, 5.5)
        }
        else
        {
            //this.rePalyNode.setPosition(0,this.rePalyNode.position.y,this.rePalyNode.position.z)
            this.rePalyNode.active = true
            this.recoverViweButton.active = true
            let finishBg =  find("FinishBG")
            finishBg.getComponent(ModelComponent).material.setProperty("mainColor",Level.getInstance().BGColor)
            finishBg.active = true
            this.getUiNode("SlotTap").active = false
            this.getUiNode("SlotList").active = false
            this.getUiNode('ButtomBG').active = false
            //this.progressBar.active = false
        }

        // //埋点
        // if(Constants.levelInfo.Level[Level.getInstance().levelIndex+1])
        // {

        // }
        this.countLevelEvent()
    }

    playSnapAnim(pos:Vec3)
    {
        let winSize = cc.view.getFrameSize()
        let i = Math.floor(Math.random() * Math.floor(2))
        //this.snapAnim.setPosition(new Vec3(pos.x/2,pos.y/2,0))
        this.snapAnim.setPosition(new Vec3(pos.x/winSize.width*720-340,pos.y/winSize.height*1280-620,0))
        this.snapAnim.children[i].active = true
        this.snapAnim.children[i].getComponent(AnimationComponent).play()
        this.scheduleOnce(() => {
            if(this.snapAnim.children[i])
            {
                this.snapAnim.children[i].active = false
            }
            }, 1)
    }

    onDestroy()
    {
        super.onDestroy()
        CustomEventListener.off(Constants.EventName.ALLOT_MODEL,this.addItemToSlot,this)
        CustomEventListener.off(Constants.EventName.ALLOT_SUBMODEL,this.addSubItemToSlot,this)
        CustomEventListener.off(Constants.EventName.SWITCH_SLOT,this.switchTogglebyNode,this)
        CustomEventListener.off(Constants.EventName.SHOW_TICK,this.showTick,this)
        CustomEventListener.off(Constants.EventName.FINISH_LEVEL,this.finishLevel,this)
        CustomEventListener.off(Constants.EventName.PLAY_SNAP_ANIM,this.playSnapAnim,this)
        //CustomEventListener.off(Constants.EventName.ADD_PROGRESS_BAR,this.addProgressBar,this)
        CustomEventListener.off(Constants.EventName.RECOVER_DATA,this.recoverData,this)
        CustomEventListener.off(Constants.EventName.SWITCH_SELLECT_MODEL,this.switchSellectModel,this)

    }


    // addProgressBar()
    // {
    //     this.progressBar.getComponent(ProgressBarComponent).progress = (Level.getInstance().gameDate.MatchCount/Level.getInstance().gameDate.TotalCount)
    //     this.BarLabel.getComponent(LabelComponent).string =  (this.progressBar.getComponent(ProgressBarComponent).progress*100).toFixed(0)+"%"
    //     this.leftProgressLabel.getComponent(LabelComponent).string  =  (this.progressBar.getComponent(ProgressBarComponent).progress*100).toFixed(0)
    // }

    recoverData()
    {
        //先从子模型开始
        this.getUiNode("SlotList").children.forEach(element => {
            if(element.uuid !== this.getUiNode("SlotList").children[0].uuid)
            {
                var i = element.children[1].children[0].children.length
                element.children[1].children[0].children.forEach(slot=>{
                    if(!Level.getInstance().gameDate.MatchedItem.has(slot.getComponent(Slot).targetItem.name))
                    {
                        i--
                        slot.getComponent(Slot).targetItem.getComponent(Model).isMacthed = true
                         
                        if(i === 1)
                        {
                            CustomEventListener.dispatchEvent(Constants.EventName.SHOW_TICK,slot.parent.parent.parent)
                            find("Canvas/GameUI/SlotList/SubSlotList/view/ItemSlot").children.forEach(ele => {
                                if(ele.children[0].name === slot.getComponent(Slot).targetItem.parent.name)
                                {
                                    slot.getComponent(Slot).targetItem.parent.getComponent(Model).needSubMatch = false
                                }
                            })
                        }
                        slot.destroy()
                        Level.getInstance().recoveredModelCount++
                    }
                })
            }
        })
        //恢复没有子模型的模型
        find("Canvas/GameUI/SlotList/SubSlotList/view/ItemSlot").children.forEach(element=>{
            if(!Level.getInstance().gameDate.MatchedItem.has(element.getComponent(Slot).targetItem.name))
            {
                element.getComponent(Slot).targetItem.getComponent(Model).phongMat()
                element.getComponent(Slot).targetItem.getComponent(Model).isMacthed =true
                element.destroy()
                Level.getInstance().recoveredModelCount++
            }
            else
            {
                if(!element.getComponent(Slot).targetItem.getComponent(Model).needSubMatch)
                {
                    element.children[0].getComponent(Model).slotMat()
                }
            }
        })
        //this.addProgressBar()
        //this.loadUI.active = false
        this.hadShowLoadUI = true
        AudioManager.getInstance().playBGM("BGM_paint")
        setTimeout(()=>{CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)},60)
        if(Level.getInstance().gameDate.FinishedLevel)
        {
            let finishBg =  find("FinishBG")
            loader.loadRes("Mat/BGMat/"+Level.getInstance().modeleName,Material,(err:any,mat:Material)=>{ 
                finishBg.getComponent(ModelComponent).material.setProperty("mainColor",Level.getInstance().BGColor)
                finishBg.active = true
            })
            this.getUiNode("SlotTap").active = false
            this.getUiNode("SlotList").active = false
        }
    }


    loadNextLevel()
    {

        let type:string  = null
        if(this.hadFinishLevel)
        {
            type = "重玩"
        }
        else
        {
            type = "首玩"
        }
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "结算场景",
            eventName: "下一关",
            type:type,
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
        });

        //隐藏结算互推
        ASCAd.getInstance().hideNavigateSettle()
        this.onShelter(true)
        AudioManager.getInstance().playSound("Click_01")
        GameStorage.instance().saveGameData(Level.getInstance().modeleName,Level.getInstance().gameDate)
        //判断下一关是否是特殊关卡
        let numLevel = Level.getInstance().levelIndex+1//(Number(Level.getInstance().modeleName.slice(4)))

        if(numLevel < Constants.levelInfo.Level.length)
        {
            let tempGameData:GameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[numLevel].level)
            if(Constants.levelInfo.Level[numLevel].isSpecial && !Constants.levelInfo.Level[numLevel].isFree && !tempGameData.isUnLock)
            {
                this.showSpecialTip()
            }
            else
            {
                Level.getInstance().levelName = Constants.levelInfo.Level[numLevel].levelName
                Level.getInstance().cameraOrthoHeight = Constants.levelInfo.Level[numLevel].orthoHeight
                Level.getInstance().BGColor = Constants.levelInfo.Level[numLevel].BGColor
                Level.getInstance().levelStar = Constants.levelInfo.Level[numLevel].star
                Level.getInstance().modeleName = Constants.levelInfo.Level[numLevel].level//Level.getInstance().modeleName.slice(0,4)+ (Number(Level.getInstance().modeleName.slice(4))+1).toString()
                Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
                Level.getInstance().levelIndex = numLevel
                Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[numLevel].sprite)
                director.loadScene("GameScene")
            }
        }
    }

    repalyLevel()
    {
        
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "计数事件",
            eventName: "重玩关卡",
        })

        //隐藏结算互推
        ASCAd.getInstance().hideNavigateSettle()
        AudioManager.getInstance().playSound("Click_01")
        Level.getInstance().gameDate = new GameData()
        Level.getInstance().gameDate.Level = Level.getInstance().modeleName
        Level.getInstance().gameDate.isUnLock = true
        Level.getInstance().gameDate.hadfinishedLevel = true
        director.loadScene("GameScene")
    }

    
    repalyLevelInSettle()
    {
        let type:string  = null
        if(this.hadFinishLevel)
        {
            type = "重玩"
        }
        else
        {
            type = "首玩"
        }

        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "结算场景",
            eventName: "重玩",
            type: type,
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
        })
        
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "计数事件",
            eventName: "重玩关卡",
        })

        //隐藏结算互推
        ASCAd.getInstance().hideNavigateSettle()
        AudioManager.getInstance().playSound("Click_01")
        Level.getInstance().gameDate = new GameData()
        Level.getInstance().gameDate.Level = Level.getInstance().modeleName
        Level.getInstance().gameDate.isUnLock = true
        Level.getInstance().gameDate.hadfinishedLevel = true
        director.loadScene("GameScene")
    }


    guideProgress()
    {
        if(Level.getInstance().gameDate.openCount === 0 && Level.getInstance().levelIndex === 0 && !Level.getInstance().gameDate.hadfinishedLevel)
        {//启用初始关卡引导
            CustomEventListener.on(Constants.EventName.GUIDER_TOW,this.showNextProgress,this)
            if(this.backNode && this.rePalyNode)
            {
                this.backNode.active = false
                this.rePalyNode.active = false
            }
            this.guideLetter.children[0].active = true
            //this.guideLabel.getComponent(LabelComponent).string = "选中你想要拼的物品，往上拖拽"
            cc.tween(this.guideLetter.children[0]).repeat(5,cc.tween()
                .to(0.5,{scale:cc.v3(0.9,0.9,0.9)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
                ).start()
            //找到没有子模型的模型进行指导展示
            let isFound =false
            //let showModel:Node = null
            find("Canvas/GameUI/SlotList").children[0].children[1].children[0].children.forEach(element => {
                if(element.children[0].name.indexOf("sub") === -1 && element.children[0].name.indexOf("Sub") === -1)
                {//找到了子模型
                    if(!isFound)
                    {
                        this.showModel = element
                        isFound = true
                    }
                }
            })
            this.finger1.active = true
            this.finger1.setWorldPosition(this.showModel.worldPosition)
            cc.tween(this.finger1).repeat(5,cc.tween()
                .to(0.5,{worldPosition:this.showModel.worldPosition})
                .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(0.7,0.7,0.7)},{easing:"sineIn"})
                .to(0.5,{worldPosition:cc.v3(this.showModel.worldPosition.x,this.showModel.worldPosition.y+100,this.showModel.worldPosition.z)})
                ).start()
                //this.showModel.on(Node.EventType.TOUCH_START,this.showNextProgress,this)
        }
        if(Level.getInstance().gameDate.openCount === 0 && Level.getInstance().levelIndex === 3 && !Level.getInstance().gameDate.hadfinishedLevel)
        {//启用子模型块引导
            this.guideLetter.children[3].active = true
            //this.guideLabel.getComponent(LabelComponent).string = "先拼子世界，拼子世界它就可以使用了"
            cc.tween(this.guideLetter.children[3]).repeat(5,cc.tween()
                .to(0.5,{scale:cc.v3(0.6,0.6,0.6)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(0.7,0.7,0.7)},{easing:"sineIn"})
                ).start()
             //找到有子模型的模型进行指导展示
             let isFound =false
            find("Canvas/GameUI/SlotList").children[0].children[1].children[0].children.forEach(element => {
                if(element.children[0].name.indexOf("sub") !== -1 || element.children[0].name.indexOf("Sub") !== -1)
                {//找到了子模型
                    if(!isFound)
                    {
                        this.showModel = element
                        isFound = true
                    }
                }
            })
            this.finger1.active = true
            this.finger1.setWorldPosition(this.showModel.worldPosition)
            cc.tween(this.finger1).repeat(2,cc.tween()
                .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(0.7,0.7,0.7)},{easing:"sineIn"})
                ).start()
            this.scheduleOnce(() => {
                this.finger1.active = false
            }, 3)
            this.scheduleOnce(() => {
                this.guideLetter.active = false
                this.backNode.active = true
                this.rePalyNode.active = true
            }, 5)
        }
    }


    showNextProgress(showModel)
    {
        CustomEventListener.off(Constants.EventName.GUIDER_TOW,this.showNextProgress,this)
        this.guideLetter.children[0].active = false
        this.guideLetter.children[1].active = true
        //this.guideLabel.getComponent(LabelComponent).string = "拖拽到对应的模型对齐后放开"
            cc.tween(this.guideLetter.children[1]).repeat(5,cc.tween()
                .to(0.5,{scale:cc.v3(0.9,0.9,0.9)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
                ).start()
        let worldModelPos = CameraCtrl.getInstance().getScreenPos(showModel.getComponent(Slot).targetItem.worldPosition)
        let winSize = cc.view.getFrameSize()
        //this.snapAnim.setPosition(new Vec3(pos.x/2,pos.y/2,0))
        worldModelPos = new Vec3(worldModelPos.x/winSize.width*720-340,worldModelPos.y/winSize.height*1280-620,0)
        cc.tween(this.finger1).repeat(5,cc.tween()
                .to(1,{worldPosition:showModel.worldPosition})
                .to(1,{position:worldModelPos})
                ).start()
        setTimeout(() => {
            this.guideLetter.children[1].active = false
            this.finger1.active = false
        }, 6000)
        setTimeout(() => {
            if(!Level.getInstance().gameDate.FinishedLevel)
            {
                this.finger1.active = true
                this.finger2.active = true
            }
            this.finger2.setScale(cc.v3(0.7,0.7,0.7))
            this.guideLetter.children[2].active = true//.getComponent(LabelComponent).string = "双指放大和缩小"
            //this.guideLabel.active = true
            cc.tween(this.guideLetter.children[2]).repeat(5,cc.tween()
                .to(0.5,{scale:cc.v3(0.9,0.9,0.9)},{easing:"sineOut"})
                .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
                ).start()
            cc.tween(this.finger1).repeat(5,cc.tween()
            .to(1,{position:cc.v3(0,0,0)})
            .to(1,{position:cc.v3(100,0,0)})
            ).start()
            cc.tween(this.finger2).repeat(5,cc.tween()
            .to(1,{position:cc.v3(100,0,0)})
            .to(1,{position:cc.v3(0,0,0)})
            ).start()
        }, 10000)
        setTimeout(() => {
            if(this.finger1)
            {
                this.finger1.active = false 
                this.finger2.active = false
                this.guideLetter.children[2].active = false
                if(!Level.getInstance().gameDate.FinishedLevel)
                {
                    this.backNode.active = true
                    this.rePalyNode.active = true
                }
            }
            
        },15000)
    }
    
    enableSettlePage()
    {
        this.settlePage.active = true
    }

    WatchAdDoubleReward()
    {
        let type:string  = null
        if(this.hadFinishLevel)
        {
            type = "重玩"
        }
        else
        {
            type = "首玩"
        }

        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "结算场景",
            eventName: "视频领取",
            type: type,
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
        })

        AudioManager.getInstance().playSound("Click_01")
        var callback = function(isEnd)
        {
            if(isEnd)
            {
                this.settlePage.getComponent(GlodEffect).PalyCionAmin()
                this.scheduleOnce(() => {
                    this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
                }, 0.8);
                AudioManager.getInstance().playBGM("BGM_paint")
                Level.getInstance().achievement.money += Level.getInstance().rewardMoney*2
                GameStorage.instance().setAchievement(Level.getInstance().achievement)
                this.doubleRewardOppo.active = false
                this.doubleRewardVivo.active = false
                this.receiveRewardOppo.active = false
                this.receiveRewardVivo.active = false
                this.settlePage.getChildByName("ReplayRewardTip").active = false
                this.showNextLevelNode()
                this.settlePage.getChildByName("TopButton").active = true
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                    name: "广告事件",
                    sceneName: "结算场景",
                    eventName: "结算视频领取",
                    type: type,
                    subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                    level: Level.getInstance().levelIndex,
                });
            }
            else
            {
                AudioManager.getInstance().playBGM("BGM_paint")
                this.showTip()
            }            
        }
        if(ASCAd.getInstance().getVideoFlag())
        {
             AudioManager.getInstance().stopBGM()
             ASCAd.getInstance().showVideo(callback.bind(this))
        }
        else
        {
            this.showTip()
        }
    }

    WatchAdReplayReward()
    {
        AudioManager.getInstance().playSound("Click_01")
        var callback = function(isEnd)
        {
            if(isEnd)
            {
                this.settlePage.getComponent(GlodEffect).PalyCionAmin()
                this.scheduleOnce(() => {
                    this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
                }, 0.8);
                AudioManager.getInstance().playBGM("BGM_paint")
                Level.getInstance().achievement.money += Level.getInstance().rewardMoney
                GameStorage.instance().setAchievement(Level.getInstance().achievement)
                //this.rewardLabel.string = (Level.getInstance().rewardMoney).toString()
                this.doubleRewardOppo.active = false
                this.doubleRewardVivo.active = false
                this.settlePage.getChildByName("ReplayRewardTip").active = false
            }
            else
            {
                AudioManager.getInstance().playBGM("BGM_paint")
                this.showTip()
            }
        }
        if(ASCAd.getInstance().getVideoFlag())
        {
             AudioManager.getInstance().stopBGM()
             ASCAd.getInstance().showVideo(callback.bind(this))
        }
        else
        {
            this.showTip()
        }
    }

    getLettersByNumber(num:number)
    {
        var  latter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"]
        return latter[num-1]
    }

    OnAddMoneyAD()
    {
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "游戏场景",
            eventName: "金币礼包",
        })
        if(ASCAd.getInstance().getVideoFlag())
        {
            var callback = function(isEnd)
            {
                if(isEnd)
                {
                    this.scheduleOnce(() => {
                        this.AddMoneyTipNode.getComponent(GlodEffect).PalyCionAmin()
                    }, 0.4);
                    this.AddMoneyTipNode.getChildByPath("BG/Logo").active = true
                    this.AddMoneyTipNode.getChildByPath("BG/Logo").getComponent(AnimationComponent).play()
                    this.AddMoneyTipNode.getChildByPath("BG/LogoFrame1").active = false
                    this.AddMoneyAD.active = false
                    this.scheduleOnce(() => {
                        this.AddMoneyTipNode.active = false
                        this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
                    }, 1.2);
                    Level.getInstance().achievement.money += 100
                    GameStorage.instance().setAchievement(Level.getInstance().achievement)
                    AudioManager.getInstance().playBGM("BGM_paint")
                    this.showContinuePage.active = this.showPageState
                    this.settlePage.active = this.settlePageState
                    //埋点
                    AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                        name: "广告事件",
                        sceneName: "游戏场景",
                        eventName: "金币礼包",
                    });
                }
                else
                {
                    this.AddMoneyTipNode.active = false
                    AudioManager.getInstance().playBGM("BGM_paint")
                    this.showContinuePage.active = this.showPageState
                    this.settlePage.active = this.settlePageState
                    this.showTip()
                }
            }.bind(this)
             AudioManager.getInstance().stopBGM()
             ASCAd.getInstance().showVideo(callback)
        }
        else
        {
            this.AddMoneyTipNode.active = false
            this.showContinuePage.active = this.showPageState
            this.settlePage.active = this.settlePageState
            this.showTip()
        }
    }

    OnMoneyBack()
    {
        this.AddMoneyTipNode.active = false
        this.showContinuePage.active = this.showPageState
        this.settlePage.active = this.settlePageState
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Cancel, {
            name: "按钮事件",
            sceneName: "游戏场景",
            eventName: "金币礼包",
        })
    }

    AddMoney()
    {

        AudioManager.getInstance().playSound("Click_01")
        this.AddMoneyAD.active = true
        this.AddMoneyTipNode.active = true
        this.AddMoneyTipNode.getChildByPath("BG/Logo").active = false
        this.AddMoneyTipNode.getChildByPath("BG/LogoFrame1").active = true
        this.showPageState = this.showContinuePage.active
        this.settlePageState = this.settlePage.active
        this.showContinuePage.active = false
        this.settlePage.active = false
    }

    showTip()
    {
        this.tip.active = true
        this.tip.getChildByName("TipOffButton").on(Node.EventType.TOUCH_END,()=>{
            this.tip.active = false
            this.tip.getChildByName("TipOffButton").off(Node.EventType.TOUCH_END)
        })
    }

    showSpecialTip()
    {
        let gameData:GameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[Level.getInstance().levelIndex+1].level)
        console.info(gameData)
        if(!gameData.isUnLock && !Constants.levelInfo.Level[Level.getInstance().levelIndex+1].isFree)
        {
            let levelName = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].levelName
            let levelSprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[Level.getInstance().levelIndex+1].sprite)
            this.specialLevelTip.getChildByPath("LevelSpriteNode/Logo").getComponent(SpriteComponent).spriteFrame = levelSprite
            this.specialLevelTip.getChildByPath("LevelSpriteNode/Label").getComponent(LabelComponent).string = levelName
            this.shelter.active = true
            this.specialLevelTip.active =true
            this.settlePage.active = false
        }
        else
        {
            Level.getInstance().levelName = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].levelName
            Level.getInstance().cameraOrthoHeight = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].orthoHeight
            Level.getInstance().BGColor = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].BGColor
            Level.getInstance().levelStar = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].star
            Level.getInstance().modeleName = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].level
            Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
            Level.getInstance().levelIndex = Level.getInstance().levelIndex+1
            Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite( Constants.levelInfo.Level[Level.getInstance().levelIndex+1].sprite)
            director.loadScene("GameScene")
        }
    }

    SpecialADAgree()
    {

        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "特殊关卡场景",
            eventName: "视频领取",
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex+1].parent,
            level: Level.getInstance().levelIndex+1,
        });

        AudioManager.getInstance().playSound("Click_01")
        GameStorage.instance().saveGameData(Level.getInstance().modeleName,Level.getInstance().gameDate)
        if(ASCAd.getInstance().getVideoFlag())
        {
            var callback = function(isEnd)
            {
                if(isEnd)
                {
                    AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                        name: "广告事件",
                        sceneName: "特殊关卡场景",
                        eventName: "视频领取",
                        subject: Constants.levelInfo.Level[Level.getInstance().levelIndex+1].parent,
                        level: Level.getInstance().levelIndex+1,
                    });
                    AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                        name: "计数事件",
                        eventName: "解锁关卡",
                        type: "视频",
                    })
                    Level.getInstance().levelName = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].levelName
                    Level.getInstance().cameraOrthoHeight = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].orthoHeight
                    Level.getInstance().BGColor = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].BGColor
                    Level.getInstance().levelStar = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].star
                    Level.getInstance().modeleName = Constants.levelInfo.Level[Level.getInstance().levelIndex+1].level//Level.getInstance().modeleName.slice(0,4)+ (Number(Level.getInstance().modeleName.slice(4))+1).toString()
                    Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
                    Level.getInstance().levelIndex = Level.getInstance().levelIndex+1
                    Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[Level.getInstance().levelIndex+1].sprite)

                    director.loadScene("GameScene")
                }
                else
                {
                    AudioManager.getInstance().playBGM("BGM_paint")
                    this.showSpecialTip()
                    this.showTip()
                }
                //this.specialLevelTip.active = false
                this.shelter.active = false
            }.bind(this)
             AudioManager.getInstance().stopBGM()
             ASCAd.getInstance().showVideo(callback)
        }
        else
        {
            this.shelter.active = false
            this.showSpecialTip()
            this.showTip()
        }
    }
    SpecialADBack()
    {
        this.specialLevelTip.active = false
        this.settlePage.active = true
        this.shelter.active = false
    }

    SpecialRefuse()
    {
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "特殊关卡场景",
            eventName: "跳过",
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex+1].parent,
            level: Level.getInstance().levelIndex+1,
        });
        Level.getInstance().levelName = Constants.levelInfo.Level[Level.getInstance().levelIndex+2].levelName
        Level.getInstance().cameraOrthoHeight = Constants.levelInfo.Level[Level.getInstance().levelIndex+2].orthoHeight
        Level.getInstance().BGColor = Constants.levelInfo.Level[Level.getInstance().levelIndex+2].BGColor
        Level.getInstance().levelStar = Constants.levelInfo.Level[Level.getInstance().levelIndex+2].star
        Level.getInstance().modeleName = Constants.levelInfo.Level[Level.getInstance().levelIndex+2].level
        Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
        Level.getInstance().levelIndex = Level.getInstance().levelIndex+2
        Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[Level.getInstance().levelIndex+2].sprite)
        director.loadScene("GameScene")
    }

    switchSellectModel(modelUI:Node,model:Node)
    {
        if(model !== this.sellectMode)
        {
           GameManager.getInstance().releasePromoty()
        }
        if(this.sellectModelUI)
        {
            this.sellectModelUI.getComponent(Model).recoverUIMat(this.sellectMode)
        }
        this.sellectModelUI = modelUI
        this.sellectMode = model
        this.sellectMask.setParent(modelUI.parent)
        this.sellectMask.setPosition(Vec3.ZERO)
        this.sellectMask.active = true

        if(this.hasPromotyList.indexOf(this.sellectMode) !== -1)
        {
            this.promotyShow()
            this.promotyShowUI()
        }
    }

    offSellectModel()
    {
        this.isPromotying = false
        this.sellectModelUI = null
        this.sellectMode = null
        this.sellectMask.setParent(find("Canvas/GameUI"))
        this.sellectMask.active = false
        GameManager.getInstance().releasePromoty()
    }

    toggleSwitchSellectModel()
    {
        if(this.node)
        {
            this.isPromotying = false
            this.sellectModelUI = null
            this.sellectMode = null
            this.sellectMask.setParent(find("Canvas/GameUI"))
            this.sellectMask.active = false
            GameManager.getInstance().releasePromoty()
            if(this.itemSlotNode.getChildByPath("view/ItemSlot").children.length>0)
            {
                let currentSellcet = this.itemSlotNode.getChildByPath("view/ItemSlot").children[0]
                if(currentSellcet !== null)
                {
                    this.switchSellectModel(currentSellcet.children[0],currentSellcet.getComponent(Slot).targetItem)
                }
            }
        }
    }

    promptButtonShow()
    {
        if(!this.sellectMode)
        {
            return
        }
        if(this.hasPromotyList.indexOf(this.sellectMode) !== -1)
        {
            return
        }

        if(GameModeManager.instance().gameMode === Constants.GameMode.Coin)
        {
            //埋点
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "按钮事件",
                sceneName: "游戏场景",
                eventName: "金币提示",
                subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                level: Level.getInstance().levelIndex,
                component: this.sellectMode.name,
                cost: 50,
            })

            let achievement:Achievement = Level.getInstance().achievement
            if(achievement.money-50 < 0)
            {
                this.AddMoneyAD.active = true
                this.AddMoneyTipNode.active = true
                //埋点
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Fail, {
                    name: "按钮事件",
                    sceneName: "游戏场景",
                    eventName: "金币提示",
                    subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                    level: Level.getInstance().levelIndex,
                    component: this.sellectMode.name,
                })
            }
            else
            {
                GameManager.getInstance().releasePromoty()
                this.isPromotying = true
                if(this.sellectModelUI !== null)
                {
                    if(this.hasPromotyList.indexOf(this.sellectMode) === -1)
                    {
                        this.hasPromotyList.push(this.sellectMode)
                        achievement.money -= 50
                        this.playCoinAnim(50)
                        GameStorage.instance().setAchievement(achievement) 
                    }
                    this.sellectMode.parent.children.forEach(element => {
                        if(element !== this.sellectMode && element.name.indexOf("water") === -1)
                        {
                            element.getComponent(Model).transParentFakeIn()
                        }
                        if(element === this.sellectMode)
                        {
                            element.getComponent(Model).PromotyEffect()
                        }
                    })
                    this.sellectModelUI.getComponent(Model).PromotyEffect()
                }
            }  
        }
        else
        {
            //埋点
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "按钮事件",
                sceneName: "游戏场景",
                eventName: "视频提示",
                subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                level: Level.getInstance().levelIndex,
                component: this.sellectMode.name,
            })
            if(ASCAd.getInstance().getVideoFlag())
            {
                var callback = function(isEnd)
                {
                    if(isEnd)
                    {
                        //埋点
                        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                            name: "广告事件",
                            sceneName: "游戏场景",
                            eventName: "视频提示",
                            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                            level: Level.getInstance().levelIndex,
                            component: this.sellectMode.name,
                        })
                        GameManager.getInstance().releasePromoty()
                        this.isPromotying = true
                        if(this.sellectModelUI !== null)
                        {
                            if(this.hasPromotyList.indexOf(this.sellectMode) === -1)
                            {
                                this.hasPromotyList.push(this.sellectMode)
                            }
                            this.sellectMode.parent.children.forEach(element => {
                                if(element !== this.sellectMode && element.name.indexOf("water") === -1)
                                {
                                    element.getComponent(Model).transParentFakeIn()
                                }
                                if(element === this.sellectMode)
                                {
                                    element.getComponent(Model).PromotyEffect()
                                }
                            })

                            this.sellectModelUI.getComponent(Model).PromotyEffect()
        
                        }
                    }
                    else
                    {
                        //埋点
                        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Fail, {
                            name: "广告事件",
                            sceneName: "游戏场景",
                            eventName: "视频提示",
                            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                            level: Level.getInstance().levelIndex,
                            component: this.sellectMode.name,
                        })
                        this.showTip()
                    }
                    AudioManager.getInstance().playBGM("BGM_paint")
                }.bind(this)
                AudioManager.getInstance().stopBGM()
                ASCAd.getInstance().showVideo(callback)
            }
            else
            {
                //埋点
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Fail, {
                    name: "广告事件",
                    sceneName: "游戏场景",
                    eventName: "视频提示",
                    subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                    level: Level.getInstance().levelIndex,
                    component: this.sellectMode.name,
                })
                this.showTip()
            }
        }
    }

    promotyShow()
    {
        GameManager.getInstance().releasePromoty()
        this.isPromotying = true
        if(this.sellectModelUI !== null)
        {
            if(this.hasPromotyList.indexOf(this.sellectMode) === -1)
            {
                this.hasPromotyList.push(this.sellectMode)
            }
            this.sellectMode.parent.children.forEach(element => {
                if(element !== this.sellectMode && element.name.indexOf("water") === -1)
                {
                    element.getComponent(Model).transParentFakeIn()
                }
                if(element === this.sellectMode)
                {
                    element.getComponent(Model).PromotyEffect()
                }
            })
        }
    }

    promotyShowUI()
    {
        if(this.sellectModelUI !== null)
        {
            this.sellectModelUI.getComponent(Model).PromotyEffect()
        }
    }

    updatePromotyButton()
    {
        let AdICon = this.promptButton.getChildByName("ADIcon")
        let promotyCountLabel:LabelComponent = this.promptButton.getChildByName("Label").getComponent(LabelComponent)
        let achievement:Achievement = GameStorage.instance().getAchievement()
        console.info(achievement)
        if(achievement.promotyCount<=0)
        {
            promotyCountLabel.string = ""
            AdICon.active = true
        }
        else
        {
            promotyCountLabel.string = achievement.promotyCount.toString()
            AdICon.active = false
        }
    }

    onAddDestopButton()
    {

        var callback_sub = function(success){
            if(success)
            {
                Level.getInstance().achievement.money += 100
                GameStorage.instance().setAchievement(Level.getInstance().achievement)
                let node:Node = this.addDestopButton.getChildByName("Coin")
                cc.tween(node.getComponent(UIOpacityComponent)).repeat(1,cc.tween()
                .to(0.3,{opacity:255},{easing:"sineOut"})
                .to(0.3,{opacity:255},{easing:"sineOut"})
                .to(0.3,{opacity:0},{easing:"sineOut"})
                ).start()
                cc.tween(node).repeat(1,cc.tween()
                .to(0.9,{position:cc.v3(-120,170,0)},{easing:"sineOut"})
                //.to(0.1,{position:cc.v3(-30,0,0)},{easing:"sineOut"})
                ).start()
                this.scheduleOnce(function() {
                    // 这里的 this 指向 component
                    this.addDestopButton.active = false
                }, 0.9);
                //find("Canvas/CoinSplash").getComponent(SplashCoin).playSplash()
            }
        }.bind(this);
        ASCAd.getInstance().addDeskTop(callback_sub);
    }

    onRecoverView()
    {
        CustomEventListener.dispatchEvent("recoverView")
    }

    onViewLevelModelButton()
    {
        let viewSprite = this.viewLevelModel.getChildByName("ViewLevelModelSprite")
        let numLevel = Level.getInstance().levelIndex
        let sprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[numLevel].sprite+"_Lock")
        viewSprite.getComponent(SpriteComponent).spriteFrame = sprite
        cc.tween(this.viewLevelModel.getComponent(UIOpacityComponent))
        .call(()=>{this.viewLevelModel.active = true}) 
        .to(0.5,{opacity:255})
        .start()
    }

    onViewLevelModelDisableButton()
    {
        cc.tween(this.viewLevelModel.getComponent(UIOpacityComponent))
        .to(0.5,{opacity:0})
        .call(()=>{this.viewLevelModel.active = false})
        .start()
    }

    playCoinAnim(num:number)
    {
        let node:Node = this.AddMoneyNode.parent.getChildByName("CoinAnim")
        node.getChildByName("Label").getComponent(LabelComponent).string ="-"+ num.toString()
        this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
        cc.tween(node.getComponent(UIOpacityComponent)).repeat(1,cc.tween()
            .to(0.05,{opacity:255},{easing:"sineOut"})
            .to(0.8,{opacity:255},{easing:"sineOut"})
            .to(0.05,{opacity:0},{easing:"sineOut"})
            ).start()
            cc.tween(node).repeat(1,cc.tween()
            .to(0.9,{position:cc.v3(0,-120,0)},{easing:"sineOut"})
            .to(0.1,{position:cc.v3(0,0,0)},{easing:"sineOut"})
            ).start()
    }

    onShowPageContinueButton()
    {
        let numLevel = Level.getInstance().levelIndex
        let sprite = PrefabsMgr.Instance.getSprite(Constants.levelInfo.Level[numLevel].sprite)
        this.levelSpriteInSettle.spriteFrame = sprite
        this.levelLabelInSettle.string  = Constants.levelInfo.Level[numLevel].levelName
        this.showContinuePage.active = false
        if(GameModeManager.instance().gameMode === Constants.GameMode.Coin)
        {
            this.AddMoneyNode.parent.active = true
        }
        else
        {
            this.nextLevelNodeVivo.active = true
            this.receiveRewardVivo.active = false
            this.doubleRewardVivo.active = false
            this.settlePage.getChildByName("ReplayRewardTip").active = false
        }
        this.settlePage.active = true
        this.backNode.active = false
        this.rePalyNode.active = false
        CustomEventListener.dispatchEvent(Constants.EventName.DiSABLE_RPTATE)
        //2*3互推广告
        ASCAd.getInstance().hideNavigateSettle()
        if(ASCAd.getInstance().getNavigateSettleFlag())
        {
            ASCAd.getInstance().showNavigateSettle(3,0,-(cc.winSize.height)/2+200)
        }
        if(ASCAd.getInstance().getIntersFlag())
        {
            ASCAd.getInstance().showInters()
        }

        if(this.firstIntiSettlePage)
        {
            this.firstIntiSettlePage = false
            let finishType:string = null
            if(this.hadFinishLevel)
            {
                finishType = "重玩"
            }
            else
            {
                finishType = "首玩"
            }
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "场景事件",
                eventName: "结算",
                type: finishType,
                subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
                level: Level.getInstance().levelIndex,
            })
        }
    }

    ReceiveReward()
    {
        AudioManager.getInstance().playSound("Click_01")
        this.settlePage.getComponent(GlodEffect).PalyCionAmin()
        this.scheduleOnce(() => {
            this.currentMoneyLabel.string = Level.getInstance().achievement.money.toString()
        }, 0.8)
        Level.getInstance().achievement.money += Level.getInstance().rewardMoney
        GameStorage.instance().setAchievement(Level.getInstance().achievement)
        this.receiveRewardOppo.active = false
        this.receiveRewardVivo.active = false
        this.doubleRewardOppo.active = false
        this.doubleRewardVivo.active = false
        this.settlePage.getChildByName("ReplayRewardTip").active = false
        this.showNextLevelNode()
        this.settlePage.getChildByName("TopButton").active = true
        let type:string  = null
        if(this.hadFinishLevel)
        {
            type = "重玩"
        }
        else
        {
            type = "首玩"
        }

        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "按钮事件",
            sceneName: "结算场景",
            eventName: "普通领取",
            type: type,
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
        })
        
    }

    onBackOnSettle()
    {
        this.settlePage.active = false
        this.showContinuePage.active = true
        this.backNode.active = true
        this.rePalyNode.active = true
    }

    showNextLevelNode()
    {
        console.info(Constants.levelInfo.Level.length)
        console.info(Level.getInstance().levelIndex)
        if(Level.getInstance().levelIndex<Constants.levelInfo.Level.length-1)
        {
            this.nextLevelNodeVivo.active = true
        }
    }

    countLevelEvent()
    {
        let gameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[Level.getInstance().levelIndex+1].level)
        if(!gameData.isUnLock)
        {
            if(!Constants.levelInfo.Level[Level.getInstance().levelIndex+1].isFree && !Constants.levelInfo.Level[Level.getInstance().levelIndex+1].isSpecial)
            {
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                    name: "计数事件",
                    eventName: "解锁关卡",
                    type: "免费",
                })
            }
            else
            {
                if(Level.getInstance().levelIndex<Constants.levelInfo.Level.length-2)
                {
                    let gameData1 = GameStorage.instance().getGameData(Constants.levelInfo.Level[Level.getInstance().levelIndex+2].level)
                    if(!gameData1.isUnLock)
                    {
                        if(!Constants.levelInfo.Level[Level.getInstance().levelIndex+2].isFree && !Constants.levelInfo.Level[Level.getInstance().levelIndex+2].isSpecial)
                        {
                            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                                name: "计数事件",
                                eventName: "解锁关卡",
                                type: "免费",
                            })
                        }
                    }
                }
            }
        }
    }
}
