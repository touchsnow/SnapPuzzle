import { _decorator, Component, Node, Prefab, ProgressBarComponent, LabelComponent, director, loader, find, instantiate, Scene } from 'cc';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../Constants';
import { ResMgr } from '../ResMgr';
import { GameStorage } from '../GameStorage';
import { Level } from '../Level';
import { AudioManager } from '../AudioManager';
import ASCAd from '../ADPlugin/ASCAd';
import AnalyticsManager, { EAnalyticsSDKType, EAnalyticsEvent } from '../Manager/AnalyticsManager';
import { PlatformManager } from '../PlatformManager';
const { ccclass, property } = _decorator;


var resPkg = {
    scenes_3D: [

    ],

    charactors_3D: [

    ],

    UI_atlas: [

    ],

    Sounds: [

    ],

    UI_prefabs: [
        "ItemSlot",
        "Slot",
        "SlotToggle",
        "SubSlotList",
        "Theme/Cute",
        "Theme/CuteLevels",
        "Theme/FairyTale",
        "Theme/FairyTaleLevels",
        "Theme/Family",
        "Theme/FamilyLevels",
        "Theme/GoToHi",
        "Theme/GoToHiLevels",
        "Theme/GoToJob",
        "Theme/GoToJobLevels",
        "Theme/LittleCute",
        "Theme/LittleCuteLevels",
        "Theme/SchoolLife",
        "Theme/SchoolLifeLevels",
        "Theme/TravelTogether",
        "Theme/TravelTogetherLevels",
        "Theme/TravelWorld",
        "Theme/TravelWorldLevels",
        "Theme/OutdoorActivities",
        "Theme/OutdoorActivitiesLevels",
        "AudioNode",
        "PrefabsNode"
    ],

    Mat: [
        "Mat/Init",
        "Mat/Change",
        "Mat/UnMatch",
        "Mat/SlotMat",
        "Mat/Phong",
        "Mat/ChangeMat",
        "Mat/MatchMat",
        "Mat/PhongTransparent",
        "Mat/InitTransparent",
        "Mat/PromotyMat",
        "Mat/MainUIMat"
    ]
};


@ccclass('LoadingScene')
export class LoadingScene extends Component {
    @property(ProgressBarComponent)
    private LoadingBar: ProgressBarComponent = null;
    @property(LabelComponent)
    private LoadLael: LabelComponent = null;
    //资源已经加载标志
    private isResLoaded = false
    //广告已经加载标志
    private isADLoaded = false

    onLoad() {
        CustomEventListener.on("LoadingBarProgress", this.updateLoadBar, this)
    }
    start() {
        //检查网络状态
        let isNotOnLine = navigator && !navigator.onLine
        if (isNotOnLine) {
            find("Canvas/Loading/Tip").active = true
            ASCAd.getInstance().showToast("当前无网络，请连网后重新尝试")
        }
        else {
            //初始化广告
            ASCAd.getInstance().setGroup("DEFAULT")
            ASCAd.getInstance().initAd(this.onAdLoad.bind(this))
            //初始化埋点
            AnalyticsManager.getInstance().init(EAnalyticsSDKType.CoCos, window.platform,"679971181");
            AnalyticsManager.getInstance().login(EAnalyticsEvent.Start);
            //埋点
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
                name: "场景事件",
                eventName: "首帧",
            })

            let currentLevel = GameStorage.instance().getCurrentLevelIndex()
            Level.getInstance().modeleName = Constants.levelInfo.Level[currentLevel].level
            // console.info(Level.getInstance().modelNode)
            Level.getInstance().levelName = Constants.levelInfo.Level[currentLevel].levelName
            //记录相机高度
            Level.getInstance().cameraOrthoHeight = Constants.levelInfo.Level[currentLevel].orthoHeight
            Level.getInstance().BGColor = Constants.levelInfo.Level[currentLevel].BGColor
            Level.getInstance().gameDate = GameStorage.instance().getGameData(Level.getInstance().modeleName)
            Level.getInstance().achievement = GameStorage.instance().getAchievement()
            Level.getInstance().levelIndex = currentLevel
            Level.getInstance().resetLevel()
            director.preloadScene("MainScene")
            director.preloadScene("GameScene")
            let showIndex = GameStorage.instance().getCurrentLevelIndex()-1 <0? 0:GameStorage.instance().getCurrentLevelIndex()-1
            let mainShowModel = "Level/"+ Constants.levelInfo.Level[showIndex].level
            resPkg.scenes_3D = ["Level/" + GameStorage.instance().getCurrentLevel(),mainShowModel]
            console.info(resPkg.scenes_3D)
            ResMgr.Instance.preloadResPackage(resPkg, function (now, total) {
                CustomEventListener.dispatchEvent("LoadingBarProgress", now / total);
            }, function () {
                this.isResLoaded = true
                this.scheduleOnce(this.onResLoaded.bind(this), 0.5);
            }.bind(this))
        }
    }

    updateLoadBar(progressData: number) {
        this.LoadingBar.progress = progressData;
        this.LoadLael.string = (progressData * 100).toFixed(0) + "%"
    }

    onResLoaded() {
        cc.log("onResLoaded:资源加载完成了")
        if (this.isADLoaded === false) {
            cc.log("资源比广告加载快")
        }
        if (this.isADLoaded && this.isResLoaded) {
            this.loadGameScene()
        }
        else if(PlatformManager.getInstance().platform === "OPPO")
        {
            cc.log("是OPPO平台，资源加载完成后直接进入游戏")
            this.loadGameScene()
        }
    }

    onAdLoad() {
        cc.log("onAdLoad：广告加载完成了")
        this.isADLoaded = true
        if (this.isResLoaded === false) {
            cc.log("广告比资源加载快")
        }
        if (this.isADLoaded && this.isResLoaded) {
            this.loadGameScene()
        }
    }

    loadGameScene()
    {
        //埋点
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "场景事件",
            eventName: "加载完成",
        });
        //初始化音频和图集资源
        let audioNode = instantiate(ResMgr.Instance.getAsset("AudioNode")) as Node
        audioNode.setParent(find("AudioNode"))
        AudioManager.getInstance().initAudio()
        let prefbasNode = instantiate(ResMgr.Instance.getAsset("PrefabsNode")) as Node
        prefbasNode.setParent(find("PrefbasNode"))
        if(GameStorage.instance().getUserCondition())
        {
           director.loadScene("MainScene")
        }
        else
        {
            director.loadScene("GameScene")
        }
    }
}
