import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";
import Chalet from "./Builds/Residence/Chalet";
import SteelStructureHouse from "./Builds/Residence/SteelStructureHouse";
import Bungalow from "./Builds/Residence/Bungalow";
import SmallApartment from "./Builds/Residence/SmallApartment";
import Residential from "./Builds/Residence/Residential";
import TalentApartment from "./Builds/Residence/TalentApartment";
import GardenHouse from "./Builds/Residence/GardenHouse";
import ChineseSmallBuilding from "./Builds/Residence/ChineseSmallBuilding";
import SkyVilla from "./Builds/Residence/SkyVilla";
import RevivalMansion from "./Builds/Residence/RevivalMansion";
import ConvenienceStore from "./Builds/Business/ConvenienceStore";
import School from "./Builds/Business/School";
import ClothingStore from "./Builds/Business/ClothingStore";
import HardwareStore from "./Builds/Business/HardwareStore";
import VegetableMarket from "./Builds/Business/VegetableMarket";
import BookCity from "./Builds/Business/BookCity";
import BusinessCenter from "./Builds/Business/BusinessCenter";
import GasStation from "./Builds/Business/GasStation";
import FolkFood from "./Builds/Business/FolkFood";
import MediaVoice from "./Builds/Business/MediaVoice";
import WoodFactory from "./Builds/Industrial/WoodFactory";
import PaperMill from "./Builds/Industrial/PaperMill";
import WaterPlant from "./Builds/Industrial/WaterPlant";
import PowerPlant from "./Builds/Industrial/PowerPlant";
import FoodFactory from "./Builds/Industrial/FoodFactory";
import SteelPlant from "./Builds/Industrial/SteelPlant";
import TextileMill from "./Builds/Industrial/TextileMill";
import PartsFactory from "./Builds/Industrial/PartsFactory";
import TencentMachinery from "./Builds/Industrial/TencentMachinery";
import PeoplesOil from "./Builds/Industrial/PeoplesOil";
import DreamApartment from "./Builds/Residence/DreamApartment";
import DreamExpress from "./Builds/Business/DreamExpress";
import SwimmingPool from "./Builds/Business/SwimmingPool";
import PowerfulCountryCoalIndustry from "./Builds/Industrial/PowerfulCountryCoalIndustry";
import {BuildingRarity} from "./Building";
import {getData} from "./Level";
import {getFlagArrs, getValidLevel, renderSize, toNumber} from "./Utils";
import {getPolicy} from "./Policy";

//接收消息
onmessage = function (e) {
    let data = e.data;
    let result;
    //根据模式处理对应的值
    if (data.config.upgradeRecommend.mode===1){
        try {
            data.config.upgradeRecommend.value = Math.round(Number(data.config.upgradeRecommend.value));
        }catch (e) {
            data.config.upgradeRecommend.value = 100;
        }
        data.config.upgradeRecommend.value = Math.max(1,data.config.upgradeRecommend.value);
        data.config.upgradeRecommend.value = Math.min(9*2000,data.config.upgradeRecommend.value);
    }else {
        data.config.upgradeRecommend.value = toNumber(data.config.upgradeRecommend.value);
    }
    //开始计算
    result = calculation(data.list,data.policy,data.buff,data.config);
    postMessage({
        mode:"result",
        result:result
    });
    postMessage("done");
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
    new DreamApartment(),
    new ConvenienceStore(),
    new School(),
    new ClothingStore(),
    new HardwareStore(),
    new VegetableMarket(),
    new BookCity(),
    new BusinessCenter(),
    new GasStation(),
    new DreamExpress(),
    new FolkFood(),
    new MediaVoice(),
    new SwimmingPool(),
    new WoodFactory(),
    new PaperMill(),
    new WaterPlant(),
    new PowerPlant(),
    new FoodFactory(),
    new SteelPlant(),
    new TextileMill(),
    new PartsFactory(),
    new TencentMachinery(),
    new PeoplesOil(),
    new PowerfulCountryCoalIndustry()
];

