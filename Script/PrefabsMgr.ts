import { _decorator, Component, Node, Prefab, game, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrefabsMgr')
export class PrefabsMgr extends Component {
    public static Instance: PrefabsMgr = null;

    @property([Prefab])
    private prefabs: Array<Prefab> = []
    @property([SpriteAtlas])
    private spriteAtlas: Array<SpriteAtlas> = []

    onLoad()
    {
        if (PrefabsMgr.Instance === null) {
            PrefabsMgr.Instance = this;
        }
        else {
            //this.destroy();
            return;
        }
        
    }

    start () {
        game.addPersistRootNode(this.node.parent);
    }

    getPrefabs(name)
    {
        for(var i = 0; i<= this.prefabs.length-1;i++)
        {
            if(this.prefabs[i].data._name === name)
            {
                return this.prefabs[i]
            }
        }
    }

    public getSprite(sprite)
    {
        for(var i = 0; i<= this.spriteAtlas.length-1;i++)
        {
            if(this.spriteAtlas[i].getSpriteFrame(sprite) !==null)
            {
                return this.spriteAtlas[i].getSpriteFrame(sprite)
            }
        }
    }
}
