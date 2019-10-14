import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class WaterPlant extends Building{
    constructor(){
        super(BuildingNames.WaterPlant,BuildingRarity.Common,BuildingType.Industrial,1.26);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.05));
    }

    getBuffValue(buff) {
        //水厂的buff也比较特殊，0.1/0.15/0.2/0.25/0.3
        //可能有错
        return super.getBuffValue(buff) + 0.05;
    }
}

export default WaterPlant