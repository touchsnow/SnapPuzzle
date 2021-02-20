import { _decorator, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**监听事件名字 */
enum EventName 
{

    //UI部分
    /**显示开始界面 */
    SHOW_START_UI = "ShowStartUI",
    /**显示游戏界面 */
    SHOW_GAME_UI = "ShowGameUI",
    SHOW_MAIN_UI = "ShowMainUI",
    /**切换游戏界面的格子 */
    SWITCH_SLOT = "SwitchSlot",
    /**显示对勾 */
    SHOW_TICK = "ShowTick",
    /**切换旋转角色 */
    SWITCH_VIEW = "SwitchView",
    /**将模型屏蔽掉 */
    DISABLE_NODE = "DisableNode",
    /**将所有模型还原 */
    ENABLE_NODE = "DisableNode",
    /**初始化游戏 */
    INIT_GIME = "InitGame",
    /**释放游戏资源 */
    RELEASE_SENCE = "ReleaseSence",
    /**分配模型到游戏界面的格子 */
    ALLOT_MODEL = "AllotModel",
    /**分配模型到游戏界面的格子 */
    ALLOT_SUBMODEL = "AllotSubModel",
    /**更新模型显示*/
    UPDATA_MODEL_DISPALY = "UpdataModelDisplay",
    /**完成关卡 */
    FINISH_LEVEL = "FinishLevel",
    /**播放snap动画 */
    PLAY_SNAP_ANIM = "PalySnapAnim",
    /**播放模型动画 */
    PALY_MODEL_ANIM = "PalyAnimModel",
    /**增加进度条 */
    ADD_PROGRESS_BAR = "AddProgressBar",
    /**开启旋转x方向 */
    ROTATE_X = "Rotate" ,
    /**停止旋转 */
    DiSABLE_RPTATE = "DisabaleRotate",
    /**播放粒子特效*/
    PALY_PARTICLE = "PalyParticle",
    /**恢复数据 */
    RECOVER_DATA = "RecoverData",
    /**更新MianU进度条 */
    UPDATE_MAINUI_PROGRESS = "UpdateMainUiProgress",
    /**启用第二次引导 */
    GUIDER_TOW = "Guide_Tow",
    /**切换选中的模型 */
    SWITCH_SELLECT_MODEL = "Switch_Sellect_Model",
    /**停止模型提示 */
    STOP_PROMOTY = "STOP_PROMOTY"
}

export class LevelInfo
{
    public Level = 
    [

        {level:"0055_VacationHomeWork",atals:"LevelSprite1",sprite:"0055_VacationHomeWork",star:1,levelName:"假期作业",orthoHeight:0.1,BGColor:cc.color(112,163,255),parent:"Cute",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"00203_LittleSnowman",atals:"LevelSprite1",sprite:"00203_LittleSnowman",star:1,levelName:"小雪人",orthoHeight:0.07,BGColor:cc.color(112,163,255),parent:"Cute",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"00202_CuteHamsterEatingCarrot",atals:"LevelSprite1",sprite:"00202_CuteHamsterEatingCarrot",star:1,levelName:"我爱胡萝卜",orthoHeight:0.05,BGColor:cc.color(112,163,255),parent:"Cute",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0026_rainyDay",atals:"LevelSprite1",sprite:"0026_rainyDay",star:1,levelName:"雨天",orthoHeight:0.05,BGColor:cc.color(112,163,255),parent:"Cute",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},

        {level:"0025_grandBlue",atals:"LevelSprite3",sprite:"0025_grandBlue",star:1,levelName:"碧海之蓝",orthoHeight:0.08,BGColor:cc.color(53,53,151),parent:"GoToHi",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0060_oliver_destiny",atals:"LevelSprite3",sprite:"0060_oliver_destiny",star:2,levelName:"奥利弗历险记：命运",orthoHeight:0.08,BGColor:cc.color(235,155,161),parent:"GoToHi",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0027_flyToTheSky",atals:"LevelSprite1",sprite:"0027_flyToTheSky",star:2,levelName:"飞向蔚蓝天空",orthoHeight:0.13,BGColor:cc.color(235,155,161),parent:"GoToHi",UnlcokMoney:200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0020_littlePrince",atals:"LevelSprite1",sprite:"0020_littlePrince",star:2,levelName:"小王子",orthoHeight:0.1,BGColor:cc.color(46,38,133),parent:"GoToHi",UnlcokMoney:200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0001_alice",atals:"LevelSprite3",sprite:"0001_alice",star:1,levelName:"爱丽丝",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToHi",UnlcokMoney:200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0028_hotAirBalloon",atals:"LevelSprite2",sprite:"0028_hotAirBalloon",star:3,levelName:"热气球",orthoHeight:0.13,BGColor:cc.color(235,155,161),parent:"GoToHi",UnlcokMoney:200,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0007_miniLondon",atals:"LevelSprite1",sprite:"0007_miniLondon",star:2,levelName:"迷你伦敦",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"TravelWorld",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0005_cafeSanfrancisco",atals:"LevelSprite1",sprite:"0005_cafeSanfrancisco",star:3,levelName:"旧金山咖啡馆",orthoHeight:0.12,BGColor:cc.color(0,79,179),parent:"TravelWorld",UnlcokMoney:400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0070_venetia",atals:"LevelSprite1",sprite:"0070_venetia",star:3,levelName:"环游世界：威尼斯",orthoHeight:0.18,BGColor:cc.color(0,176,184),parent:"TravelWorld",UnlcokMoney:400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0019_miniOsaka",atals:"LevelSprite1",sprite:"0019_miniOsaka",star:3,levelName:"迷你大阪",orthoHeight:0.2,BGColor:cc.color(0,131,177),parent:"TravelWorld",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0011_Paris",atals:"LevelSprite1",sprite:"0011_Paris",star:3,levelName:"迷你巴黎",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"TravelWorld",UnlcokMoney:400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0092_explorers_egypt",atals:"LevelSprite1",sprite:"0092_explorers_egypt",star:4,levelName:"考古学家：埃及探险",orthoHeight:0.4,BGColor:cc.color(112,163,255),parent:"TravelWorld",UnlcokMoney:400,isSpecial:true,isFree:false,onlyAD:true},
        
        {level:"0039_secretLibrary",atals:"LevelSprite1",sprite:"0039_secretLibrary",star:3,levelName:"专属的森林秘密图书馆",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"SchoolLife",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0052_audition",atals:"LevelSprite1",sprite:"0052_audition",star:3,levelName:"选拔",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"SchoolLife",UnlcokMoney:600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0064_karin_breaktime",atals:"LevelSprite1",sprite:"0064_karin_breaktime",star:3,levelName:"卡琳：空课世界",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"SchoolLife",UnlcokMoney:600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0051_artClass",atals:"LevelSprite1",sprite:"0051_artClass",star:3,levelName:"美术课",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"SchoolLife",UnlcokMoney:600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0034_manInBlack",atals:"LevelSprite1",sprite:"0034_manInBlack",star:4,levelName:"黑衣人",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"SchoolLife",UnlcokMoney:600,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0063_karin_late",atals:"LevelSprite1",sprite:"0063_karin_late",star:2,levelName:"卡琳：迟到",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToJob",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0090_yura_late",atals:"LevelSprite1",sprite:"0090_yura_late",star:3,levelName:"尤拉：迟到",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToJob",UnlcokMoney:800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0089_yura_officeGoingHour",atals:"LevelSprite1",sprite:"0089_yura_officeGoingHour",star:3,levelName:"总是忙碌的早晨",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToJob",UnlcokMoney:800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0031_imBusyNow",atals:"LevelSprite1",sprite:"0031_imBusyNow",star:3,levelName:"尤拉：工作时间",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToJob",UnlcokMoney:800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0088_yura_officeHours",atals:"LevelSprite1",sprite:"0088_yura_officeHours",star:3,levelName:"尤拉：上班时间",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"GoToJob",UnlcokMoney:800,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0056_VapenSummerVacation",atals:"LevelSprite2",sprite:"0056_VapenSummerVacation",star:3,levelName:"巴潘：暑期休假",orthoHeight:0.05,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0058_vapenpacking",atals:"LevelSprite2",sprite:"0058_vapenpacking",star:4,levelName:"巴潘：准备旅行",orthoHeight:0.07,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:1000,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0057_vapenSpa",atals:"LevelSprite2",sprite:"0057_vapenSpa",star:3,levelName:"巴潘：温泉旅行",orthoHeight:0.11,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:1000,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0018_camping",atals:"LevelSprite2",sprite:"0018_camping",star:3,levelName:"露营",orthoHeight:0.12,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:1000,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0047_yachtParty",atals:"LevelSprite2",sprite:"0047_yachtParty",star:3,levelName:"船上派对",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:1000,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0073_MorningAtTheMountainCabin",atals:"LevelSprite2",sprite:"0073_MorningAtTheMountainCabin",star:4,levelName:"山庄的早晨",orthoHeight:0.2,BGColor:cc.color(112,163,255),parent:"TravelTogether",UnlcokMoney:1000,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0002_watchTV",atals:"LevelSprite2",sprite:"0002_watchTV",star:3,levelName:"死守首播",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"Family",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0008_relaxation",atals:"LevelSprite2",sprite:"0008_relaxation",star:3,levelName:"休息",orthoHeight:0.12,BGColor:cc.color(173,97,0),parent:"Family",UnlcokMoney:1200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0062_karin_myLittleWorld",atals:"LevelSprite2",sprite:"0062_karin_myLittleWorld",star:3,levelName:"卡琳：我的世界",orthoHeight:0.1,BGColor:cc.color(167,120,0),parent:"Family",UnlcokMoney:1200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0098_roundStoneFamily_familyPhoto",atals:"LevelSprite2",sprite:"0098_roundStoneFamily_familyPhoto",star:3,levelName:"支石墓家族：全家福",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"Family",UnlcokMoney:1200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0101_roundStoneFamily_brotherAndSister",atals:"LevelSprite2",sprite:"0101_roundStoneFamily_brotherAndSister",star:3,levelName:"支石墓家族：快乐的兄妹俩",orthoHeight:0.08,BGColor:cc.color(112,163,255),parent:"Family",UnlcokMoney:1200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0100_roundStoneFamily_Shopping",atals:"LevelSprite2",sprite:"0100_roundStoneFamily_Shopping",star:3,levelName:"支石墓家族：逛街",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"Family",UnlcokMoney:1200,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0102_roundStoneFamily_dinnerTime",atals:"LevelSprite2",sprite:"0102_roundStoneFamily_dinnerTime",star:5,levelName:"支石墓家族：吃饭时间",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"Family",UnlcokMoney:1200,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0009_toyStory",atals:"LevelSprite2",sprite:"0009_toyStory",star:3,levelName:"主人不在家",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0045_monkeySecretTrip",atals:"LevelSprite2",sprite:"0045_monkeySecretTrip",star:3,levelName:"猴岛的秘密旅行",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0017_catRoom",atals:"LevelSprite2",sprite:"0017_catRoom",star:3,levelName:"等待猫奴回家",orthoHeight:0.1,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0044_bearPlayground",atals:"LevelSprite2",sprite:"0044_bearPlayground",star:3,levelName:"熊乐园",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0006_foxPlayGround",atals:"LevelSprite2",sprite:"0006_foxPlayGround",star:4,levelName:"狐狸乐园",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0030_houseOfForest",atals:"LevelSprite2",sprite:"0030_houseOfForest",star:4,levelName:"纳鲁：森林之家",orthoHeight:0.2,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0053_penguinPlayGround",atals:"LevelSprite2",sprite:"0053_penguinPlayGround",star:4,levelName:"企鹅乐园",orthoHeight:0.15,BGColor:cc.color(112,163,255),parent:"LittleCute",UnlcokMoney:1400,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0049_surfing",atals:"LevelSprite1",sprite:"0049_surfing",star:2,levelName:"冲浪",orthoHeight:0.14,BGColor:cc.color(112,163,255),parent:"OutdoorActivities",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0068_snowBoarding",atals:"LevelSprite1",sprite:"0068_snowBoarding",star:2,levelName:"单板滑雪",orthoHeight:0.14,BGColor:cc.color(112,163,255),parent:"OutdoorActivities",UnlcokMoney:0,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0080_Lucy_jogging",atals:"LevelSprite2",sprite:"0080_Lucy_jogging",star:3,levelName:"露茜：慢跑",orthoHeight:0.14,BGColor:cc.color(112,163,255),parent:"OutdoorActivities",UnlcokMoney:1600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0077_pilates",atals:"LevelSprite2",sprite:"0077_pilates",star:3,levelName:"普拉提好累",orthoHeight:0.1,BGColor:cc.color(112,163,255),parent:"OutdoorActivities",UnlcokMoney:1600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0029_fishing",atals:"LevelSprite2",sprite:"0029_fishing",star:3,levelName:"钓鱼",orthoHeight:0.11,BGColor:cc.color(120,157,185),parent:"OutdoorActivities",UnlcokMoney:1600,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0078_Lucy_riding",atals:"LevelSprite2",sprite:"0078_Lucy_riding",star:3,levelName:"露茜：骑自行车",orthoHeight:0.2,BGColor:cc.color(56,131,180),parent:"OutdoorActivities",UnlcokMoney:1600,isSpecial:true,isFree:false,onlyAD:true},

        {level:"0083_JourneyToTheWest",atals:"LevelSprite2",sprite:"0083_JourneyToTheWest",star:3,levelName:"西游记",orthoHeight:0.11,BGColor:cc.color(120,157,185),parent:"FairyTale",UnlcokMoney:0,isSpecial:false,isFree:true,onlyAD:false},
        {level:"0081_snowWhite_forestLife",atals:"LevelSprite2",sprite:"0081_snowWhite_forestLife",star:3,levelName:"白雪公主：快乐的森林生活",orthoHeight:0.11,BGColor:cc.color(120,157,185),parent:"FairyTale",UnlcokMoney:1800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0032_henjelAndGretel",atals:"LevelSprite2",sprite:"0032_henjelAndGretel",star:3,levelName:"灰姑娘",orthoHeight:0.34,BGColor:cc.color(0,0,85),parent:"FairyTale",UnlcokMoney:1800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0072_RomeoAndJuliet",atals:"LevelSprite2",sprite:"0072_RomeoAndJuliet",star:3,levelName:"罗密欧与朱丽叶",orthoHeight:0.18,BGColor:cc.color(0,176,184),parent:"FairyTale",UnlcokMoney:1800,isSpecial:false,isFree:false,onlyAD:true},
        {level:"0095_cinderella",atals:"LevelSprite2",sprite:"0095_cinderella",star:4,levelName:"糖果屋",orthoHeight:0.18,BGColor:cc.color(0,176,184),parent:"FairyTale",UnlcokMoney:1800,isSpecial:true,isFree:false,onlyAD:true},
    ]
}

export class ThemeInfo
{
    theme = ["Cute","GoToHi","TravelWorld","SchoolLife","GoToJob","TravelTogether","Family","LittleCute","OutdoorActivities","FairyTale"]
    themeCnName = ["萌萌哒","一起去嗨呀","梦想环游世界","校园生活","我要去工作","一起去旅游","温馨的家庭时光","小可爱们","户外活动","童话世界"]
}




enum GameMode 
{
    UnCoin = "UnCoin",
    Coin = "Coin"
}


@ccclass('Constants')
export class Constants
{
    /**监听事件名 */
    public static EventName = EventName
    public static levelInfo = new  LevelInfo()
    public static themeInfo = new ThemeInfo()
    public static GameMode = GameMode
}
