import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class ChineseSmallBuilding extends Building{
    constructor(){
        super(BuildingNames.ChineseSmallBuilding,BuildingRarity.Rare,BuildingType.Residence,1.4);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
        this.buffs.push(new Buff(BuffRange.Residence,BuffRange.Residence,0.15));
    }
}

export default ChineseSmallBuilding