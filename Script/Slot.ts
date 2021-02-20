import { _decorator, Component, Node, find, instantiate, Vec2, Vec3, Material, loader, ModelComponent, Quat, ScrollViewComponent, quat } from 'cc';
import { MatchItem } from './MatchItem';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { Constants } from './Constants';
import { Model } from './Model';
import { CameraCtrl } from './CameraCtrl';
import { Level } from './Level';
import { AudioManager } from './AudioManager';
import { GameStorage } from './GameStorage';
import ASCAd from './ADPlugin/ASCAd';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {

    /** 格子储存的模型*/
    private Item: Node = new Node()

    /** 本体的匹配模型*/
    private matchItem: MatchItem = null

    /** 模型的本体模型*/
    public targetItem: Node = new Node

    /**是否匹配上*/
    private isMatching = false

    private hadSpwanMatchItem = false

    /**触摸移动变化量 */
    private v3: Vec3 = new Vec3()

    /**手指到模型的偏移量 */
    private offsetDrag: number = 0
    /**屏幕偏移点 */
    private offsetYPoint: number = null

    private moveSwitchFalg:boolean = false



    start() {

        this.init()
        //注册事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        CustomEventListener.on(Constants.EventName.UPDATA_MODEL_DISPALY, this.updateRotation, this)
    }

    init(): void {
        this.Item = this.node.children[0]
        this.Item.rotate(CameraCtrl.getInstance().mainCameraNode.rotation, 0)

        if (this.Item.getComponent(Model).needSubMatch) {
            this.Item.getComponent(Model).unMatchMat()
        }
        else {
            this.Item.getComponent(Model).slotMat()
        }
        this.offsetYPoint = cc.view.getCanvasSize().height * 2 / 5
    }


    /**实例匹配模型 */
    private onTouchStart(e) {

        CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SELLECT_MODEL, this.Item,this.targetItem)
        

        var pos: Vec2 = new Vec2()
        e.getLocation(pos)
        this.offsetDrag = this.offsetYPoint - pos.y
        CustomEventListener.dispatchEvent(Constants.EventName.GUIDER_TOW, this.node)
        if (!(this.targetItem.getComponent(Model).needSubMatch && !this.targetItem.getComponent(Model).isMacthed) || this.Item.getComponent(Model).isMacthed) {
            return
        }
        else {
            //进行场景切换
            //1.显示Ui
            // CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SLOT, this.targetItem.getComponent(Model).subSlot)
            // //2.切换镜头目标
            // setTimeout(() => { CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY) }, 40)
        }

        //if(Level.getInstance().gameDate.openCount === 0 && Level.getInstance().gameDate.Level === "000_1" && !Level.getInstance().gameDate.hadfinishedLevel)
        //{

        //} 
    }


    /**使匹配模型跟随触摸点移动 */
    private onTouchMove(e) {
        e.getDelta(this.v3)
        if (this.v3.y >= 8) {
            this.node.parent.parent.parent.getComponent(ScrollViewComponent).enabled = false
            if (this.hadSpwanMatchItem === false) {
                if (!(this.targetItem.getComponent(Model).needSubMatch && !this.targetItem.getComponent(Model).isMacthed) || this.Item.getComponent(Model).isMacthed) {
                    AudioManager.getInstance().playSound("dragStart_1")
                    let node = instantiate(this.targetItem) as Node
                    node.setParent(find("MatchNode"))
                    this.matchItem = node.addComponent(MatchItem)
                    this.matchItem.getComponent(MatchItem).targetItem = this.targetItem
                    this.hadSpwanMatchItem = true
                }
                else
                {
                    if(this.moveSwitchFalg === false)
                    {
                        this.moveSwitchFalg = true
                        //1.显示Ui
                        CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SLOT, this.targetItem.getComponent(Model).subSlot)
                        //2.切换镜头目标
                        setTimeout(() => { CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY) }, 40)
                        this.scheduleOnce(()=>{this.moveSwitchFalg = false},2)
                    }
                }
            }
        }

        if (this.hadSpwanMatchItem) {
            var pos: Vec2 = new Vec2()
            e.getLocation(pos)
            var posY = pos.y + this.offsetDrag
            if (posY <= this.offsetYPoint + this.targetItem.getComponent(Model).getModelSize / 3 / CameraCtrl.getInstance().mainCameraOrther * cc.view.getCanvasSize().width / 10) {
                posY = this.offsetYPoint + this.targetItem.getComponent(Model).getModelSize / 3 / CameraCtrl.getInstance().mainCameraOrther * cc.view.getCanvasSize().width / 10
            }
            this.matchItem.node.setPosition(CameraCtrl.getInstance().hitPoint(pos.x, posY))
            if (CameraCtrl.getInstance().screenDistance(this.targetItem.worldPosition, this.matchItem.node.worldPosition) <= 50) {
                if (!this.isMatching) {
                    this.isMatching = true
                    loader.loadRes("Mat/ChangeMat", Material, (err: any, mat: Material) => {
                        if(!GameManager.getInstance().gameUI.isPromotying)
                        {
                            this.targetItem.getComponent(Model).changeMat()
                        }
                        this.matchItem.getComponent(MatchItem).MatchMat()
                    })
                }
            }
            else {

                loader.loadRes("Mat/Init", Material, (err: any, mat: Material) => {
                    if (this.isMatching) {
                        // if(GameManager.getInstance().gameUI.sellectMode !== this.targetItem && !GameManager.getInstance().gameUI.isPromotying)
                        // {
                        //     this.targetItem.getComponent(Model).initMat()
                        // }
                        // this.matchItem.getComponent(MatchItem).recoverMat()
                        if(GameManager.getInstance().gameUI.isPromotying)
                        {
                            this.matchItem.getComponent(MatchItem).recoverMat()
                        }
                        else
                        {
                            this.targetItem.getComponent(Model).initMat()
                            this.matchItem.getComponent(MatchItem).recoverMat()
                        }
                        this.isMatching = false
                    }
                })
            }

        }
    }


    /**触摸结束后动作，检查是否匹配完成 */                                                      //需要重构
    private onTouchCancel(e) {

        this.node.parent.parent.parent.getComponent(ScrollViewComponent).enabled = true
        if (this.hadSpwanMatchItem === true) {
            this.matchItem.node.destroy()
            this.hadSpwanMatchItem = false
            if (this.isMatching) {
                GameManager.getInstance().gameUI.offSellectModel()
                Level.getInstance().gameDate.isUnLock = true
                Level.getInstance().gameDate.MatchCount++
                Level.getInstance().gameDate.MatchedItem.delete(this.Item.name)
                AudioManager.getInstance().playSound("dragEnd")
                setTimeout(() => {
                    this.targetItem.getComponent(Model).phongMat()
                    CustomEventListener.dispatchEvent(Constants.EventName.PALY_MODEL_ANIM, this.targetItem)
                }, 60)
                this.targetItem.getComponent(Model).isMacthed = true
                //CustomEventListener.dispatchEvent(Constants.EventName.ADD_PROGRESS_BAR)
                var pos: Vec2 = new Vec2()
                e.getLocation(pos)
                CustomEventListener.dispatchEvent(Constants.EventName.PLAY_SNAP_ANIM, CameraCtrl.getInstance().getScreenPos(this.targetItem.worldPosition))
                CustomEventListener.dispatchEvent(Constants.EventName.PALY_PARTICLE, this.targetItem.worldPosition)
                ASCAd.getInstance().phoneVibrate('short')

                if (this.node.parent.children.length === 1) {
                    AudioManager.getInstance().playSound("congratulation_short")
                    CustomEventListener.dispatchEvent(Constants.EventName.SHOW_TICK, this.node.parent.parent.parent)
                    if (this.targetItem.getComponent(Model).isSubMode) {
                        find("Canvas/GameUI/SlotList/SubSlotList/view/ItemSlot").children.forEach(element => {
                            if (element.children[0].name === this.targetItem.parent.name) {
                                //增加插屏广告
                                if (ASCAd.getInstance().getIntersFlag()) {
                                    ASCAd.getInstance().showInters()
                                }
                                element.children[0].getComponent(Model).slotMat()
                                this.targetItem.parent.getComponent(Model).needSubMatch = false
                                let scale = element.scale.x
                                cc.tween(element).repeat(5,
                                    cc.tween()
                                        .to(0.5, { scale: cc.v3(scale * 0.9, scale * 0.9, scale * 0.9) }, { easing: "sineOut" })
                                        .to(0.5, { scale: cc.v3(scale * 1, scale * 1, scale * 1) }, { easing: "sineIn" })
                                )
                                    .start()
                                setTimeout(() => {
                                    CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SLOT, find("Canvas/GameUI/SlotList/SubSlotList"))
                                }, 1000);
                            }
                        })
                    }
                    if (this.targetItem.parent.name === Level.getInstance().modeleName) {
                        //关卡完成
                        setTimeout(() => {
                            Level.getInstance().gameDate.FinishedLevel = true
                            GameStorage.instance().saveGameData(Level.getInstance().modeleName, Level.getInstance().gameDate)
                            AudioManager.getInstance().playSound("ColoringCompleteAll")
                            CustomEventListener.dispatchEvent(Constants.EventName.ROTATE_X, true)
                            CustomEventListener.dispatchEvent(Constants.EventName.FINISH_LEVEL, true)
                        }, 1000)
                    }
                }
                setTimeout(() => {this.node.destroy()}, 70)
                setTimeout(() => {GameManager.getInstance().gameUI.toggleSwitchSellectModel()}, 200)
                GameStorage.instance().saveGameData(Level.getInstance().modeleName, Level.getInstance().gameDate)
            }
            else {
                if(!GameManager.getInstance().gameUI.isPromotying)
                {
                    this.targetItem.getComponent(Model).initMat()
                }
                this.isMatching = false
            }
        }
    }

    private onTouchEnd(e) {

        this.node.parent.parent.parent.getComponent(ScrollViewComponent).enabled = true
        if (this.hadSpwanMatchItem) {
            // console.info("我已经进来了")
            this.matchItem.node.destroy()
            this.hadSpwanMatchItem = false
            if (this.isMatching) {
                GameManager.getInstance().gameUI.offSellectModel()
                Level.getInstance().gameDate.isUnLock = true
                Level.getInstance().gameDate.MatchCount++
                Level.getInstance().gameDate.MatchedItem.delete(this.Item.name)
                AudioManager.getInstance().playSound("dragEnd")
                setTimeout(() => {
                    this.targetItem.getComponent(Model).phongMat()
                    CustomEventListener.dispatchEvent(Constants.EventName.PALY_MODEL_ANIM, this.targetItem)
                }, 60)
                this.targetItem.getComponent(Model).isMacthed = true
                //CustomEventListener.dispatchEvent(Constants.EventName.ADD_PROGRESS_BAR)
                var pos: Vec2 = new Vec2()
                e.getLocation(pos)
                CustomEventListener.dispatchEvent(Constants.EventName.PLAY_SNAP_ANIM, CameraCtrl.getInstance().getScreenPos(this.targetItem.worldPosition))
                CustomEventListener.dispatchEvent(Constants.EventName.PALY_PARTICLE, this.targetItem.worldPosition)
                ASCAd.getInstance().phoneVibrate('short')
                if (this.node.parent.children.length === 1) {
                    AudioManager.getInstance().playSound("congratulation_short")
                    CustomEventListener.dispatchEvent(Constants.EventName.SHOW_TICK, this.node.parent.parent.parent)
                    if (this.targetItem.getComponent(Model).isSubMode) {
                        find("Canvas/GameUI/SlotList/SubSlotList/view/ItemSlot").children.forEach(element => {
                            if (element.children[0].name === this.targetItem.parent.name) {
                                //增加插屏广告
                                if (ASCAd.getInstance().getIntersFlag()) {
                                    ASCAd.getInstance().showInters()
                                }
                                element.children[0].getComponent(Model).slotMat()
                                this.targetItem.parent.getComponent(Model).needSubMatch = false
                                let scale = element.scale.x
                                cc.tween(element).repeat(5,
                                    cc.tween()
                                        .to(0.5, { scale: cc.v3(scale * 0.9, scale * 0.9, scale * 0.9) }, { easing: "sineOut" })
                                        .to(0.5, { scale: cc.v3(scale * 1, scale * 1, scale * 1) }, { easing: "sineIn" })
                                )
                                    .start()
                                setTimeout(() => {
                                    CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SLOT, find("Canvas/GameUI/SlotList/SubSlotList"))
                                }, 1000)
                            }
                        })
                    }
                    if (this.targetItem.parent.name === Level.getInstance().modeleName) {
                        //关卡完成
                        setTimeout(() => {
                            Level.getInstance().gameDate.FinishedLevel = true
                            GameStorage.instance().saveGameData(Level.getInstance().modeleName, Level.getInstance().gameDate)
                            AudioManager.getInstance().playSound("ColoringCompleteAll")
                            AudioManager.getInstance().stopBGM()
                            CustomEventListener.dispatchEvent(Constants.EventName.ROTATE_X, true)
                            CustomEventListener.dispatchEvent(Constants.EventName.FINISH_LEVEL, true)
                        }, 1000)
                    }
                }
                setTimeout(() => {this.node.destroy()}, 70)
                setTimeout(() => {GameManager.getInstance().gameUI.toggleSwitchSellectModel()}, 200)
                GameStorage.instance().saveGameData(Level.getInstance().modeleName, Level.getInstance().gameDate)
            }
            else {
                if(!GameManager.getInstance().gameUI.isPromotying)
                {
                    this.targetItem.getComponent(Model).initMat()
                }
                this.isMatching = false
            }
            
        }
        if(!(this.targetItem.getComponent(Model).needSubMatch && !this.targetItem.getComponent(Model).isMacthed))
        {
            return
        }
        else
        {
            //1.显示Ui
            CustomEventListener.dispatchEvent(Constants.EventName.SWITCH_SLOT, this.targetItem.getComponent(Model).subSlot)
            //2.切换镜头目标
            setTimeout(() => { CustomEventListener.dispatchEvent(Constants.EventName.UPDATA_MODEL_DISPALY) }, 40)
        }
        return
    }

    /**更新UI格子储存的模型显示 */
    private updateRotation(): void {
        let a = new Vec3()
        Vec3.add(a, this.targetItem.parent.eulerAngles, this.targetItem.eulerAngles)
        let b = new Quat()
        Quat.fromEuler(b, a.x, a.y, a.z)
        var euler:Vec3 = new Vec3();
        this.targetItem.getWorldRotation().clone().getEulerAngles(euler)
        // let c = CameraCtrl.getInstance().mainCamera.node.eulerAngles
        // euler.add(cc.v3(c.x,-c.y,c.z))
        var g:Vec3 = new Vec3();
        this.Item.getWorldRotation().clone().getEulerAngles(g)
        if(g.y-euler.y>180)
        {
            this.Item.setRotationFromEuler(g.x,g.y-360,g.z)
        }
        if(g.y-euler.y<-180)
        {
            this.Item.setRotationFromEuler(g.x,g.y+360,g.z)
        }

        let node:Node = instantiate(this.Item)
        node.setWorldRotationFromEuler(euler.x,euler.y,euler.z)
        let c =  CameraCtrl.getInstance().mainCamera.node.eulerAngles
        let d = new Quat()
        Quat.fromEuler(d,-c.x,c.y,-c.z)
        node.rotate(d,1)
        node.getWorldRotation().getEulerAngles(euler)
        //this.Item.rotate(d,1)
        node.destroy()
        cc.tween(this.Item).repeat(1,cc.tween()
        .to(0.5,{eulerAngles:euler},{easing:"sineOut"}))
        // .call(()=>{
        //     let c =  CameraCtrl.getInstance().mainCamera.node.eulerAngles
        //     let d = new Quat()
        //     Quat.fromEuler(d,-c.x,c.y,-c.z)
        //     this.Item.rotate(d,1)
        //     })
        .start()
        // let a = new Vec3()
        // Vec3.add(a,this.targetItem.parent.eulerAngles,this.targetItem.eulerAngles)
        // let b = new Quat()
        // Quat.fromEuler(b,a.x,a.y,a.z)
        // this.Item.setRotation(this.targetItem.worldRotation)
        // let c =  CameraCtrl.getInstance().mainCamera.node.eulerAngles
        // let d = new Quat()
        // Quat.fromEuler(d,-c.x,c.y,-c.z)
        // this.Item.rotate(d,1)

        // let c = CameraCtrl.getInstance().mainCamera.node.eulerAngles
        // let d = new Quat()
        // Quat.fromEuler(d, -c.x, c.y, -c.z)
        // let rotateTarget: Quat = new Quat()
        // let itemWorldRotation = this.targetItem.worldRotation.clone()
        // Quat.scaleAndAdd(rotateTarget, itemWorldRotation, d, 1)
        // cc.tween(this.Item).repeat(1, cc.tween()
        //     .to(0.5, { worldRotation: rotateTarget }, { easing: "sineOut" }))
        //     .start()
        // this.Item.rotate(d,1)

        //this.Item.position = Vec3.ZERO
        let size = 200 / this.targetItem.getComponent(Model).getModelSize
        let offset = new Vec3()
        Vec3.subtract(offset, this.targetItem.worldPosition, this.targetItem.getComponent(Model).getModelCenter)
        //console.info(Vec3.distance(Vec3.ZERO,offset))

        //this.Item.setPosition(offset.x * size, offset.y * size, offset.z * size)

        cc.tween(this.Item).repeat(1,cc.tween()
        .to(0.5,{position:cc.v3(offset.x*size,offset.y*size,offset.z*size)},{easing:"sineOut"}))
        .start()
    }


    findNodeByName(node: Node, name: string, findNode: Node) {
        node.children.forEach(element => {
            this.findNodeByName(element, name, findNode)
            if (element.name === name) {
                this.targetItem = element
                return
            }
        })
    }



    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
        CustomEventListener.off(Constants.EventName.UPDATA_MODEL_DISPALY, this.updateRotation, this)
    }

}


