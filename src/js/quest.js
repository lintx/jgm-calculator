import Vue from "vue";
import questsData from "./AllQuests";
import BootstrapVue from "bootstrap-vue";
import PortalVue from "portal-vue";
import { renderSize } from "./Utils";

let version = "0.2";

Vue.use(BootstrapVue);
Vue.use(PortalVue);

let app = new Vue({
    el: "#app",
    data: {
        version: version,
        quests: questsData,
        filter: {
            stepStart: 116,
            stepStop: 175,
            name: "",
            building: "",
            buffComparison: ">=",
            buffValue: 0
        },
        questsReward: {
            chest2: 0,
            chest3: 0,
            awardPolicy: 0,
            awardContribution: 0
        }
    },
    computed: {
        filterQuests() {
            let quests = {};
            let questsReward = {
                chest2: 0,
                chest3: 0,
                awardPolicy: 0,
                awardContribution: 0,
                needMoney: 0
            }
            Object.keys(this.quests).forEach(key => {
                let index = Number(key);
                let quest = questsData[key];
                let filter = this.filter;
                if (index < filter.stepStart) return;
                if (index > filter.stepStop) return;
                if (filter.name !== "" && quest.name.indexOf(filter.name) === -1) return;
                let fb = filter.building !== "";
                let fv = filter.buffValue > 0;
                if (fb || fv) {
                    let eqbuff = false;
                    let has = false;
                    let alleq = false;
                    quest.buffs.forEach(buffs => {
                        buffs.forEach(buff => {
                            let thas = false;
                            let teqbuff = false;
                            if (fb && buff.name.indexOf(filter.building) >= 0) {
                                thas = true;
                                has = thas
                            }
                            if (fv && (filter.buffComparison === '>=' && buff.buff >= filter.buffValue || filter.buffComparison === '=' && buff.buff === filter.buffValue || filter.buffComparison === '<=' && buff.buff <= filter.buffValue)) {
                                teqbuff = true;
                                eqbuff = teqbuff;
                            }
                            if (fb && fv) {
                                alleq = alleq || thas && teqbuff;
                            }
                        });
                    });
                    if (fb && !has) return;
                    if (fv && !eqbuff) return;
                    if (fb && fv && !alleq) return;
                }
                quests[key] = quest;
            });
            this.questsReward = questsReward
            return quests;
        }
    },
    methods: {
        getAllQuestsReward() {
            let questsReward = {
                chest2: 0,
                chest3: 0,
                awardPolicy: 0,
                awardContribution: 0,
                needMoney: 0
            }
            for (let index in this.filterQuests) {
                let item = this.filterQuests[index]
                questsReward.chest2 += item.chest2
                questsReward.chest3 += item.chest3
                questsReward.awardPolicy += item.awardPolicy
                questsReward.awardContribution += item.awardContribution
                questsReward.needMoney += item.needMoney
            }
            questsReward.needMoney = renderSize(questsReward.needMoney);
            this.questsReward = questsReward
        }
    }
});