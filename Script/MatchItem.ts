import { _decorator, Component, Node, find, Vec3, Quat, ModelComponent, Material } from 'cc';
import { CameraCtrl } from './CameraCtrl';
import { Model } from './Model';
import { ResMgr } from './ResMgr';
import { FlowLight } from './FlowLight';
const { ccclass, property } = _decorator;

@ccclass('MatchItem')
export class MatchItem extends Component {

    public targetItem:Node = new Node()


    start ()
    {
        //this.findNodeByName(find("ModelNode"),this.node.name,this.targetItem)
        //let a = new Vec3()
       // Vec3.add(a,this.targetItem.parent.eulerAngles,this.targetItem.eulerAngles)
        //let b = new Quat()
        //Quat.fromEuler(b,a.x,a.y,a.z)
        this.node.setPosition(new Vec3(10,10,10))
        this.node.setWorldRotation(this.targetItem.worldRotation)
        if(this.targetItem.parent.scale.x === 1)
        {
            this.node.setScale(this.targetItem.scale)
        }
        else
        {
            this.node.setScale(this.targetItem.parent.scale)
        }
        find("Collider").setPosition(this.targetItem.worldPosition)
        find("Collider").lookAt(CameraCtrl.getInstance().mainCameraNode.position,Vec3.FORWARD)
        this.node.layer = 524288
        this.recoverMat()
        this.node.getComponent(Model).changeLayer()
    }

    update(){

    }

    findNodeByName(node:Node,name:string,findNode:Node){
        node.children.forEach(element => {
            this.findNodeByName(element,name,findNode)
            if(element.name === name){
                this.targetItem = element
                return
            }
        })
    }

    public recoverMat(){

        if(this.node.getComponent(ModelComponent) !==null)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.removeComponent(FlowLight)
                this.node.getComponent(ModelComponent).setMaterial(this.targetItem.getComponent(Model).originalMats[i],i)
            }
        }
        
        var i = 0
        this.node.children.forEach(element => {
            if(element.getComponent(ModelComponent) !==null)
            {
                if(this.targetItem.children[i].getComponent(Model)!== null)
                {
                    for(var t = 0;t<= element.getComponent(ModelComponent).materials.length-1;t++)
                    {
                        element.removeComponent(FlowLight)
                        element.getComponent(ModelComponent).setMaterial(this.targetItem.children[i].getComponent(Model).originalMats[t],t)
                    }
                }
                var j = 0
                element.children.forEach(sub_element => {
                    if(sub_element.getComponent(ModelComponent)!==null)
                    {
                        for(var h = 0;h<=sub_element.getComponent(ModelComponent).materials.length-1;h++)
                        {
                            sub_element.removeComponent(FlowLight)
                            sub_element.getComponent(ModelComponent).setMaterial(this.targetItem.children[i].children[j].getComponent(Model).originalMats[h],h) 
                        }
                    }
                    j++
                });
            }
            i++
        })
    }

    public MatchMat()
    {
        if(this.node.getComponent(ModelComponent) !==null)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.addComponent(FlowLight)
                if(i===0)
                {
                    this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/MatchMat")),i) 
                }
                else
                {
                    this.node.getComponent(ModelComponent).setMaterial(this.targetItem.getComponent(Model).originalMats[i],i) 
                }
                   //= this.targetItem.getComponent(Model).originalMats[0]
            }
        }
        
        var i = 0
        this.node.children.forEach(element => {
            if(element.getComponent(ModelComponent) !==null)
            {
                if(this.targetItem.children[i].getComponent(Model)!== null)
                {
                    for(var t = 0;t<= element.getComponent(ModelComponent).materials.length-1;t++)
                    {
                        if(t === 0)
                        {
                            element.addComponent(FlowLight)
                            element.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/MatchMat")),t)
                        }
                        else
                        {
                            element.getComponent(ModelComponent).setMaterial(this.targetItem.children[i].getComponent(Model).originalMats[t],t)
                        }
                        
                    }
                    //element.getComponent(ModelComponent).material = this.targetItem.children[i].getComponent(Model).originalMats[0]
                }
                // else
                // {
                //     element.getComponent(ModelComponent).material = this.targetItem.getComponent(Model).originalMats[0]
                // }
                var j = 0
                element.children.forEach(sub_element => {
                    if(sub_element.getComponent(ModelComponent)!==null)
                    {
                        for(var h = 0;h<=sub_element.getComponent(ModelComponent).materials.length-1;h++)
                        {
                            if(h === 0)
                            { 
                                sub_element.addComponent(FlowLight)
                                sub_element.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/MatchMat")),h) 
                            }
                            else
                            {
                                sub_element.getComponent(ModelComponent).setMaterial(this.targetItem.children[i].children[j].getComponent(Model).originalMats[h],h) 
                            }
                           
                        }
                    }
                    j++
                });
            }
            i++
        })
    }
}
