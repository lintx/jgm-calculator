import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import ClothingStore from "./ClothingStore";

class TextileMill extends Building{
    constructor(){
        super("纺织厂",BuildingRarity.Rare,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new ClothingStore().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Business,BuffRange.Business,0.15));
    }
}

export default TextileMill