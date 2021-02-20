import { _decorator, Component,Node,game, Game} from 'cc';
import AnalyticsManager, { EAnalyticsEvent } from '../Manager/AnalyticsManager';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component{
    
    /**上一个面板*/
    protected topUI:UIBase

    /** 储存面板中所以的节点*/
    protected NodeDic:Map<string,Node>


    /**初始化面板*/
    Init(node):void{
        this.NodeDic = new Map<string,Node>()
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
    /**显示面板*/
    Show(topUi:UIBase):void{
        if(topUi !== null)
        {
            topUi.Hide()
        }
        this.node.active = true
    }

    /**隐藏面板*/
    Hide():void{
        this.node.active = false
    }

    /**获取指定Node的组件*/
    getUiComponent(nodeName: string,componet:any):any{
        if(this.NodeDic.has(nodeName))
        {
            return this.NodeDic.get(nodeName).getComponent(componet)
        }
        console.error("没有这个Node:"+ nodeName)
        return null
    }

    /**
     * 给特定Node添加组建
     * @param nodeName 组件名
     * @param componet 要添加的组建类
     */
    addUiComponent(nodeName: string,componet:any):any{
        if(this.NodeDic.has(nodeName))
        {
            return this.NodeDic.get(nodeName).addComponent(componet)
        }
        console.error("没有这个Node:"+ nodeName)
        return null
    }

    /**
     * 根据节点名字获取UI节点
     * @param nodeName 节点名字
     */
    getUiNode(nodeName:string):Node{
        if(this.NodeDic.has(nodeName)){
            return this.NodeDic.get(nodeName)
        }
        console.error("没有这个Node:"+ nodeName)
        return null
    }

    /**
     * 遍历指定UI节点，将所有节点存储在map以便后续获取
     * @param node 节点
     */
    traverseNode(node:Node):void{
        node.children.forEach(element => {
            this.NodeDic.set(element.name,element)
            this.traverseNode(element)
        })
    }

    onDestroy()
    {
        game.off(Game.EVENT_HIDE)
        game.off(Game.EVENT_HIDE)
    }


}

