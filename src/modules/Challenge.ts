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

        let i = 0
        while(
            i < partsCombinations.length &&
            this.getTotal(partsCombinations[i][0], partsCombinations[i][1]) !== this.getTotal(partsCombinations[i][1], partsCombinations[i][0])
        ){
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
                return part.length % 2 === 0 ? 2 : 1 
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
                console.error('not handled dice face', face)
                return 0
            }
        })

        console.log()

        if(part.includes(DiceFace.Pink_IxAhau)){
            const scoresToHandle = scores.filter((v, i) => part[i] !== DiceFace.Pink_IxAhau)
            const minimalValue = Math.min(...scoresToHandle)
            scores = scores.filter((v, i) => part[i] === DiceFace.Pink_IxAhau || v !== minimalValue)
        }

        return scores.reduce( (sum, score) => sum + score, 0)
    }

    get leftPartTotal(){
        return this.getTotal(this.leftPart, this.rightPart)
    }
    
    get rightPartTotal(){
        return this.getTotal(this.rightPart, this.leftPart)
    }

}