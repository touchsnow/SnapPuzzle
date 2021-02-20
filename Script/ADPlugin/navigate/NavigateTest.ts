import SdkTools from "../tools/SdkTools";
import Cocos3dUI from "../ui/cocos3dUI/Cocos3dUI";
import BannerController from "../ads/bannerAd/BannerController";

import {
    _decorator, Node, SpriteComponent, SpriteFrame, loader,
} from "cc";

class NavigateTest {

    private static instance: NavigateTest

    public navigateBg = null;

    public navigateSettle = null;

    /**
    * NavigateTest 单例
    */
    public static getInstance(): NavigateTest {
        if (!NavigateTest.instance) {
            NavigateTest.instance = new NavigateTest()
        }
        return NavigateTest.instance
    }


    /**
     * 展示测试互推ICON
     */
    public showNavigateIcon(width, height, x, y) {

        if (this.navigateBg) {
            console.log("ASCSDK", "Test 已存在测试互推ICON return");
            return;
        }

        console.log("ASCSDK", "Test showNavigateIcon===============");

        var self = this;
        loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, imagetexture) => {
            var spFrame = new SpriteFrame();
            spFrame.texture = imagetexture._texture;
            self.navigateBg = new Node("navigateBg");
            self.navigateBg.addComponent(SpriteComponent);
            self.navigateBg.getComponent(SpriteComponent).spriteFrame = spFrame;
            setTimeout(() => {
                self.navigateBg.width = width;
                self.navigateBg.height = height;
                self.navigateBg.setPosition(x, y, 0);
            }, 1);
            Cocos3dUI.getInstance().getsdkCanvas().addChild(self.navigateBg);
            if (Cocos3dUI.getInstance().cocosGroup != '') {
                self.navigateBg.group = Cocos3dUI.getInstance().cocosGroup;
            }
        });
    }
    /**
     * 隐藏测试互推ICON
     */
    public hideNavigateIcon() {
        if (this.navigateBg) {
            console.log("ASCSDK", "Test hideNavigateIcon==========================");
            this.navigateBg.removeFromParent();
        } else {
            console.log("ASCSDK", "Test 不存在测试互推ICON return");
            return;
        }
    }


    /**
     * 展示测试结算互推
     */
    public showNavigateSettle(type, x, y) {
        if (this.navigateSettle) {
            console.log("ASCSDK", "Test 已存在测试结算互推 return");
            return;
        }
        BannerController.getInstance().hideBanner();
        console.log("ASCSDK", 'Test showNavigateSettle====================');
        switch (type) {
            case 1:
                {
                    var self = this;
                    cc.textureUtil.loadImage("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettle.png", (err, imagetexture) => {
                        var spFrame = new SpriteFrame();
                        spFrame.texture = imagetexture._texture;
                        self.navigateSettle = new Node("navigateSettle");
                        self.navigateSettle.addComponent(SpriteComponent);
                        self.navigateSettle.getComponent(SpriteComponent).spriteFrame = spFrame;
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                self.navigateSettle.width = cc.winSize.width * 0.65;
                                self.navigateSettle.height = self.navigateSettle.width / 1.15;
                            }
                            else {
                                self.navigateSettle.height = cc.winSize.height / 5 * 2;
                                self.navigateSettle.width = self.navigateSettle.height * 1.15;
                            }
                            self.navigateSettle.setPosition(x, y, 0);
                        }, 1);
                        if (Cocos3dUI.getInstance().cocosGroup != '') {
                            self.navigateSettle.group = Cocos3dUI.getInstance().cocosGroup;
                        }
                        Cocos3dUI.getInstance().getsdkCanvas().addChild(self.navigateSettle);
                    });
                }
                break;
            case 2:
                {
                    var self = this;
                    self.navigateSettle = new Node("navigateSettle");
                    self.navigateSettle.zIndex = 30000;
                    Cocos3dUI.getInstance().getsdkCanvas().addChild(self.navigateSettle);

                    cc.textureUtil.loadImage("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleLeft.png", (err, imagetexture) => {
                        var spFrame = new SpriteFrame();
                        spFrame.texture = imagetexture._texture;
                        var navigateSettleLeft = new Node("navigateSettleLeft");
                        navigateSettleLeft.addComponent(SpriteComponent);
                        navigateSettleLeft.getComponent(SpriteComponent).spriteFrame = spFrame;
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                navigateSettleLeft.width = cc.winSize.width * 0.2;
                                navigateSettleLeft.height = navigateSettleLeft.width / 0.39;
                            }
                            else {
                                navigateSettleLeft.height = cc.winSize.height - 200;
                                navigateSettleLeft.width = cc.winSize.height * 0.39;
                            }
                            navigateSettleLeft.setPosition(navigateSettleLeft.width / 2 - cc.winSize.width / 2, 0, 0)
                        }, 1);
                        self.navigateSettle.addChild(navigateSettleLeft);
                    });

                    cc.textureUtil.loadImage("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleRight.png", (err, imagetexture) => {
                        var spFrame = new SpriteFrame();
                        spFrame.texture = imagetexture._texture;
                        var navigateSettleRight = new Node("navigateSettleRight");
                        navigateSettleRight.addComponent(SpriteComponent);
                        navigateSettleRight.getComponent(SpriteComponent).spriteFrame = spFrame;
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                navigateSettleRight.width = cc.winSize.width * 0.2;
                                navigateSettleRight.height = navigateSettleRight.width / 0.39;
                            }
                            else {
                                navigateSettleRight.height = cc.winSize.height - 200;
                                navigateSettleRight.width = cc.winSize.height * 0.39;
                            }
                            navigateSettleRight.setPosition(-navigateSettleRight.width / 2 + cc.winSize.width / 2, 0, 0)
                        }, 1);
                        self.navigateSettle.addChild(navigateSettleRight);
                    });

                    if (Cocos3dUI.getInstance().cocosGroup != '') {
                        self.navigateSettle.group = Cocos3dUI.getInstance().cocosGroup;
                    }

                }
                break;
            case 3:
                {
                    var self = this;
                    cc.textureUtil.loadImage("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleType3.png", (err, imagetexture) => {
                        var spFrame = new SpriteFrame();
                        spFrame.texture = imagetexture._texture;
                        self.navigateSettle = new Node("navigateSettle");
                        self.navigateSettle.addComponent(SpriteComponent);
                        self.navigateSettle.getComponent(SpriteComponent).spriteFrame = spFrame;
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                self.navigateSettle.width = cc.winSize.width * 0.904;
                                self.navigateSettle.height = self.navigateSettle.width * 0.317;
                            }
                            else {
                                self.navigateSettle.height = cc.winSize.height / 5;
                                self.navigateSettle.width = self.navigateSettle.height / 0.317;
                            }
                            self.navigateSettle.setPosition(x, y, 0);
                            self.navigateSettle.zIndex = 30000;
                        }, 1);
                        if (Cocos3dUI.getInstance().cocosGroup != '') {
                            self.navigateSettle.group = Cocos3dUI.getInstance().cocosGroup;
                        }
                        Cocos3dUI.getInstance().getsdkCanvas().addChild(self.navigateSettle);
                    });

                }
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏测试结算互推
     */
    public hideNavigateSettle() {
        if (this.navigateSettle) {
            console.log("ASCSDK", 'Test hideNavigateSettle====================');
            this.navigateSettle.removeFromParent();
            this.navigateSettle = null
        } else {
            console.log("ASCSDK", "Test 不存在测试结算互推 return");
            return;
        }
    }

}

export default NavigateTest