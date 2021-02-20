import { _decorator, Component, Node, AudioClip, loader, find, game, AudioSourceComponent } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager 
{

    private static audioManager: AudioManager
    private constructor() {
       this.soundPath = "Audio/"
       this.soundNode = find("AudioNode/AudioNode")
       game.addPersistRootNode(this.soundNode)
    }
    public static getInstance(): AudioManager {
      if (this.audioManager == null) {
        this.audioManager = new AudioManager()
      }
      return AudioManager.audioManager
    }
    private soundPath = null
    private soundNode:Node = null

    /**音效列表 */
    private soundList:Map<string,AudioSourceComponent>  = new Map<string,AudioSourceComponent>()

    /**播放背景音乐 */
    public playBGM(name:string)
    {
        //("我进来播放音乐了")
        if(!this.soundList.has(name))
        {

        }
        else
        {
            this.soundList.get(name).loop = true
            if(!this.soundList.get(name).playing)
            {
                this.soundList.get(name).play()
            }
        }
    }
    /**停止背景音乐 */
    public stopBGM()
    {
        this.soundList.forEach(element => {
            element.stop()
        })
    }

    /**播放音效 */
    public playSound(name:string)
    {
        
        if(!this.soundList.has(name))
        {

        }
        else
        {
            this.soundList.get(name).loop = false
            this.soundList.get(name).play()
        }
    }
    
    initAudio()
    {
        this.soundList = new Map<string,AudioSourceComponent>()
        find("AudioNode/AudioNode").children.forEach(element => {
            let audioSource = element.getComponent(AudioSourceComponent)
            this.soundList.set(element.name,audioSource)
        })
        game.addPersistRootNode(find("AudioNode"))
    }
}
