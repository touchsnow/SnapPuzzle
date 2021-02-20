import { _decorator, CameraComponent, find, geometry, Vec3, PhysicsSystem,Node, Quat } from 'cc';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { Constants } from './Constants';
import { Level } from './Level';
import { Model } from './Model';
const { ccclass, property } = _decorator;

@ccclass('CameraCtrl')
export class CameraCtrl {


    private initPos:Vec3 = new Vec3()
    public initRot:Quat = new Quat()
    public modelNode:Node = null
    private targetNode:Node = null
    public originalOrthoHeiget:number = null

    public switchOriginalOrthoHeiget:number = null
    private static cameraCtrl: CameraCtrl
    private constructor() {
        this.mainCamera = find("MainCamera").getComponent(CameraComponent)
        this.topCamera = find("TopCamera").getComponent(CameraComponent)
        this.modelNode = find("ModelNode")
        this.originalOrthoHeiget = Level.getInstance().cameraOrthoHeight
        this.setOrthoHeiget(this.originalOrthoHeiget)
        this.switchOriginalOrthoHeiget = Level.getInstance().cameraOrthoHeight
        CustomEventListener.on(Constants.EventName.RELEASE_SENCE,this.initTarget,this)
    }
    public static getInstance(): CameraCtrl {
      if (this.cameraCtrl == null) {
        this.cameraCtrl = new CameraCtrl()
      }
      return CameraCtrl.cameraCtrl
    }

    public mainCamera:CameraComponent
    public topCamera:CameraComponent
    /**相机射线 */
    private ray: geometry.ray = new geometry.ray()
 


    public get mainCameraNode(){return this.mainCamera.node}
    public get mainCameraOrther(){return this.mainCamera.orthoHeight}

     
    public hitPoint(posX:number,posY:number):Vec3{
        this.mainCamera.screenPointToRay(posX,posY,this.ray)      
        if (PhysicsSystem.instance.raycast(this.ray)){
            const r = PhysicsSystem.instance.raycastResults;
            const item = r[0]
            return item.hitPoint
        }
    }

    public screenDistance(posA:Vec3,posB:Vec3){
        this.mainCamera.worldToScreen(posA)
        this.mainCamera.worldToScreen(posB)
        return Vec3.distance(this.mainCamera.worldToScreen(posA),this.mainCamera.worldToScreen(posB))
    }


    public setTargetNode(node:Node)
    {
        this.targetNode = node
        this.initPos = node.getWorldPosition()
        this.initRot = node.getWorldRotation()
        node.worldPosition = this.modelNode.children[0].getWorldPosition()
        this.topCamera.node.lookAt(node.worldPosition)
        this.mainCamera.node.lookAt(node.worldPosition)
        if(node.name !== this.modelNode.name)
        {
            node.setWorldPosition(node.worldPosition.x,node.worldPosition.y+this.mainCamera.orthoHeight*0.3 ,node.worldPosition.z)
        }
        else
        {
            node.setWorldPosition(node.worldPosition.x,node.worldPosition.y+this.mainCamera.orthoHeight*0.15 ,node.worldPosition.z)
        }
    }

    public recoverTargetNode()
    {
        if(this.targetNode!==null)
        {
            this.targetNode.setWorldPosition(this.initPos)
            this.targetNode.setWorldRotation(this.initRot)
        }
    }

    private initTarget()
    {
        this.targetNode = this.modelNode
    }

    public getScreenPos(pos:Vec3):Vec3
    {
        //return this.mainCamera.convertToUINode(pos,find("Canvas"))
        return this.mainCamera.worldToScreen(pos)
    }

    resetCamera()
    {
        this.mainCamera = find("MainCamera").getComponent(CameraComponent)
        this.topCamera = find("TopCamera").getComponent(CameraComponent)
        this.modelNode = find("ModelNode")
        this.targetNode = null
        this.setOrthoHeiget(Level.getInstance().cameraOrthoHeight)
        this.switchOriginalOrthoHeiget = Level.getInstance().cameraOrthoHeight
        this.topCamera.node.lookAt(this.modelNode.worldPosition)
        this.mainCamera.node.lookAt(this.modelNode.worldPosition)
        this.modelNode.setWorldPosition(this.modelNode.worldPosition.x,this.modelNode.worldPosition.y+this.mainCamera.orthoHeight*0.03 ,this.modelNode.worldPosition.z)
    }

    public setOrthoHeiget(height:number)
    {
        this.mainCamera.orthoHeight = height
        this.topCamera.orthoHeight = height
        if(this.mainCamera.orthoHeight<=0)
        {
            this.mainCamera.orthoHeight = 0
            this.topCamera.orthoHeight = 0
        }
    }

    recoverOrthoHeight(height:number)
    {
        cc.tween(this.mainCamera).repeat(1,cc.tween()
        .to(0.5,{orthoHeight:height},{easing:"sineOut"}))
        .start()
        cc.tween(this.topCamera).repeat(1,cc.tween()
        .to(0.5,{orthoHeight:height},{easing:"sineOut"}))
        .start()
    }
}
