import { _decorator, Component, Node, Vec2, Quat, CCInteger, CameraComponent, Vec3, math, instantiate, find, Material, ModelComponent } from 'cc';
import { Constants } from '../Constants';
import { GameData } from '../GameData';
import { GameStorage } from '../GameStorage';
import { Level } from '../Level';
import { ResMgr } from '../ResMgr';
import { MainPageBase } from './MainPageBase';
const { ccclass, property } = _decorator;

@ccclass('ViewPage')
export class ViewPage extends MainPageBase {

    protected v2_1 = new Vec2()
    protected v2_2 = new Vec2()
    protected qt_1 = new Quat()


    @property({
        type: Node,
        displayName: '模型根节点',
        tooltip: '旋转模型的节点'
    })
    rotateAxis: Node = null

    @property({
        type: CCInteger,
        displayName: '滑动速度',
        tooltip: '滑动时模型的旋转速度'
    })
    rotateSpeed = 10;

    /**触摸状态 */
    protected touchState = null

    /**双指触摸距离 */
    private touchDis:number = 0

    @property({
        type: CameraComponent,
        displayName: '主摄像机',
    })
    mainCamera: CameraComponent = null

    @property(Node)
    modelPoint:Node = null

    start() {
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        //实例模型
        let model:Node = null
        console.info("Level/"+Level.getInstance().modeleName)
        console.info("Level/"+GameStorage.instance().getCurrentLevel())

        let gameData = GameStorage.instance().getGameData(Level.getInstance().modeleName)as GameData
        if(gameData.hadfinishedLevel)
        {
            model = instantiate(ResMgr.Instance.getAsset("Level/"+Level.getInstance().modeleName)) as Node
            this.setCameraDistant(Level.getInstance().cameraOrthoHeight)

        }
        else
        {
            let showIndex = GameStorage.instance().getCurrentLevelIndex()-1
            if(showIndex<0)
            {
                showIndex = 0
            }
            model = instantiate(ResMgr.Instance.getAsset("Level/"+Constants.levelInfo.Level[showIndex].level)) as Node
            this.setCameraDistant(Constants.levelInfo.Level[showIndex].orthoHeight)
        }

        model.setParent(this.modelPoint)
        model.setPosition(Vec3.ZERO)
        model.setRotationFromEuler(0,0,0)

        let mat = ResMgr.Instance.getAsset("Mat/Phong")
        this.recoverModelMat(model,mat)


    }


    setDisable()
    {
        this.node.active =false
        this.selfButton.getChildByName("SellectBg").active = false
    }

    setEnable()
    {
        this.node.active = true
        this.selfButton.getChildByName("SellectBg").active = true
    }

    onTouchMove(e) {
        if (e.getTouches().length === 1) {
            e.getStartLocation(this.v2_1)
            e.getDelta(this.v2_2)
            Quat.fromEuler(this.qt_1, this.v2_2.y * this.rotateSpeed * 0.1, 0, 0)
            this.rotateAxis.rotate(this.qt_1, Node.NodeSpace.LOCAL)
            Quat.fromEuler(this.qt_1, 0, -this.v2_2.x * this.rotateSpeed * 0.1, 0)
            this.rotateAxis.rotate(this.qt_1, Node.NodeSpace.WORLD)
            if (this.rotateAxis.eulerAngles.x <= -50) {
                this.rotateAxis.setWorldRotationFromEuler(-50, this.rotateAxis.eulerAngles.y, this.rotateAxis.eulerAngles.z)
            }
            if (this.rotateAxis.eulerAngles.x >= 0) {
                this.rotateAxis.setWorldRotationFromEuler(0, this.rotateAxis.eulerAngles.y, this.rotateAxis.eulerAngles.z)
            }
        }
        // if(e.getTouches().length === 2)
        // {
        //     let touch1 = e.getTouches()[0]
        //     let touch2 = e.getTouches()[1]
        //     let pos1 = touch1.getLocation()
        //     let pos2 = touch2.getLocation()
        //     let newTouchDis = Vec2.distance(pos1,pos2)
        //     if(this.touchDis!==0)
        //     {
        //         this.setCameraDistant((newTouchDis-this.touchDis)*0.001)
        //     }
        //     this.touchDis = newTouchDis
        //     let v2_1 = new Vec2()
        //     let v2_2 = new Vec2()
        //     touch1.getDelta(v2_1)
        //     touch2.getDelta(v2_2)
        //     if(v2_1.x>0&& v2_2.x>0)
        //     {
        //         const result = new Vec3(1, 0, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.x + v2_2.x)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.0001*moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if(v2_1.x<0&& v2_2.x<0)
        //     {
        //         const result = new Vec3(-1, 0, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.x + v2_2.x) 
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.0001*moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if(v2_1.y>0&& v2_2.y>0)
        //     {
        //         const result = new Vec3(0, -1, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.y + v2_2.y) 
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.0001*moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if(v2_1.y<0&& v2_2.y<0)
        //     {
        //         const result = new Vec3(0, 1, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.y + v2_2.y)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.0001*moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        // }
    }

    onTouchEnd(e) {
        this.touchDis = 0
    }

    setCameraDistant(orthoHeight:number)
    {
        this.mainCamera.getComponent(CameraComponent).orthoHeight = orthoHeight*1.3
    }

    recoverModelMat(model:Node,mat:Material)
    {
        
        model.children.forEach(element => {
            if(element.name.indexOf("water") !== -1 || element.name.indexOf("Water") !== -1)return
            if(element.getComponent(ModelComponent))
            {
                element.getComponent(ModelComponent).setMaterial(mat,0)
            }
            this.recoverModelMat(element,mat)
        })
    }

}
