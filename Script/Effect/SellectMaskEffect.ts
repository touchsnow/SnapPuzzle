import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SellectMaskEffect')
export class SellectMaskEffect extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {

        cc.tween(this.node).repeatForever(cc.tween()
        .to(0.5,{position:cc.v3(0,-100,0)},{easing:"sineOut"})
        .to(0.5,{position:cc.v3(0,-85,0)},{easing:"sineOut"}))
        .start()
    }

}
