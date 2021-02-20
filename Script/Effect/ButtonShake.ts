import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonShake')
export class ButtonShake extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {

        cc.tween(this.node).repeatForever(cc.tween()
        .to(0.1,{eulerAngles:cc.v3(0,0,-10)},{easing:"sineOut"})
        .to(0.1,{eulerAngles:cc.v3(0,0,10)},{easing:"sineIn"})
        .to(0.06,{eulerAngles:cc.v3(0,0,-5)},{easing:"sineOut"})
        .to(0.06,{eulerAngles:cc.v3(0,0,5)},{easing:"sineIn"})
        .to(0.03,{eulerAngles:cc.v3(0,0,-2.5)},{easing:"sineOut"})
        .to(0.03,{eulerAngles:cc.v3(0,0,2.5)},{easing:"sineIn"})
        .to(0.01,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
        .to(2,{eulerAngles:cc.v3(0,0,0)},{easing:"sineIn"})
        ).start()
    }
}
