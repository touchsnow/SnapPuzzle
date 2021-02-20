import { _decorator, Component, Quat, Vec2, Vec3, find ,Node, macro, LabelComponent, lerp, Vec4} from 'cc';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { Constants } from './Constants';
import { CameraCtrl } from './CameraCtrl';
import { Model } from './Model';
import { Level } from './Level';
const { ccclass, property } = _decorator;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v3_1 = new Vec3();
const qt_1 = new Quat();


@ccclass('ViewCtrl')
export class ViewCtrl extends Component {

    @property
    public moveSpeed = 1;

    @property
    public moveSpeedShiftScale = 5;

    @property({ slide: true, range: [0.05, 0.5, 0.01] })
    public damp = 0.2;

    @property
    public rotateSpeed = 10;

    private _euler = new Vec3();
    private _velocity = new Vec3();
    private _position = new Vec3();
    private _speedScale = 1;

    //private _canUpdate = true
    private rootNode:Node = null
    private _rotateTarget:Node = null
    private _subTarget:Node = null

    private _initEulerY:number
    private _initEulerX:number

    private animModle:Node = null
    private startPalyAnim = false
    private timer = 0
    private vec3:Vec3 = new Vec3()
    private targetSacle = new Vec3(1.3,1.3,1.3)
    private originalScale = new Vec3()
    private touchList : Array<Touch> = new Array<Touch>()
    private touchPos1 :Vec2 = null
    private touchPos2 : Vec2 = null
    /**两点之间的触碰距离 */
    private touchDis:number = 0
    /**是否可以选择X轴 */
    private canRotateVertical = false

    /**是否完成关卡 */
    private finishLevel = false

    /**模型根节点的原始坐标 */
    private originalPos = new Vec3()
    private originalPosVec3:Vec3 = new Vec3()
    /**模型根节点孩子的原始旋转角度 */
    public originalRot = new Quat()
    private originalRotQuat:Quat = new Quat()

    private resetViewTime:number = 0

    private stopRotate:boolean = false

    //恢复的旋转角
    private recoverRotate:Quat = new Quat()
    //恢复的视野
    private recoverOrtheHight:number = 0

    

    public onLoad () 
    {

        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        CustomEventListener.on(Constants.EventName.SWITCH_VIEW,this.switchTarget,this)
        CustomEventListener.on(Constants.EventName.RELEASE_SENCE,this.initTarget,this)
        CustomEventListener.on(Constants.EventName.PALY_MODEL_ANIM,this.palyModelAnim,this)
        CustomEventListener.on(Constants.EventName.ROTATE_X,this.setRotateX,this)
        CustomEventListener.on(Constants.EventName.DiSABLE_RPTATE,this.stopTouchRotate,this)
        CustomEventListener.on("recoverView",this.recoverView,this)
    }

    public start()
    {
        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);

        this.rootNode = find("ModelNode")
        this._rotateTarget = this.rootNode
        this.originalPos = this.rootNode.getPosition()
        
        this._initEulerY = this.rootNode.eulerAngles.y
        this._initEulerX = this.rootNode.eulerAngles.y

        this.originalRot = this.rootNode.getRotation()

