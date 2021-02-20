import { _decorator, Component, Node, AnimationComponent, Vec3, SystemEventType, director, find, Loader, loader, Prefab, instantiate, LabelComponent, LayoutComponent, ProgressBarComponent, AudioSourceComponent, UIOpacityComponent, ScrollViewComponent, Vec2, Tween } from 'cc';
import { UIBase } from './UIBase';
import { Level } from '../Level';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants, LevelInfo } from '../Constants';
import { AudioManager } from '../AudioManager';
import { GameData } from '../GameData';
import { GameStorage } from '../GameStorage';
import { ListPage } from './ListPage';
import { ViewPage } from './ViewPage';
import { MainPageBase } from './MainPageBase';
import { CollcetPage } from './CollcetPage';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {

    @property(ListPage)
    listPage:ListPage = null

    @property(ViewPage)
    viewPage:ViewPage = null

    @property(CollcetPage)
    collcetPage:CollcetPage = null

    @property(Node)
    listPageButton:Node = null

    @property(Node)
    viewPageButton:Node = null

    @property(Node)
    collectButton:Node = null

    private sellectPage:MainPageBase = null



    start()
    {
        this.listPageButton.on(Node.EventType.TOUCH_END,this.onListButton,this)
        this.viewPageButton.on(Node.EventType.TOUCH_END,this.onViewButton,this)
        this.collectButton.on(Node.EventType.TOUCH_END,this.onCollectButton,this)
        this.sellectPage = this.listPage
    }

    onListButton()
    {
        if(this.sellectPage === this.listPage)return
        this.sellectPage.setDisable()
        this.sellectPage = this.listPage
        this.sellectPage.setEnable()
    }

    onViewButton()
    {
        if(this.sellectPage === this.viewPage)return
        this.sellectPage.setDisable()
        this.sellectPage = this.viewPage
        this.sellectPage.setEnable()
    }

    onCollectButton()
    {
        if(this.sellectPage === this.collcetPage)return
        this.sellectPage.setDisable()
        this.sellectPage = this.collcetPage
        this.sellectPage.setEnable()
    }



}
