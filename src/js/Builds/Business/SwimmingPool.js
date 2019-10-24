import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class SwimmingPool extends Building{
    constructor(){
        super(BuildingNames.SwimmingPool,BuildingRarity.Legendary,BuildingType.Business,1.52)
        this.initBuffs()
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.DreamApartment,1));
        this.buffs.push(new Buff(BuffRange.Business,BuffRange.Business,0.4));
    }
}

export default SwimmingPool