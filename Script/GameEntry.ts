import { _decorator, Component, find } from 'cc';
import { GameCtrl } from './GameCtrl';
const { ccclass } = _decorator;

@ccclass('GameEntry')
export class GameEntry extends Component {

    start () 
    {
        find("GameCtrl").addComponent(GameCtrl)
    }
}
