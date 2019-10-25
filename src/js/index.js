import Vue from "vue";
import {BuildingRarity, BuildingType} from "./Building";
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
import {Buff, BuffRange, Buffs, BuffSource} from "./Buff";
import BootstrapVue from "bootstrap-vue";
import PortalVue from 'portal-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "../css/index.scss";
import {getPolicy} from "./Policy";
import quests from "./Quests";
import {getValidLevel} from "./Utils";

let storage_key = "lintx-jgm-calculator-config";
let worker = undefined;
let version = "0.25";

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
                allBuildingLevel:1,
                shineChinaBuff:0,
                showBuffConfig:true,
                showBuildingConfig:true,
                showOtherConfig:true,
                configName:"",
                questTargetBuff:[
                    {
                        building:"",
                        buff:0
                    },
                    {
                        building:"",
                        buff:0
                    },
                    {
                        building:"",
                        buff:0
                    }
                ],
                upgradeRecommend:{
                    mode:1,
                    value:"100"
                }
            },
            selectConfigIndex:0,
            localConfigList:[],
            buildingProgram:{
                current:-1,
                programs:[]
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
                        new RevivalMansion(),
                        new DreamApartment()
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
                        new DreamExpress(),
                        new FolkFood(),
                        new MediaVoice(),
                        new SwimmingPool()
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
                        new PeoplesOil(),
                        new PowerfulCountryCoalIndustry()
                    ]
                }
            ],
            buffs:[],
            policy: {
                step: 1,
                levels: []
            },
            programs:[],
            progress:{
                progress:0,
                useTime:"-",
                needTime:"-"
            },
            workerUseTime:"-",
            calculationIng:false,
            questList:[],
            allQuests:{
                data:quests,
                selectIndex:0
            }
        };
        Object.keys(BuffRange).forEach((rkey)=>{
            let range = BuffRange[rkey];
            if (range===BuffRange.Targets){
                return;
            }
            data.questList.push(range);
        });
        Object.keys(BuffSource).forEach((key)=>{
            let source = BuffSource[key];
            if (source===BuffSource.Building || source===BuffSource.Policy || source===BuffSource.Quest){
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

        let localConfig = this.localConfig();
        let config = null;
        if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
            config = localConfig.config[localConfig.current] || null;
            data.selectConfigIndex = localConfig.current;
            data.localConfigList = configList(localConfig);
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
                                    db.disabled = item.disabled;
                                    db.level = getValidLevel(item.level);
                                    db.use = item.use;
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
            if (config.hasOwnProperty("policy") && typeof config.policy==="object"){
                data.policy.step = config.policy.step;
                data.policy.levels = getPolicyLevelData(data.policy.step);
                if (config.policy.hasOwnProperty("levels") && Array.isArray(config.policy.levels)){
                    data.policy.levels.forEach(l=>{
                        config.policy.levels.forEach(ll=>{
                            if (ll.title===l.title){
                                l.level = ll.level;
                            }
                        });
                    });
                }
            }
            if (config.hasOwnProperty("buildingProgram")){
                Object.assign(data.buildingProgram,config.buildingProgram);
            }
        }
        if (!data.policy.levels || data.policy.levels.length<=0){
            data.policy.levels = getPolicyLevelData(data.policy.step);
        }
        return data;
    },
    computed: {
        // 计算属性的 getter
        policyGlobalBuffs(){
            let globalBuffs = new Buffs();
            for (let i=1;i<=this.policy.step;i++){
                getPolicy(i).policys.forEach((p)=>{
                    let level = 5;
                    if (i===this.policy.step){
                        this.policy.levels.forEach((l)=>{
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
            let buffs = {};
            Object.keys(BuffRange).forEach(key=>{
                let range = BuffRange[key];
                if (range===BuffRange.Targets){
                    return;
                }
                buffs[range] = 0;
            });
            globalBuffs.Policy.forEach(buff=>{
                buffs[buff.range] += buff.buff * 100;
            });
            return buffs;
        }
    },
    methods:{
        calculation() {
            this.calculationIng = true;
            //拿出已有的建筑
            let list = [];
            let count = 0;
            this.buildings.forEach(function (cls) {
                let building = {
                    type:cls.type,
                    list:[]
                };
                cls.list.forEach(function (item) {
                    if (Number(item.star)>0){
                        building.list.push({
                            star:Number(item.star),
                            name:item.BuildingName,
                            use:item.use,
                            disabled:item.disabled,
                            level:getValidLevel(item.level)
                        });
                        count += 1;
                    }
                });
                list.push(building);
            });

            if (count===0){
                this.$bvToast.toast('你没有配置任何建筑，无法计算', {
                    title: '错误',
                    variant: 'danger',//danger,warning,info,primary,secondary,default
                    solid: true
                });
                this.calculationIng = false;
                return;
            }

            if(typeof(Worker)!=="undefined") {
                worker = new Worker("static/worker.js?v=" + this.version);
                let _self = this;
                worker.onmessage = function(e){
                    let data = e.data;
                    if (data==="done"){
                        _self.calculationIng = false;
                        worker.terminate();
                        worker = undefined;
                        _self.workerUseTime = _self.progress.useTime;
                        _self.progress = {
                            progress:0,
                            useTime:"-",
                            needTime:"-"
                        };
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
        getConfig(){
            let config = {
                building:[],
                buff:[],
                config: this.config,
                policy: this.policy,
                buildingProgram: this.buildingProgram
            };
            this.buildings.forEach(function (cls) {
                cls.list.forEach(function (item) {
                    if (Number(item.star)>0){
                        config.building.push({
                            building:item.BuildingName,
                            star:Number(item.star),
                            disabled:item.disabled,
                            use:item.use,
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
        localConfig(){
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
        saveConfig() {
            localStorage.setItem(storage_key,this.getConfig());
            this.localConfigList = configList(this.localConfig());

            this.$bvToast.toast('配置保存成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        clearConfig() {
            this.$bvModal.msgBoxConfirm('是否要清除本地存档（删除所有配置）？清除后不可恢复，请谨慎操作！', {
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
            });
        },
        removeConfig(){
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
        addConfig(){
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
                    localConfig.config.push({})
                }else {
                    localConfig = {
                        current:0,
                        config:[]
                    };
                }
                localStorage.setItem(storage_key,JSON.stringify(localConfig));
                Object.assign(this.$data, this.$options.data());
            });
        },
        copyConfig(){
            this.$bvModal.msgBoxConfirm('是否要把当前存档复制一份？', {
                title: '请确认',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    let localConfig = this.localConfig();
                    if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                        if (localConfig.current>=localConfig.config.length){
                            this.$bvToast.toast('无效的配置，无法复制', {
                                title: '错误',
                                variant: 'danger',//danger,warning,info,primary,secondary,default
                                solid: true
                            });
                        }else {
                            localConfig.config.push(localConfig.config[localConfig.current]);
                            localStorage.setItem(storage_key,JSON.stringify(localConfig));

                            this.localConfigList = configList(localConfig);

                            this.$bvToast.toast('配置复制成功', {
                                title: '提示',
                                variant: 'success',//danger,warning,info,primary,secondary,default
                                solid: true
                            });
                        }
                    }else {
                        this.$bvToast.toast('本地配置无效，无法复制', {
                            title: '错误',
                            variant: 'danger',//danger,warning,info,primary,secondary,default
                            solid: true
                        });
                    }
                }
            });
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
                                title: '错误',
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
                            title: '错误',
                            variant: 'danger',//danger,warning,info,primary,secondary,default
                            solid: true
                        });
                    }
                }
            });
        },
        switchConfig() {
            if (this.selectConfigIndex<0){
                this.$bvToast.toast('无效的配置名', {
                    title: '错误',
                    variant: 'danger',//danger,warning,info,primary,secondary,default
                    solid: true
                });
                return;
            }
            let localConfig = this.localConfig();
            if (localConfig!==null && typeof localConfig==="object" && localConfig.hasOwnProperty("current") && typeof localConfig.current==="number"){
                if (this.selectConfigIndex>=localConfig.config.length){
                    this.$bvToast.toast('无效的配置名', {
                        title: '错误',
                        variant: 'danger',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }else {
                    localConfig.current = this.selectConfigIndex;
                    localStorage.setItem(storage_key,JSON.stringify(localConfig));
                    Object.assign(this.$data, this.$options.data());
                    this.$bvToast.toast('配置切换成功', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            }else {
                this.$bvToast.toast('本地配置无效，无法切换', {
                    title: '错误',
                    variant: 'danger',//danger,warning,info,primary,secondary,default
                    solid: true
                });
            }
        },
        stop() {
            try {
                worker.terminate();
                worker = undefined;
                this.calculationIng = false;
                this.progress = {
                    progress:0,
                    useTime:"-",
                    needTime:"-"
                }
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
        switchPolicyStep() {
            this.policy.levels = getPolicyLevelData(this.policy.step);
        },
        clearQuestData(){
            this.$bvModal.msgBoxConfirm('是否要把城市任务加成清空？清空后如果没有保存配置，刷新页面后即可恢复。', {
                title: '请确认',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    this.config.questTargetBuff.forEach(target=>{
                        target.building = "";
                        target.buff = 0;
                    });
                    this.$bvToast.toast('清除成功，请配置新的任务加成数据', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        selectProgram(buildings){
            this.$bvModal.msgBoxConfirm('是否要把除了当前方案中的建筑之外的所有建筑都禁用？应用后如果没有保存配置，刷新页面后即可恢复。', {
                title: '请确认',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    let bs = [];
                    buildings.forEach(b=>{
                        bs.push(b.building);
                    });
                    this.buildings.forEach((b)=>{
                        b.list.forEach((item)=>{
                            item.disabled = bs.indexOf(item) === -1;
                        });
                    });
                    this.$bvToast.toast('应用成功', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        syncProgramLevel(buildings){
            let data = [];
            let clearMoney = false;
            buildings.forEach(building=>{
                if (building.toLevel!=="-"){
                    data.push({
                        select:true,
                        level:building.toLevel,
                        building:building.building
                    });
                }
            });

            const h = this.$createElement;
            let tr = [];
            data.forEach((item)=>{
                tr.push(h('tr',{},[
                    h('td',{class:['text-center']},[
                        h('input',{
                            attrs:{type:'checkbox',checked:'checked'},
                            on:{
                                input:function (e) {
                                    item.select = e.target.checked;
                                }
                            }
                        },[])
                    ]),
                    h('td',{class:['text-center','text-nowrap']},[item.building.BuildingName]),
                    h('td',{class:['text-center']},[
                        h('input',{
                            attrs:{type:'number',value: item.level},
                            class:['form-control', 'text-right', 'form-control-sm', 'calculator-level'],
                            on:{
                                input:function (e) {
                                    item.level = getValidLevel(e.target.value);
                                },
                                focus:function (e) {
                                    e.target.select();
                                }
                            }
                        },[])
                    ])
                ]));
            });

            let table = h('table',{class:['table', 'table-bordered', 'table-sm']},[
                h('thead',{},[
                    h('tr',{},[
                        h('th',{class:['text-center','text-nowrap']},['同步']),
                        h('th',{class:['text-center','text-nowrap']},['建筑']),
                        h('th',{class:['text-center']},['等级'])
                    ])
                ]),
                h('tbody',{},tr)
            ]);

            let content = [
                h('p',{},['将本方案的推荐等级同步到设置中，应用后如果没有保存配置，刷新页面后即可恢复。'])
            ];
            if (this.config.upgradeRecommend.mode===2){
                clearMoney = true;
                content.push(h('div',{class:['form-check','mb-2']},[
                    h('input',{class:'form-check-input',on:{change:function(e){clearMoney = e.target.checked}},attrs:{type:'checkbox',checked:'checked',id:'syncProgramLevelClearMoneyCheck'}},[]),
                    h('label',{class:'form-check-label',attrs:{for:'syncProgramLevelClearMoneyCheck'}},['清空剩余金币'])
                ]));
            }
            content.push(table);

            const messageVNode = h('div', { class: ['foobar'] }, content);
            this.$bvModal.msgBoxConfirm(messageVNode, {
                title: '应用等级',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: '确认',
                cancelTitle: '取消',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if (value){
                    if (clearMoney){
                        this.config.upgradeRecommend.value = "";
                    }
                    data.forEach(item=>{
                        if (item.select){
                            item.building.level = item.level;
                        }
                    });
                    this.$bvToast.toast('同步成功', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        switchBuildingProgram(){
            if (this.buildingProgram.current>=0 && this.buildingProgram.programs.length>0){
                let bps = this.buildingProgram.programs[this.buildingProgram.current].inUse;
                if (Array.isArray(bps)){
                    this.buildings.forEach((b)=>{
                        b.list.forEach((item)=>{
                            item.disabled = bps.indexOf(item.BuildingName) === -1;
                        });
                    });
                    this.$bvToast.toast('切换方案成功', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                    return;
                }
            }
            this.$bvToast.toast('方案数据错误，无法切换', {
                title: '错误',
                variant: 'danger',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        buildingProgramSave(){
            this.buildingProgramInit();
            if (this.buildingProgram.programs.length<=0){
                this.buildingProgram.programs.push({title:"",inUse:[]});
                this.buildingProgram.current = 0;
            }
            this.buildingProgram.programs[this.buildingProgram.current].inUse = [];
            let bps = this.buildingProgram.programs[this.buildingProgram.current].inUse;
            this.buildings.forEach((b)=>{
                b.list.forEach((item)=>{
                    if (!item.disabled){
                        bps.push(item.BuildingName);
                    }
                });
            });
            this.$bvToast.toast('方案保存成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        buildingProgramSaveTo(){
            this.buildingProgramInit();

            let bps = [];
            this.buildings.forEach((b)=>{
                b.list.forEach((item)=>{
                    if (!item.disabled){
                        bps.push(item.BuildingName);
                    }
                });
            });
            this.buildingProgram.programs.push({title:"",inUse:bps});
            this.$bvToast.toast('方案保存成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        buildingProgramRemove(){
            this.$bvModal.msgBoxConfirm('是否要删除当前方案？删除后如果没有保存配置，刷新页面后即可恢复。', {
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
                    this.buildingProgramInit();
                    if (this.buildingProgram.programs.length>0){
                        this.buildingProgram.programs.splice(this.buildingProgram.current,1);
                        if (this.buildingProgram.programs.length===0){
                            this.buildingProgram.current=-1;
                        }else {
                            if (this.buildingProgram.current>0){
                                this.buildingProgram.current-=1;
                            }
                        }
                    }
                    this.switchBuildingProgram();

                    this.$bvToast.toast('方案已删除', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        buildingProgramClear(){
            this.$bvModal.msgBoxConfirm('是否要删除所有方案？删除后如果没有保存配置，刷新页面后即可恢复。', {
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
                    this.buildingProgramInit();
                    this.buildingProgram = {
                        current:-1,
                        programs:[]
                    };

                    this.$bvToast.toast('方案已全部删除', {
                        title: '提示',
                        variant: 'success',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                }
            });
        },
        buildingProgramInit(){
            this.buildingProgram.current = Math.max(this.buildingProgram.current,0);
            if (!Array.isArray(this.buildingProgram.programs)){
                this.buildingProgram.programs = [];
            }
            this.buildingProgram.current = Math.min(this.buildingProgram.current,this.buildingProgram.programs.length-1);
        },
        buildingClass(building){
            switch (building.rarity) {
                case BuildingRarity.Common:
                    return "building-common";
                case BuildingRarity.Rare:
                    return "building-rare";
                case BuildingRarity.Legendary:
                    return "building-legendary";
            }
            return "";
        },
        useBuilding(e,type,building){
            if (e.target.checked){
                let count = 0;
                this.buildings.forEach(b=>{
                    if (b.type===type){
                        b.list.forEach(item=>{
                            if (item.use){
                                count += 1;
                            }
                        });
                        return true;
                    }
                });
                if (count>=3){
                    this.$bvToast.toast('每种建筑只能摆放3个', {
                        title: '错误',
                        variant: 'danger',//danger,warning,info,primary,secondary,default
                        solid: true
                    });
                    e.preventDefault();
                    building.use = false;
                }
            }
        },
        getQuestsBuffText(buffs){
            let arr =[];
            buffs.forEach(buff=>{
                arr.push(buff.name + " " + buff.buff + "%");
            });
            return arr.join("<br />");
        },
        selectQuestBuffs(buffs){
            this.config.questTargetBuff.forEach(target=>{
                target.building = "";
                target.buff = 0;
            });
            buffs.forEach((buff,index)=>{
                this.config.questTargetBuff[index].building = buff.name;
                this.config.questTargetBuff[index].buff = buff.buff;
            });
            this.$bvToast.toast('填写成功', {
                title: '提示',
                variant: 'success',//danger,warning,info,primary,secondary,default
                solid: true
            });
        },
        showRoute(routes){
            console.log(routes)
            const h = this.$createElement;
            let tr = [];
            routes.forEach((route)=>{
                tr.push(h('tr',{},[
                    h('td',{class:['text-center','text-nowrap']},[route.building.BuildingName]),
                    h('td',{class:['text-center','text-nowrap']},[route.toLevel]),
                    h('td',{class:['text-center','text-nowrap']},[route.needMoney]),
                    h('td',{class:['text-center','text-nowrap']},[route.needTime])
                ]));
            });

            let table = h('table',{class:['table', 'table-bordered', 'table-sm']},[
                h('thead',{},[
                    h('tr',{},[
                        h('th',{class:['text-center','text-nowrap']},['建筑']),
                        h('th',{class:['text-center','text-nowrap']},['目标']),
                        h('th',{class:['text-center','text-nowrap']},['花费']),
                        h('th',{class:['text-center','text-nowrap']},['用时'])
                    ])
                ]),
                h('tbody',{},tr)
            ]);

            let content = [
                h('p',{},['本方案推荐升级的路线。'])
            ];
            content.push(table);

            const messageVNode = h('div', { class: ['foobar'] }, content);
            this.$bvModal.msgBoxOk([messageVNode], {
                title: '升级路线',
                buttonSize: 'sm',
                okTitle: '确认',
                centered: true,
                size: 'md',
                scrollable:true
            });
        }
    }
});

function getPolicyLevelData(step) {
    let policy = getPolicy(step);
    let data = [];
    policy.policys.forEach((p)=>{
        data.push({
            title:p.title,
            level:0
        });
    });
    return data;
}

function configList(localConfig) {
    let list = [];
    if (localConfig!==null && typeof localConfig==="object"){
        if (localConfig.hasOwnProperty("config") && Array.isArray(localConfig.config)){
            localConfig.config.forEach((c,i)=>{
                let name = "配置" + (i+1);
                if (c.hasOwnProperty("config") && c.config.hasOwnProperty("configName") && c.config.configName!==""){
                    name = c.config.configName;
                }
                list.push(name);
            });
        }
    }

    return list;
}