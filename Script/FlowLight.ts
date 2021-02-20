import { _decorator, Component, Node, ModelComponent, Material, math, Vec3, lerp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlowLight')
export class FlowLight extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private time:number = 0
    private mat:Material = null
    private progress:number = 0

    private modelSize:number = 0
    start () {
        this.mat = this.node.getComponent(ModelComponent).material
        var a :Vec3 = new Vec3()
        var b :Vec3 = new Vec3()
        this.node.getComponent(ModelComponent).model.worldBounds.getBoundary(a,b)
        
        this.modelSize = Vec3.distance(a,b)/this.node.scale.x/this.node.parent.scale.x
        this.mat.setProperty("HalfWidth",this.modelSize/5)
        this.progress = -this.modelSize
    }

    update(dt)
    {
        this.time+=dt*8
        if(this.node!==null)
        {
            //this.mat.setProperty("Progress",Math.sin(this.time)*this.modelSize*6)
            //this.progress = Math.abs(Math.sin(this.time)*this.modelSize
            this.progress = this.progress+this.modelSize*0.03
            if(this.modelSize-this.progress<=0.00005)
            {
                this.progress = -this.modelSize
            }
            
            this.mat.setProperty("Progress",this.progress*3)
        }
    }

    
}
