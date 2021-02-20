import { _decorator, Component, Node } from 'cc';
import { MenuUI } from '../UI/MenuUI';
import { AudioManager } from '../AudioManager';
import ASCAd from '../ADPlugin/ASCAd';
const { ccclass, property } = _decorator;

@ccclass('MenuScene')
export class MenuScene extends Component {

    start () {
       
        this.node.addComponent(MenuUI)
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    
}
