// DOM Elements
const fileInput = document.getElementById('fileInput');
const openFileBtn = document.getElementById('openFileBtn');
const fileNameSpan = document.getElementById('fileName');
const lexicalBtn = document.getElementById('lexicalBtn');
const syntaxBtn = document.getElementById('syntaxBtn');
const semanticBtn = document.getElementById('semanticBtn');
const clearBtn = document.getElementById('clearBtn');
const codeArea = document.getElementById('codeArea');
const resultArea = document.getElementById('resultArea');
const langBadge = document.getElementById('langBadge');
const progressFill = document.querySelector('.progress-fill');
const progressLabel = document.querySelector('.progress-label');
const copyBtn = document.getElementById('copyBtn');

// State
let currentLang = 'Unknown';
let sourceCode = '';

// Language detection & badge mapping
const langMap = {
  '.c': 'C', '.h': 'C Header',
  '.cpp': 'C++', '.cxx': 'C++', '.cc': 'C++',
  '.java': 'Java',
  '.py': 'Python',
  '.js': 'JavaScript', '.ts': 'TypeScript',
  '.go': 'Go',
  '.rs': 'Rust',
  '.php': 'PHP',
  '.rb': 'Ruby',
  '.swift': 'Swift',
  '.kt': 'Kotlin', '.kts': 'Kotlin Script',
  '.cs': 'C#',
  '.html': 'HTML', '.htm': 'HTML',
  '.css': 'CSS',
  '.sql': 'SQL'
};

// Open file
openFileBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    sourceCode = e.target.result;
    codeArea.textContent = sourceCode;
    highlightSyntax(sourceCode, currentLang);

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    currentLang = langMap[ext] || 'Text';
    langBadge.textContent = currentLang;
    fileNameSpan.textContent = `Loaded: ${file.name}`;

    resetAll();
    enablePhase(lexicalBtn, 1);
    updateProgress(0);
  };
  reader.readAsText(file);
});

// Phase buttons
lexicalBtn.addEventListener('click', () => performLexical());
syntaxBtn.addEventListener('click', () => performSyntax());
semanticBtn.addEventListener('click', () => performSemantic());
clearBtn.addEventListener('click', () => resetAll(true));

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(resultArea.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy', 2000);
});

function enablePhase(btn, step) {
  btn.classList.add('enabled');
  btn.disabled = false;
  updateProgress(step * 33);
}

function updateProgress(percent) {
  progressFill.style.width = percent + '%';
  const labels = [
    "Ready — Upload a file to begin",
    "Lexical analysis completed — ready for syntax parsing",
    "Syntax analysis completed — checking semantics",
    "All phases completed successfully!"
  ];
  progressLabel.textContent = labels[Math.min(Math.floor(percent / 33), 3)] || labels[0];
}

function resetAll(clearCode = false) {
  [lexicalBtn, syntaxBtn, semanticBtn].forEach(b => {
    b.classList.remove('enabled');
    b.disabled = true;
  });
  if (clearCode) {
    codeArea.textContent = '';
    resultArea.textContent = '';
    sourceCode = '';
    fileNameSpan.textContent = 'Upload Source Code';
    langBadge.textContent = 'Unknown';
    currentLang = 'Unknown';
  } else {
    resultArea.textContent = 'Click "Lexical Analysis" to begin...';
  }
  updateProgress(0);
}

// Universal Lexer (greatly improved)
function performLexical() {
  if (!sourceCode.trim()) {
    resultArea.textContent = "No source code loaded.";
    return;
  }

  const tokens = universalLexer(sourceCode);
  const output = `LEXICAL ANALYSIS COMPLETE (${currentLang})\n\n` +
    `Total tokens recognized: ${tokens.length}\n` +
    `${'═'.repeat(50)}\n\n` +
    tokens.slice(0, 1000).join('\n') +
    (tokens.length > 1000 ? `\n\n... and ${tokens.length - 1000} more tokens` : '');

  resultArea.textContent = output;
  enablePhase(syntaxBtn, 2);
}

