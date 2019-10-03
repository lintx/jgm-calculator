import {BuffRange, BuffSource} from "./Buff";


class Building{
    constructor(name,rarity,type,baseMoney){
        this.star = 0;
        this.quest = 0;
        this.buffs = [];  //建筑加成
        this.BuildingName = name;
        this.rarity = rarity;
        this.BuildingType = type;
        this.baseMoney = baseMoney;
    }

    calculation(buffs){
        let addition = {};
        let money = this.money;
        addition[BuffRange.Online] = money;
        addition[BuffRange.Offline] = money / 2;
        [BuffSource.Building,BuffSource.Policy,BuffSource.Photo,BuffSource.Quest].forEach((source)=>{
            let buff = buffs.Calculation(source,this);
            Object.keys(buff).forEach((range)=>{
                addition[range] *= buff[range];
            });
        });
        return addition;
    }

    get money(){
        return this.baseMoney * this.multiple; //这里需要按等级计算，这是基础金钱收益
    }

    get multiple(){
        switch (this.star) {
            case 1:
                return  1;
            case 2:
                return 2;
            case 3:
                return 6;
            case 4:
                return 24;
            case 5:
                return 120;
            default:
                return 1;
        }
    }

    getBuffValue(buff){
        return buff.buff * this.star;
    }
}

let BuildingRarity = {
    Common:"普通",
    Rare:"稀有",
    Legendary:"史诗"
};

let BuildingType = {
    Residence:"住宅",
    Business:"商业",
    Industrial:"工业"
};

export {
    Building,
    BuildingRarity,
    BuildingType
}