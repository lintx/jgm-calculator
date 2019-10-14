import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class VegetableMarket extends Building{
    constructor(){
        super(BuildingNames.VegetableMarket,BuildingRarity.Common,BuildingType.Business,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.FoodFactory,1));
    }
}

export default VegetableMarket