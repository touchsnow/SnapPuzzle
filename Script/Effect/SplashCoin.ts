import { _decorator, Component, Node, Prefab, instantiate, find, UIOpacityComponent } from 'cc';
import { CoinSplash } from './CoinSplash';
import { AudioManager } from '../AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SplashCoin')
export class SplashCoin extends Component {



    @property(Prefab)
    coinPrefab:Prefab = null


    start () 
    {
        
    }

    public playSplash()
    {

        cc.tween(this.node).repeat(40,cc.tween()
        .call(()=>{
            this.spawnCoin()
        }).delay(0.03)
        ).start()
        this.scheduleOnce(function () {
            this.showLabel()
        },0.4)

        this.scheduleOnce(function () {
            this.playAudio()
        },0.4)
    }

    spawnCoin()
    {

        let coin:Node = instantiate(this.coinPrefab)
        coin.setParent(this.node)
        coin.addComponent(CoinSplash)
    
    }

    showLabel()
    {
        let node:Node = find("Canvas/Coin")
        cc.tween(node.getComponent(UIOpacityComponent)).repeat(1,cc.tween()
        .to(0.3,{opacity:255},{easing:"sineOut"})
        .to(0.3,{opacity:255},{easing:"sineOut"})
        .to(0.3,{opacity:0},{easing:"sineOut"})
        ).start()
        cc.tween(node).repeat(1,cc.tween()
        .to(0.9,{position:cc.v3(-30,120,0)},{easing:"sineOut"})
        .to(0.1,{position:cc.v3(-30,0,0)},{easing:"sineOut"})
        ).start()
    }

    playAudio()
    {
        AudioManager.getInstance().playSound("ReceivingMoney")
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
