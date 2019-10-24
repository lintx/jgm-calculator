import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class DreamApartment extends Building{
    constructor(){
        super(BuildingNames.DreamApartment,BuildingRarity.Legendary,BuildingType.Residence,1.235)
        this.initBuffs()
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.SwimmingPool,1));
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.PowerfulCountryCoalIndustry,1));
    }
}

export default DreamApartment