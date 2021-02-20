import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CionScaleChange')
export class CionScaleChange extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private time:number = 0

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        //this.time += deltaTime
        //this.node.setScale(0.5+ Math.sin(this.time*30)/3,1,1)
    }
}
