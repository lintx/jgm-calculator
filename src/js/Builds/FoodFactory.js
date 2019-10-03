import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import VegetableMarket from "./VegetableMarket";

class FoodFactory extends Building{
    constructor(){
        super("食品厂",BuildingRarity.Common,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new VegetableMarket().BuildingName,1));
    }
}

export default FoodFactory