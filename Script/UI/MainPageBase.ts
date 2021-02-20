import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainPageBase')
export class MainPageBase extends Component {


    @property({
        type: Node,
        displayName:"控制按钮"
    })
    selfButton:Node = null
    
    setDisable(){}

    setEnable(){}




}
