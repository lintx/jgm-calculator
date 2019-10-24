import {BuffRange, BuffSource} from "./Buff";
import {getIncome} from "./Level";
import {renderSize} from "./Utils";


class Building{
    constructor(name,rarity,type,baseMoney){
        this.use = false;
        this.disabled = false;
        this.level = 1;
        this.star = 0;
        this.buffs = [];  //建筑加成
        this.BuildingName = name;
        this.rarity = rarity;
        this.BuildingType = type;
        this.baseMoney = baseMoney;
    }

    get tooltip(){
        if (this.star===0){
            return "";
        }
        let tooltip = [];
        tooltip.push(this.BuildingName);
        tooltip.push(Array(this.star+1).join("★"));
        tooltip.push("等级 " + this.level);
        this.buffs.forEach((buff)=>{
            tooltip.push(buff.target + "的收入增加 " + Math.round(this.getBuffValue(buff) * 100) + "%");
        });
        tooltip.push("基础收益：" + this.baseMoney + "*" + this.multiple + "*" + renderSize(getIncome(this.level)) + "=" + renderSize(this.money));
        return tooltip.join("<br />");
    }

    get money(){
        return this.baseMoney * this.multiple * getIncome(this.level); //这里需要按等级计算，这是基础金钱收益
    }

    sumMoney(multiple){
        let income = getIncome(this.level);
        let money = {};
        money[BuffRange.Online] = multiple[BuffRange.Online] * income;
        money[BuffRange.Offline] = multiple[BuffRange.Offline] * income;
        return money;
    }

    sumMultiple(buffs){
        let m = this.baseMoney * this.multiple;
        let multiple = {};
        multiple[BuffRange.Online] = m;
        multiple[BuffRange.Offline] = m / 2;
        [BuffSource.Building,BuffSource.Policy,BuffSource.Photo,BuffSource.Quest].forEach((source)=>{
            let buff = buffs.Calculation(source,this);
            Object.keys(buff).forEach((range)=>{
                multiple[range] *= buff[range];
            });
        });
        return multiple;
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
    Industrial:"工业",
    Business:"商业",
    Residence:"住宅"
};

let BuildingNames = {
    Chalet:"木屋",
    SteelStructureHouse:"钢结构房",
    Bungalow:"平房",
    SmallApartment:"小型公寓",
    Residential:"居民楼",
    TalentApartment:"人才公寓",
    GardenHouse:"花园洋房",
    ChineseSmallBuilding:"中式小楼",
    SkyVilla:"空中别墅",
    RevivalMansion:"复兴公馆",
    DreamApartment:"梦想公寓",

    ConvenienceStore:"便利店",
    School:"学校",
    ClothingStore:"服装店",
    HardwareStore:"五金店",
    VegetableMarket:"菜市场",
    BookCity:"图书城",
    BusinessCenter:"商贸中心",
    GasStation:"加油站",
    DreamExpress:"追梦快递",
    FolkFood:"民食斋",
    MediaVoice:"媒体之声",
    SwimmingPool:"游泳馆",

    WoodFactory:"木材厂",
    PaperMill:"造纸厂",
    WaterPlant:"水厂",
    PowerPlant:"电厂",
    FoodFactory:"食品厂",
    SteelPlant:"钢铁厂",
    TextileMill:"纺织厂",
    PartsFactory:"零件厂",
    TencentMachinery:"企鹅机械",
    PeoplesOil:"人民石油",
    PowerfulCountryCoalIndustry:"强国煤业"
}

export {
    Building,
    BuildingRarity,
    BuildingType,
    BuildingNames
}