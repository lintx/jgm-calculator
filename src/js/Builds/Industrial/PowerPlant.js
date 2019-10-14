import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class PowerPlant extends Building{
    constructor(){
        super(BuildingNames.PowerPlant,BuildingRarity.Common,BuildingType.Industrial,1.18);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.3));
        //电厂buff比较特殊，是0.2/0.5/0.8/1.1/1.4
    }

    getBuffValue(buff) {
        return super.getBuffValue(buff) - 0.1;
    }
}

export default PowerPlant