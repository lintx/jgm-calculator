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
import {getPolicy} from "./Policy";

let storage_key = "lintx-jgm-calculator-config";
let worker = undefined;
let version = "0.12";

Vue.use(BootstrapVue);
Vue.use(PortalVue);

let app = new Vue({
    el:"#app",
    data:function () {
        let data = {
            version:version,
            rarity:BuildingRarity,
            config:{
                supplyStep50:false,
                allBuildingLevel1:false,
                shineChinaBuff:0,
                showBuffConfig:true,
                showBuildingConfig:true,
                showOtherConfig:true,
                configName:""
            },
            selectConfigIndex:0,
            localConfigList:[],
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
            policy: {
                step: 1,
                levels: []
            },
            programs:[],
            progress:0,
            calculationIng:false
        };
        Object.keys(BuffSource).forEach((key)=>{
            let source = BuffSource[key];
            if (source===BuffSource.Building || source===BuffSource.Policy){
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

        let localConfig = this.localConfig();
        let config = null;
        if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
            config = localConfig.config[localConfig.current] || null;
            data.selectConfigIndex = localConfig.current;

            localConfig.config.forEach((c,i)=>{
                let name = "配置" + (i+1);
                if (c.hasOwnProperty("config") && c.config.hasOwnProperty("configName") && c.config.configName!==""){
                    name += "(" + c.config.configName + ")";
                }
                data.localConfigList.push(name);
            });
        }else {
            config = localConfig;
        }
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
            if (config.hasOwnProperty("policy")){
                Object.assign(data.policy,config.policy);
            }
        }
        if (!data.policy.levels || data.policy.levels.length<=0){
            data.policy.levels = getPolicyLevelData(data.policy.step);
        }

        return data;
    },
    watch:{
        "policy.step":function (val, oldVal) {
            if (val!==oldVal){
                let temp = getPolicyLevelData(val);
                temp.forEach(l=>{
                    this.policy.levels.forEach(pl=>{
                        if (l.title===pl.title){
                            l.level = pl.level;
                        }
                    });
                });
                this.policy.levels = temp;
            }
        }
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
                            _self.programs.forEach(function (program) {
                                program.addition.buildings.forEach(function (pb) {
                                    _self.buildings.forEach((building)=>{
                                        building.list.forEach((item)=>{
                                            if (pb.building.BuildingName===item.BuildingName){
                                                pb.building = item;
                                                return true;
                                            }
                                        });
                                    });
                                });
                                _self.buildings.forEach((building)=>{
                                    building.list.forEach((item)=>{
                                        if (program.addition.upgrade.building.BuildingName===item.BuildingName){
                                            program.addition.upgrade.building = item;
                                        }
                                        if (program.addition.upgrade.nextBuilding.BuildingName===item.BuildingName){
                                            program.addition.upgrade.nextBuilding = item;
                                        }
                                    });
                                });
                            });

                        }else if (mode==="progress"){
                            _self.progress = data.progress;
                        }
                    }
                };
                worker.postMessage({
                    list:list,
                    buff:this.buffs,
                    config:this.config,
                    policy:this.policy
                });
            } else {
                //抱歉! Web Worker 不支持
            }
        },
        getConfig:function(){
            let config = {
                building:[],
                buff:[],
                config: this.config,
                policy: this.policy
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

            let localConfig = this.localConfig();
            if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                localConfig.config = localConfig.config || [];
                localConfig.config[localConfig.current] = config;
            }else {
                localConfig = {
                    current:0,
                    config:[config]
                };
            }

            return JSON.stringify(localConfig);
        },
        localConfig:function(){
            let config = null;
            let storage = localStorage.getItem(storage_key);
            if (storage!==null){
                try {
                    config = JSON.parse(storage);
                }catch (e) {

                }
            }
            return config;
        },
        save:function () {
            localStorage.setItem(storage_key,this.getConfig());

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
        removeConfig:function(){
            this.$bvModal.msgBoxConfirm('是否要删除配置 ' + this.localConfigList[this.selectConfigIndex] + ' ？删除后不可恢复，请谨慎操作！', {
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
                    let localConfig = this.localConfig();
                    if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                        localConfig.config = localConfig.config || [];
                        localConfig.config.splice(this.selectConfigIndex,1);
                        localConfig.current = 0;
                        localStorage.setItem(storage_key,JSON.stringify(localConfig));
                    }else {
                        localStorage.removeItem(storage_key);
                    }
                    Object.assign(this.$data, this.$options.data());

                    this.$bvToast.toast('配置已删除', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        addConfig:function(){
            this.$bvModal.msgBoxConfirm('是否要保存当前数据？', {
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
                    this.save();
                }

                let localConfig = this.localConfig();
                if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                    localConfig.current = localConfig.config.length;
                }else {
                    localConfig = {
                        current:1,
                        config:[config]
                    };
                }
                localStorage.setItem(storage_key,JSON.stringify(localConfig));
                Object.assign(this.$data, this.$options.data());
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
            }else {
                return;
            }
            e.preventDefault();
            item.level = Math.min(2000,item.level);
            item.level = Math.max(1,item.level);
        },
        exportConfig(){
            const h = this.$createElement;
            const messageVNode = h('div', { class: ['foobar'] }, [
                h('p',{},['请复制并保存下面的文本框内的内容']),
                h('textarea',{class:['form-control'],attrs:{rows:8}},[this.getConfig()])
            ]);
            this.$bvModal.msgBoxOk([messageVNode], {
                title: '导出配置',
                buttonSize: 'sm',
                okTitle: '确认',
                centered: true,
                size: 'xl'
            });
        },
        importConfig(){
            const h = this.$createElement;
            let json = "";
            const messageVNode = h('div', { class: ['foobar'] }, [
                h('p',{},['请在下面的文本框内粘贴配置内容，然后点击确认按钮']),
                h('textarea',{class:['form-control'],attrs:{rows:8},on:{input:function (e) {
                            json = e.target.value;
                        }}},[])
            ]);
            this.$bvModal.msgBoxConfirm(messageVNode, {
                title: '导入配置',
                size: 'xl',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    try {
                        let config = JSON.parse(json);
                        if (typeof config!=="object"
                            || !config.hasOwnProperty("current")
                            || typeof config.current!=="number"
                            || !config.hasOwnProperty("config")
                            || !Array.isArray(config.config)){
                            this.$bvToast.toast('无效的配置', {
                                title: '提示',
                                variant: 'danger',//danger,warning,info,primary,secondary,default
                                solid: true
                            });
                            return;
                        }
                        let localConfig = this.localConfig();
                        if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                            localConfig.config = [...localConfig.config,...config.config];
                        }else {
                            localConfig = config;
                        }
                        localStorage.setItem(storage_key,JSON.stringify(localConfig));
                        Object.assign(this.$data, this.$options.data());
                        this.$bvToast.toast('配置导入成功', {
                            title: '提示',
                            variant: 'success',//danger,warning,info,primary,secondary,default
                            solid: true
                        });
                    }catch (e) {
                        this.$bvToast.toast('无效的配置', {
                            title: '提示',
                            variant: 'danger',//danger,warning,info,primary,secondary,default
                            solid: true
                        });
                    }
                }
            })
        },
        switchConfig:function () {
            if (this.selectConfigIndex<0){
                this.$bvToast.toast('无效的配置名', {
                    title: '提示',
                    variant: 'danger',//danger,warning,info,primary,secondary,default
                    solid: true
                });
                return;
            }
            let localConfig = this.localConfig();
            if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                if (this.selectConfigIndex>=localConfig.config.length){
                    this.$bvToast.toast('无效的配置名', {
                        title: '提示',
                        variant: 'danger',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                    return;
                }
                localConfig.current = this.selectConfigIndex;
            }else {
                this.$bvToast.toast('本地配置无效，无法切换', {
                    title: '提示',
                    variant: 'danger',//danger,warning,info,primary,secondary,default
                    solid: true
                });
                return;
            }
            localStorage.setItem(storage_key,JSON.stringify(localConfig));
            Object.assign(this.$data, this.$options.data());
            this.$bvToast.toast('配置切换成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
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

function getPolicyLevelData(step) {
    let policy = getPolicy(step);
    let data = [];
    policy.policys.forEach((p)=>{
        data.push({
            title:p.title,
            level:1
        });
    });
    return data;
}