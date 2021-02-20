import { _decorator, Component, Node, Vec2, find, ScrollViewComponent, SpriteComponent } from 'cc';
import { AudioManager } from './AudioManager';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { GameData } from './GameData';
import { GameManager } from './GameManager';
import { GameStorage } from './GameStorage';
const { ccclass, property } = _decorator;

@ccclass('LevelTapBind')
export class LevelTapBind extends Component {

    @property(Node)
    levelContent:Node = null
    @property(Node)
    arrowEnable:Node = null
    @property(Node)
    arrowDisable:Node = null
    @property(Node)
    lockNode = null

    public lock:boolean = false
    public judgeTheme:string = null


    start () {
        

        this.node.on(Node.EventType.TOUCH_END,this.onNodeTouch,this)
        let unlcokThemeArray = GameStorage.instance().getUnlockTheme()
        console.info(unlcokThemeArray)
        if(this.node.name === "Cute")
        {
            this.lock = false
            this.lockNode.active = false
        }
        else
        {
            let index = Constants.themeInfo.theme.indexOf(this.node.name)-1
            let theme = Constants.themeInfo.theme[index]
            this.judgeTheme = Constants.themeInfo.themeCnName[index]
            console.info(this.node.name+ "对应解锁的名字为："+ theme )
            if(unlcokThemeArray.indexOf(theme)!== -1)
            {
                this.lock = false
                this.lockNode.active = false
            }
            else
            {
                this.lock = true
                this.lockNode.active = true
                this.arrowDisable.active =false
                this.arrowEnable.active = false
                this.node.getComponent(SpriteComponent).grayscale = true
            }
        }

        //保存主题状态
        let lockState = false
        for(let i = 0;i<Constants.levelInfo.Level.length;i++)
        {
            if(Constants.levelInfo.Level[i].parent === this.node.name)
            {
                let gameData:GameData = GameStorage.instance().getGameData(Constants.levelInfo.Level[i].level)
                console.info(this.node.name+gameData)
                if(!gameData.hadfinishedLevel)
                {   
                    lockState = true
                }
            }
        }
        if(!lockState)
        {
            console.info("保存一个解锁了的主题")
            GameStorage.instance().setUnlockTheme(this.node.name)
        }
    }


    onNodeTouch()
    {
        // if(this.lock)
        // {
        //     CustomEventListener.dispatchEvent("showTip", null,this.judgeTheme)
        //     return 
        // }


        AudioManager.getInstance().playSound("Click_02")
        if(this.levelContent.active)
        {
            this.levelContent.active = false
            this.arrowEnable.active = false
            this.arrowDisable.active = true
        }
        else
        {
            this.levelContent.active = true
            this.arrowEnable.active = true
            this.arrowDisable.active = false

            this.levelContent.children.forEach(element => {
                let i = Math.random()*2
                if(i>1)
                {
                    cc.tween(element).repeat(1,cc.tween()
                    .to(0.1,{eulerAngles:cc.v3(0,0,3)},{easing:"sineIn"})
                    .to(0.1,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
                    ).start()
                }
                else
                {
                    cc.tween(element).repeat(1,cc.tween()
                    .to(0.1,{eulerAngles:cc.v3(0,0,-3)},{easing:"sineIn"})
                    .to(0.1,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
                    ).start()
                }
            });
        }
        this.getSetting(this.node.parent)

        this.scheduleOnce(()=>{
            let content = this.node.parent
            let scrollView = find("Canvas/ListPage/ScrollView").getComponent(ScrollViewComponent)
            let levelTapPosY =  this.node.getWorldPosition().y
            let contentPosY = content.getWorldPosition().y
            let offset =  contentPosY - levelTapPosY
            let rate =1- offset/content.height
            scrollView.scrollTo(new Vec2(rate,rate),1,true)
        },0)
        
        if(this.lock)
        {
            this.arrowEnable.active = false
            this.arrowDisable.active = false
        }
    }

    recoverArrow()
    {
        if(this.levelContent.active)
        {
            this.arrowEnable.active = true
            this.arrowDisable.active = false
        }
        else
        {
            this.arrowEnable.active = false
            this.arrowDisable.active = true
        }
    }

    public getSetting(node:Node)
    {
        GameManager.getInstance().mainPageSetting.TabSet = new Map<string,boolean>()
        for(var i = 0;i<node.children.length;i++)
        {
            if(node.children[i].name.indexOf("Levels") !== -1)
            {
                if(node.children[i].active === true)
                {
                    GameManager.getInstance().mainPageSetting.TabSet.set(node.children[i].name,node.children[i].active)
                }
            }
        }
        GameStorage.instance().SetMainPageSetting(GameManager.getInstance().mainPageSetting)
    }

    onNodeAbel()
    {
        //console.info("点击了")
        AudioManager.getInstance().playSound("Click_02")

        this.levelContent.active = true
        this.arrowEnable.active = true
        this.arrowDisable.active = false

        this.levelContent.children.forEach(element => {
            let i = Math.random()*2
            if(i>1)
            {
                cc.tween(element).repeat(1,cc.tween()
                .to(0.1,{eulerAngles:cc.v3(0,0,3)},{easing:"sineIn"})
                .to(0.1,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
                ).start()
            }
            else
            {
                cc.tween(element).repeat(1,cc.tween()
                .to(0.1,{eulerAngles:cc.v3(0,0,-3)},{easing:"sineIn"})
                .to(0.1,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
                ).start()
            }
        });
        
        this.getSetting(this.node.parent)

        this.scheduleOnce(()=>{
            let content = this.node.parent
            let scrollView = find("Canvas/ListPage/ScrollView").getComponent(ScrollViewComponent)
            let levelTapPosY =  this.node.getWorldPosition().y
            let contentPosY = content.getWorldPosition().y
            let offset =  contentPosY - levelTapPosY
            let rate =1- offset/content.height
            scrollView.scrollTo(new Vec2(rate,rate),1,true)
        },0)
    }




    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
