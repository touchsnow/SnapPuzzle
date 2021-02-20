import { _decorator, Component, Node, ModelComponent, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireBGFade')
export class FireBGFade extends Component {


    private mat:Material = null
    private trantition:number = 255

    start () {
        this.mat = this.node.getComponent(ModelComponent).material

    }

    update (deltaTime: number) {
        this.trantition -= 5
        if(this.trantition<=0)
        {
            this.trantition = 0
        }
        this.mat.setProperty("mainColor",cc.color(163,216,236,this.trantition))
    }
}
