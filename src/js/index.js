import {BuildingRarity, BuildingType} from "./Building";
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
import "../css/index.scss";
import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";

let storage_key = "lintx-jgm-calculator-config";
let worker = undefined;

let app = new Vue({
    el:"#app",
    data:function () {
        let config = null;
        let storage = localStorage.getItem(storage_key);
        if (storage!==null){
            try {
                config = JSON.parse(storage);
            }catch (e) {

            }
        }

        let data = {
            rarity:BuildingRarity,
            buildings:[
                {
                    type:BuildingType.Residence,
                    list:[
                        new Chalet(),
                        new SteelStructureHouse(),
                        new Bungalow(),
                        new SmallApartment(),
                        new Residential(),
                        new TalentApartment(),
                        new GardenHouse(),
                        new ChineseSmallBuilding(),
                        new SkyVilla(),
                        new RevivalMansion()
                    ]
                },
                {
                    type: BuildingType.Business,
                    list: [
                        new ConvenienceStore(),
                        new School(),
                        new ClothingStore(),
                        new HardwareStore(),
                        new VegetableMarket(),
                        new BookCity(),
                        new BusinessCenter(),
                        new GasStation(),
                        new FolkFood(),
                        new MediaVoice()
                    ]
                },
                {
                    type:BuildingType.Industrial,
                    list:[
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
                    ]
                }
            ],
            buffs:[],
            programs:{
                onlineMoney:{},
                supplyMoney:{},
                supplyRarity:{},
                offlineMoney:{}
            },
            progress:0,
            calculationing:false
        };
        Object.keys(BuffSource).forEach((key)=>{
            let source = BuffSource[key];
            if (source===BuffSource.Building){
                return;
            }
            let buff = {
                type:source,
                list:[]
            };
            Object.keys(BuffRange).forEach((rkey)=>{
                let range = BuffRange[rkey];
                if (range===BuffRange.Targets){
                    return;
                }
                buff.list.push(new Buff(range,range,0));
            });
            data.buffs.push(buff);
        });
        data.buildings.forEach((building)=>{
            building.list.forEach((item)=>{
                item.initBuffs();
            });
        });

        if (config!==null && typeof config==="object"){
            if (config.hasOwnProperty("building")){
                let building = config.building;
                try {
                    building.forEach((item)=>{
                        data.buildings.forEach((dbs)=>{
                            dbs.list.forEach((db)=>{
                                if (db.BuildingName===item.building){
                                    db.star = item.star;
                                    db.quest = item.quest;
                                }
                            });
                        });
                    });
                }catch (e) {

                }
            }
            if (config.hasOwnProperty("buff")){
                let buffs = config.buff;
                try {
                    buffs.forEach((buffc)=>{
                        buffc.list.forEach((b)=>{
                            data.buffs.forEach((dbuffc)=>{
                                if (dbuffc.type===buffc.type){
                                    dbuffc.list.forEach((db)=>{
                                        if (db.range===b.range){
                                            db.buff = b.buff;
                                        }
                                    });
                                }
                            });
                        });
                    });
                }catch (e) {

                }
            }
        }

        return data;
    },
    methods:{
        calculation:function () {
            this.calculationing = true;
            //拿出已有的建筑
            let list = [];
            this.buildings.forEach(function (cls) {
                let building = {
                    type:cls.type,
                    list:[]
                };
                cls.list.forEach(function (item) {
                    if (Number(item.star)>0){
                        building.list.push({
                            star:Number(item.star),
                            quest:item.quest,
                            name:item.BuildingName
                        });
                    }
                });
                list.push(building);
            });

            if(typeof(Worker)!=="undefined") {
                worker = new Worker("static/worker.js?v=0.2");
                let _self = this;
                worker.onmessage = function(e){
                    let data = e.data;
                    if (data==="done"){
                        _self.calculationing = false;
                        worker.terminate();
                        worker = undefined;
                    }else {
                        let mode = data.mode;
                        if (mode==="result"){
                            _self.programs = data.result;
                        }else if (mode==="progress"){
                            _self.progress = data.progress;
                        }
                    }
                };
                worker.postMessage({
                    list:list,
                    buff:this.buffs
                });
            } else {
                //抱歉! Web Worker 不支持
            }
        },
        save:function () {
            let config = {
                building:[],
                buff:[]
            };
            this.buildings.forEach(function (cls) {
                cls.list.forEach(function (item) {
                    if (Number(item.star)>0){
                        config.building.push({
                            building:item.BuildingName,
                            star:Number(item.star),
                            quest:item.quest
                        });
                    }
                });
            });

            this.buffs.forEach(function (source) {
                let b = {
                    type:source.type,
                    list:[]
                };
                source.list.forEach(function (buff) {
                    b.list.push({
                        range:buff.range,
                        buff:buff.buff
                    });
                });
                config.buff.push(b);
            });

            localStorage.setItem(storage_key,JSON.stringify(config));
        },
        clear:function () {
            localStorage.removeItem(storage_key);
            Object.assign(this.$data, this.$options.data());
        },
        stop:function () {
            try {
                worker.terminate();
                worker = undefined;
                this.calculationing = false;
            }catch (e) {

            }
        }
    }
});