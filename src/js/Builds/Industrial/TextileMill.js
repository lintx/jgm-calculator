import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class TextileMill extends Building{
    constructor(){
        super(BuildingNames.TextileMill,BuildingRarity.Rare,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.ClothingStore,1));
        this.buffs.push(new Buff(BuffRange.Business,BuffRange.Business,0.15));
    }
}

export default TextileMill