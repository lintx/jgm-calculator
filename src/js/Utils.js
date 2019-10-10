let unitArr = ["","K","M","B","T","aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz"];
let lowUnitArr = [];
unitArr.forEach(v=>{
    lowUnitArr.push(v.toLowerCase());
});

function renderSize(value){
    if (value===0){
        return 0;
    }
    if(null===value||value===''){
        return "0";
    }
    if (value<0){
        return "err";
    }
    if (value<1){
        return value.toFixed(2);
    }

    let index=0,
        srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1000));
    let size =srcsize/Math.pow(1000,index);
    //  保留的小数位数
    if (size>=100){
        size = Math.round(size);
    }else if (size>=10){
        size = size.toFixed(1);
    }else {
        size = size.toFixed(2);
    }
    let unit = unitArr[index];
    if (unit===undefined){
        unit = "E" + index * 3;
    }
    return size + unit;
}

function toNumber(value) {
    if (!isNaN(value)){
        return Number(value);
    }
    value = value.toLowerCase();
    let arr = value.split(/^([\d\.]+)(.*)$/g);
    if (arr.length!==4){
        return 0;
    }
    let index = lowUnitArr.indexOf(arr[2]);
    if (index===-1){
        return 0;
    }
    return Number(arr[1]) * Math.pow(1000,index);
}

function getFlagArrs(m, n) {
    if(!n || n < 1) {
        return [];
    }
    let resultArrs = [],
        flagArr = [],
        isEnd = false,
        i, j, leftCnt;

    for (i = 0; i < m; i++) {
        flagArr[i] = i < n ? 1 : 0;
    }

    resultArrs.push(flagArr.concat());
    if (m<=n){
        return resultArrs;
    }

    while (!isEnd) {
        leftCnt = 0;
        for (i = 0; i < m - 1; i++) {
            if (flagArr[i] === 1 && flagArr[i+1] === 0) {
                for(j = 0; j < i; j++) {
                    flagArr[j] = j < leftCnt ? 1 : 0;
                }
                flagArr[i] = 0;
                flagArr[i+1] = 1;
                let aTmp = flagArr.concat();
                resultArrs.push(aTmp);
                if(aTmp.slice(-n).join("").indexOf('0') === -1) {
                    isEnd = true;
                }
                break;
            }
            flagArr[i] === 1 && leftCnt++;
        }
    }
    return resultArrs;
}

function getValidLevel(level) {
    if (typeof level!=="number"){
        if (isNaN(level)){
            return 1;
        }else {
            level = Number(level);
        }
    }
    level = Math.floor(level);
    if (level<1){
        return 1;
    }
    if (level>2000){
        return 2000;
    }
    return level;
}

export {
    renderSize,
    getFlagArrs,
    toNumber,
    getValidLevel
}