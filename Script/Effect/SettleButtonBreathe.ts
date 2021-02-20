import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettleButtonBreathe')
export class SettleButtonBreathe extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        cc.tween(this.node).repeatForever(cc.tween()
        .to(0.5,{scale:cc.v3(0.73,0.73,0.73)},{easing:"sineOut"})
        .to(0.5,{scale:cc.v3(0.7,0.7,0.7)},{easing:"sineIn"})
        ).start()
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
