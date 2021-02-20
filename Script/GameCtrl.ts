import { _decorator, Component, Node, find, ModelComponent, loader, Prefab, instantiate} from 'cc';
import { Model } from './Model';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { Constants } from './Constants';
import { Level } from './Level';
import { CameraCtrl } from './CameraCtrl';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    /**放游戏模型物体的节点*/
    private modelNode : Node = null 

    start () {    
        //注册游戏事件
        CustomEventListener.on(Constants.EventName.INIT_GIME,this.initGmae,this)
        CustomEventListener.on(Constants.EventName.DISABLE_NODE,this.disableNode,this)     
        CustomEventListener.on(Constants.EventName.RELEASE_SENCE,this.releaseSence,this)
        //开始游戏UI显示
        CustomEventListener.dispatchEvent(Constants.EventName.SHOW_START_UI)       
    }


    /**给每个本体模型添加进行初始化*/
    private initAllModel(node:Node):void
    {
        node.children.forEach(element => {
            //为每个模型添加Model类
            element.addComponent(Model)
        })
    }


    /**初始化游戏*/
    public initGmae():void{
        loader.loadRes(Level.getInstance().modeleName, Prefab , (err: any, prefab: Prefab) => {
            const node = instantiate(prefab) as Node
            node.setParent(find("ModelNode"))
            //显示游戏UI界面
            CustomEventListener.dispatchEvent(Constants.EventName.SHOW_GAME_UI)
            setTimeout(() => {
            //找到模型节点，对模型进行初始化
            this.modelNode = node.children[0].children[0]
            this.initAllModel(this.modelNode)
            }, 200)
        })
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
                    setTimeout(() => {//给点延时才能激活
                    element.active = true
    
                }, 10)
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
        CustomEventListener.off(Constants.EventName.INIT_GIME,this.initGmae,this)
        CustomEventListener.off(Constants.EventName.DISABLE_NODE,this.disableNode,this)     
        CustomEventListener.off(Constants.EventName.RELEASE_SENCE,this.releaseSence,this)
    }
}