function initBuildings(list,config) {
    let availableBuildings = [];
    let currentBuildings = [];
    list.forEach((l,i)=>{
        let t = {
            type:l.type,
            list:[]
        };
        currentBuildings[i] = [];
        l.list.forEach(b=>{
            buildings.forEach(item=>{
                if (item.BuildingName===b.name){
                    if (config.allBuildingLevel1){
                        item.level = getValidLevel(config.allBuildingLevel);
                    }else {
                        item.level = b.level;
                    }
                    item.star = b.star;
                    item.use = b.use;
                    item.disabled = b.disabled;

                    if (!item.disabled){
                        t.list.push(item);
                    }
                    if (item.use && currentBuildings[i].length<3){
                        currentBuildings[i].push(item);
                    }
                }
            });
        });
        availableBuildings.push(t);
    });

    return {
        available:availableBuildings,
        current:[...currentBuildings[2],...currentBuildings[1],...currentBuildings[0]]
    };
}

function getPrograms(list) {
    let programs = [];
    list.forEach(function (building) {
        let program = [];
        let sel = getFlagArrs(building.list.length,3);
        sel.forEach(function (val) {
            let p = [];
            val.forEach(function (v, index) {
                if (v===1){
                    p.push(building.list[index]);
                }
            });
            program.push(p);
        });
        programs.push(program);
    });
    return programs;
}

function getGlobalBuff(policy, buff, config) {
    //全局的buff
    let globalBuffs = new Buffs();
    //添加常规填写的buff（游记buff、城市任务普通buff、活动buff）
    buff.forEach(function (source) {
        source.list.forEach(function (buff) {
            globalBuffs.add(source.type,new Buff(buff.range,buff.target,buff.buff));
        });
    });
    //添加家国之光buff
    if (config.shineChinaBuff>0){
        globalBuffs.add(BuffSource.Policy,new Buff(BuffRange.Global,BuffRange.Global,config.shineChinaBuff));
    }
    //添加城市任务buff
    let buffRanges = [];
    Object.keys(BuffRange).forEach((rkey)=>{
        let range = BuffRange[rkey];
        if (range===BuffRange.Targets){
            return;
        }
        buffRanges.push(range);
    });
    config.questTargetBuff.forEach(target=>{
        if (target.building!=="" && target.buff>0){
            if (buffRanges.indexOf(target.building)===-1){
                globalBuffs.add(BuffSource.Quest,new Buff(BuffRange.Targets,target.building,target.buff));
            }else {
                globalBuffs.add(BuffSource.Quest,new Buff(target.building,target.building,target.buff));
            }
        }
    });
    //添加政策buff
    for (let i=1;i<=policy.step;i++){
        getPolicy(i).policys.forEach((p)=>{
            let level = 5;
            if (i===policy.step){
                policy.levels.forEach((l)=>{
                    if (p.title===l.title){
                        level = l.level;
                        return true;
                    }
                })
            }
            if (level===0){
                return;
            }
            globalBuffs.add(BuffSource.Policy,p.buff(level));
        })
    }
    return globalBuffs;
}

