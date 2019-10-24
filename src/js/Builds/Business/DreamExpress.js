import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class DreamExpress extends Building{
    constructor(){
        super(BuildingNames.DreamExpress,BuildingRarity.Rare,BuildingType.Business,1.4)
        this.initBuffs()
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Business,BuffRange.Business,0.15));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default DreamExpress