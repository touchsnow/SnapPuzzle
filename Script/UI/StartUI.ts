import { _decorator, Component, Node, ButtonComponent, EventTouch, find, EventHandler, AnimationClip, AnimationComponent, director } from 'cc';
import { GameEntry } from '../GameEntry';
import { UIManager } from './UIManager';
import { UIBase } from './UIBase';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { GameCtrl } from '../GameCtrl';
import { AudioManager } from '../AudioManager';
const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends UIBase {

    private touchDown:Boolean = false

    /**开始按钮 */
    public startButton:Node = null;
    /**SLogo动画 */
    private SAnim:Animation = null
    /**Logo动画 */
    private LogoAnim:Animation = null


    start ()
    {
        this.Init()
        this.startButton = this.getUiNode("Button")
        this.SAnim = this.getUiComponent("S",AnimationComponent)
        this.LogoAnim = this.getUiComponent("Button",AnimationComponent)
        this.SAnim.play()
        this.scheduleOnce(() => 
        {
            this.LogoAnim.play()
            AudioManager.getInstance().playSound("Click_OK")
        }, 2)
        this.scheduleOnce(() => director.loadScene("MainScene"), 3)
    }
    
    Init()
    {
        this.NodeDic = new Map<string,Node>()
        this.traverseNode(find("Canvas/StartUI"))
    }
}
