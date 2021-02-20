import { _decorator, Component, Node, director, SpriteComponent, LabelComponent, Prefab, instantiate, find, CCObject, Color, SpriteAtlas, ProgressBarComponent, Material } from 'cc';
import { AudioManager } from './AudioManager';
import { Level } from './Level';
import { GameStorage } from './GameStorage';
import { GameData } from './GameData';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { ResMgr } from './ResMgr';
import { PrefabsMgr } from './PrefabsMgr';
import ASCAd from './ADPlugin/ASCAd';
import { Constants } from './Constants';
import { LevelTapBind } from './LevelTapBind';
import AnalyticsManager, { EAnalyticsEvent } from './Manager/AnalyticsManager';
import { MainUI } from './UI/MainUI';
import { GameModeManager } from './GameModeManager';
import { ListPage } from './UI/ListPage';
const { ccclass } = _decorator;

@ccclass('LevelTap')
export class LevelTap extends Component {

    public level: string = null
    public atlas: string = null
    public sprite: string = null
    public star: number = null
    public levelName: string = null
    public cameraOrthoHeight = null
    public BGColor = null
    public unlockMoney:number = null
    public isSpecial:boolean = false
    public isFree:boolean = false
    public levelIndex:number = 0
    public onlyAD:boolean = false
    public theme:string = null


    private gameData: GameData = null
    private lock: boolean = true

    private tapBGNode:Node = null
    private spriteNode: Node = null
    private spriteNodeBG: Node = null
    private spriteNodeLock:Node = null 
    private spriteNodeLockBG: Node = null

    private levelNameNode:Node = null
    private tap:Node = null
    private startNode: Node = null
    private progressBar: Node = null
    //广告节点
    private AdNode: Node = null
    //金钱解锁节点
    private moneyUnlock = null

    private specialNode:Node = null

    private freeNode:Node = null
    //需解锁的金钱数
    private moneyLabel: LabelComponent = null
    //触摸范围
    private touchRange:Node = null

    


    start() 
    {
        this.tapBGNode = this.node
        this.spriteNode = this.node.getChildByName("LevelSpriteUnlock")
        this.spriteNodeLock = this.node.getChildByName("LevelSpriteLock")
        this.spriteNodeLockBG = this.node.getChildByName("LevelSpriteLockBG")
        let i = Math.floor(Math.random() * Math.floor(15))
        this.spriteNodeBG = this.node.getChildByName("LevelSpriteUnlockBG").children[i]
        this.spriteNodeBG.active = true
        this.levelNameNode = this.node.getChildByPath('LevelName')
        this.AdNode = this.node.getChildByPath("Layout/ADUnlock")
        this.moneyUnlock = this.node.getChildByPath("Layout/MoneyUnlock")
        this.specialNode = this.node.getChildByPath("Layout/Special")
        this.freeNode = this.node.getChildByPath("Layout/Free")
        this.touchRange = this.node.getChildByName("TouchRange")
        this.moneyLabel = this.node.getChildByPath("Layout/MoneyUnlock/MoneyLabel").getComponent(LabelComponent)
        this.moneyLabel.string = this.unlockMoney.toString()
        let sprite = PrefabsMgr.Instance.getSprite(this.sprite)
        let spriteLock = PrefabsMgr.Instance.getSprite(this.sprite+"_Lock")
        this.spriteNode.getComponent(SpriteComponent).spriteFrame = sprite
        this.spriteNodeLock.getComponent(SpriteComponent).spriteFrame = spriteLock
        this.levelNameNode.getComponent(LabelComponent).string = this.levelName
        this.gameData = GameStorage.instance().getGameData(this.level)
        if (!this.gameData.FinishedLevel) {
            if (this.gameData.openCount === 0) {
                this.changeSpriteColot(0)
            }
            else {
                this.changeSpriteColot(this.gameData.MatchCount / this.gameData.TotalCount)
            }
        }
        else {
            this.changeSpriteColot(1)
        }
        if(this.isSpecial)
        {
            this.specialNode.active = true
            this.moneyUnlock.active = false
        }
        if(this.isFree)
        {
            this.freeNode.active = true
        }
        this.CheckisLock()
        this.touchRange.on(Node.EventType.TOUCH_END, this.onTouchRange, this)
    }


    changeSpriteColot(rate: number) {

        this.spriteNode.getComponent(SpriteComponent).fillStart = 1-rate
        this.spriteNodeBG.getComponent(SpriteComponent).fillStart = 1-rate
    }


