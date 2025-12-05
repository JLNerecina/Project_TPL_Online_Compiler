let semanticValid = true;

export default function semanticAnalyzer(tokens) {

    semanticValid = true;

    // Organize tokens into declarations of 5 tokens each
    // Format: [KEYWORD, IDENTIFIER, OPERATOR, LITERAL/IDENTIFIER, SEPARATOR]
    const syntaxArray = [];
    for (let i = 0; i < tokens.length; i += 5) {
        syntaxArray.push(tokens.slice(i, i + 5));
    }
    console.log(syntaxArray);

    // Check for Identifier Duplicates
    const identifiers = new Set();
    for (let i = 0; i < syntaxArray.length; i++) {
        const identifierName = syntaxArray[i][1].value;
        if (identifiers.has(identifierName)) {
            semanticValid = false;
            return `🛑 Code 2: Semantic Error: Duplicate identifier '${identifierName}' found.`;
        }
        identifiers.add(identifierName);
    }

    // Type Checking Existing Identifiers
    for(let i = 0; i < syntaxArray.length; i++) {
        const typeToken = syntaxArray[i][0];
        const valueToken = syntaxArray[i][3];

        if(valueToken.type === 'IDENTIFIER') {
            if(identifiers.has(valueToken.value) === true){
                for(let j = 0; j < i; j++) {
                    if(syntaxArray[j][1].value === valueToken.value){
                        const declaredType = syntaxArray[j][0].value;
                        if(declaredType !== typeToken.value) {
                            semanticValid = false;
                            return `🛑 Code 2: Semantic Error: Type mismatch for existing identifier '${valueToken.value}'. Expected ${declaredType} but found ${typeToken.value}.`;
                        }   
                    }
                }
            }
            else{
                semanticValid = false;
                return `🛑 Code 3: Semantic Error: Undeclared identifier '${valueToken.value}' used.`;
            }
        }

        // Type Checking Literal Values
        switch(typeToken.value) {
            case 'int':
                if(valueToken.type !== 'INT_LITERAL' && valueToken.type !== 'IDENTIFIER') {
                    semanticValid = false;
                    return `🛑 Code 1: Semantic Error: Type mismatch for identifier '${syntaxArray[i][1].value}'. Expected int but found ${valueToken.type} ('${valueToken.value}').`;
                }
                break;
            case 'String':
                if (valueToken.type !== 'STRING_LITERAL' && valueToken.type !== 'IDENTIFIER') {
                    semanticValid = false;
                    return `🛑 Code 1: Semantic Error: Type mismatch for identifier '${syntaxArray[i][1].value}'. Expected string but found ${valueToken.type} ('${valueToken.value}').`;
                }
                break;
            case 'boolean':
                if (valueToken.type !== 'BOOLEAN_LITERAL' && valueToken.type !== 'IDENTIFIER') {
                    semanticValid = false;
                    return `🛑 Code 1: Semantic Error: Type mismatch for identifier '${syntaxArray[i][1].value}'. Expected boolean but found ${valueToken.type} ('${valueToken.value}').`;
                }
                break;
            case 'char':
                if (valueToken.type !== 'CHAR_LITERAL' && valueToken.type !== 'IDENTIFIER') {
                    semanticValid = false;
                    return `🛑 Code 1: Semantic Error: Type mismatch for identifier '${syntaxArray[i][1].value}'. Expected char but found ${valueToken.type} ('${valueToken.value}').`;
                }
                break;
            case 'float':
                if (valueToken.type !== 'FLOAT_LITERAL' && valueToken.type !== 'INT_LITERAL' && valueToken.type !== 'IDENTIFIER') {
                    semanticValid = false;
                    return `🛑 Code 1: Semantic Error: Type mismatch for identifier '${syntaxArray[i][1].value}'. Expected float but found ${valueToken.type} ('${valueToken.value}').`;
                }
                break;
        }
    }
    return `✅ Code 0: Semantic Analysis Completed Successfully.`;
}

export function semanticValidCheck() {
    return semanticValid;
}