import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainPageSetting')
export class MainPageSetting{

    constructor()
    {
        
    }
    public TabSet:Map<string,boolean> = new Map<string,boolean>()
    public TabSetString:string = null
    public currentLevel:string = null

    // public getSetting(node:Node)
    // {
    //     this.TabSet = new Map<string,boolean>()
    //     for(var i = 0;i<node.children.length;i++)
    //     {
    //         if(node.children[i].name.indexOf("Levels") !== -1)
    //         {
    //             if(node.children[i].active = true)
    //             {
    //                 this.TabSet.set(node.children[i].name,node.children[i].active)
    //             }
    //         }
    //     }
    // }
}
