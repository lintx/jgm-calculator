import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";
import Chalet from "./Builds/Chalet";
import SteelStructureHouse from "./Builds/SteelStructureHouse";
import Bungalow from "./Builds/Bungalow";
import SmallApartment from "./Builds/SmallApartment";
import Residential from "./Builds/Residential";
import TalentApartment from "./Builds/TalentApartment";
import GardenHouse from "./Builds/GardenHouse";
import ChineseSmallBuilding from "./Builds/ChineseSmallBuilding";
import SkyVilla from "./Builds/SkyVilla";
import RevivalMansion from "./Builds/RevivalMansion";
import ConvenienceStore from "./Builds/ConvenienceStore";
import School from "./Builds/School";
import ClothingStore from "./Builds/ClothingStore";
import HardwareStore from "./Builds/HardwareStore";
import VegetableMarket from "./Builds/VegetableMarket";
import BookCity from "./Builds/BookCity";
import BusinessCenter from "./Builds/BusinessCenter";
import GasStation from "./Builds/GasStation";
import FolkFood from "./Builds/FolkFood";
import MediaVoice from "./Builds/MediaVoice";
import WoodFactory from "./Builds/WoodFactory";
import PaperMill from "./Builds/PaperMill";
import WaterPlant from "./Builds/WaterPlant";
import PowerPlant from "./Builds/PowerPlant";
import FoodFactory from "./Builds/FoodFactory";
import SteelPlant from "./Builds/SteelPlant";
import TextileMill from "./Builds/TextileMill";
import PartsFactory from "./Builds/PartsFactory";
import TencentMachinery from "./Builds/TencentMachinery";
import PeoplesOil from "./Builds/PeoplesOil";
import {BuildingRarity} from "./Building";
import {getCost} from "./Level";

onmessage = function (e) {
    let data = e.data;
    calculation(data.list,data.buff,data.config);
};

let buildings = [
    new Chalet(),
    new SteelStructureHouse(),
    new Bungalow(),
    new SmallApartment(),
    new Residential(),
    new TalentApartment(),
    new GardenHouse(),
    new ChineseSmallBuilding(),
    new SkyVilla(),
    new RevivalMansion(),
    new ConvenienceStore(),
    new School(),
    new ClothingStore(),
    new HardwareStore(),
    new VegetableMarket(),
    new BookCity(),
    new BusinessCenter(),
    new GasStation(),
    new FolkFood(),
    new MediaVoice(),
    new WoodFactory(),
    new PaperMill(),
    new WaterPlant(),
    new PowerPlant(),
    new FoodFactory(),
    new SteelPlant(),
    new TextileMill(),
    new PartsFactory(),
    new TencentMachinery(),
    new PeoplesOil()
];
buildings.forEach((item)=>{
    item.initBuffs();
});