function calculation(list,policy,buff,config) {
    //初始化建筑等级
    let sb = initBuildings(list,config);
    list = sb.available;
    let currentBuilding = sb.current;


    //获取所有可能的组合
    let programs = getPrograms(list);

    let tempResult = {
        current:{
            title:["当前摆放"],
            addition:{}
        },
        useMoneyLeast:{
            title:["需要金币最少"],
            useMoney : -1,
            bestTps : 0,
            addition:{}
        },
        onlineMoney:{
            title:["在线金币优先策略"],
            money:0,
            addition:{}
        },
        supplyMoney:{
            title:["供货优先、金币次之策略"],
            supply:0,
            money:0,
            addition:{}
        },
        supplyRarity:{
            title:["供货优先、橙卡次之、紫卡再次之策略"],
            supply:0,
            legendary:0,
            rare:0,
            money:0,
            addition:{}
        },
        supplyLegendaryMoney:{
            title:["供货优先、橙卡次之、金币再次之策略"],
            supply:0,
            legendary:0,
            money:0,
            addition:{}
        },
        offlineMoney:{
            title:["离线金币优先策略"],
            money:0,
            addition:{}
        }
    };

    //全局的buff
    let globalBuffs = getGlobalBuff(policy,buff,config);

    if (currentBuilding.length>0){
        tempResult.current.addition = calculationAddition(globalBuffs,currentBuilding).addition;
        if (config.upgradeRecommend.mode===4){
            upgradeWithMode(tempResult.current.addition,config.upgradeRecommend.mode,config.upgradeRecommend.value);
        }
    }

    let progress = {
        full:programs[0].length * programs[1].length * programs[2].length,
        current:0,
        lastTime:(new Date()).getTime(),
        startTime:(new Date()).getTime(),
        count:0
    };
    programs[0].forEach(function (val1) {
        programs[1].forEach(function (val2) {
            programs[2].forEach(function (val3) {
                //进度
                progress.count += 1;
                let tempProgress = progress.count/progress.full*100;
                let nowTime = (new Date()).getTime();
                let sub = nowTime - progress.lastTime;
                let currentProgress = Number(tempProgress.toFixed(2));
                if (currentProgress>progress.current && sub>=500 || sub>=1000){
                    progress.current = currentProgress;
                    progress.lastTime = nowTime;
                    let useTime = (nowTime - progress.startTime) / 1000;
                    let needTime = useTime / tempProgress * 100 - useTime;
                    needTime = formatSeconds(needTime);
                    useTime = formatSeconds(useTime);
                    if (needTime===0){
                        needTime = "-";
                    }
                    postMessage({
                        mode:"progress",
                        progress:{
                            progress:progress.current,
                            useTime:useTime,
                            needTime:needTime
                        }
                    });
                }

                //计算组合的收益等数据
                let calc = calculationAddition(globalBuffs,[...val3,...val2,...val1]);
                let legendary = calc.legendary;
                let rare = calc.rare;

                //按升级推荐方案判断当前方案是否最优组合，如果是则先记录下来，用做后续比对
                if (config.upgradeRecommend.mode===4){
                    //如果是方案4，还要进行模拟升级
                    upgradeWithMode(calc.addition,config.upgradeRecommend.mode,config.upgradeRecommend.value);
                    if (
                        (tempResult.useMoneyLeast.useMoney===calc.addition.useMoney && tempResult.useMoneyLeast.bestTps<calc.addition.toTps)
                        || (tempResult.useMoneyLeast.useMoney===-1 || calc.addition.useMoney<tempResult.useMoneyLeast.useMoney)){
                        tempResult.useMoneyLeast.useMoney = calc.addition.useMoney;
                        tempResult.useMoneyLeast.bestTps = calc.addition.toTps;
                        tempResult.useMoneyLeast.addition = calc.addition;
                    }
                }else {
                    let supply = calc.addition.supply;
                    if (config.supplyStep50){
                        supply = Math.floor(supply/50);
                    }
                    if (calc.addition.online>tempResult.onlineMoney.money){
                        tempResult.onlineMoney.money = calc.addition.online;
                        tempResult.onlineMoney.addition = calc.addition;
                    }
                    if (calc.addition.offline>tempResult.offlineMoney.money){
                        tempResult.offlineMoney.money = calc.addition.offline;
                        tempResult.offlineMoney.addition = calc.addition;
                    }
                    if (supply===tempResult.supplyMoney.supply && calc.addition.online>tempResult.supplyMoney.money || supply>tempResult.supplyMoney.supply){
                        tempResult.supplyMoney.money = calc.addition.online;
                        tempResult.supplyMoney.supply = supply;
                        tempResult.supplyMoney.addition = calc.addition;
                    }
                    if (supply===tempResult.supplyRarity.supply
                        && (legendary===tempResult.supplyRarity.legendary
                            && ((rare===tempResult.supplyRarity.rare
                                && calc.addition.online>tempResult.supplyRarity.money)
                                || rare>tempResult.supplyRarity.rare)
                            || legendary>tempResult.supplyRarity.legendary)
                        || supply>tempResult.supplyRarity.supply){
                        tempResult.supplyRarity.supply = supply;
                        tempResult.supplyRarity.legendary = legendary;
                        tempResult.supplyRarity.rare = rare;
                        tempResult.supplyRarity.addition = calc.addition;
                        tempResult.supplyRarity.money = calc.addition.online;
                    }
                    if (supply===tempResult.supplyLegendaryMoney.supply
                        && (legendary===tempResult.supplyLegendaryMoney.legendary
                            && calc.addition.online>tempResult.supplyLegendaryMoney.money
                            || legendary>tempResult.supplyLegendaryMoney.legendary)
                        || supply>tempResult.supplyLegendaryMoney.supply){
                        tempResult.supplyLegendaryMoney.supply = supply;
                        tempResult.supplyLegendaryMoney.legendary = legendary;
                        tempResult.supplyLegendaryMoney.money = calc.addition.online;
                        tempResult.supplyLegendaryMoney.addition = calc.addition;
                    }
                }
            });
        });
    });

    //对结果去重、去除无关元素
    let result = [];
    Object.keys(tempResult).forEach((key)=>{
        //遍历返回结果集
        let r = tempResult[key];
        if (Object.keys(r.addition).length===0){
            return;
        }
        let arr1 = [];
        result.forEach((ar)=>{
            //将arr中的元素加入到临时arr
            arr1.push(ar.addition);
        });
        let index = arr1.indexOf(r.addition);
        if (index===-1){
            //如果结果集中的元素不在临时arr中，那就把该元素加入到arr
            result.push({
                title:r.title,
                addition:r.addition
            });
        }else {
            result.forEach((ar)=>{
                if (ar.addition===r.addition){
                    ar.title.push(r.title[0]);
                }
            });
        }
    });

    //对结果进行最后处理，需要升级的升级，对数据进行单位转换
    result.forEach(program=>{
        if (config.upgradeRecommend.mode!==4){
            upgradeWithMode(program.addition,config.upgradeRecommend.mode,config.upgradeRecommend.value);
        }
        program.addition.buildings.forEach((building)=>{
            building.onlineTooltip = "建筑在线收益倍数:" + (building.multiple[BuffRange.Online] / building.building.baseMoney / building.building.multiple).toFixed(2);
            building.offlineTooltip = "建筑离线收益倍数:" + (building.multiple[BuffRange.Offline] / building.building.baseMoney / building.building.multiple).toFixed(2);
            building.online = renderSize(building.online);
            building.offline = renderSize(building.offline);
            building.toOnline = renderSize(building.toOnline);
            if (building.toLevel===building.building.level){
                building.toLevel = "-";
            }else {
                building.tooltip = "该组合和当前buff下，该建筑升级到" + building.toLevel + "级时的在线收入为" + building.toOnline + "/秒";
            }
        });

        program.addition.route.forEach(route=>{
            route.needMoney = renderSize(route.needMoney);
            route.needTime = formatSeconds(route.needTime);
        });

        program.addition.needTime = formatSeconds(program.addition.needTime);
        program.addition.maxNeedTime = formatSeconds(program.addition.useMoney / program.addition.online);
        program.addition.toTps = renderSize(program.addition.toTps);
        program.addition.useMoney = renderSize(program.addition.useMoney);
        program.addition.online = renderSize(program.addition.online);
        program.addition.offline = renderSize(program.addition.offline);
    });

    return result;
}