        this.recoverOrtheHight = Level.getInstance().cameraOrthoHeight

    }

    public onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        CustomEventListener.off(Constants.EventName.SWITCH_VIEW,this.switchTarget,this)
        CustomEventListener.off(Constants.EventName.RELEASE_SENCE,this.initTarget,this)
        CustomEventListener.off(Constants.EventName.PALY_MODEL_ANIM,this.palyModelAnim,this)
        CustomEventListener.off(Constants.EventName.ROTATE_X,this.setRotateX,this)
        CustomEventListener.off(Constants.EventName.DiSABLE_RPTATE,this.stopTouchRotate,this)
        CustomEventListener.off("recoverView",this.recoverView,this)
    }

    public update (dt) {
        if(this.startPalyAnim)
        {
            this.timer +=dt
            Vec3.lerp(this.vec3,this.animModle.scale,this.targetSacle,0.4)
            this.animModle.setScale(this.vec3)
            if(this.timer>=0.5)
            {
                this.startPalyAnim =false
                this.timer = 0
                this.animModle.setScale(this.originalScale)
            }
        }
        //0.5秒时间恢复视野
        if(this.resetViewTime<1)
        {
            if(this.finishLevel)
            {
                this.resetViewTime += dt
                CameraCtrl.getInstance().setOrthoHeiget(lerp(CameraCtrl.getInstance().mainCameraOrther,Level.getInstance().cameraOrthoHeight,0.1))
                Vec3.lerp(this.originalPosVec3,this.rootNode.position,this.originalPos,0.1)
                Vec3.lerp(this.originalRotQuat,this.rootNode.children[0].rotation,this.originalRot,0.1)
                this.rootNode.setPosition(this.originalPosVec3)
                this.rootNode.children[0].setRotation(this.originalRotQuat)
            }
        }
        //恢复完视野后模型一边旋转一边往下移动1秒
        else if(this.resetViewTime>1&&this.resetViewTime<3.5)
        {
            this.resetViewTime += dt
            //Vec3.lerp(this.originalPosVec3,this.rootNode.position,find("LevelFinishNode").position,0.1)
            //this.rootNode.setPosition(this.originalPosVec3)
            this.rootNode.children[0].setRotationFromEuler(this.rootNode.children[0].eulerAngles.x,this.rootNode.children[0].eulerAngles.y+dt*100,this.rootNode.children[0].eulerAngles.z)
        }
        
        //6秒后一边完上移动一边旋转1秒
        else if(this.resetViewTime>3.5&&this.resetViewTime<5.5)
        {
            this.resetViewTime += dt
            //Vec3.lerp(this.originalPosVec3,this.rootNode.position,this.originalPos,0.1)
            //this.rootNode.setPosition(this.originalPosVec3)
            this.rootNode.children[0].setRotationFromEuler(this.rootNode.children[0].eulerAngles.x,this.rootNode.children[0].eulerAngles.y+dt*100,this.rootNode.children[0].eulerAngles.z)
        }
    }


    public onTouchStart (e) {
        
        if (cc.game.canvas.requestPointerLock) { cc.game.canvas.requestPointerLock(); }
    }

    public onTouchMove (e,a) {
        if(!this.stopRotate)
        {
            this.touchList = a.getTouches()
            if(a.getTouches().length === 1)
            {
                e.getStartLocation(v2_1)
                if (v2_1.y > cc.game.canvas.height * 0.2) { 
                    e.getDelta(v2_2)
                }
                if(!this.canRotateVertical)
                {
                    Quat.fromEuler(qt_1, 0, v2_2.x * this.rotateSpeed * 0.1, 0)
                }
                else
                {
                    Quat.fromEuler(qt_1, -v2_2.y * this.rotateSpeed * 0.1, v2_2.x * this.rotateSpeed * 0.1, 0)
                }
                if(this._rotateTarget.name === "ModelNode")
                {
                    if(!this.canRotateVertical)
                    {
                        this._rotateTarget.children[0].rotate(qt_1,Node.NodeSpace.LOCAL)
                    }
                    else
                    {
                        this._rotateTarget.children[0].rotate(qt_1,Node.NodeSpace.WORLD)
                    }
                }
                else
                {
                    this._rotateTarget.rotate(qt_1,Node.NodeSpace.WORLD)
                }
            }
            if(a.getTouches().length === 2)
            {
                this.touchPos1 = a.getTouches()[0].getLocation()
                this.touchPos2 = a.getTouches()[1].getLocation()
                
                if(this.touchDis === null)
                {
                    //todo
                }
                else
                {
                   // console.info(this.touchDis - Vec2.distance(this.touchPos1,this.touchPos2))
                    if((this.touchDis - Vec2.distance(this.touchPos1,this.touchPos2)) === 0)
                    {
    
                    }
                    else if((this.touchDis - Vec2.distance(this.touchPos1,this.touchPos2))<0)
                    {
                        let orthoHeight = CameraCtrl.getInstance().mainCameraOrther
                        orthoHeight -= orthoHeight*0.02
                        if(orthoHeight<=CameraCtrl.getInstance().switchOriginalOrthoHeiget*0.7)
                        {
                            orthoHeight = CameraCtrl.getInstance().switchOriginalOrthoHeiget*0.7
                        }
                        CameraCtrl.getInstance().setOrthoHeiget(orthoHeight)
                    }
                    else
                    {
                        let orthoHeight = CameraCtrl.getInstance().mainCameraOrther
                        orthoHeight += orthoHeight*0.02
                        if(orthoHeight>=CameraCtrl.getInstance().switchOriginalOrthoHeiget*1.3)
                        {
                            orthoHeight = CameraCtrl.getInstance().switchOriginalOrthoHeiget*1.3
                        }
                        CameraCtrl.getInstance().setOrthoHeiget(orthoHeight)
                    }
                }
                this.touchDis = Vec2.distance(this.touchPos1,this.touchPos2)
            }
        }
        
    }

    public onTouchEnd (e) {
        if (document.exitPointerLock) { document.exitPointerLock(); }
        e.getStartLocation(v2_1);
        if (v2_1.x < cc.game.canvas.width * 0.4) {
            this._velocity.x = 0;
            this._velocity.z = 0;
        }
        this.touchDis = null
        CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)
    }


    /**切换目标 */
    private switchTarget(node:Node){
        this._euler.y = 0
        var temp:Vec3 = new Vec3()
        Quat.toEuler(temp,node.rotation)
        this._rotateTarget = node
        CameraCtrl.getInstance().recoverTargetNode()
        
        if(node.name === "ModelNode")
        {
            CameraCtrl.getInstance().setOrthoHeiget(Level.getInstance().cameraOrthoHeight)
            CameraCtrl.getInstance().switchOriginalOrthoHeiget = Level.getInstance().cameraOrthoHeight
        }
        else
        {
            let size = node.getComponent(Model).getModelSize
            CameraCtrl.getInstance().setOrthoHeiget(size)
            CameraCtrl.getInstance().switchOriginalOrthoHeiget = size
        }
        CameraCtrl.getInstance().setTargetNode(node)
        this.recoverOrtheHight = CameraCtrl.getInstance().switchOriginalOrthoHeiget
        if(this._rotateTarget.name === "ModelNode")
        {
            this.recoverRotate = this._rotateTarget.children[0].rotation.clone()
        }
        else
        {
            this.recoverRotate = this._rotateTarget.rotation.clone()
        }
    }

    /**初始化目标 */
    private initTarget()
    {
        this.switchTarget(this.rootNode)
    }

    /**播放模型动画 */
    private palyModelAnim(node:Node)
    {
        // this.originalScale = node.getScale()
        // Vec3.scaleAndAdd(this.targetSacle,node.scale,node.scale,0.3)
        // this.animModle = node
        // this.startPalyAnim = true
        let originalScale = node.getScale()
        cc.tween(node).repeat(1,
            cc.tween()
            .to(0.2,{scale:originalScale.clone().multiplyScalar(1.3)},{easing:"sineOut"})
            .to(0.1,{scale:originalScale.clone().multiplyScalar(1.3)},{easing:"sineOut"})
            .to(0.1,{scale:originalScale.clone().multiplyScalar(1)},{easing:"sineIn"})
            .to(0.1,{scale:originalScale.clone().multiplyScalar(1.1)},{easing:"sineOut"})
            .to(0.1,{scale:originalScale.clone().multiplyScalar(1)},{easing:"sineIn"})
            )
        .start()
    }

    /**设置可否旋转X */
    private setRotateX(state:boolean)
    {
        this.canRotateVertical = state
        this.finishLevel = true
    }


    private stopTouchRotate()
    {
        this.stopRotate = true
    }

    private recoverView()
    {
        let rotateTarger = null
        if(this._rotateTarget.name === "ModelNode")
        {
            rotateTarger = this._rotateTarget.children[0]
        }
        else
        {
            rotateTarger = this._rotateTarget
        }
        let euler = new Vec3()
        this.recoverRotate.getEulerAngles(euler)
        cc.tween(rotateTarger).repeat(1,cc.tween()
        .to(0.5,{eulerAngles:euler},{easing:"sineOut"}))
        .call(()=>{CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY)})
        .start()
        CameraCtrl.getInstance().recoverOrthoHeight(this.recoverOrtheHight)
    }

    onDisable()
    {
        CustomEventListener.off(Constants.EventName.SWITCH_VIEW,this.switchTarget,this)
        CustomEventListener.off(Constants.EventName.RELEASE_SENCE,this.initTarget,this)
        CustomEventListener.off(Constants.EventName.PALY_MODEL_ANIM,this.palyModelAnim,this)
        CustomEventListener.off(Constants.EventName.ROTATE_X,this.setRotateX,this)
    }
}