function calculation(list,buff,config) {
    let programs = [];
    list.forEach(function (building) {
        let program = [];
        let sel = getFlagArrs(building.list.length,3);
        sel.forEach(function (val) {
            let p = [];
            val.forEach(function (v, index) {
                if (v===1){
                    let c = building.list[index];
                    buildings.forEach((item)=>{
                        if (item.BuildingName===c.name){
                            item.star = c.star;
                            item.quest = c.quest;
                            if (!config.allBuildingLevel1){
                                item.level = c.level;
                            }else {
                                item.level = 1;
                            }
                            p.push(item);
                            return true;
                        }
                    });
                }
            });
            program.push(p);
        });
        programs.push(program);
    });

    //需要结果：
    //1.在线金币最高
    //2.货物加成最高且在线金币最高
    //3.货物加成最高且橙色建筑最多且紫色建筑最多
    //4.离线金币最高

    let result = {
        onlineMoney:{
            money:0,
            addition:{},
            buffs:null
        },
        supplyMoney:{
            supply:0,
            money:0,
            addition:{},
            buffs:null
        },
        supplyRarity:{
            supply:0,
            legendary:0,
            rare:0,
            money:0,
            addition:{},
            buffs:null
        },
        supplyLegendaryMoney:{
            supply:0,
            legendary:0,
            money:0,
            addition:{},
            buffs:null
        },
        offlineMoney:{
            money:0,
            addition:{},
            buffs:null
        }
    };

    let progressFull = programs[0].length;
    programs[0].forEach(function (val1,i1) {
        postMessage({
            mode:"progress",
            progress:Math.round((i1+1)/progressFull*100)
        });
        programs[1].forEach(function (val2) {
            programs[2].forEach(function (val3) {
                let temp = [...val1,...val2,...val3];
                let addition = {
                    online:0,
                    offline:0,
                    supply:0,
                    buildings:[],
                };

                let buffs = new Buffs();
                buff.forEach(function (source) {
                    source.list.forEach(function (buff) {
                        buffs.add(source.type,new Buff(buff.range,buff.target,buff.buff));
                    });
                });
                if (config.policy.stage1){
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Global,BuffRange.Global,100));//一带一路建设
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Business,BuffRange.Business,300));//自由贸易区建设
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Residence,BuffRange.Residence,300));//区域协调发展
                }
                if (config.policy.stage2){
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Global,BuffRange.Global,200));//全面深化改革
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Online,BuffRange.Online,200));//全面依法治国
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Offline,BuffRange.Offline,200));//科教兴国
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Industrial,BuffRange.Industrial,600));//创新驱动
                }
                if (config.policy.stage3){
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Industrial,BuffRange.Industrial,1200));//制造强国
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Supply,BuffRange.Supply,30));//优化营商环境
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Global,BuffRange.Global,400));//减税降费
                    buffs.add(BuffSource.Policy,new Buff(BuffRange.Business,BuffRange.Business,1200));//普惠金融
                }

                let legendary = 0;
                let rare = 0;

                temp.forEach(function (t) {
                    if (t.rarity===BuildingRarity.Legendary){
                        legendary += 1;
                    }else if (t.rarity===BuildingRarity.Rare){
                        rare += 1;
                    }
                    buffs.addBuilding(t);
                    if (t.quest>0){
                        buffs.addQuest(t);
                    }
                });

                temp.forEach(function (t) {
                    let a = t.calculation(buffs);
                    addition.online += a[BuffRange.Online];
                    addition.offline += a[BuffRange.Offline];
                    addition.buildings.push({
                        online:a[BuffRange.Online],
                        offline:a[BuffRange.Offline],
                        building:t
                    });
                });
                addition.supply = Math.round(buffs.supplyBuff*100);

                let supply = addition.supply;
                if (config.supplyStep50){
                    supply = Math.floor(supply/50);
                }
                if (addition.online>result.onlineMoney.money){
                    result.onlineMoney.money = addition.online;
                    result.onlineMoney.addition = addition;
                    result.onlineMoney.buffs = buffs;
                }
                if (addition.offline>result.offlineMoney.money){
                    result.offlineMoney.money = addition.offline;
                    result.offlineMoney.addition = addition;
                    result.offlineMoney.buffs = buffs;
                }
                if (supply===result.supplyMoney.supply){
                    if (addition.online>result.supplyMoney.money){
                        result.supplyMoney.money = addition.online;
                        result.supplyMoney.supply = supply;
                        result.supplyMoney.addition = addition;
                        result.supplyMoney.buffs = buffs;
                    }
                }else if (supply>result.supplyMoney.supply){
                    result.supplyMoney.money = addition.online;
                    result.supplyMoney.supply = supply;
                    result.supplyMoney.addition = addition;
                    result.supplyMoney.buffs = buffs;
                }
                if (supply===result.supplyRarity.supply){
                    if (legendary===result.supplyRarity.legendary){
                        if (rare===result.supplyRarity.rare){
                            if (addition.online>result.supplyRarity.money){
                                result.supplyRarity.supply = supply;
                                result.supplyRarity.legendary = legendary;
                                result.supplyRarity.rare = rare;
                                result.supplyRarity.addition = addition;
                                result.supplyRarity.buffs = buffs;
                                result.supplyRarity.money = addition.online;
                            }
                        }else if (rare>result.supplyRarity.rare){
                            result.supplyRarity.supply = supply;
                            result.supplyRarity.legendary = legendary;
                            result.supplyRarity.rare = rare;
                            result.supplyRarity.addition = addition;
                            result.supplyRarity.buffs = buffs;
                            result.supplyRarity.money = addition.online;
                        }
                    }else if (legendary>result.supplyRarity.legendary){
                        result.supplyRarity.supply = supply;
                        result.supplyRarity.legendary = legendary;
                        result.supplyRarity.rare = rare;
                        result.supplyRarity.addition = addition;
                        result.supplyRarity.buffs = buffs;
                        result.supplyRarity.money = addition.online;
                    }
                }else if (supply>result.supplyRarity.supply){
                    result.supplyRarity.supply = supply;
                    result.supplyRarity.legendary = legendary;
                    result.supplyRarity.rare = rare;
                    result.supplyRarity.addition = addition;
                    result.supplyRarity.buffs = buffs;
                    result.supplyRarity.money = addition.online;
                }
                if (supply===result.supplyLegendaryMoney.supply){
                    if (legendary===result.supplyLegendaryMoney.legendary){
                        if (addition.online>result.supplyLegendaryMoney.money){
                            result.supplyLegendaryMoney.supply = supply;
                            result.supplyLegendaryMoney.legendary = legendary;
                            result.supplyLegendaryMoney.money = addition.online;
                            result.supplyLegendaryMoney.addition = addition;
                            result.supplyLegendaryMoney.buffs = buffs;
                        }
                    }else if (legendary>result.supplyLegendaryMoney.legendary){
                        result.supplyLegendaryMoney.supply = supply;
                        result.supplyLegendaryMoney.legendary = legendary;
                        result.supplyLegendaryMoney.money = addition.online;
                        result.supplyLegendaryMoney.addition = addition;
                        result.supplyLegendaryMoney.buffs = buffs;
                    }
                }else if (supply>result.supplyLegendaryMoney.supply){
                    result.supplyLegendaryMoney.supply = supply;
                    result.supplyLegendaryMoney.legendary = legendary;
                    result.supplyLegendaryMoney.money = addition.online;
                    result.supplyLegendaryMoney.addition = addition;
                    result.supplyLegendaryMoney.buffs = buffs;
                }
            });
        });
    });

    let arr = [];
    Object.keys(result).forEach((key)=>{
        let r = result[key];
        let arr1 = [];
        arr.forEach((ar)=>{
            arr1.push(ar.addition);
        });
        if (arr1.indexOf(r.addition)===-1){
            arr.push(r);
        }
    });

    arr.forEach((program)=>{
        program.addition.online = renderSize(program.addition.online);
        program.addition.offline = renderSize(program.addition.offline);

        let upgrade = {
            best:{
                online:0,
                upgradeBenefit:0,
                building:null
            },
            minor:{
                online:0,
                upgradeBenefit:0,
                building:null
            }
        };
        program.addition.buildings.forEach((building)=>{
            //计算方案内建筑升级最优解
            //1.先计算每个建筑升1级的金币-收益比
            //2.然后取出最优解和次优解，再计算最优解升级到多少级后变为次优解
            if (building.building.level<2000){
                let level = building.building.level;
                let benefitObj = upgradeBenefit(building.online,building.building,program.buffs);
                building.building.level = level;
                //及时把建筑的等级恢复原样

                let benefit = benefitObj.benefit;
                if (benefit>upgrade.best.upgradeBenefit){
                    upgrade.minor.upgradeBenefit = upgrade.best.upgradeBenefit;
                    upgrade.minor.building = upgrade.best.building;
                    upgrade.minor.online = upgrade.best.online;

                    upgrade.best.upgradeBenefit = benefit;
                    upgrade.best.building = building;
                    upgrade.best.online = building.online;
                }else if (benefit>upgrade.minor.upgradeBenefit){
                    upgrade.minor.upgradeBenefit = benefit;
                    upgrade.minor.building = building;
                    upgrade.minor.online = building.online;
                }
            }

            building.online = renderSize(building.online);
            building.offline = renderSize(building.offline);
        });

        // console.log("最优建筑：" + upgrade.best.building.building.BuildingName + ",等级：" + upgrade.best.building.building.level + ",效益：" + upgrade.best.upgradeBenefit + ",次优建筑:" + upgrade.minor.building.building.BuildingName + ",效益：" + upgrade.minor.upgradeBenefit);

        if (upgrade.best.building!==null && upgrade.best.building.building.level<2000){
            let level = upgrade.best.building.building.level;
            while (true){
                let benefitObj = upgradeBenefit(upgrade.best.online,upgrade.best.building.building,program.buffs);
                // console.log("模拟升级：" + upgrade.best.building.building.BuildingName + ",目标等级：" + upgrade.best.building.building.level + ",效益：" + benefitObj.benefit);

                upgrade.best.online = benefitObj.online;
                if (benefitObj.benefit<upgrade.minor.upgradeBenefit){
                    program.addition.upgrade = {
                        building:upgrade.best.building.building,
                        toLevel:upgrade.best.building.building.level - 1,
                        nextBuilding:upgrade.minor.building.building
                    };
                    break;
                }
            }
            upgrade.best.building.building.level = level;
        }
    });

    postMessage({
        mode:"result",
        result:[
            {
                title:"在线金币优先策略",
                addition:result.onlineMoney.addition
            },
            {
                title:"供货优先、金币次之策略",
                addition:result.supplyMoney.addition
            },
            {
                title:"供货优先、橙卡次之、紫卡再次之策略",
                addition:result.supplyRarity.addition
            },
            {
                title:"供货优先、橙卡次之、金币再次之策略",
                addition:result.supplyLegendaryMoney.addition
            },
            {
                title:"离线金币优先策略",
                addition:result.offlineMoney.addition
            },
        ]
    });
    postMessage("done");
}