//计算组合的收益数据
function calculationAddition(globalBuffs, temp) {
    let addition = {
        online:0,
        offline:0,
        supply:0,
        buildings:[],
        toTps:0,
        useMoney:0,
        needTime:0,
        maxNeedTime:0,
        route:[]
    };

    //计算这个组合的所有buff，先拿出公共buff
    let buffs = new Buffs();
    buffs.Policy = globalBuffs.Policy;
    buffs.Photo = globalBuffs.Photo;
    buffs.Quest = globalBuffs.Quest;

    let legendary = 0;
    let rare = 0;

    //计算组合内各品质建筑的数量，并添加建筑间的buff
    temp.forEach(function (t) {
        if (t.rarity===BuildingRarity.Legendary){
            legendary += 1;
        }else if (t.rarity===BuildingRarity.Rare){
            rare += 1;
        }
        buffs.addBuilding(t);
    });

    //计算组合收益
    temp.forEach(function (t) {
        //收益倍数（基础倍数*星级倍数*各种buff）
        let sumMultiple = t.sumMultiple(buffs);
        //总收益（等级收益*收益倍数）
        let sumMoney = t.sumMoney(sumMultiple);
        addition.online += sumMoney[BuffRange.Online];
        addition.offline += sumMoney[BuffRange.Offline];
        addition.buildings.push({
            online:sumMoney[BuffRange.Online],
            onlineTooltip:"",
            offline:sumMoney[BuffRange.Offline],
            offlineTooltip:"",
            multiple:sumMultiple,
            toLevel:t.level,
            toOnline:sumMoney[BuffRange.Online],
            tooltip:"",
            building:t
        });
    });
    addition.supply = Math.round(buffs.supplyBuff*100);
    addition.toTps = addition.online;

    return {
        addition:addition,
        legendary:legendary,
        rare:rare
    };
}

