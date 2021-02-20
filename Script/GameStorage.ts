import { _decorator, Component, Node, game } from 'cc';
import { GameData } from './GameData';
import { Constants } from './Constants';
import { Achievement } from './Achievement';
import { MainPageSetting } from './MainPageSetting';
const { ccclass, property } = _decorator;



@ccclass('GameStorage')
export class GameStorage
{
    private jsonData = {}
    private lastGameItem = "Gam108"
    private gameItem = "Gam109"
    static _instance: GameStorage = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new GameStorage();
        }
        return this._instance;
    }

    constructor()
    {
        //清除上一次存档
        const lastData = cc.sys.localStorage.getItem(this.lastGameItem)
        if(lastData !==null && lastData !== undefined && lastData !=="")
        {
            cc.sys.localStorage.removeItem(this.lastGameItem)
        }

        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !==null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
        }
        else
        {
            this.jsonData = {}
        }
    }

    public gameData: GameData = null

    saveGameData(key, value:GameData)
    {
        value.openCount ++
        value.MatchedItemString = ""
        value.MatchedItem.forEach((Value,key) => 
        {   
            value.MatchedItemString+= key
            value.MatchedItemString+= "."
        })
        this.jsonData[key] = value
        const data = JSON.stringify(this.jsonData)
        cc.sys.localStorage.setItem(this.gameItem,data)
    }

    getGameData(key):any
    {
        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !== null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
            this.gameData = this.jsonData[key]
            if(this.jsonData[key] === undefined)
            {
                const gamedata = new GameData()
                gamedata.Level = key
                return gamedata
            }
            else
            {
                const stingArray = this.gameData.MatchedItemString.split(".")
                this.gameData.MatchedItem = new Map<string,boolean>()
                //console.info(stingArray)
                stingArray.forEach(element => {
                    if(element!=="")
                    {
                        this.gameData.MatchedItem.set(element,false)
                    }
                })
                return this.gameData
            }
        }
        else
        {
            const gamedata = new GameData()
            gamedata.Level = key
            return gamedata
        }
    }

    public getCurrentLevel():string
    {
        
        for(var i = 0;i<=Constants.levelInfo.Level.length-1;i++)
        {
            let gamedata:GameData = this.getGameData(Constants.levelInfo.Level[i].level)
            if(gamedata.openCount === 0 && i === 0)
            {
                return Constants.levelInfo.Level[i].level
            }
            if(gamedata.openCount>=0 && gamedata.FinishedLevel === false)
            {
                if(Constants.levelInfo.Level[i].isSpecial)
                {
                    if(gamedata.openCount > 0)
                    {
                        return Constants.levelInfo.Level[i].level
                    }
                }
                else
                {
                    return Constants.levelInfo.Level[i].level
                }
            }
        }
    }

    public getCurrentLevelIndex():number
    {
        
        for(var i = 0;i<=Constants.levelInfo.Level.length-1;i++)
        {
            let gamedata:GameData = this.getGameData(Constants.levelInfo.Level[i].level)
            if(gamedata.openCount === 0 && i === 0)
            {
                return i
            }
            if(gamedata.openCount>=0 && gamedata.FinishedLevel === false)
            {
                if(Constants.levelInfo.Level[i].isSpecial)
                {
                    if(gamedata.openCount > 0)
                    {
                        return i
                    }
                }
                else
                {
                    return i
                }
            }
        }
    }

    public getAchievement()
    {
        if(this.jsonData["achievement"] === undefined)
        {
            const achievement = new Achievement()
            return achievement
        }
        else
        {
            return this.jsonData["achievement"]
        }
    }

    public setAchievement(value)
    {
        this.jsonData["achievement"] = value
        const data = JSON.stringify(this.jsonData)
        cc.sys.localStorage.setItem(this.gameItem,data)
    }


    public getMainPageSetting()
    {
        if(this.jsonData["MainPageSetting"] === undefined)
        {

            const mainPageSetting = new MainPageSetting()
            return mainPageSetting
        }
        else
        {
            let mainPageSettingData:MainPageSetting = this.jsonData["MainPageSetting"]
            const stingArray = mainPageSettingData.TabSetString.split(".")
            mainPageSettingData.TabSet = new Map<string,boolean>()
            stingArray.forEach(element => {
                if(element!=="")
                {
                    mainPageSettingData.TabSet.set(element,false)
                }
            })
            return mainPageSettingData
        }
    }

    public SetMainPageSetting(value:MainPageSetting)
    {
        value.TabSetString = ""
        value.TabSet.forEach((Value,key) => 
        {   
            value.TabSetString+= key
            value.TabSetString+= "."
        })
        this.jsonData["MainPageSetting"] = value
        const data = JSON.stringify(this.jsonData)
        cc.sys.localStorage.setItem(this.gameItem,data)
    }

    
    public getUserCondition()
    {
        const uesrCondition = cc.sys.localStorage.getItem("condition")
        if(uesrCondition !==null && uesrCondition !== undefined && uesrCondition !=="")
        {
            return true
        }
        else
        {
            let tempInfo = {}
            cc.sys.localStorage.setItem("condition",tempInfo)
            return false
        }
    }

    public setUnlockTheme(name:string)
    {
        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !== null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
            let unLockThemeData = this.jsonData["UnlockTheme"]
            if(unLockThemeData === undefined)
            {
                this.jsonData["UnlockTheme"] = [name]
            }
            else
            {
                if(this.jsonData["UnlockTheme"].indexOf(name) === -1)
                {
                    this.jsonData["UnlockTheme"].push(name)
                }
            }
        }
        else
        {
            this.jsonData = {}
            this.jsonData["UnlockTheme"] = [name]
        }
        const data = JSON.stringify(this.jsonData)
        cc.sys.localStorage.setItem(this.gameItem,data)
    }

    public getUnlockTheme()
    {
        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !== null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
            let unLockThemeData = this.jsonData["UnlockTheme"]
            if(unLockThemeData === undefined)
            {
                return []
            }
            else
            {
                return this.jsonData["UnlockTheme"]
            }
        }
        else
        {
           return []
        }
    }
}
