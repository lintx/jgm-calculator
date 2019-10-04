import Vue from "vue";
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
import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";
import BootstrapVue from "bootstrap-vue";
import PortalVue from 'portal-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "../css/index.scss";

let storage_key = "lintx-jgm-calculator-config";
let worker = undefined;
let version = "0.8";

Vue.use(BootstrapVue);
Vue.use(PortalVue);

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
            version:version,
            rarity:BuildingRarity,
            config:{
                supplyStep50:false,
                allBuildingLevel1:false,
                policy:{
                    stage1:false,
                    stage2:false,
                    stage3:false
                }
            },
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
            programs:[],
            progress:0,
            calculationIng:false
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
                                    db.disabled = item.disabled;
                                    db.level = getValidLevel(item.level);
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
            if (config.hasOwnProperty("config")){
                Object.assign(data.config, config.config);
            }
        }

        return data;
    },
    methods:{
        calculation:function () {
            this.calculationIng = true;
            //拿出已有的建筑
            let list = [];
            this.buildings.forEach(function (cls) {
                let building = {
                    type:cls.type,
                    list:[]
                };
                cls.list.forEach(function (item) {
                    if (!item.disabled && Number(item.star)>0){
                        building.list.push({
                            star:Number(item.star),
                            quest:item.quest,
                            name:item.BuildingName,
                            level:getValidLevel(item.level)
                        });
                    }
                });
                list.push(building);
            });

            if(typeof(Worker)!=="undefined") {
                worker = new Worker("static/worker.js?v=" + this.version);
                let _self = this;
                worker.onmessage = function(e){
                    let data = e.data;
                    if (data==="done"){
                        _self.calculationIng = false;
                        worker.terminate();
                        worker = undefined;
                        _self.progress = 0;
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
                    buff:this.buffs,
                    config:this.config
                });
            } else {
                //抱歉! Web Worker 不支持
            }
        },
        save:function () {
            let config = {
                building:[],
                buff:[],
                config: this.config
            };
            this.buildings.forEach(function (cls) {
                cls.list.forEach(function (item) {
                    if (Number(item.star)>0){
                        config.building.push({
                            building:item.BuildingName,
                            star:Number(item.star),
                            quest:item.quest,
                            disabled:item.disabled,
                            level:getValidLevel(item.level)
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

            this.$bvToast.toast('配置保存成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        clear:function () {
            this.$bvModal.msgBoxConfirm('是否要清除本地存档？清除后不可恢复，请谨慎操作！', {
                title: '请确认',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    localStorage.removeItem(storage_key);
                    Object.assign(this.$data, this.$options.data());

                    this.$bvToast.toast('配置已清除', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            })
                .catch(err => {

                });
        },
        stop:function () {
            try {
                worker.terminate();
                worker = undefined;
                this.calculationIng = false;
            }catch (e) {

            }
        },
        levelKeyDown(e,item){
            if (e.code==="ArrowUp"){
                if (e.shiftKey){
                    item.level += 100;
                }else if (e.ctrlKey){
                    item.level += 10;
                }else {
                    item.level += 1;
                }
            }else if (e.code==="ArrowDown"){
                if (e.shiftKey){
                    item.level -= 100;
                }else if (e.ctrlKey){
                    item.level -= 10;
                }else {
                    item.level -= 1;
                }
            }else if (e.code==="PageUp"){
                item.level += 1000;
            }else if (e.code==="PageDown"){
                item.level -= 1000;
            }
            item.level = Math.min(2000,item.level);
            item.level = Math.max(1,item.level);
        },
        export(){
            const h = this.$createElement;
            const titleVNode = h('div', { domProps: { innerHTML: '导出配置' } });
            const messageVNode = h('div', { class: ['foobar'] }, [
                h('p',{},['配置内容'])
            ]);
            this.$bvModal.msgBoxOk([messageVNode], {
                title: [titleVNode],
                buttonSize: 'sm',
                okTitle: '确认',
                centered: true, size: 'sm'
            })
        }
    }
});

function getValidLevel(level) {
    if (typeof level!=="number"){
        if (isNaN(level)){
            return 1;
        }else {
            level = Number(level);
        }
    }
    level = Math.floor(level);
    if (level<1){
        return 1;
    }
    if (level>2000){
        return 2000;
    }
    return level;
}