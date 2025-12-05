export default function lexicalAnalyzer(sourceCode) {

    // Defines primitive data types commonly used in Java
    const KEYWORD   = "\\b(boolean|byte|char|double|float|int|long|short|String)\\b";

    // Cannot start with a digit
    const IDENTIFIER   = "\\b[A-Za-z_$][A-Za-z0-9_$]*\\b";

    // 
    const INT_LITERAL  = "0|[1-9][0-9]*";

    const FLOAT_LITERAL= "[0-9]+\\.[0-9]*";

    const CHAR_LITERAL = "'[^']'";

    const STRING_LITERAL = "\"([^\"\\\\]|\\\\.)*\"";

    const BOOLEAN_LITERAL = "\\b(true|false)\\b";

    const NULL_LITERAL = "\\bnull\\b";

    const OPERATOR = "=";

    const SEPARATOR = "[;,]";

    const LINE_COMMENT = "//[^\\n]*";

    const BLOCK_COMMENT = "/\\*[^*]*\\*+([^/*][^*]*\\*+)*/";
    
    const WHITESPACE = "\\s+";

    const tokens = [];
    let current = 0;

    const tokenMatchers = [
        { type: 'WHITESPACE', regex: WHITESPACE, skip: true },
        { type: 'BLOCK_COMMENT', regex: BLOCK_COMMENT, tokenType: 'COMMENT' },
        { type: 'LINE_COMMENT', regex: LINE_COMMENT, tokenType: 'COMMENT' },
        { type: 'KEYWORD', regex: KEYWORD },
        { type: 'STRING_LITERAL', regex: STRING_LITERAL },
        { type: 'CHAR_LITERAL', regex: CHAR_LITERAL },
        { type: 'FLOAT_LITERAL', regex: FLOAT_LITERAL },
        { type: 'INT_LITERAL', regex: INT_LITERAL },
        { type: 'BOOLEAN_LITERAL', regex: BOOLEAN_LITERAL },
        { type: 'NULL_LITERAL', regex: NULL_LITERAL },
        { type: 'IDENTIFIER', regex: IDENTIFIER },
        { type: 'OPERATOR', regex: OPERATOR },
        { type: 'SEPARATOR', regex: SEPARATOR }
    ];

    while (current < sourceCode.length) {
        let matched = false;
        for (const matcher of tokenMatchers) {
            const regex = new RegExp(`^(${matcher.regex})`);
            const match = sourceCode.substring(current).match(regex);
            if (match) {
                if (!matcher.skip) {
                    tokens.push({ type: matcher.tokenType || matcher.type, value: match[0] });
                }
                current += match[0].length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            tokens.push({ type: 'UNKNOWN', value: sourceCode[current] });
            current++;
        }
    }
    return tokens;
}