function upgradeBenefit(online,building,buffs) {
    if (building.level<2000){
        building.level += 1;
    }else {
        return {
            online: online,
            benefit: 0
        };
    }
    let cost = getCost(building.level,building.rarity);

    let addition = building.calculation(buffs);
    let addOnline = addition[BuffRange.Online] - online;
    if (addOnline===0){
        return {
            online: addition[BuffRange.Online],
            benefit: 0
        };
    }
    return {
        online:addition[BuffRange.Online],
        benefit:addOnline/cost
    };
}

function renderSize(value){
    if(null===value||value===''){
        return "0";
    }
    let unitArr = ["","K","M","B","T","aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz"];
    let index=0,
        srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1000));
    let size =srcsize/Math.pow(1000,index);
    //  保留的小数位数
    if (size>=100){
        size = Math.round(size);
    }else if (size>=10){
        size = size.toFixed(1);
    }else {
        size = size.toFixed(2);
    }
    let unit = unitArr[index];
    if (unit===undefined){
        unit = "E" + index * 3;
    }
    return size + unit;
}

function getFlagArrs(m, n) {
    if(!n || n < 1) {
        return [];
    }
    let resultArrs = [],
        flagArr = [],
        isEnd = false,
        i, j, leftCnt;

    for (i = 0; i < m; i++) {
        flagArr[i] = i < n ? 1 : 0;
    }

    resultArrs.push(flagArr.concat());
    if (m<=n){
        return resultArrs;
    }

    while (!isEnd) {
        leftCnt = 0;
        for (i = 0; i < m - 1; i++) {
            if (flagArr[i] === 1 && flagArr[i+1] === 0) {
                for(j = 0; j < i; j++) {
                    flagArr[j] = j < leftCnt ? 1 : 0;
                }
                flagArr[i] = 0;
                flagArr[i+1] = 1;
                let aTmp = flagArr.concat();
                resultArrs.push(aTmp);
                if(aTmp.slice(-n).join("").indexOf('0') === -1) {
                    isEnd = true;
                }
                break;
            }
            flagArr[i] === 1 && leftCnt++;
        }
    }
    return resultArrs;
}