import { _decorator, Component, Node, Material, ModelComponent } from 'cc';
import { Constants } from '../Constants';
import { Level } from '../Level';
const { ccclass, property } = _decorator;

@ccclass('FinishBGEffect')
export class FinishBGEffect extends Component {
    private mat:Material = null
    private trantition:number = 0
    private bgColor = null

    start () {
        this.mat = this.node.getComponent(ModelComponent).material
        this.bgColor = Constants.levelInfo.Level[Level.getInstance().levelIndex].BGColor
    }

    update (deltaTime: number) {
        this.trantition += 5
        if(this.trantition>=255)
        {
            this.trantition = 255
        }
        this.bgColor.a = this.trantition
        //console.info(this.bgColor.r,this.bgColor.g,this.bgColor.b,this.bgColor.a)
        this.mat.setProperty("mainColor",this.bgColor)
    }
}
