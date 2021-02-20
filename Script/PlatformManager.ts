import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlatformManager')
export class PlatformManager
{
    private static platformManager: PlatformManager
    public platform:string = "Loacl"
    private constructor() 
    {
        let channel = 'local';
        //@ts-ignore
        if(typeof qg != "undefined")
        {
            //@ts-ignore
            channel = qg.getProvider()
            this.platform = channel.toUpperCase()
        }
    }
    
    public static getInstance(): PlatformManager {
      if (this.platformManager == null) {
        this.platformManager = new PlatformManager()
      }
      return PlatformManager.platformManager
    }


}
