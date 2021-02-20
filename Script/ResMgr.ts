import { _decorator, Component, Node, loader, AudioClip, Prefab, SpriteAtlas, SpriteFrame, game, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResMgr')
export class ResMgr extends Component {
    public static Instance: ResMgr = null;

    private progressFunc: Function = null;
    private endFunc: Function = null;
    private total:Number = 0;
    private now: Number = 0;

    private prefabDepRefCount = {};

    @property([AudioClip])
    private preloadSounds: Array<AudioClip> = [];

    @property([Prefab])
    private preloadScenes_3D: Array<Prefab> = [];

    @property([Prefab])
    private preloadCharactors_3D: Array<Prefab> = [];

    @property([Prefab])
    private preloadUIPrefabs: Array<Prefab> = [];

    @property([SpriteAtlas])
    private preloadUIAtalas: Array<SpriteAtlas> = [];

    @property(SpriteAtlas)
    spriteAtlas: SpriteAtlas = null;
    
    public init(): void {
        for(var i = 0; i < this.preloadScenes_3D.length; i ++) {
            var dep = loader.getDependsRecursively(this.preloadScenes_3D[i]);

            for(var i = 0; i < dep.length; i ++) {
                this.incRefCount(dep[i]);
            }
        }

        for(var i = 0; i < this.preloadCharactors_3D.length; i ++) {
            var dep = loader.getDependsRecursively(this.preloadCharactors_3D[i]);

            for(var i = 0; i < dep.length; i ++) {
                this.incRefCount(dep[i]);
            }
        }

        for(var i = 0; i < this.preloadUIPrefabs.length; i ++) {
            var dep = loader.getDependsRecursively(this.preloadUIPrefabs[i]);

            for(var i = 0; i < dep.length; i ++) {
                this.incRefCount(dep[i]);
            }
        }

        for(var i = 0; i < this.preloadUIAtalas.length; i ++) {
            var dep = loader.getDependsRecursively(this.preloadUIAtalas[i]);

            for(var i = 0; i < dep.length; i ++) {
                this.incRefCount(dep[i]);
            }
        }

        for(var i = 0; i < this.preloadSounds.length; i ++) {
            var dep = loader.getDependsRecursively(this.preloadSounds[i]);

            for(var i = 0; i < dep.length; i ++) {
                this.incRefCount(dep[i]);
            }
        }
    }

    onLoad()
    {
        if (ResMgr.Instance === null) {
            ResMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
        
    }
    start()
    {
        game.addPersistRootNode(this.node);
    }

    public getAsset(name: string): any {
        return loader.getRes(name);
    }

    public releaseResPackage(resPkg: object) {
        for(var key in resPkg) {
           for(var i = 0; i < resPkg[key].length; i ++) {
                var dep = loader.getDependsRecursively(resPkg[key][i]);
                for(var i = 0; i < dep.length; i ++) {
                    this.decRefCount(dep[i]);
                }
                loader.release(resPkg[key][i]); 
           }
        }
    }

    incRefCount(url) {
        if (this.prefabDepRefCount[url]) {
            this.prefabDepRefCount[url] += 1;
        }
        else {
            this.prefabDepRefCount[url] = 1;
        }
    }

    decRefCount(url) {
        if (this.prefabDepRefCount[url]) {
            this.prefabDepRefCount[url] -= 1;
            if (this.prefabDepRefCount[url] === 0) {
                loader.release(url); // 这里删除得时候要使用release;
            }
        }
        else {
        }
    }

    private loadRes(url: string, typeOfClass) {
        if (loader.getRes(url)) { // 资源有了直接返回
            return;
        }

        loader.loadRes(url, typeOfClass, function(error, asset) {
            this.now ++;
            if (error) {
            }
            else {
                var dep = loader.getDependsRecursively(asset);
                for(var i = 0; i < dep.length; i ++) {
                    this.incRefCount(dep[i]);
                }
            }
            

            if (this.now >= this.total) {
                if (this.endFunc !== null) {
                    this.progressFunc(this.now, this.total);
                    this.endFunc();
                }
            }
            else {
                if (this.progressFunc !== null) {
                    this.progressFunc(this.now, this.total);
                }
            }
        }.bind(this));
    }

    // public getSpriteFrame(AltasUrl, spriteName): SpriteFrame {
        
    //     var atlas: SpriteAtlas = loader.getRes(AltasUrl);
    //     console.info("=========="+atlas+"==============="+spriteName)
    //     if (!atlas) {
    //         console.info("=========="+AltasUrl+"==============="+spriteName)
    //         return null;
    //     }
    //     console.info(atlas)
    //     return atlas.getSpriteFrame(spriteName);
    // }
    public getSpriteFrame(AltasUrl, spriteName): SpriteFrame {
        
        var atlas: SpriteAtlas = this.spriteAtlas;
       // console.info("=========="+atlas+"==============="+spriteName)
        if (!atlas) {
       //     console.info("=========="+AltasUrl+"==============="+spriteName)
            return null;
        }
       // console.info(atlas)
        return atlas.getSpriteFrame(spriteName);
    }

    /*
    资源包的模板
    var resPkg = {
    scenes_3D: [
        "maps/game",
    ],

    charactors_3D: [

    ],

    UI_atlas: [

    ],

    

    Sounds: [
    ],

    UI_prefabs: [

    ]
};
    */
    // { scenes_3D: [,路径, ], charactors_3D: [路径, ], UI_atlas: [路径], UI_prefabs: [路径], Sounds: [路径]... }
    public preloadResPackage(resPkg: any, progressFunc, endFunc) {
        this.total = 0;
        this.now = 0;

        this.progressFunc = progressFunc;
        this.endFunc = endFunc;

        for(var key in resPkg) {
            this.total += resPkg[key].length; 
        }

        if(resPkg.scenes_3D) {
            for(var i = 0; i < resPkg.scenes_3D.length; i ++) {
                this.loadRes(resPkg.scenes_3D[i], Prefab);
            }
        }

        if (resPkg.charactors_3D) {
            for(var i = 0; i < resPkg.charactors_3D.length; i ++) {
                this.loadRes(resPkg.charactors_3D[i], Prefab);
            }
        }

        if (resPkg.UI_prefabs) {
            for(var i = 0; i < resPkg.UI_prefabs.length; i ++) {
                this.loadRes(resPkg.UI_prefabs[i], Prefab);
            }
        }

        if (resPkg.UI_atlas) {
            for(var i = 0; i < resPkg.UI_atlas.length; i ++) {
                this.loadRes(resPkg.UI_atlas[i], SpriteAtlas);
            }
        }

        if (resPkg.Sounds) {
            for(var i = 0; i < resPkg.Sounds.length; i ++) {
                this.loadRes(resPkg.Sounds[i], AudioClip);
            }
        }

        if (resPkg.Mat) {
            for(var i = 0; i < resPkg.Mat.length; i ++) {
                this.loadRes(resPkg.Mat[i], Material);
            }
        }
    }

    public addRes(url:string,typeOfClass,callback)
    {
        loader.loadRes(url, typeOfClass, function(error, asset) {
            if (error) {
            }
            else {
                var dep = loader.getDependsRecursively(asset);
                for(var i = 0; i < dep.length; i ++) {
                    this.incRefCount(dep[i]);
                }
            }
            if(callback!==null)
            {
                console.info("加载完成了，进行回调")
                setTimeout(() => {callback()}, 30);
            }
        }.bind(this));
    }
}

