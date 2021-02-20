import { _decorator, Component, Node, ModelComponent, BoxColliderComponent } from 'cc';
import { Model } from '../Model';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { GameManager } from '../GameManager';
import { ResMgr } from '../ResMgr';
const { ccclass, property } = _decorator;

@ccclass('PromotyEffectFadeIn')
export class PromotyEffectFadeIn extends Component {

    private model:Model = null
    private time:number = 0
    private reachValue:boolean = false

    start ()
    {
        this.model = this.node.getComponent(Model)
        GameManager.getInstance().gameUI.promotyList.push(this)
    }



    update (deltaTime: number) 
    {
        this.time +=  deltaTime 
        if(this.model!== null && !this.reachValue)
        {
            let transParent = Math.cos(this.time*6)*255
            if(transParent<=15)
            {
                transParent = 15
                this.reachValue = true
            }
            if(this.model)
            {
                if( this.model.isModel && this.node)
                {
                    for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
                    {
                        let mat = this.node.getComponent(ModelComponent).materials
                        mat[i].setProperty("mainColor",cc.color(255,255,255,transParent))
                    }
                }
            }
        }
    }

    public removeThis()
    {
        if(this && this.node)
        {
            this.reachValue = true
            this.node.removeComponent(this)
        }
    }

    public recoverMat()
    {
        if(this && this.model && this.node)
        {
            if(this.model.isModel)
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
        }
    }

    onDestroy()
    {

    }
}