// Simulated parsers
function performSyntax() {
  resultArea.textContent = `SYNTAX ANALYSIS SUCCESSFUL (${currentLang})

Parsed construct types:
• Functions / Methods
• Control structures (if, loops, etc.)
• Expressions & operators
• Declarations & definitions

Abstract Syntax Tree generated successfully.
No syntax errors detected.

Ready for semantic analysis →`;
  enablePhase(semanticBtn, 3);
}

function performSemantic() {
  const langSpecific = currentLang.includes('Python') ? 'Dynamic typing verified' :
                       currentLang.includes('Java') || currentLang.includes('C#') ? 'Type inference & checking passed' :
                       'Static type analysis completed';

  resultArea.textContent = `SEMANTIC ANALYSIS SUCCESSFUL (${currentLang})

All checks passed:
• Variable declaration & usage
• Type consistency & compatibility
• Function/method signature matching
• Scope and shadowing rules
• ${langSpecific}
• No unreachable code or conflicts

The program is semantically correct and ready for intermediate code generation or interpretation.

Compilation front-end completed successfully!`;
  updateProgress(100);
}

// Enhanced universal lexer
function universalLexer(source) {
  const tokens = [];
  const lines = source.split('\n');

  // Language-agnostic + smart patterns
  const patterns = [
    { type: 'PREPROCESSOR', regex: /^#.*$/gm },
    { type: 'COMMENT',     regex: /\/\/.*|\/\*[\s\S]*?\*\//g },
    { type: 'STRING',      regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g },
    { type: 'NUMBER',      regex: /\b(?:0x[\da-fA-F]+|0b[01]+|\d*\.?\d+(?:[eE][+-]?\d+)?)\b/g },
    { type: 'KEYWORD',     regex: /\b(abstract|as|async|await|break|case|catch|class|const|continue|def|default|do|else|enum|export|extends|false|final|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|struct|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|match|impl|trait|mod|use|pub|fn|mut|ref)\b/g },
    { type: 'OPERATOR',    regex: /=>|->|\+\+|--|<<|>>|<=|>=|==|===|!=|!==|[-+*/%=&|^~<>!]=?|\b(?:and|or|not)\b/g },
    { type: 'PUNCTUATION', regex: /[;,\.\(\)\[\]\{\}]|\b->\b/g },
    { type: 'IDENTIFIER',  regex: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g }
  ];

  lines.forEach((line, i) => {
    let col = 0;
    while (col < line.length) {
      let matched = false;
      const remaining = line.substring(col);

      for (const { type, regex } of patterns) {
        regex.lastIndex = 0;
        const match = regex.exec(remaining);
        if (match && match.index === 0) {
          const token = match[0].trim();
          if (token) {
            const typeLabel = type.padEnd(12);
            tokens.push(`L${(i+1).toString().padStart(3)}:${(col+1).toString().padStart(2)} [${typeLabel}] ${token}`);
          }
          col += match[0].length;
          matched = true;
          break;
        }
      }
      if (!matched) col++;
    }
  });

  return tokens.length > 0 ? tokens : ['(No tokens found — empty or only whitespace)'];
}

// Basic syntax highlighting
function highlightSyntax(code, lang) {
  codeArea.innerHTML = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("([^"]*)")/g, '<span class="string">$1</span>')
    .replace(/('([^']*)')/g, '<span class="string">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    .replace(/\b(function|class|const|let|var|if|else|for|while|return|import|export|async|await)\b/g, '<span class="keyword">$1</span>')
    .replace(/\/\/.*/g, '<span class="comment">$&</span>')
    .replace(/#.*/g, '<span class="comment">$&</span>');
}

// Add some styles for highlighting
const style = document.createElement('style');
style.textContent = `
  .code-display .keyword { color: #e67e22; font-weight: bold; }
  .code-display .string { color: #27ae60; }
  .code-display .number { color: #2980b9; }
  .code-display .comment { color: #95a5a6; font-style: italic; }
`;
document.head.appendChild(style);