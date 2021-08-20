import { DiceFace, Side } from "./definitions";

export class Challenge {

    constructor(
        public dices: DiceFace[],
        public leftPart : DiceFace[] = [],
        public rightPart : DiceFace[] = []
    ){}

    add(side: Side, dice: DiceFace){
        if(side === Side.Left){
            this.leftPart = [...this.leftPart, dice]
        }
        else if(side === Side.Right){
            this.rightPart = [...this.rightPart, dice]
        }
        else {
            throw Error('side not handled' + JSON.stringify(side))
        }
    }

    getSolution(): DiceFace[][] | null {
        const toCombine = new Array(this.dices.length)
            .fill('')
            .map( (_, i) => i)
        let combinations = [];
        let temp = [];
        let slent = Math.pow(2, toCombine.length) - 1;

        for (let i = 0; i < slent; i++) {
            temp = [];
            for (var j = 0; j < toCombine.length; j++) {
                if ((i & Math.pow(2, j))) {
                    temp.push(toCombine[j]);
                }
            }
            
            if (temp.length > 0) {
                combinations.push(temp);
            }
        }

        const partsCombinations = combinations.map(combi => {
            const completion = toCombine.filter(index => combi.indexOf(index) === -1)
            const diceCombi = combi.map(e => this.dices[e])
            const diceCompletion = completion.map(e => this.dices[e])
            return [diceCombi, diceCompletion]
        })
        .filter(c => {
            const whiteFacesLeft = c[0].filter(dFace => dFace < 6)
            const whiteFacesRight = c[1].filter(dFace => dFace < 6)
            let isAnimalGreyCompatible = 
                ![...c[0], ...c[1]].includes(DiceFace.Animal_Grey_Wech)
                ||(c[0].includes(DiceFace.Animal_Grey_Wech) && whiteFacesLeft.length < whiteFacesRight.length)
                || (c[1].includes(DiceFace.Animal_Grey_Wech) && whiteFacesRight.length < whiteFacesLeft.length)
            
            let isPinkAnimalCompatible =
                ![...c[0], ...c[1]].includes(DiceFace.Animal_Pink_Keh)
                || (c[0].includes(DiceFace.Animal_Pink_Keh) && whiteFacesLeft.length > whiteFacesRight.length)
                || (c[1].includes(DiceFace.Animal_Pink_Keh) && whiteFacesRight.length > whiteFacesLeft.length)
            
            return isAnimalGreyCompatible && isPinkAnimalCompatible
        })

        let i = 0
        while(i < partsCombinations.length && this.getTotal(partsCombinations[i][0], partsCombinations[i][1]) !== this.getTotal(partsCombinations[i][1], partsCombinations[i][0])){
            i++
        }

        return i < partsCombinations.length ? partsCombinations[i] : null
    }

    isComplete(){
        return this.rightPartTotal === this.leftPartTotal
    }

    getTotal(part: DiceFace[], otherPart: DiceFace[]){
        let scores = part.map(face => {
            if(face === DiceFace.Green_Kat){
                return 1
            }
            else if(face === DiceFace.Grey_Kankabiyok){
                return 2
            }
            else if(face === DiceFace.Orange_AhTsIb){
                return part.filter(dFace => dFace < 6).length % 2 === 0 ? 2 : 1 
            }
            else if(face === DiceFace.Blue_Way){
                return otherPart.filter(dFace => dFace < 6).length
            }
            else if(face === DiceFace.Yellow_Okol){
                return -1
            }
            else if(face === DiceFace.Pink_IxAhau){
                return 3
            }
            else {
                return null
            }
        })
        .filter(s => s !== null) as number[]
        // console.log('scores', scores)

        if(part.includes(DiceFace.Pink_IxAhau)){
            const scoresToHandle = scores.filter((v, i) => part[i] !== DiceFace.Pink_IxAhau)
            const minimalValue = Math.min(...scoresToHandle)
            scores = scores.map((v, i) => (part[i] === DiceFace.Pink_IxAhau || v !== minimalValue) ? v : 0)
        }
        // console.log('scores after pink', scores)

        const animals = part.filter(df => df >= 6)
        animals.forEach(animal => {
            if(animal === DiceFace.Animal_Grey_Wech){
                scores = scores.map((v, i) => part[i] < 6 ? v + 1 : v)
            }
            // console.log('scores after animal grey', scores)

            if(animal === DiceFace.Animal_Pink_Keh){
                scores = scores.map((v, i) => part[i] < 6 ? v - 1 : v)
            }
            // console.log('scores after animal pink', scores)
            
            if(animal === DiceFace.Animal_Green_Huh){            
                const uniqDiceFaceIndex = part
                    .reduce( (uniqDices: number[], dFace, i) =>  
                        (dFace < 6 && part.filter(df => df ===dFace).length === 1) 
                        ? [...uniqDices, i] 
                        : uniqDices
                    , [] )
                scores = scores.map((e, i) => uniqDiceFaceIndex.indexOf(i) !== -1 ? e + 1 : e)
            }  
            // console.log('scores after animal green', scores)
            
            if(animal === DiceFace.Animal_Yellow_SinaAn){
                const uniqDiceFaceIndex = part
                    .reduce( (uniqDices: number[], dFace, i) =>  
                        (dFace < 6 && part.filter(df => df ===dFace).length === 1) 
                            ? [...uniqDices, i] 
                            : uniqDices
                        , []
                    )
                scores = scores.map((e, i) => uniqDiceFaceIndex.indexOf(i) !== -1 ? e - 1 : e)
            }
            // console.log('scores after animal yellow', scores)
            
            if(animal === DiceFace.Animal_Blue_Balam){
                const max = Math.max(...scores)
                const min = Math.min(...scores)
                const minIndex = scores.findIndex(e => e === min)
                scores[minIndex] = max
            }
            // console.log('scores after animal blue', scores)
            
            if(animal === DiceFace.Animal_Orange_Kab){            
                const min = Math.min(...scores)
                const max = Math.max(...scores)
                const maxIndex = scores.findIndex(e => e === max)
                scores[maxIndex] = min
            }
            // console.log('scores after animal orange', scores)
        })
        
        return scores.reduce( (sum, score) => sum + score, 0)
    }

    get leftPartTotal(){
        return this.getTotal(this.leftPart, this.rightPart)
    }
    
    get rightPartTotal(){
        return this.getTotal(this.rightPart, this.leftPart)
    }

}