function addRoute(addition, u) {
    let needTime = u.cost/addition.toTps;
    if (addition.route.length>0){
        let last = addition.route[addition.route.length - 1];
        if (last.building===u.building.building){
            last.toLevel = u.building.toLevel;
            last.needMoney += u.cost;
            last.needTime += needTime;
            return;
        }
    }
    addition.route.push({
        building:u.building.building,
        toLevel:u.building.toLevel,
        needMoney:u.cost,
        needTime:needTime
    });
}

//按模式进行模拟升级
function upgradeWithMode(addition, mode, value) {
    if (mode===1){
        //模式1，升级一定次数
        let count = 0;
        while (count<value){
            //按优先度升级
            let u = upgrade(addition.buildings);
            if (u.addMoney===0){
                break;
            }
            u.building.toOnline += u.addMoney;
            addition.needTime += u.cost / addition.toTps;
            addRoute(addition,u);
            addition.toTps += u.addMoney;
            addition.useMoney += u.cost;
            count += 1;
        }
    }else if (mode===2){
        //模式2，按已有金钱升级
        let money = 0;
        while (money<value){
            //按优先度升级，并返回消耗的金钱，并将money加上对应数值
            let u = upgrade(addition.buildings);
            if (u.addMoney===0){
                break;
            }
            money += u.cost;
            //按金钱升级的，如果使用的金钱超过了已有金钱，则需要进行一次回退，并直接中断循环，否则会造成给出的结果中升级费用不够的问题
            if (money>value){
                u.building.toLevel -= 1;
                break;
            }
            u.building.toOnline += u.addMoney;
            addRoute(addition,u);
            addition.toTps += u.addMoney;
            addition.useMoney += u.cost;
        }
    }else if (mode===3 || mode===4){
        //模式3和模式4，都是按目标tps升级
        while (addition.toTps<value){
            //按优先度升级，并返回增加的tps，并将tps加上对应的数值
            let u = upgrade(addition.buildings);
            if (u.addMoney===0){
                break;
            }
            u.building.toOnline += u.addMoney;
            addition.needTime += u.cost / addition.toTps;
            addRoute(addition,u);
            addition.toTps += u.addMoney;
            addition.useMoney += u.cost;
        }
    }
}

//模拟升级方案中升级优先级最高的建筑
function upgrade(buildings) {
    let benefit = 0;
    let building;
    let levelData;
    //先找出升级效益最高的建筑（升级效益=升级到下一级增加的tps收益/需要的金钱，可以先计算固定数值的效益，然后乘以当前组合中当前建筑的收益倍数，即为实际效益）
    buildings.forEach(b=>{
        if (b.toLevel>=2000){
            return;
        }
        let ld = getData(b.toLevel,b.building.rarity);
        let ben = ld.benefit * b.multiple[BuffRange.Online];
        if (ben > benefit){
            benefit = ben;
            building = b;
            levelData = ld;
        }
    });
    //进行一次升级，返回增加的tps，和需要金币，和升级的是哪个建筑
    if (benefit>0 && building && levelData){
        building.toLevel += 1;
        return {
            addMoney:levelData.addMoney * building.multiple[BuffRange.Online],
            cost:levelData.cost,
            building:building
        }
    }else {
        return {
            addMoney:0,
            cost:0,
            building:null
        }
    }
}

//将秒数换算成x天x小时x分x秒
function formatSeconds(second) {
    if (second===0 || second===Infinity){
        return 0;
    }
    second = Math.ceil(second);
    // second = parseInt(second);// 需要转换的时间秒
    let minute = 0;// 分
    let hour = 0;// 小时
    let day = 0;// 天
    if(second >= 60) {
        minute = Math.floor(second/60);
        second = second%60;
        if(minute >= 60) {
            hour = Math.floor(minute/60);
            minute = minute%60;
            if(hour >= 24){
                //大于24小时
                day = Math.floor(hour/24);
                hour = hour%24;
            }
        }
    }
    let result = '';
    if (day>0){
        result += day + "天";
    }
    if (hour>0){
        result += hour + "小时"
    }
    if (minute>0){
        result += minute + "分";
    }
    if (second>0){
        result += second + "秒";
    }
    return result;
}