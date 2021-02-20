import { _decorator, Component, Node, loader, instantiate, find, Prefab, macro, ParticleSystemComponent, Vec3, director, tween } from 'cc';
import { Model } from '../Model';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { Level } from '../Level';
import { GameUI } from '../UI/GameUI';
import { CameraCtrl } from '../CameraCtrl';
import { ResMgr } from '../ResMgr';
import { AudioManager } from '../AudioManager';
import { GameStorage } from '../GameStorage';
import ASCAd from '../ADPlugin/ASCAd';
import { GameManager } from '../GameManager';
import AnalyticsManager, { EAnalyticsEvent } from '../Manager/AnalyticsManager';
const { ccclass, property } = _decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true

@ccclass('GameScene')
export class GameScene extends Component 
{

    private gameData = null
    /**放游戏模型物体的节点*/
    private modelNode : Node = null 

    private matchPartcile:Node = null

    private particleSize:number = 1
    private particleSpeed:number = 1
    private particleGravity:number = 1

    private hidePoint:Node = null

    private initPint:Vec3 = null
    

    start ()
    {
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "场景事件",
            eventName: "游戏场景",
        })
        if(!GameStorage.instance().getGameData(Constants.levelInfo.Level[Level.getInstance().levelIndex].level).isUnLock)
        {
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "计数事件",
                eventName: "进入关卡",
            })
        }

        this.hidePoint = find("HidePoint")
        if(this.isOnline())
        {
            this.node.addComponent(GameUI)
            CameraCtrl.getInstance().resetCamera()
            this.matchPartcile = find("MatchParticle")
            //setTimeout(() => {
                this.scheduleOnce(function(){
                    this.initGmae()
                },0)
            //}, 10)
            //注册游戏事件
            CustomEventListener.on(Constants.EventName.INIT_GIME,this.initGmae,this)
            CustomEventListener.on(Constants.EventName.DISABLE_NODE,this.disableNode,this)  
            CustomEventListener.on(Constants.EventName.RELEASE_SENCE,this.releaseSence,this)
            CustomEventListener.on(Constants.EventName.PALY_PARTICLE,this.playParticle,this)
            macro.ENABLE_MULTI_TOUCH = true
            this.particleSpeed = this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSpeed.constant
            this.particleSize = this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSizeX.constant
            this.particleGravity = this.matchPartcile.children[0].getComponent(ParticleSystemComponent).gravityModifier.constant
        }

    }

    update()
    {
        
    }


    /**给每个本体模型添加进行初始化*/
    private initAllModel(node:Node):void
    {
        for(var i = 0;i<node.children.length;i++)
        {
            node.children[i].addComponent(Model)
        }
        // node.children.forEach(element => {
        //     //为每个模型添加Model类
        //     element.addComponent(Model)
        // })
        tween(this.node)
        .call(()=>{this.putModelToSlotList(node)}).delay(0).start()
        .call(()=>{this.updateSlotShow()}).delay(0).start()
        .call(()=>{this.preLoadLevel()}).delay(1.5).start()
        .start()



        // setTimeout(() => {
        //     console.info(Level.getInstance().gameDate)
        //     if(Level.getInstance().gameDate.FinishedLevel)
        //     {
        //         node.children.forEach(element => {
        //             if(element.name.indexOf("water") !== -1)
        //             {
        //                 //todo
        //             }
        //             else
        //             {
        //                 element.getComponent(Model).phongMat()
        //             }
        //         })
        //         CustomEventListener.dispatchEvent(Constants.EventName.ROTATE_X,true)
        //         CustomEventListener.dispatchEvent(Constants.EventName.FINISH_LEVEL,false)
        //     }
        //     else
        //     {
        //         node.children.forEach(element => {
        //             if(element.getComponent(Model).needSubMatch)
        //             {
        //                 CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_SUBMODEL,element)
        //             }
        //             //将每个模型放进格子
        //             CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_MODEL,element)
        //         })
        //         if(Level.getInstance().gameDate.openCount !==0)
        //         {
        //             CustomEventListener.dispatchEvent(Constants.EventName.ADD_PROGRESS_BAR)
        //         }
        //     }
        //     }, 80)
        //     setTimeout(()=>{
        //         CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)
        //         GameManager.getInstance().gameUI.toggleSwitchSellectModel()
        //     },200)
        //     setTimeout(() => {
        //         let numLevel = Level.getInstance().levelIndex// (Number(Level.getInstance().modeleName.slice(4)))
        //         console.info("LevelIndex ="+ numLevel)
        //         if(Constants.levelInfo.Level[numLevel+1].isSpecial)
        //         //if(numLevel%6 === 5 && numLevel < 41)
        //         {
        //             // ResMgr.Instance.addRes("Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+2).toString(),Prefab,null)
        //             // console.info("预加载关卡为："+ "Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+2).toString())
        //             // ResMgr.Instance.addRes("Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+1).toString(),Prefab,null)
        //             // console.info("预加载关卡为："+ "Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+1).toString())
        //             ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+1].level ,Prefab,null)
        //             ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+2].level ,Prefab,null)

        //         }
        //         else
        //         {
        //             ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+1].level ,Prefab,null)
        //             // ResMgr.Instance.addRes("Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+1).toString(),Prefab,null)
        //             // console.info("预加载关卡为："+ "Level/"+"000_"+(Number((Level.getInstance().modeleName.slice(4)))+1).toString())
        //         }
        //     }, 1500)
            // AudioManager.getInstance().initAudio()
            // AudioManager.getInstance().playBGM("BGM_paint")
    }


    /**初始化游戏*/
    public initGmae():void{
            console.info("Level/"+Constants.levelInfo.Level[Level.getInstance().levelIndex].level)
            var node = instantiate(ResMgr.Instance.getAsset("Level/"+Constants.levelInfo.Level[Level.getInstance().levelIndex].level)) as Node
            if(node)
            {


                node.setParent(this.hidePoint)
                node.setPosition(Vec3.ZERO)
                this.scheduleOnce(function(){
                    //找到模型节点，对模型进行初始化
                    this.modelNode = node.children[0].children[0]
                    this.initAllModel(this.modelNode)
                },0)
            }
            else
            {
                loader.loadRes("Level/"+Constants.levelInfo.Level[Level.getInstance().levelIndex].level,Prefab,(err:any,prefab:Prefab)=>{
                    node = instantiate(prefab)
                    node.setParent(this.hidePoint)
                    node.setPosition(Vec3.ZERO)
                    this.scheduleOnce(function(){
                        //找到模型节点，对模型进行初始化
                        this.modelNode = node.children[0].children[0]
                        this.initAllModel(this.modelNode)
                    },0)
                })
            }
    }

    /**屏蔽掉除此Node模型外的所以Node模型 */
    disableNode(node:Node)
    {
        if(node === find("ModelNode"))
        {
            this.enableAllNode()
        }
        else
        {
            this.modelNode.children.forEach(element => {
                element.active = false
                if(element === node)
                {
                    this.scheduleOnce(() => {//给点延时才能激活
                    element.active = true
    
                }, 0.01)
                }
            })
        }
    }

    /**激活所有模型节点，然所有模型显示 */
    enableAllNode()
    {
        this.modelNode.children.forEach(element => {
            if(!element.active)
            {
                element.active = true
            }
        })
    }


    releaseSence()
    {
        find("ModelNode").children[0].destroy()
    }

    onDestroy()
    {
        //注册游戏事件
        CustomEventListener.off(Constants.EventName.INIT_GIME,this.initGmae,this)
        CustomEventListener.off(Constants.EventName.DISABLE_NODE,this.disableNode,this)     
        CustomEventListener.off(Constants.EventName.RELEASE_SENCE,this.releaseSence,this)
        CustomEventListener.off(Constants.EventName.PALY_PARTICLE,this.playParticle,this)

    }

    playParticle(pos:Vec3)
    {

        let scale =  CameraCtrl.getInstance().mainCameraOrther*6.25+0.03125
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSpeed.constant = this.particleSpeed*scale
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSizeX.constant = this.particleSize*scale
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSizeY.constant = this.particleSize*scale
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).startSizeZ.constant = this.particleSize*scale
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).gravityModifier.constant = this.particleGravity*scale
        this.matchPartcile.setScale(new Vec3(scale,scale,scale))
        this.matchPartcile.setWorldPosition(pos)
        this.matchPartcile.children[0].getComponent(ParticleSystemComponent).play()
    }

    isOnline()
    {
         //检查网络状态
         let isNotOnLine = navigator && !navigator.onLine
         if(isNotOnLine)
         {
             //this.tip.getChildByName("TipLabel").getComponent(LabelComponent).string = "当前无网络，请连网后重新尝试"
             //this.tip.getComponent(UIOpacityComponent).opacity = 255
             find("Canvas/GameUI/Tip").active = true
             //  console.info("当前无网络，请连网后重新尝试")
             ASCAd.getInstance().showToast("当前无网络，请连网后重新尝试")
             return false
         }
         else
         {
             return true
         }
    }

    //把模型放进格子，并初始化模型
    putModelToSlotList(node:Node)
    {
        //if(true)
        if(Level.getInstance().gameDate.FinishedLevel)
        {
            for(var i = 0;i< node.children.length;i++)
            {
                if(node.children[i].name.indexOf("water") !== -1)
                {
                    //todo
                }
                else
                {
                    node.children[i].getComponent(Model).phongMat()
                }
            }
            // node.children.forEach(element => {
            //     if(element.name.indexOf("water") !== -1)
            //     {
            //         //todo
            //     }
            //     else
            //     {
            //         element.getComponent(Model).phongMat()
            //     }
            // })
            this.modelNode.parent.parent.setParent(find("ModelNode"))
            CustomEventListener.dispatchEvent(Constants.EventName.ROTATE_X,true)
            GameManager.getInstance().gameUI.finishLevel(false)
            //CustomEventListener.dispatchEvent(Constants.EventName.FINISH_LEVEL,false)
        }
        else
        {
            // node.children.forEach(element => {
            //     if(element.getComponent(Model).needSubMatch)
            //     {
            //         CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_SUBMODEL,element)
            //     }
            //     //将每个模型放进格子
            //     CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_MODEL,element)
            // })
            // if(Level.getInstance().gameDate.openCount !==0)
            // {
            //     CustomEventListener.dispatchEvent(Constants.EventName.ADD_PROGRESS_BAR)
            // }

            for(var i = 0;i<node.children.length;i++)
            {
                if(node.children[i].getComponent(Model).needSubMatch)
                {
                    GameManager.getInstance().gameUI.addSubItemToSlot(node.children[i])
                    //CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_SUBMODEL,element)
                }
                //将每个模型放进格子
                GameManager.getInstance().gameUI.addItemToSlot(node.children[i])
                //CustomEventListener.dispatchEvent(Constants.EventName.ALLOT_MODEL,element)
            }
        }
    }

    //更新列表显示
    updateSlotShow()
    {
        this.modelNode.parent.parent.setParent(find("ModelNode"))
        this.scheduleOnce(function(){
            CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)
            GameManager.getInstance().gameUI.toggleSwitchSellectModel()
        })
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Start, {
            name: "关卡事件",
            subject: Constants.levelInfo.Level[Level.getInstance().levelIndex].parent,
            level: Level.getInstance().levelIndex,
        });
    }

    //预加载关卡
    preLoadLevel()
    {
        let numLevel = Level.getInstance().levelIndex
        if(numLevel+2<Constants.levelInfo.Level.length)
        {
            if(Constants.levelInfo.Level[numLevel+1].isSpecial)
            {
                ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+1].level ,Prefab,null)
                if(numLevel+2<Constants.levelInfo.Level.length)
                {
                    ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+2].level ,Prefab,null)
                }
            }
            else
            {
                ResMgr.Instance.addRes("Level/"+Constants.levelInfo.Level[numLevel+1].level ,Prefab,null)
            }
        }
    }
}
