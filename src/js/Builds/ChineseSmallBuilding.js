import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";

class ChineseSmallBuilding extends Building{
    constructor(){
        super("中式小楼",BuildingRarity.Rare,BuildingType.Residence,1.4);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
        this.buffs.push(new Buff(BuffRange.Residence,BuffRange.Residence,0.15));
    }
}

export default ChineseSmallBuilding