import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinLife')
export class CoinLife extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.scheduleOnce(()=>{this.node.destroy()},1)
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
