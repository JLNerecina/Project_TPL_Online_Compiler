let syntaxValid = true;
export default function syntaxAnalyzer(tokens) {

    syntaxValid = true;
    // Java syntax rules. Literals are compiled in one array to be iterated through.
    const rules = [
        "KEYWORD",
        "IDENTIFIER",
        "OPERATOR",
        ["INT_LITERAL", "FLOAT_LITERAL", "CHAR_LITERAL", "STRING_LITERAL", "BOOLEAN_LITERAL", "NULL_LITERAL"],
        "SEPARATOR"
    ];

    // Cycles through tokens within the source code
    // And checks if they follow Java syntax rules/language.
    // Rules: KEYWORD, IDENTIFIER, OPERATOR, LITERAL, SEPARATOR.

    let validDeclarations = 0;
    let i = 0;
    for(const token of tokens) {
        console.log(`Current Rule: ${rules[i]}, Current Token: ${token.type} ('${token.value}')`);
        if(rules[i] === token.type) {

            // After successfully scanning the SEPARATOR rule, start over from index 0.
            if(i === rules.length - 1) {
                i = 0;
                validDeclarations++;
                continue;
            }
            // Iterate.
            else{
                i++;
                continue;
            }
        }

        // The third rule cannot be matched by the token normally.
        // Since there are multiple literal types,
        // Cycle through all literals and see if one matches.
        else if(i === 3){
            if(rules[i].includes(token.type)) {
                i++;
                continue;
            }
            else {
                syntaxValid = false;
                return `🛑 Code 2: Syntax Error: Expected LITERAL but found ${token.type} ('${token.value}')`;
            }
        }

        // If token and rule isn't equal, throw an error.
        else {
            syntaxValid = false;
            return `🛑 Code 1: Syntax Error: Expected ${rules[i]} but found ${token.type} ('${token.value}')`;
        }
    }

    // if index isn't reset to 0, that means syntax is not complete. Throw an error.
    if (i !== 0) {
        syntaxValid = false;
        return `🛑 Code 3: Syntax Error: Incomplete statement at token '${tokens[tokens.length - 1].value}', expected ${rules[i]}.`;
    }

    return `✅ Code 0: Syntax of ${validDeclarations} variable declarations are all valid.`;
}

export function syntaxValidCheck() {
    return syntaxValid;
}