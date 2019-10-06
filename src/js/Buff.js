import {BuildingType} from "./Building";

class Buff {
    constructor(range,target,buff){
        this.range = range;
        this.target = target;
        this.buff = buff;
    }
}

let BuffRange = {
    Global:"所有建筑",
    Supply:"供货",
    Online:"在线",
    Offline:"离线",
    Residence:"住宅建筑",
    Business:"商业建筑",
    Industrial:"工业建筑",
    Targets:"特定建筑物"
};

let BuffSource = {
    Building:"建筑加成",
    Policy:"政策加成",
    Photo:"游记加成",
    Activity:"活动加成(如国庆buff)",
    Quest:"城市任务加成"//,
    // ShineChina:"家国之光"
};

class Buffs {
    constructor(){
        this.Building = []; //建筑加成
        this.Policy = []; //政策加成
        this.Photo = []; //游记加成
        this.Quest = []; //任务加成
    }

    add(source,buff){
        let b = new Buff(buff.range,buff.target,buff.buff/100);
        switch (source) {
            case BuffSource.Policy:
            case BuffSource.Activity:
            // case BuffSource.ShineChina:
                this.Policy.push(b);
                break;
            case BuffSource.Photo:
                this.Photo.push(b);
                break;
            case BuffSource.Quest:
                this.Quest.push(b);
                break;
        }
    }

    addBuilding(building){
        building.buffs.forEach((buff)=>{
            this.Building.push(new Buff(buff.range,buff.target,building.getBuffValue(buff)));
        });
    }

    Calculation(source, building) {
        let result = {};
        result[BuffRange.Online] = 1;
        result[BuffRange.Offline] = 1;
        let buffs;
        switch (source) {
            case BuffSource.Building:
                buffs = this.Building;
                break;
            case BuffSource.Policy:
                buffs = this.Policy;
                break;
            case BuffSource.Photo:
                buffs = this.Photo;
                break;
            case BuffSource.Quest:
                buffs = this.Quest;
                break;
            default:
                return result;
        }
        buffs.forEach((buff) => {
            switch (buff.range) {
                case BuffRange.Global:
                    result[BuffRange.Online] += buff.buff;
                    result[BuffRange.Offline] += buff.buff;
                    break;
                case BuffRange.Online:
                    result[BuffRange.Online] += buff.buff;
                    break;
                case BuffRange.Offline:
                    result[BuffRange.Offline] += buff.buff;
                    break;
                case BuffRange.Business:
                    if (building.BuildingType === BuildingType.Business) {
                        result[BuffRange.Online] += buff.buff;
                        result[BuffRange.Offline] += buff.buff;
                    }
                    break;
                case BuffRange.Residence:
                    if (building.BuildingType === BuildingType.Residence) {
                        result[BuffRange.Online] += buff.buff;
                        result[BuffRange.Offline] += buff.buff;
                    }
                    break;
                case BuffRange.Industrial:
                    if (building.BuildingType === BuildingType.Industrial) {
                        result[BuffRange.Online] += buff.buff;
                        result[BuffRange.Offline] += buff.buff;
                    }
                    break;
                case BuffRange.Targets:
                    if (buff.target === building.BuildingName) {
                        result[BuffRange.Online] += buff.buff;
                        result[BuffRange.Offline] += buff.buff;
                    }
            }
        });
        return result;
    }

    get supplyBuff(){
        let b = 0;
        [this.Building,this.Policy,this.Photo,this.Quest].forEach((buffs)=>{
            buffs.forEach((buff) => {
                if (buff.range === BuffRange.Supply) {
                    b += buff.buff;
                }
            });
        });
        return b;
    }
}

export {
    Buff,
    Buffs,
    BuffRange,
    BuffSource
}