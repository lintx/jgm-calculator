import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class FoodFactory extends Building{
    constructor(){
        super(BuildingNames.FoodFactory,BuildingRarity.Common,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.VegetableMarket,1));
    }
}

export default FoodFactory