    loadLevel(canLoad:boolean = true) {
        if(canLoad)
        {
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "关卡事件",
                sceneName: "关卡场景",
                eventName: "关卡解锁",
                subject: Constants.levelInfo.Level[this.levelIndex].parent,
                level: this.levelIndex,
                type: "视频",
            })
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "计数事件",
                eventName: "解锁关卡",
                type: "视频",
            })
            CustomEventListener.dispatchEvent("showADTip",false)
            find("Canvas/ListPage/Loading/LoadingLevelSprite").getComponent(SpriteComponent).spriteFrame = PrefabsMgr.Instance.getSprite(this.sprite)
            find("Canvas/ListPage/Loading").active = true
            this.lock = false
            //let lastGameData: GameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[this.levelIndex-1].level)
            if (this.lock === false)
            //if(true)
            {
                CustomEventListener.dispatchEvent("onShelter", true)
                AudioManager.getInstance().playSound("Click_01")
                Level.getInstance().modeleName = this.level
                Level.getInstance().levelName = this.levelName
                Level.getInstance().levelStar = this.star
                //记录相机高度
                Level.getInstance().cameraOrthoHeight = this.cameraOrthoHeight
                Level.getInstance().BGColor = this.BGColor
                Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
                Level.getInstance().gameDate.isUnLock = true
                Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite(this.sprite)
                Level.getInstance().levelIndex = this.levelIndex
                Level.getInstance().resetLevel()
                CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
               // console.info("准备加载场景")
                ResMgr.Instance.addRes("Level/" + this.gameData.Level, Prefab, this.loadGameSnece.bind(this))
            }
            else {
                CustomEventListener.dispatchEvent("showTip", 0)
            }
        }
        else
        {
            AudioManager.getInstance().playBGM("BGM_main")
            CustomEventListener.dispatchEvent("showTip", 1)
            //CustomEventListener.dispatchEvent("showADTip",false)
            //cc.log("loadLevel")
            //CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
        }
    }

    loadLevelWithoutAD(canLoad:boolean = true) {
        if(canLoad)
        {
            CustomEventListener.dispatchEvent("showADTip",false)
            find("Canvas/ListPage/Loading/LoadingLevelSprite").getComponent(SpriteComponent).spriteFrame = PrefabsMgr.Instance.getSprite(this.sprite)
            find("Canvas/ListPage/Loading").active = true
            this.lock = false
            if (this.lock === false)
            {
                CustomEventListener.dispatchEvent("onShelter", true)
                AudioManager.getInstance().playSound("Click_01")
                Level.getInstance().modeleName = this.level
                Level.getInstance().levelName = this.levelName
                Level.getInstance().levelStar = this.star
                //记录相机高度
                Level.getInstance().cameraOrthoHeight = this.cameraOrthoHeight
                Level.getInstance().BGColor = this.BGColor
                Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
                Level.getInstance().gameDate.isUnLock = true
                Level.getInstance().levelSprite = PrefabsMgr.Instance.getSprite(this.sprite)
                Level.getInstance().levelIndex = this.levelIndex
                Level.getInstance().resetLevel()
                CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
               // console.info("准备加载场景")
                ResMgr.Instance.addRes("Level/" + this.gameData.Level, Prefab, this.loadGameSnece.bind(this))
            }
            else {
                CustomEventListener.dispatchEvent("showTip", 0)
            }
        }
        else
        {
            AudioManager.getInstance().playBGM("BGM_main")
            CustomEventListener.dispatchEvent("showTip", 1)
            //CustomEventListener.dispatchEvent("showADTip",false)
            //cc.log("loadLevel")
            //CustomEventListener.dispatchEvent("RemoveAgreeADOnTouch")
        }
    }

    //检查是否需要解锁
    CheckisLock() {
        //根据游戏模式进行检测
        // if(GameModeManager.instance().gameMode === Constants.GameMode.UnCoin &&　!this.isSpecial)
        // {
        //     if(!this.onlyAD)
        //     {
        //         this.isFree = true
        //         this.freeNode.active = false
        //     }
        // }

        // //如果上一关已经完成了、这一关为第一关、这一关解锁过、上一关曾经完成过---》 把这一关解锁
        // if (this.gameData.Level === Constants.levelInfo.Level[0].level || this.gameData.isUnLock || this.isFree) 
        // {
        //     this.lock = false
        //     this.AdNode.active = false
        //     this.moneyUnlock.active = false
        //     this.freeNode.active = false
        // }
        // else
        // {
        //     let numLevel = this.levelIndex
        //     let isSperail = Constants.levelInfo.Level[numLevel-1].isSpecial
        //     let lastGameData:GameData = null
        //     if(isSperail)
        //     {
        //         lastGameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[numLevel-2].level)
        //     }
        //     else
        //     {
        //         lastGameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[numLevel-1].level)
        //     }
        //     if (lastGameData.FinishedLevel || this.gameData.Level === Constants.levelInfo.Level[0].level || this.gameData.isUnLock || lastGameData.hadfinishedLevel)
        //     {
        //         if(this.isSpecial)
        //         {
        //             this.lock = true
        //             this.AdNode.active = true
        //             //this.moneyUnlock.active = false
        //         }
        //         else
        //         {
        //             this.lock = false
        //             this.AdNode.active = false
        //             this.moneyUnlock.active = false
        //         }
        //     }
        //     else
        //     {
        //         if(isSperail)
        //         {
        //             this.lock = true
        //             this.AdNode.active = true
        //         }
        //         else
        //         {
        //             this.lock = true
        //             this.AdNode.active = true
        //             this.moneyUnlock.active = true
        //         }

        //         if(this.onlyAD)
        //         {
        //             this.moneyUnlock.active = false
        //         }
        //         else
        //         {
        //             this.AdNode.active = false
        //         }
        //     }
        //     if(this.isFree)
        //     {
        //         this.freeNode.active = true
        //     }
        // }  
        //根据游戏模式进行检测
        if(GameModeManager.instance().gameMode === Constants.GameMode.UnCoin)
        {
            // if(!this.onlyAD)
            // {
            //     this.isFree = true
            //     this.freeNode.active = false
            // }
            this.moneyUnlock.active = false
        } 
        if(this.isSpecial)
        {
            this.specialNode.active = true
        } 
        if(this.isFree)
        {
            this.lock = false
            if(this.gameData.isUnLock)
            {
                this.freeNode.active =false
            }
            else
            {
                this.freeNode.active =true
            }
        }
        if(this.onlyAD)
        {
            if(this.gameData.isUnLock)
            {
                this.lock = false
                this.AdNode.active = false
            }
            else
            {
                this.AdNode.active = true
            }
        }
        else
        {
            this.AdNode.active = false
        }
    }

    loadGameSnece() {
        this.scheduleOnce(() => {
            AudioManager.getInstance().stopBGM()
            director.loadScene("GameScene")
        }, 0.03)
    }

    //点击金钱按钮
    onMoneyNode() {
        var surplu = Level.getInstance().achievement.money - Number(this.unlockMoney)
        if(surplu>=0)
        {
            Level.getInstance().achievement.money -= Number(this.unlockMoney)
            GameStorage.instance().setAchievement(Level.getInstance().achievement)
            CustomEventListener.dispatchEvent("playCoinAnim",this.unlockMoney,this.loadLevelWithoutAD.bind(this))
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "关卡事件",
                sceneName: "关卡场景",
                eventName: "关卡解锁",
                subject: Constants.levelInfo.Level[this.levelIndex].parent,
                level: this.levelIndex,
                type: "金币",
            });

            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "计数事件",
                eventName: "解锁关卡",
                type: "金币",
            })
        }
        else
        {

            find("Canvas/ListPage").getComponent(ListPage).addMoneyTip()
        }
    }

    //看广告解锁
    onAdNode() {
        
       //广告加载好了
       if(ASCAd.getInstance().getVideoFlag())
       {
            AudioManager.getInstance().stopBGM()
            ASCAd.getInstance().showVideo(this.loadLevel.bind(this))
       }
       //广告没有加载好
       else
       {
            CustomEventListener.dispatchEvent("showTip", 3)
       }
    }

    onTouchRange()
    {
        let themeState = this.node.parent.parent.getChildByName(this.theme).getComponent(LevelTapBind)
        //let themeLock = this.node.parent.parent.getChildByName(this.theme).getComponent(LevelTapBind).lock
        if(themeState.lock)
        {
            CustomEventListener.dispatchEvent("showTip", null,themeState.judgeTheme)
            return
        }
        
        if(this.lock === false)
        {
            this.loadLevelWithoutAD()
            if(this.isFree && !GameStorage.instance().getGameData(Constants.levelInfo.Level[this.levelIndex].level).isUnLock)
            {
                AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                    name: "关卡事件",
                    sceneName: "关卡场景",
                    eventName: "关卡解锁",
                    subject: Constants.levelInfo.Level[this.levelIndex].parent,
                    level: this.levelIndex,
                    type: "免费",
                })
            }
        }
        else
        {
            AudioManager.getInstance().playSound("Click_01")
            if(this.onlyAD)
            {
                this.onAdNode()
            }
            else
            {
                this.onMoneyNode()
            }

            // if(this.isSpecial)
            // {
            //     this.onAdNode()
            // }
            // else
            // {


            //     AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            //         name: "按钮事件",
            //         info: {
            //             "sceneName": "主场景",
            //             "eventName": "解锁关卡金币提示",
            //             "subject": Constants.levelInfo.Level[this.levelIndex],
            //             "level": this.levelIndex,
            //             "component": "ADTip",
            //             "cost": this.unlockMoney,
            //         }
            //     })

            //     //CustomEventListener.dispatchEvent("showTip", 4)
            //     AudioManager.getInstance().playSound("Click_01")
            //     CustomEventListener.dispatchEvent("showADTip",true)
            //     //CustomEventListener.dispatchEvent("onShelter",true)
            //     find("Canvas/ADTip/BG/Logo").getComponent(SpriteComponent).spriteFrame = PrefabsMgr.Instance.getSprite(this.atlas, this.sprite)
            //     find("Canvas/ADTip/BG/Label").getComponent(LabelComponent).string = this.levelName
            //     CustomEventListener.dispatchEvent("AddAgreeADOnTouch",this.onAdNode,this.onMoneyNode,this)
                
            //}
        }
    }


    //根据星星分配此关卡的解锁需要的金钱
    AllotMoney() {
        let labelSting = null
        switch (this.star) {
            case 1:
                labelSting = "100"
                break;
            case 2:
                labelSting = "200"
                break;
            case 3:
                labelSting = "500"
                break;
            case 4:
                labelSting = "2000"
                break;
            case 5:
                labelSting = "5000"
                break;
        }
        this.moneyLabel.string = labelSting
        return labelSting
    }

}
