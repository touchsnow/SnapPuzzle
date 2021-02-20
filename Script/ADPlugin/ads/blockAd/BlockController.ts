import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI"
import NavigateController from "../../navigate/NavigateController"

import {
    _decorator, Node, SpriteComponent, SpriteFrame, loader, view, UITransformComponent
} from "cc";

class BlockController {
    private static instance: BlockController

    /**
     * 积木广告ID
     */
    public ID_BlockID = "";

    /**
     * 积木广告对象
     */
    public blockAd: any = null;

    /**
     * 是否加载到积木广告
     */
    public isLoadBlock: boolean = false;

    /**
     * 积木广告展示方向
     */
    public blockOrientation: string = "landscape";

    /**
     * 积木广告左上角横坐标
     */
    public blockX: number = 32;

    /**
     * 积木广告左上角纵坐标
     */
    public blockY: number = 32;

    /**
     * 积木广告数量
     */
    public blockSize: number = 1;

    /**
     * 积木广告刷新定时器
     */
    public updateBlock: any = null;

    /**
     * 积木广告白包ICON组件
     */
    public nativeIcon: any = null;


    /**
    * BlockController 单例
    */
    public static getInstance(): BlockController {
        if (!BlockController.instance) {
            BlockController.instance = new BlockController()
        }
        return BlockController.instance
    }


    /**
     * 创建积木广告
     */
    public createBlock() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Oppo) {
            NavigateController.getInstance().createNavigateBoxBanner(this.ID_BlockID);
            return;
        }

        if (SdkTools.getPlatform() != Game_Platform.GP_QQ) {
            console.log("ASCSDK", 'QQ 该平台非QQ平台');
            return;
        }

        if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.15.0")) {
            console.log("ASCSDK", "QQ 平台版本过低,不能创建积木广告");
            return;
        }

        console.log('ASCSDK', 'QQ 积木广告初始化', this.ID_BlockID);

        let self = this;

        this.blockAd = qq.createBlockAd({
            adUnitId: self.ID_BlockID,
            size: self.blockSize,
            orientation: self.blockOrientation,
            style: {
                left: self.blockX,
                top: self.blockY
            },
        });

        // 监听积木广告加载
        this.blockAd.onLoad(function () {
            console.log("ASCSDK", "QQ 积木广告加载成功");
            self.isLoadBlock = true;
        })

        // 监听积木广告错误
        this.blockAd.onError(function (err) {
            console.log("ASCSDK", "QQ 积木广告加载失败:" + JSON.stringify(err));
            if (err.errCode == 1004) {
                console.log("ASCSDK", "QQ 积木广告列表为空");
            }
        })

    }

    /**
     * 获取积木是否可以展示标志
     */
    public getBlockFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                return this.isLoadBlock;
            case Game_Platform.GP_Test:
                return true;
        }
    }

    /**
     * 展示积木广告
     */
    public showBlock(type: string, x: number, y: number, blockSize: number) {

        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                {
                    if (this.nativeIcon) {
                        console.log("ASCSDK", "已存在测试积木广告 return");
                        return;
                    }
                    console.log("ASCSDK", 'Test showBlock==========================');
                    loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
                        this.nativeIcon = new Node("nativeIcon");
                        this.nativeIcon.addComponent(SpriteComponent);
                        this.nativeIcon.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = texture._texture;
                        this.nativeIcon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        setTimeout(() => {
                            this.nativeIcon.width = 200;
                            this.nativeIcon.height = 200;
                            this.nativeIcon.setPosition(x + this.nativeIcon.width / 2, y - this.nativeIcon.height / 2, 0);
                        }, 1)
                        this.nativeIcon.setSiblingIndex(29999);
                        Cocos3dUI.getInstance().getsdkCanvas().addChild(this.nativeIcon);
                        if (Cocos3dUI.getInstance().cocosGroup != '') {
                            this.nativeIcon.group = Cocos3dUI.getInstance().cocosGroup;
                        }
                    });
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (this.updateBlock) {
                        clearInterval(this.updateBlock);
                    }

                    let self = this;

                    let windowWidth = Number(qq.getSystemInfoSync().windowWidth);
                    let windowHeight = Number(qq.getSystemInfoSync().windowHeight);

                    // 存放一开始传入的参数y
                    let tempY = y;

                    // 版本为8.3.6则不展示积木广告
                    if (qq.getSystemInfoSync().version == "8.3.6") {
                        console.log("ASCSDK", "QQ 平台版本过低,不能展示积木广告==============");
                        return;
                    }
                    else {
                        // cocos以左下角为(0,0) 转换为qq的以左上角为(0,0)
                        y = cc.winSize.height - y;
                        this.blockX = x * (windowWidth / view.getVisibleSize().width)
                        this.blockY = y * (windowHeight / view.getVisibleSize().height)
                        this.blockOrientation = type;
                        this.blockSize = blockSize;
                    }

                    this.createBlock();

                    setTimeout(() => {
                        console.log('ASCSDK', 'QQ 展示积木广告===============================');
                        this.blockAd.show();
                    }, 500);

                    this.updateBlock =
                        setInterval(() => {
                            console.log("ASCSDK", "QQ 刷新积木广告================");
                            self.blockAd.offLoad();
                            self.blockAd.offError();
                            self.blockAd.destroy();
                            self.showBlock(self.blockOrientation, x, tempY, self.blockSize);
                        }, 30 * 1000)
                }
                break;
        }
    }

    /**
     * 关闭积木广告
     */
    public hideBlock() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                {
                    if (this.nativeIcon) {
                        console.log("ASCSDK", "Test hideBlock==========================");
                        this.nativeIcon.removeFromParent();
                        this.nativeIcon = null;
                    } else {
                        console.log("ASCSDK", "Test 不存在积木广告 return");
                        return;
                    }
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (this.updateBlock) {
                        clearInterval(this.updateBlock);
                    }
                    if (this.blockAd) {
                        console.log("ASCSDK", "QQ hideBlock==========================");
                        this.blockAd.destroy();
                    } else {
                        console.log("ASCSDK", "QQ 不存在积木广告");
                        return;
                    }
                    break;
                }
            default:
                break;
        }
    }


}

export default BlockController  