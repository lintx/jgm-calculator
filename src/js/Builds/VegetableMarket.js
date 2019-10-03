import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import FoodFactory from "./FoodFactory";

class VegetableMarket extends Building{
    constructor(){
        super("菜市场",BuildingRarity.Common,BuildingType.Business,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new FoodFactory().BuildingName,1));
    }
}

export default VegetableMarket