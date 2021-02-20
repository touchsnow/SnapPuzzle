import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinSplash')
export class CoinSplash extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private _time:number = 0
    private _initial_position:Vec3 = new Vec3()
    private initial_velocity:Vec3 = new Vec3()
    private acceleration:Vec3 = new Vec3()

    private minSpeedy:number = 700
    private maxSpeedy:number = 800
    private minSpeedx:number = -200
    private maxSpeedx:number = 200

    start () 
    {
        // 0-1 均匀分布
        const random_a = Math.random();
        const random_b = Math.random();
        this.node.position = Vec3.ZERO
        this._initial_position = this.node.getPosition()
        this.acceleration = new Vec3(0,-1500,0)
        // 均匀分布的初速度
        this.initial_velocity = new Vec3(random_a * (this.maxSpeedx - this.minSpeedx) + this.minSpeedx,random_b * (this.maxSpeedy - this.minSpeedy) + this.minSpeedy,0) ;
        //coin.initial_velocity.y = ;

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.destroySelf();
        }, 2);
    }

    update(dt) {

        this._time += dt;
        this.node.setPosition(this._initial_position.x + this.initial_velocity.x * this._time + this.acceleration.x * this._time * this._time / 2,this._initial_position.y + this.initial_velocity.y * this._time + this.acceleration.y * this._time * this._time / 2,this.node.worldPosition.z)
       
    }
    destroySelf()
    {
        this.node.destroy()
    }
}
