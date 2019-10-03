import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";


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
        // addition[BuffRange.Supply] = 0;
        [BuffSource.Building,BuffSource.Policy,BuffSource.Photo,BuffSource.Quest].forEach((source)=>{
            let buff = buffs.Calculation(source,this);
            Object.keys(buff).forEach((range)=>{
                addition[range] *= buff[range];
            });
            // globalBuff.Calculation(source,this).forEach((buff,range)=>{
            //     // if (range===BuffRange.Supply){
            //     //     addition[range] += buff;
            //     // }else {
            //         addition[range] *= buff;
            //     // }
            // });
        });
        return addition;
        // [BuffRange.Online,BuffRange.Offline,BuffRange.Supply].forEach((range)=>{
        //     addition[range] = this.money
        //         * globalBuff.Calculation(BuffSource.Building,this) //建筑加成
        //         * globalBuff.Calculation(BuffSource.Policy,this)   //政策加成
        //         * globalBuff.Calculation(BuffSource.Photo,this)    //照片加成
        //         * globalBuff.Calculation(BuffSource.Quest,this);   //任务加成
        // });
        // addition[BuffRange.Online] = this.money
        //     * globalBuff.Calculation(BuffSource.Building,this) //建筑加成
        //     * globalBuff.Calculation(BuffSource.Policy,this)   //政策加成
        //     * globalBuff.Calculation(BuffSource.Photo,this)    //照片加成
        //     * globalBuff.Calculation(BuffSource.Quest,this);   //任务加成
        // Object.keys(BuffType).forEach((type)=>{
        //     addition[type] = this.money
        //         * this.getAdditionWithBuffAndType(globalBuff.Building,type) //建筑加成
        //         * this.getAdditionWithBuffAndType(globalBuff.Policy,type)   //政策加成
        //         * this.getAdditionWithBuffAndType(globalBuff.Photo,type)    //照片加成
        //         * this.getAdditionWithBuffAndType(globalBuff.Quest,type);   //任务加成
        // });
    }

    // Calculation(type){
    //     let globalBuff = Buffs.getInstance();
    //     return this.money
    //     * this.getAdditionWithBuffAndType(globalBuff.Building,type) //建筑加成
    //     * this.getAdditionWithBuffAndType(globalBuff.Policy,type)   //政策加成
    //     * this.getAdditionWithBuffAndType(globalBuff.Photo,type)    //照片加成
    //     * this.getAdditionWithBuffAndType(globalBuff.Quest,type);   //任务加成
    // }

    get money(){
        return this.baseMoney * this.multiple; //这里需要按等级计算，这是基础金钱收益
    }

    get multiple(){
        let multiple = 1;
        switch (this.star) {
            case 1:
                multiple = 1;
                break;
            case 2:
                multiple = 2;
                break;
            case 3:
                multiple = 6;
                break;
            case 4:
                multiple = 24;
                break;
            case 5:
                multiple = 120;
                break;
        }
        return multiple
    }

    getBuffValue(buff){
        return buff.buff * this.star;
    }

    // getAdditionWithBuffAndType(buff, type) {
    //     let addition = 1;
    //     buff.Targets.forEach((value)=>{
    //         if (value.target.BuildingName===this.BuildingName){
    //             addition += value.buff
    //         }
    //     });
    //     switch (this.BuildingType) {
    //         case Type.Residence:
    //             addition += buff.Residence;
    //             break;
    //         case Type.Business:
    //             addition += buff.Business;
    //             break;
    //         case Type.Industrial:
    //             addition += buff.Industrial;
    //     }
    //
    //     switch (type) {
    //         case BuffType.Online:
    //             addition += buff.Online;
    //             break;
    //         case BuffType.Offline:
    //             addition += buff.Offline;
    //             break;
    //         case BuffType.Supply:
    //             addition += buff.Supply;
    //             break;
    //     }
    //
    //     return addition;
    // }
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