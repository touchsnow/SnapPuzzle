import { _decorator, Component, Node } from 'cc';
import { Level } from './Level';
const { ccclass, property } = _decorator;

@ccclass('Achievement')
export class Achievement {

    public money:number = 0
    public promotyCount:number = 1

}
