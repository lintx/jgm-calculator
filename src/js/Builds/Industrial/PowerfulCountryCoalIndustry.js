import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class PowerfulCountryCoalIndustry extends Building{
    constructor(){
        super(BuildingNames.PowerfulCountryCoalIndustry,BuildingRarity.Legendary,BuildingType.Industrial,1.52)
        this.initBuffs()
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.DreamApartment,1));
        this.buffs.push(new Buff(BuffRange.Industrial,BuffRange.Industrial,0.4));
    }
}

export default PowerfulCountryCoalIndustry