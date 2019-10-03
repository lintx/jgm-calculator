import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";

class TalentApartment extends Building{
    constructor(){
        super("人才公寓",BuildingRarity.Rare,BuildingType.Residence,1.4);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
        this.buffs.push(new Buff(BuffRange.Industrial,BuffRange.Industrial,0.15));
    }
}

export default TalentApartment