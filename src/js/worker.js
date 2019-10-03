import {Buff, BuffRange, Buffs} from "./Buff";
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

onmessage = function (e) {
    let data = e.data;
    calculation(data.list,data.buff);
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

function calculation(list,buff) {
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
                            item.level = c.level;
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
            addition:{}
        },
        supplyMoney:{
            supply:0,
            money:0,
            addition:{}
        },
        supplyRarity:{
            supply:0,
            legendary:0,
            rare:0,
            addition:{}
        },
        offlineMoney:{
            money:0,
            addition:{}
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
                    buildings:[]
                };

                let buffs = new Buffs();
                buff.forEach(function (source) {
                    source.list.forEach(function (buff) {
                        buffs.add(source.type,new Buff(buff.range,buff.target,buff.buff));
                    });
                });

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

                if (addition.online>result.onlineMoney.money){
                    result.onlineMoney.money = addition.online;
                    result.onlineMoney.addition = addition;
                }
                if (addition.offline>result.offlineMoney.money){
                    result.offlineMoney.money = addition.offline;
                    result.offlineMoney.addition = addition;
                }
                if (addition.supply===result.supplyMoney.supply){
                    if (addition.online>result.supplyMoney.money){
                        result.supplyMoney.money = addition.online;
                        result.supplyMoney.supply = addition.supply;
                        result.supplyMoney.addition = addition;
                    }
                }else if (addition.supply>result.supplyMoney.supply){
                    result.supplyMoney.money = addition.online;
                    result.supplyMoney.supply = addition.supply;
                    result.supplyMoney.addition = addition;
                }
                if (addition.supply===result.supplyRarity.supply){
                    if (legendary===result.supplyRarity.legendary){
                        if (rare>result.supplyRarity.rare){
                            result.supplyRarity.supply = addition.supply;
                            result.supplyRarity.legendary = legendary;
                            result.supplyRarity.rare = rare;
                            result.supplyRarity.addition = addition;
                        }
                    }else if (legendary>result.supplyRarity.legendary){
                        result.supplyRarity.supply = addition.supply;
                        result.supplyRarity.legendary = legendary;
                        result.supplyRarity.rare = rare;
                        result.supplyRarity.addition = addition;
                    }
                }else if (addition.supply>result.supplyRarity.supply){
                    result.supplyRarity.supply = addition.supply;
                    result.supplyRarity.legendary = legendary;
                    result.supplyRarity.rare = rare;
                    result.supplyRarity.addition = addition;
                }
            });
        });
    });
    console.log(result.supplyMoney.addition);

    let arr = [result.onlineMoney.addition];
    if (arr.indexOf(result.supplyMoney.addition)===-1){
        arr.push(result.supplyMoney.addition);
    }
    if (arr.indexOf(result.supplyRarity.addition)===-1){
        arr.push(result.supplyRarity.addition);
    }
    if (arr.indexOf(result.offlineMoney.addition)===-1){
        arr.push(result.offlineMoney.addition);
    }
    arr.forEach((addition)=>{
        addition.online = renderSize(addition.online);
        addition.offline = renderSize(addition.offline);
        addition.buildings.forEach((building)=>{
            building.online = renderSize(building.online);
            building.offline = renderSize(building.offline);
        });
    });

    console.log(result.supplyMoney.addition);

    postMessage({
        mode:"result",
        result:{
            onlineMoney:result.onlineMoney.addition,
            supplyMoney:result.supplyMoney.addition,
            supplyRarity:result.supplyRarity.addition,
            offlineMoney:result.offlineMoney.addition
        }
    });
    postMessage("done");
}

function renderSize(value){
    if(null===value||value===''){
        return "0";
    }
    let unitArr = ["","K","M","B","T","aa","bb","cc","dd","ee","ff","gg"];
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
    return size+unitArr[index];
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