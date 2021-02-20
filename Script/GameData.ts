import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData
{

    /**关卡等级 */
    public Level:string = null
    /**是否已经完成关卡 */
    public FinishedLevel:boolean = false
    /**已经匹配的个数 */
    public MatchCount:number = 0
    /**总个数 */
    public TotalCount:number = 0
    /**未匹配模型的名字数组 */
    public MatchedItem:Map<string,boolean> = new Map<string,boolean>()
    /**未匹配模型的名字数组sting模式 */
    public MatchedItemString:string = null
    /**打开此关卡次数 */
    public openCount:number = 0
    /**此关卡是否已经解锁 */
    public isUnLock:boolean = false
    /**是否曾经通关过 */
    public hadfinishedLevel:boolean = false

}
