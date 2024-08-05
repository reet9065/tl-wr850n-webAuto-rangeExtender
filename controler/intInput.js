const prompt = require('prompt-sync')();

exports.intUserInput = (message, valid)=>{
    if(valid == 0){
        return null;
    }
    var input = (prompt(message)*1 - 1);
    while(!Number.isInteger(input)&& input < 0 && input >= valid && input == ""){
        input = (prompt('Jitna wifi hai ushi ke andar me no. type karna hai : ')*1-1);
    }

    return input;
}