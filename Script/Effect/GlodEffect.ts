import { _decorator, Component, Node, Prefab, Vec2, loader, instantiate, find } from 'cc';
import { PrefabsMgr } from '../PrefabsMgr';
import { AudioManager } from '../AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GlodEffect')
export class GlodEffect extends Component {
    
    @property(Node)
    targetNode:Node = null

    @property(Node)
    startNode:Node = null

    @property(Prefab)
    cionPrefab:Prefab = null

    start ()
    {
        
    }

    getCirclePoints(r: number, pos: Vec2, count: number, randomScope: number = 60): Vec2[] {
        let points = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
          let x = pos.x + r * Math.sin(radians * i);
          let y = pos.y + r * Math.cos(radians * i);
           let int = Math.random()*3
           //console.info(int)
        //    if(int.toFixed(0) === "0")
        //    {
            points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        //    }
        //    if(int.toFixed(0) === "1")
        //    {
        //     points.unshift(cc.v3(x + Math.random() * randomScope, y - Math.random() * randomScope, 0));
        //    }
        //    if(int.toFixed(0) === "2")
        //    {
        //     points.unshift(cc.v3(x - Math.random() * randomScope, y - Math.random() * randomScope, 0));
        //    }

        //    if(int.toFixed(0) === "3")
        //    {
        //     points.unshift(cc.v3(x - Math.random() * randomScope, y + Math.random() * randomScope, 0));
        //    }
        }
        return points;
    }


    public PalyCionAmin()
    {
        this.scheduleOnce(() => {
            AudioManager.getInstance().playSound("ReceivingMoney")
        }, 0.5);
        let cionNum:Number = 10
        let cionList:Array<Node> = new Array<Node>()
        for(var i = 0;i<cionNum;i++)
        {
            let cion:Node = instantiate(this.cionPrefab)
            cion.setParent(find("Canvas"))
            cion.setWorldPosition(this.startNode.worldPosition)
            cionList.push(cion)
        }

        let pointList = this.getCirclePoints(90,cc.v2(this.startNode.worldPosition.x,this.startNode.worldPosition.y,0),10,25)
        pointList.sort(function() { return 0.5 - Math.random(); });

        cionList.forEach((element,index) => {
            cc.tween(element).repeat(1,cc.tween()
            .to(0.3,{worldPosition:cc.v3(pointList[index].x,pointList[index].y,0)},{easing:"sineOut"}))
            .to(index*0.03,{worldPosition:cc.v3(pointList[index].x,pointList[index].y,0)},{easing:"sineOut"})
            .to(0.3,{worldPosition:this.targetNode.worldPosition},{easing:"sineOut"})
            .start()
        })

    }

    
    

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
