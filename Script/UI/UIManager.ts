import { _decorator, Component, Node, Prefab, find, loader, instantiate } from 'cc';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { UIBase } from './UIBase';
import { StartUI } from './StartUI';
import { GameUI } from './GameUI';
import { MainUI } from './MainUI';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {


    /**存储Ui的界面类*/
    public UIDic:Map<string,UIBase> = new Map<string,UIBase>()

    /**Cavans节点*/
    public rootNode:Node = null

    /**当前正显示的界面类*/
    private currentUI:UIBase = null

    start () {
        this.rootNode = find("Canvas")

        //注册UI事件
        CustomEventListener.on(Constants.EventName.SHOW_START_UI,this.onShowStartUI,this)
        CustomEventListener.on(Constants.EventName.SHOW_GAME_UI,this.onShowGameUI,this)
        CustomEventListener.on(Constants.EventName.SHOW_MAIN_UI,this.onShowMainUI,this)
    }

    /**
     * 显示界面
     * @param uiName 界面名字
     * @param uiType 界面类型
     */
    public ShowUI(uiName:string,uiType:any){
        if(this.UIDic.has(uiName))
        {
            var ui:UIBase = this.UIDic.get(uiName)
            ui.Show(this.currentUI)
            this.currentUI = ui
        }
        else
        {
            loader.loadRes(uiName, Prefab , (err: any, prefab: Prefab) => {
                const newNode = instantiate(prefab)
              //  console.info("我把UI放上去了")
                newNode.setParent(this.rootNode)
                const ui = newNode.addComponent(uiType)
                this.UIDic.set(uiName,ui)
                ui.Show(this.currentUI)
                this.currentUI = ui
            })
        }
    }

    /**显示开始界面 */
    private onShowStartUI()
    {
        this.ShowUI("StartUI",StartUI)
    }

    /**显示游戏界面 */
    private onShowGameUI()
    {
        this.ShowUI("GameUI",GameUI)
    }

    private onShowMainUI()
    {
        this.ShowUI("MainUI",MainUI)
    }

}
