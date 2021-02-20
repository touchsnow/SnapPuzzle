import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonBreathe')
export class ButtonBreathe extends Component {


    start () 
    {
        cc.tween(this.node).repeatForever(cc.tween()
        .to(0.5,{scale:cc.v3(0.95,0.95,0.95)},{easing:"sineOut"})
        .to(0.5,{scale:cc.v3(1,1,1)},{easing:"sineIn"})
        ).start()
    }


}
