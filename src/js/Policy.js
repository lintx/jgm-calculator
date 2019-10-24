import {Buff, BuffRange} from "./Buff";

class PolicyStep {
    constructor(step,policys){
        this.step = step;
        this.policys = policys;
    }

    policy(title){
        let policy = new Policy("error",[]);
        this.policys.forEach((p)=>{
            if (p.title===title){
                policy = p;
                return true;
            }
        });
        return policy;
    }
}

class Policy {
    constructor(title,policyLevels){
        this.title = title;
        this.policyLevels = policyLevels;
    }

    buff(level){
        let buff = new Buff(BuffRange.Global,BuffRange.Global,0);
        this.policyLevels.forEach((policyLevel)=>{
            if (policyLevel.level===level){
                buff = policyLevel.buff;
                return true;
            }
        });
        return buff;
    }
}

class PolicyLevel {
    constructor(level,buff){
        this.level = level;
        this.buff = buff;
    }
}

function getPolicyLevelBuffs(title,buffRange,buff1,buff2,buff3,buff4,buff5){
    return new Policy(title,[
        new PolicyLevel(1,new Buff(buffRange,buffRange,buff1)),
        new PolicyLevel(2,new Buff(buffRange,buffRange,buff2)),
        new PolicyLevel(3,new Buff(buffRange,buffRange,buff3)),
        new PolicyLevel(4,new Buff(buffRange,buffRange,buff4)),
        new PolicyLevel(5,new Buff(buffRange,buffRange,buff5))
    ]);
}

let policys = [
    new PolicyStep(1,[
        getPolicyLevelBuffs("大众创业万众创新",BuffRange.Global,10,25,50,75,100),
        getPolicyLevelBuffs("产权保护",BuffRange.Business,30,75,150,225,300),
        getPolicyLevelBuffs("个税改革",BuffRange.Residence,30,75,150,225,300)
    ]),
    new PolicyStep(2,[
        getPolicyLevelBuffs("创新驱动",BuffRange.Global,20,50,100,150,200),
        getPolicyLevelBuffs("互联网+",BuffRange.Online,20,50,100,150,200),
        getPolicyLevelBuffs("新一代人工智能",BuffRange.Offline,20,50,100,150,200),
        getPolicyLevelBuffs("制造强国",BuffRange.Industrial,60,150,300,450,600)
    ]),
    new PolicyStep(3,[
        getPolicyLevelBuffs("双一流建设",BuffRange.Industrial,120,300,600,900,1200),
        getPolicyLevelBuffs("体育强国",BuffRange.Supply,10,15,20,25,30),
        getPolicyLevelBuffs("科教兴国",BuffRange.Global,40,100,200,300,400),
        getPolicyLevelBuffs("健康中国",BuffRange.Business,120,300,600,900,1200)
    ]),
    new PolicyStep(4,[
        getPolicyLevelBuffs("乡村振兴",BuffRange.Residence,240,600,1200,1800,2400),
        getPolicyLevelBuffs("强军兴军",BuffRange.Online,80,200,400,600,800),
        getPolicyLevelBuffs("民族团结",BuffRange.Offline,80,200,400,600,800),
        getPolicyLevelBuffs("社会主义核心价值观",BuffRange.Global,80,200,400,600,800)
    ]),
    new PolicyStep(5,[
        getPolicyLevelBuffs("医保异地结算",BuffRange.Industrial,360,900,1800,2700,3600),
        getPolicyLevelBuffs("大病保险",BuffRange.Offline,120,300,600,900,1200),
        getPolicyLevelBuffs("幼有所育",BuffRange.Residence,360,900,1800,2700,3600),
        getPolicyLevelBuffs("老有所养",BuffRange.Business,360,900,1800,2700,3600),
        getPolicyLevelBuffs("全面二孩",BuffRange.Global,120,300,600,900,1200)
    ]),
    new PolicyStep(6,[
        getPolicyLevelBuffs("垃圾分类",BuffRange.Business,750,1875,3750,5625,7500),
        getPolicyLevelBuffs("租购并举",BuffRange.Online,250,625,1250,1875,2500),
        getPolicyLevelBuffs("全民健身",BuffRange.Industrial,750,1875,3750,5625,7500),
        getPolicyLevelBuffs("棚户区改造",BuffRange.Residence,750,1875,3750,5625,7500),
        getPolicyLevelBuffs("文化惠民",BuffRange.Global,250,625,1250,1875,2500)
    ]),
    new PolicyStep(7,[
        getPolicyLevelBuffs("河长制",BuffRange.Online,750,1875,3750,5625,7500),
        getPolicyLevelBuffs("节约资源",BuffRange.Supply,10,15,20,25,30),
        getPolicyLevelBuffs("美丽中国",BuffRange.Global,750,1875,3750,5625,7500),
        getPolicyLevelBuffs("蓝天保卫战",BuffRange.Industrial,2250,5625,11250,16875,22500),
        getPolicyLevelBuffs("厕所革命",BuffRange.Offline,750,1875,3750,5625,7500)
    ]),
    new PolicyStep(8,[
        getPolicyLevelBuffs("精准扶贫",BuffRange.Global,1000,2500,5000,7500,10000),
        getPolicyLevelBuffs("一带一路建设",BuffRange.Industrial,3000,7500,15000,22500,30000),
        getPolicyLevelBuffs("自由贸易区建设设",BuffRange.Business,3000,7500,15000,22500,30000),
        getPolicyLevelBuffs("新型城镇化",BuffRange.Residence,3000,7500,15000,22500,30000),
        getPolicyLevelBuffs("户籍制度改革",BuffRange.Offline,1000,2500,5000,7500,10000)
    ]),
    new PolicyStep(9,[
        getPolicyLevelBuffs("减税降费",BuffRange.Residence,9000,22500,45000,67500,90000),
        getPolicyLevelBuffs("区域协调发展",BuffRange.Residence,9000,22500,45000,67500,90000),
        getPolicyLevelBuffs("优化营商环境",BuffRange.Supply,10,15,20,25,30),
        getPolicyLevelBuffs("普惠金融",BuffRange.Offline,3000,7500,15000,22500,30000),
        getPolicyLevelBuffs("全面深化改革",BuffRange.Offline,3000,7500,15000,22500,30000)
    ]),
    new PolicyStep(10,[
        getPolicyLevelBuffs("拍蝇打虎猎狐",BuffRange.Global,6000,15000,30000,45000,60000),
        getPolicyLevelBuffs("扫黑除恶",BuffRange.Online,6000,15000,30000,45000,60000),
        getPolicyLevelBuffs("失信联合惩戒",BuffRange.Online,6000,15000,30000,45000,60000),
        getPolicyLevelBuffs("平安中国",BuffRange.Business,18000,45000,90000,135000,180000),
        getPolicyLevelBuffs("全面依法治国",BuffRange.Global,6000,15000,30000,45000,60000)
    ]),
];

function getPolicy(step){
    let policy = policys[0];
    policys.forEach((policyStep)=>{
        if (policyStep.step===step){
            policy = policyStep;
            return true;
        }
    });
    return policy;
}

export {
    policys,
    getPolicy
};