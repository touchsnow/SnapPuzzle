import { _decorator, Component, Node, ModelComponent } from 'cc';
import { Model } from '../Model';
import { ResMgr } from '../ResMgr';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('PromotyEffect')
export class PromotyEffect extends Component 
{
   
    private model:Model = null
    start () 
    {
        GameManager.getInstance().gameUI.promotyList.push(this)
        //CustomEventListener.on(Constants.EventName.STOP_PROMOTY,this.removeThis,this)
        this.model = this.node.getComponent(Model)

        if(this.model.isModel)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/PromotyMat")),i)
            }
        }
    }


    public removeThis()
    {
        if(this)
        {
            if(this.node && this.model)
            {
                if(this.model.isModel)
                {
                    this.node.removeComponent(this)
                }
            }
        }
    }

    public recoverMat()
    {
        if(this)
        {
            if(this.model&&this.node)
            {
                if(this.model.isModel)
                {
                    this.node.getComponent(ModelComponent).material =ResMgr.Instance.getAsset("Mat/Init")
                }
            }
        }
    }

    onDestroy()
    {
        CustomEventListener.off(Constants.EventName.STOP_PROMOTY,this.removeThis,this)
    }
}
