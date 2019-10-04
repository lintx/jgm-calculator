import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";

class SmallApartment extends Building{
    constructor(){
        super("小型公寓",BuildingRarity.Common,BuildingType.Residence,1.18);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.15));
    }

    getBuffValue(buff) {
        //小型公寓的buff也比较特殊，0.1/0.25/0.4/0.55/0.7
        return super.getBuffValue(buff) - 0.05;
    }
}

export default SmallApartment