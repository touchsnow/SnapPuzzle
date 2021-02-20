import CocosAnalyticsPack from "./CocosAnalyticsPack";
import AnalyticsParent from "./AnalyticsParent";
import CommonHelper from "./CommonHelper";
import { Md5 } from "./md5";


const { ccclass, property } = cc._decorator;

/** 统计sdk类型 */
export enum EAnalyticsSDKType {
    CoCos,    // cocos 统计
}

/** 统计事件 */
export enum EAnalyticsEvent {
    Start,  // 开始
    Success,  // 成功
    Fail,   // 失败
    Cancel,  // 取消/退出
}

/** 事件类型 */
export enum EAnalyticsEventType {
    Custom,
    Level
}

export interface IAnalyticsCustomParams {
    name: string,
    info: any,
    failresult?: string  // 失败原因
}

export interface IAnalyticsLevelParams {
    level: string  // 关卡名称
    reason?: string,  // 失败原因
}

/** 统计管理 */
@ccclass
export default class AnalyticsManager {
    private static instance: AnalyticsManager = null;
    public static getInstance() {
        if (AnalyticsManager.instance == null) {
            AnalyticsManager.instance = new AnalyticsManager();
        }
        return AnalyticsManager.instance;
    }

    private type: EAnalyticsSDKType = EAnalyticsSDKType.CoCos;
    private readonly enableDebug = true;

    private analyticsPack: AnalyticsParent = null;
    private userId: string = "";

    constructor() {
        this.userId = this._getUserId();
    }

    init(_type: EAnalyticsSDKType, channelid: number, appID:string) {
        this.type = _type;
        // if(cc.sys.os == cc.sys.OS_WINDOWS && this.enableDebug == false){
        // return;
        // }

        console.log("统计开始初始化", this.userId);

        switch (this.type) {
            case EAnalyticsSDKType.CoCos:
                this.analyticsPack = new CocosAnalyticsPack();
                break;
            default: cc.error("not find analytics");
                return;
        }

        let channel = 'local';
        //@ts-ignore
        if(typeof qg != "undefined")
        {
            //@ts-ignore
            channel = qg.getProvider()
            console.info(channel)
        }
        this.analyticsPack.enableDebug(this.enableDebug);
        this.analyticsPack.init({ channel:channel.toUpperCase(), userId: this.userId , appID:appID});
    }

    login(event: EAnalyticsEvent, param?: any) {
        this.analyticsPack && this.analyticsPack.login(event, param);
    }

    

    /** 自定义事件 */
    raiseCustomEvent(event: EAnalyticsEvent, param: any) {
        this.analyticsPack && this.analyticsPack.raiseEvent(EAnalyticsEventType.Custom, event, param.name, param);
    }

    /** 关卡事件 */
    raiseLevelEvent(event: EAnalyticsEvent, param: IAnalyticsLevelParams) {
        this.analyticsPack && this.analyticsPack.raiseEvent(EAnalyticsEventType.Level, event, param.level, param);
    }

    private _getUserId() {
        let userId = cc.sys.localStorage.getItem("analytics_userId");
        if (userId) {
            return userId;
        }
        else {
            let timer = new Date().getTime();
            let randStr = CommonHelper.randomStr(10);
            let str = randStr + timer.toString();
            let md5 = new Md5();
            md5.start();
            md5.appendStr(str);
            let finalMd5 = md5.end();
            cc.log(finalMd5);
            cc.sys.localStorage.setItem("analytics_userId", finalMd5);
            return finalMd5;
        }
    }
}
