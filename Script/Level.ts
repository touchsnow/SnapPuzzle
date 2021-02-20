import { _decorator, Component, Node, SpriteComponent, SpriteFrame } from 'cc';
import { GameData } from './GameData';
import { GameStorage } from './GameStorage';
import { Achievement } from './Achievement';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level{

    private static level: Level
    
    private constructor() {}
    public static getInstance(): Level {
      if (this.level == null) {
        this.level = new Level()
      }
      return Level.level
    }

    //模型的名字
    public modeleName :string = null
    //相机高度
    public cameraOrthoHeight = null

    public BGColor = null
    //游戏数据
    public gameDate:GameData = null
    //游戏成就
    public achievement:Achievement = null
    //关卡名字
    public levelName:string = null
    //关卡需加载的模型数量
    public LoadModelCount:number = 0
    //关卡已经加载的模型数量
    public LoadedModelCount:number = 0
    //关卡需恢复数据的模型数量
    public recoverModelCount:number = 0
    //关卡已经恢复得模型数量
    public recoveredModelCount:number = 0
    //是否正在恢复数据
    public recoveringData:boolean = false

    public levelStar:number = 0

    public playerMoney:number = 0

    public levelSprite:SpriteFrame = null

    public levelIndex:number = 0
    
    public get modelNode()
    {
        return "ModelNode/"+this.modeleName+"/RootNode/"+this.modeleName
    }

    public get rewardMoney()
    {
        return 100
    }

    public resetLevel()
    {
      this.LoadModelCount = this.gameDate.TotalCount
      this.LoadedModelCount = 0
      this.recoverModelCount = this.gameDate.MatchCount
      this.recoveredModelCount = 0
      this.recoveringData = false
    }

}
