import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonEffect')
export class ButtonEffect extends Component {


    private originalScale:Vec3 = new Vec3()
    

    start () {
        this.originalScale = this.node.getScale()
        this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this)
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this)
        this.node.on(Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this)
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    onTouchStart()
    {
        cc.tween(this.node).repeat(1,cc.tween()
        .to(0.08,{scale:this.originalScale.clone().multiplyScalar(0.9)},{easing:"sineOut"}))
        .start()
    }

    onTouchEnd()
    {
        cc.tween(this.node).repeat(1,cc.tween()
        .to(0.08,{scale:this.originalScale},{easing:"sineOut"}))
        .start()

    }

    onTouchCancel()
    {
        cc.tween(this.node).repeat(1,cc.tween()
        .to(0.08,{scale:this.originalScale},{easing:"sineOut"}))
        .start()
    }

    

}
