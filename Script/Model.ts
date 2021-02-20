import { _decorator, Component, Node, ModelComponent, Material, loader, instantiate, find, Vec3, Size} from 'cc';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener/CustomEventListener';
import { ResMgr } from './ResMgr';
import { PromotyEffectFadeIn } from './Effect/PromotyEffectFadeIn';
import { PromotyEffectFadeOut } from './Effect/PromotyEffectFadeOut';
import { PromotyEffect } from './Effect/PromotyEffect';
const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends Component {

    /**初始材质 */
    public originalMats : Array<Material> = new Array<Material>()

    /**模型中心点 */
    public centerPiont:Vec3

    /**模型大小 */
    private modelSize:number

    /**存储子模型的数组 */
    public subModel: Array<Model> = new Array<Model>()

    public subSlot:Node = null

    /**是模型还是节点 */
    public isModel:boolean = false

    /**是否需要进行子匹配 */
    public needSubMatch:boolean = false

    public isMacthed = false
    /**节点中心与模型中心的偏移量 */
    public offset:Vec3 = new Vec3()

    private phongMaterial:Material =  null

    public isSubMode = false
    start () {
        this.init()
       }

    public init()
    {
        this.phongMaterial = ResMgr.Instance.getAsset("Mat/Phong")
        //是否有ModelComponent组建，无：为节点，有：为模型，获取模型数据
        if(this.node.getComponent(ModelComponent) === null)
        {
            this.isModel = false  
           // console.info("不是模型")
        }
        else
        {
            this.isModel = true
            this.node.getComponent(ModelComponent).materials.length           
            var i
            for(i = 0;i<this.node.getComponent(ModelComponent).materials.length  ;i++)
            {
                this.originalMats[i] = this.node.getComponent(ModelComponent).getMaterial(i)
            }
            var a :Vec3 = new Vec3()
            var b :Vec3 = new Vec3()
            this.node.getComponent(ModelComponent).model.worldBounds.getBoundary(a,b)
            
            this.modelSize = Vec3.distance(a,b)
        }
        //this.isMacthed = true
        //是否需要进行子匹配
        if(this.node.name.indexOf("sub") !== -1 ||this.node.name.indexOf("Sub") !== -1)
        {
            if(this.node.parent.name.indexOf("sub") !== -1||this.node.parent.name.indexOf("Sub") !== -1)
            {
                this.needSubMatch = false
                this.isMacthed = false
            }
            else
            {
                
                this.needSubMatch = true
                this.isMacthed = false
            }
        }

        //为子模型添加此类
        this.node.children.forEach(element => {
            element.addComponent(Model)
            this.subModel.push(element.getComponent(Model))
        })
        //模型的中心坐标
        //this.centerPiont = this.node.worldPosition
        if(this.isModel)
        {
            this.centerPiont = this.node.getComponent(ModelComponent).model.worldBounds.center
            //Vec3.subtract(this.offset,this.node.worldPosition,this.getModelCenter)
        }
        else
        {
            this.centerPiont = this.node.worldPosition
            this.offset = Vec3.ZERO
        }
        if(this.node.parent.name.indexOf("sub") !== -1 ||this.node.parent.name.indexOf("Sub") !== -1)
        {
            this.isSubMode = true
        }
        //console.info(this.node.worldPosition)
        //console.info(this.getModelSize)

        //console.info(this.node.name+"的offset为："+ this.offset)
    }

    update()
    {

    }

    /**通过计算子节点模型的大小合算此节点模型的大小 */
    public get getModelSize():number{
        var currentCenterPiont
        var currentModelSize
        var i 
        //console.info("这个节点的名称是："+this.node.name)
        //console.info("这个节点的子节点有："+this.subModel.length)
        if(this.subModel)
        {
            if(this.subModel.length === 0)
            {
                //console.info("================没有子模型")
                //console.info(this.node.name+this.modelSize)
                return this.modelSize
            }
            else
            {
                for(i = 0;i<= this.subModel.length-1;i++)
                {
                    
                    if(i === 0)
                    {
                        currentCenterPiont = this.subModel[i].centerPiont
                        currentModelSize = this.subModel[i].getModelSize
                        if(i===this.subModel.length-1)
                        {
                            break
                        }
                    }
                    else
                    {
                        var centerPiont = this.subModel[i].centerPiont
                        var modelSize = this.subModel[i].getModelSize
                        var centerDis = Vec3.distance(currentCenterPiont,centerPiont)
                        //合并模型尺寸需要核算  //两个模型交叉或分离
                        if(centerDis>currentModelSize/2&&centerDis>modelSize/2)
                        {
                            var LastSize = currentModelSize as number
                            currentModelSize = currentModelSize/2+modelSize/2+Vec3.distance(currentCenterPiont,centerPiont)
                            var centerVec : Vec3 = new Vec3()
                            var result:Vec3 = new Vec3()
                            if(LastSize>modelSize)
                            {
                                Vec3.subtract(centerVec,centerPiont,currentCenterPiont)
                                Vec3.scaleAndAdd(result, currentCenterPiont,centerVec.normalize(),(currentModelSize/2-modelSize))
                            }
                            else
                            {
                                Vec3.subtract(centerVec,currentCenterPiont,centerPiont)
                                Vec3.scaleAndAdd(result, centerPiont,centerVec.normalize(),(currentModelSize/2-LastSize))
                            }
                            currentCenterPiont = result
                        }
                        //合并模型尺寸为大的那个模型
                        else
                        {
                            if(currentModelSize>modelSize)
                            {
                                currentModelSize = currentModelSize
                                currentCenterPiont = currentCenterPiont
                            }
                            else
                            {
                                currentModelSize = modelSize
                                currentCenterPiont = centerPiont
                            }     
                        }
                        if(i===this.subModel.length-1)
                        {
                            break
                        }
                    }
                }
    
                if(this.isModel)
                {
                    var centerPiont = this.centerPiont
                    var modelSize = this.modelSize
                    var centerDis = Vec3.distance(currentCenterPiont,centerPiont)
                    //合并模型尺寸需要核算
                    if(centerDis>currentModelSize/2&&centerDis>modelSize/2)
                    {
                        var LastSize = currentModelSize as number
                        currentModelSize = currentModelSize/2+modelSize/2+Vec3.distance(currentCenterPiont,centerPiont)
                        var centerVec : Vec3 = new Vec3()
                        var result:Vec3 = new Vec3()
                        if(LastSize>modelSize)
                        {
                            Vec3.subtract(centerVec,centerPiont,currentCenterPiont)
                            Vec3.scaleAndAdd(result, currentCenterPiont,centerVec.normalize(),(currentModelSize/2-modelSize))
                        }
                        else
                        {
                            Vec3.subtract(centerVec,currentCenterPiont,centerPiont)
                            Vec3.scaleAndAdd(result, centerPiont,centerVec.normalize(),(currentModelSize/2-LastSize))
                        }
                        currentCenterPiont = result
                    }
                    //合并模型尺寸为大的那个模型
                    else
                    {
                        if(currentModelSize>modelSize)
                        {
                            currentModelSize = currentModelSize
                            currentCenterPiont = currentCenterPiont
                        }
                        else
                        {
                            currentModelSize = modelSize
                            currentCenterPiont = centerPiont
                        }      
                    }
                }
            //console.info(this.node.name+currentModelSize)
            return currentModelSize
            }
        }
        return -1
        
    }

    /**通过计算子节点模型的大小合算此节点模型的大小 */
    public get getModelCenter():Vec3{
        var currentCenterPiont
        var currentModelSize
        var i 
        //console.info("这个节点的名称是："+this.node.name)
        //console.info("这个节点的子节点有："+this.subModel.length)
        if(this.subModel)
        {
            if(this.subModel.length === 0)
            {
                //console.info("================没有子模型")
                return this.centerPiont
            }
            else
            {
                for(i = 0;i<= this.subModel.length-1;i++)
                {
                    
                    if(i === 0)
                    {
                        currentCenterPiont = this.subModel[i].centerPiont
                        currentModelSize = this.subModel[i].getModelSize
                        if(i===this.subModel.length-1)
                        {
                            break
                        }
                    }
                    else
                    {
                        var centerPiont = this.subModel[i].centerPiont
                        var modelSize = this.subModel[i].getModelSize
                        var centerDis = Vec3.distance(currentCenterPiont,centerPiont)
                        //合并模型尺寸需要核算
                        if(centerDis>currentModelSize/2&&centerDis>modelSize/2)
                        {
                            var LastSize = currentModelSize as number
                            currentModelSize = currentModelSize/2+modelSize/2+Vec3.distance(currentCenterPiont,centerPiont)
                            var centerVec : Vec3 = new Vec3()
                            var result:Vec3 = new Vec3()
                            if(LastSize>modelSize)
                            {
                                Vec3.subtract(centerVec,centerPiont,currentCenterPiont)
                                Vec3.scaleAndAdd(result, currentCenterPiont,centerVec.normalize(),(currentModelSize/2-modelSize))
                            }
                            else
                            {
                                Vec3.subtract(centerVec,currentCenterPiont,centerPiont)
                                Vec3.scaleAndAdd(result, centerPiont,centerVec.normalize(),(currentModelSize/2-LastSize))
                            }
                            currentCenterPiont = result
                        }
                        //合并模型尺寸为大的那个模型
                        else
                        {
                            if(currentModelSize>modelSize)
                            {
                                currentModelSize = currentModelSize
                                currentCenterPiont = currentCenterPiont
                            }
                            else
                            {
                                currentModelSize = modelSize
                                currentCenterPiont = centerPiont
                            }     
                        }
                        if(i===this.subModel.length-1)
                        {
                            break
                        }
                    }
                }
    
                if(this.isModel)
                {
                    var centerPiont = this.centerPiont
                    var modelSize = this.modelSize
                    var centerDis = Vec3.distance(currentCenterPiont,centerPiont)
                    //合并模型尺寸需要核算
                    if(centerDis>currentModelSize/2&&centerDis>modelSize/2)
                    {
                        var LastSize = currentModelSize as number
                        currentModelSize = currentModelSize/2+modelSize/2+Vec3.distance(currentCenterPiont,centerPiont)
                        var centerVec : Vec3 = new Vec3()
                        var result:Vec3 = new Vec3()
                        if(LastSize>modelSize)
                        {
                            Vec3.subtract(centerVec,centerPiont,currentCenterPiont)
                            Vec3.scaleAndAdd(result, currentCenterPiont,centerVec.normalize(),(currentModelSize/2-modelSize))
                        }
                        else
                        {
                            Vec3.subtract(centerVec,currentCenterPiont,centerPiont)
                            Vec3.scaleAndAdd(result, centerPiont,centerVec.normalize(),(currentModelSize/2-LastSize))
                        }
                        currentCenterPiont = result
                    }
                    //合并模型尺寸为大的那个模型
                    else
                    {
                        if(currentModelSize>modelSize)
                        {
                            currentModelSize = currentModelSize
                            currentCenterPiont = currentCenterPiont
                        }
                        else
                        {
                            currentModelSize = modelSize
                            currentCenterPiont = centerPiont
                        }      
                    }
                }
            return currentCenterPiont
            }
        } 
        return new Vec3(0,0,0)       
    }




    /**恢复模型初始材质 */
    public recoverMat(){
        if(this.isModel)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.getComponent(ModelComponent).setMaterial(this.originalMats[i],i)
            }
        }
        this.subModel.forEach(element => {
            element.recoverMat()
        })
    }

    public initMat()
    {
        if(this.isModel)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/Init")),i)
            }
        }
        this.subModel.forEach(element => {
            element.initMat()
        })
    }

    public changeMat()
    {
            if(this.isModel)
            {
                this.node.getComponent(ModelComponent).material =ResMgr.Instance.getAsset("Mat/ChangeMat")
            }
            this.subModel.forEach(element => {
                element.changeMat()
            })
    }

    //格子里未匹配的模型材质
    public unMatchMat()
    {

            if(this.isModel)
            {
                this.node.getComponent(ModelComponent).material =ResMgr.Instance.getAsset("Mat/UnMatch")
            }
            if(this.needSubMatch)
            {
                this.subModel.forEach(element => {
                    element.unMatchMat()
                })
            }
    }


    /**格子显示的模型材质 */
    public slotMat(){
        //console.info(this.node)
        if(this.node)
        {        
            loader.loadRes("Mat/SlotMat",Material,(err:any,mat:Material)=>{
            if(this.isModel)
            {
                
                this.node.getComponent(ModelComponent).material = mat
                //console.info("已经换成SlotMat了")
    
            }
            if(this.needSubMatch)
            {
                if(this.subModel !== null)
                {
                    this.subModel.forEach(element => {
                        element.slotMat()
                    });
                }

            }
            if(this.subModel!==null)
            {
                this.subModel.forEach(element => {
                    element.slotMat()
                }); 
            }
            
        })
        }
    }

    //格子里未匹配的模型材质
    public phongMat(){
        if(this.isModel)
        {
            this.node.getComponent(ModelComponent).material = ResMgr.Instance.getAsset("Mat/Phong")
        }
        this.subModel.forEach(element => {
            element.phongMat()
        })
    }


    public transParentFakeIn()
    {
        
        if(this.isModel)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                //(this.node.getComponent(ModelComponent).material.parent.effectName)
                if(this.node.getComponent(ModelComponent).material.parent.effectName.indexOf("Phong") === -1)
                {
                    this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/InitTransparent")),i)
                }
                else
                {
                    this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/PhongTransparent")),i)
                }
            }
            
            if(this.node.getComponent(PromotyEffectFadeIn) === null)
            {
                this.node.addComponent(PromotyEffectFadeIn)
            }
            else
            {
                this.node.getComponent(PromotyEffectFadeIn).removeThis()
                this.scheduleOnce(() => {
                    this.node.addComponent(PromotyEffectFadeIn)
                }, 0.1);
            }
            //this.node.addComponent(PromotyEffectFadeIn)

        }
        this.subModel.forEach(element => {
            element.transParentFakeIn()
        })
    }



    public transParentFakeOut()
    {

        // if(this.isModel)
        // {
        //     if(this.node.getComponent(PromotyEffectFadeOut) === null)
        //     {
        //         this.node.addComponent(PromotyEffectFadeOut)
        //     }
        //     else
        //     {
        //         this.node.getComponent(PromotyEffectFadeOut).removeThis()
        //         setTimeout(() => {
        //             this.node.addComponent(PromotyEffectFadeOut)
        //         }, 100);
        //     }
        // }
        this.node.addComponent(PromotyEffectFadeOut)

    }

    public PromotyEffect()
    {

        if(this.isModel)
        {
            for(var i = 0;i<=this.node.getComponent(ModelComponent).materials.length-1;i++)
            {
                this.node.getComponent(ModelComponent).setMaterial((ResMgr.Instance.getAsset("Mat/ChangeMat")),i)
            }
            this.node.addComponent(PromotyEffect)
        }
        this.subModel.forEach(element => {
            element.PromotyEffect()
        })

    }

    recoverUIMat(model:Node)
    {
        if(model.getComponent(Model).needSubMatch)
        //if(this.needSubMatch)
        {
            this.unMatchMat()
        }
        else
        {
            this.slotMat()
        }
    }



    public changeLayer()
    {
        this.node.layer = 524288
        this.subModel.forEach(element => {
            element.changeLayer()
        })
    }
}

