import { _decorator, Component, Node, CameraComponent, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private camera:CameraComponent = null

    start () {
        this.camera = this.node.getComponent(CameraComponent)
    }

    update()
    {
        cc.color(1,1,1)
        //Vec3.lerp(this.camera.clearColor,Vec3.ZERO,0.1)
        //this.camera.clearColor = 
    }

       

   
}
