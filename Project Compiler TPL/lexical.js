export default function lexicalAnalyzer(sourceCode) {

    const KEYWORD   = "\\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|"
                    + "default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|"
                    + "import|instanceof|int|interface|long|native|new|package|private|protected|public|"
                    + "return|short|static|strictfp|super|switch|synchronized|this|throw|throws|"
                    + "transient|try|void|volatile|while)\\b";

    const IDENTIFIER   = "\\b[A-Za-z_$][A-Za-z0-9_$]*\\b";

    const INT_LITERAL  = "0[bB][01]+|0[xX][0-9a-fA-F]+|0[0-7]*|[1-9][0-9]*";

    const FLOAT_LITERAL= "[0-9]+\\.[0-9]*([eE][+-]?[0-9]+)?[fFdD]?|[0-9]+[eE][+-]?[0-9]+[fFdD]?";

    const CHAR_LITERAL = "'(\\\\.|[^\\\\'])'";

    const STRING_LITERAL = "\"([^\"\\\\]|\\\\.)*\"";

    const BOOLEAN_LITERAL = "\\b(true|false)\\b";

    const NULL_LITERAL = "\\bnull\\b";

    const OPERATOR = "(\\+\\+|--|==|!=|<=|>=|&&|\\|\\||<<|>>>|>>|->|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|>>>=|\\+|-|\\*|/|%|=|<|>|!|~|\\^)";

    const SEPARATOR = "[(){}\\[\\];,\\.]";

    const LINE_COMMENT = "//[^\\n]*";

    const BLOCK_COMMENT = "/\\*[^*]*\\*+([^/*][^*]*\\*+)*/";

    const WHITESPACE = "[ \\t\\r\\n]+";

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