export default function fact(number){
    var result = 1;
    for (let index = 1; index <= number; index++) {
        result *= index;
    }
    return result;
}