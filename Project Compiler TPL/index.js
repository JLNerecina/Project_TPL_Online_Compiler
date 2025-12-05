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

// Open file
let sourceCode = '';
openFileBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    sourceCode = e.target.result;
    codeArea.textContent = sourceCode;
    // highlightSyntax(sourceCode);

    // const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    // currentLang = langMap[ext] || 'Text';
    // langBadge.textContent = currentLang;
    // fileNameSpan.textContent = `Loaded: ${file.name}`;

    resetAll();
    enablePhase(lexicalBtn, null, 0);
    updateProgress(0);
  };
  reader.readAsText(file);
});

//Buttons
import lexicalAnalyzer, { lexicalValidCheck } from "./lexical.js";
import syntaxAnalyzer from "./syntax.js";
import semanticAnalyzer from "./semantic.js";

let tokens = [];
lexicalBtn.addEventListener('click', () => performLexical());
function performLexical() {
  tokens = lexicalAnalyzer(sourceCode);
  resultArea.textContent = tokens
    .map(token => `Type: ${token.type.padEnd(15)} Value: '${token.value}'`)
    .join('\n');
  lexicalValidCheck();
  enablePhase(syntaxBtn, lexicalBtn, 1);
}

let syntaxArray = [];
syntaxBtn.addEventListener('click', () => performSyntax());
function performSyntax() {
  syntaxArray = syntaxAnalyzer(tokens);
  resultArea.textContent = syntaxAnalyzer(tokens);
  enablePhase(semanticBtn, syntaxBtn, 2);
}

semanticBtn.addEventListener('click', () => performSemantic());
function performSemantic() {
  // Placeholder for semantic analysis
  resultArea.textContent += '\n\nSemantic Analysis: (Not Implemented)';
  enablePhase(null, semanticBtn,  3);
}

clearBtn.addEventListener('click', () => resetAll(true));

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(resultArea.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy', 2000);
});

//UI Functions
function enablePhase(btnEnable, btnDisable, step) {

  if (btnEnable){
    btnEnable.classList.add('enabled');
    btnEnable.disabled = false;
  }

  if (btnDisable) {
    btnDisable.classList.remove('enabled');
    btnDisable.disabled = true;
  }
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
    langBadge.textContent = 'Java';
    fileInput.value = '';
    // currentLang = 'Unknown';
  } else {
    resultArea.textContent = 'Click "Lexical Analysis" to begin...';
  }
  updateProgress(0);
}

// Basic syntax highlighting
// function highlightSyntax(code) {
//   codeArea.innerHTML = code
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/("([^"]*)")/g, '<span class="string">$1</span>')
//     .replace(/('([^']*)')/g, '<span class="string">$1</span>')
//     .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
//     .replace(/\b(function|class|const|let|var|if|else|for|while|return|import|export|async|await)\b/g, '<span class="keyword">$1</span>')
//     .replace(/\/\/.*/g, '<span class="comment">$&</span>')
//     .replace(/#.*/g, '<span class="comment">$&</span>');
// }

// // Add some styles for highlighting
// const style = document.createElement('style');
// style.textContent = `
//   .code-display .keyword { color: #e67e22; font-weight: bold; }
//   .code-display .string { color: #27ae60; }
//   .code-display .number { color: #2980b9; }
//   .code-display .comment { color: #95a5a6; font-style: italic; }
// `;
// document.head.appendChild(style);