import { _decorator, Component, Node, ParticleSystemComponent, Vec3 } from 'cc';
import { CameraCtrl } from './CameraCtrl';
const { ccclass, property } = _decorator;

@ccclass('ParticleSetting')
export class ParticleSetting extends Component 
{
    private particleSys :ParticleSystemComponent = null

    start () 
    {
        // this.particleSys = this.node.getComponent(ParticleSystemComponent)
        // let scale = CameraCtrl.getInstance().mainCameraOrther*6.25+0.03125
        // this.particleSys.startSpeed.constant = scale*this.particleSys.startSpeed.constant
        // this.particleSys.startSizeX.constant = scale*this.particleSys.startSizeX.constant
        // this.particleSys.startSizeY.constant = scale*this.particleSys.startSizeY.constant
        // this.particleSys.startSizeZ.constant = scale*this.particleSys.startSizeZ.constant
        // this.particleSys.startSizeX.constantMax = scale*this.particleSys.startSizeX.constantMax
        // this.particleSys.startSizeY.constantMax = scale*this.particleSys.startSizeY.constantMax
        // this.particleSys.startSizeZ.constantMax = scale*this.particleSys.startSizeZ.constantMax
        // this.particleSys.startSizeX.constantMin = scale*this.particleSys.startSizeX.constantMin
        // this.particleSys.startSizeY.constantMin = scale*this.particleSys.startSizeY.constantMin
        // this.particleSys.startSizeZ.constantMin = scale*this.particleSys.startSizeZ.constantMin
        // this.particleSys.gravityModifier.constant = scale*this.particleSys.startSpeed.constant*0.5
        // this.node.parent.setScale(new Vec3(scale,scale,scale))
    }

    
}
