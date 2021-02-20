import { _decorator, Component, Node, tween, UIOpacityComponent } from 'cc';
import { MainPageBase } from './MainPageBase';
const { ccclass, property } = _decorator;

@ccclass('CollcetPage')
export class CollcetPage extends MainPageBase {


    start () {
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
}
