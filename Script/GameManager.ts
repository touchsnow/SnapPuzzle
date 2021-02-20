import { _decorator, Component, Node } from 'cc';
import { GameUI } from './UI/GameUI';
import { MainPageSetting } from './MainPageSetting';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager{
   
    private static gameManager: GameManager
    private constructor() {
       
    }
    public static getInstance(): GameManager {
      if (this.gameManager == null) {
        this.gameManager = new GameManager()
      }
      return GameManager.gameManager
    }

    public isFirstOpenGame:boolean = true

    public gameUI:GameUI = null

    public mainPageSetting:MainPageSetting = null



    public releasePromoty()
    {
      this.gameUI.promotyList.forEach(element => {
        element.recoverMat()
        element.removeThis()
      });
      this.gameUI.isPromotying = false
      this.gameUI.promotyList = new Array<any>()
    }
}
