import { _decorator, Component, Node, ModelComponent } from 'cc';
import { Model } from '../Model';
import { ResMgr } from '../ResMgr';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('PromotyEffectFadeOut')
export class PromotyEffectFadeOut extends Component {
    private model:Model = null
    private time:number = 0
    private reachValue:boolean = false
    private hasRemoveThis:boolean = false

    start () 
    {
        this.model = this.node.getComponent(Model)

        this.scheduleOnce(() => {
            if(this.node && !this.hasRemoveThis)
            {
                GameManager.getInstance().gameUI.isPromotying = false
                this.node.removeComponent(this)
            }
        }, 1);

        // if(model.isModel)
        // {
        //     for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
        //     {
        //         let mat = this.node.getComponent(ModelComponent).materials
        //         mat[i].setProperty("mainColor",cc.color(117,117,117,8))
        //     }
        // }
        // model.subModel.forEach(element => {
        //     element.transParent()
        // })
    }



    update (deltaTime: number) {

        this.time +=  deltaTime 
        if(this.model!== null && !this.reachValue)
        {
            let transParent = Math.sin(this.time*2)*255
            if(transParent>=250)
            {
                transParent = 255
                this.reachValue = true
                this.recoverMat()
            }
            if(this.model.isModel)
            {
                for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
                {
                    let mat = this.node.getComponent(ModelComponent).materials
                    mat[i].setProperty("mainColor",cc.color(255,255,255,transParent))
                }
            }
        }
    }

    recoverMat()
    {
        for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                if(this.node.getComponent(ModelComponent).material.parent.effectName.indexOf("Phong") === -1)
                {
                    this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/Init")),i)
                }
                else
                {
                    this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/Phong")),i)
                }
            }
    }

    public removeThis()
    {
        this.reachValue = true
        this.hasRemoveThis = true

        //setTimeout(() => {
        for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
        {
            let mat = this.node.getComponent(ModelComponent).materials
            mat[i].setProperty("mainColor",cc.color(255,255,255,255))
        }
        this.node.removeComponent(this)
        //}, 50);
    }
    
}
