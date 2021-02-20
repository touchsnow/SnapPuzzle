import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgLightRotate')
export class BgLightRotate extends Component {
    
    private time:number = 0
    start () {
        
    }
    update(dt)
    {
        this.time += dt
        if(this.node.active === true)
        {
            this.node.setRotationFromEuler(this.node.eulerAngles.x,this.node.eulerAngles.y,this.time*50)
        }
    }

    
}
