import { _decorator, Component, Node } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;



@ccclass('GameModeManager')
export class GameModeManager{

    private static gameModeManager: GameModeManager
    
    private constructor() {}
    public static instance(): GameModeManager {
      if (this.gameModeManager == null) {
        this.gameModeManager = new GameModeManager()
      }
      return GameModeManager.gameModeManager
    }

    public gameMode:string = Constants.GameMode.UnCoin
}
