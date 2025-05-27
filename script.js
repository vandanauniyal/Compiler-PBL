document.getElementById("docTab").addEventListener("click", () => {
  document.getElementById("documentation").classList.remove("hidden");
  document.getElementById("finalWork").classList.add("hidden");
  document.getElementById("docTab").classList.add("active");
  document.getElementById("finalTab").classList.remove("active");
});

document.getElementById("finalTab").addEventListener("click", () => {
  document.getElementById("documentation").classList.add("hidden");
  document.getElementById("finalWork").classList.remove("hidden");
  document.getElementById("finalTab").classList.add("active");
  document.getElementById("docTab").classList.remove("active");
});

function tokenize(code) {
  const tokens = [];
  const tokenRegex = /\/\/.*|#include|int|for|while|if|else|return|\+\+|--|\+=|-=|\*=|\/=|==|!=|<=|>=|[%+\-*/=<>]|[{}()[\];,]|"[^"]*"|\b[_a-zA-Z][_a-zA-Z0-9]*\b|\d+/g;

  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    const value = match[0];
    let type = "Identifier";

    if (/^\/\/.*/.test(value)) {
      type = "Comment";
    } else if (/^#include$/.test(value)) {
      type = "PreprocessorDirective";
    } else if (/^(int|for|while|if|else|return)$/.test(value)) {
      type = "Keyword";
    } else if (/^[{}()[\];,]$/.test(value)) {
      type = "Delimiter";
    } else if (/^(\+\+|--|\+=|-=|\*=|\/=|==|!=|<=|>=|[%+\-*/=<>])$/.test(value)) {
      type = "Operator";
    } else if (/^\d+$/.test(value)) {
      type = "Number";
    } else if (/^".*"$/.test(value)) {
      type = "Symbol";
    }

    tokens.push({ type, value });
  }

  return tokens;
}

function buildAST(tokens) {
  return {
    type: "Program",
    body: tokens.map(t => ({
      type:
        t.type === "Keyword" && t.value === "#include"
          ? "IncludeDirective"
          : t.type === "Keyword" && t.value === "int"
          ? "VariableDeclaration"
          : t.type,
      value: t.value,
    })),
  };
}

function renderTokens(tokens) {
  const tbody = document.querySelector("#tokenTable tbody");
  tbody.innerHTML = "";
  tokens.forEach(({ type, value }) => {  //arrow function
    const tr = document.createElement("tr");
    const tdType = document.createElement("td");
    tdType.textContent = type;
    const tdValue = document.createElement("td");
    tdValue.textContent = value;
    tr.appendChild(tdType);
    tr.appendChild(tdValue);
    tbody.appendChild(tr);
  });
}

function renderAST(ast) {
  document.getElementById("astTree").textContent = JSON.stringify(ast, null, 2);//print
}

function analyzeCode() {
  const code = document.getElementById("codeInput").value;
  if (!code.trim()) {
    alert("Please enter some C code.");
    return;
  }
  const tokens = tokenize(code);
  renderTokens(tokens);
  const ast = buildAST(tokens);
  renderAST(ast);
  window.latestResults = { tokens, ast };
}

function saveResults() {
  if (!window.latestResults) {
    alert("Please analyze code first.");
    return;
  }
  
  const { tokens, ast } = window.latestResults;
  const tokenLines = tokens.map(t => `${t.type}\t${t.value}`);
  const astString = JSON.stringify(ast, null, 2);
  const content = ["TOKENS:", ...tokenLines, "", "AST:", astString].join("\n"); //spread operator...
  const blob = new Blob([content], { type: "text/plain" }); //memory mae bnra h
  const url = URL.createObjectURL(blob); //blob address store hora 
  const a = document.createElement("a");//anchor tag link to this url
  a.href = url;   //jb bhi koi link dabayega ,file will download
  a.download = "c_code_analysis.txt";  //file name
  document.body.appendChild(a); 
  a.click();  //jb bhi click hoga tb chlega ye event
  document.body.removeChild(a);  //one time use tha everytime we have to make new file for new input
    
}

document.getElementById("analyzeBtn").addEventListener("click", analyzeCode);
document.getElementById("saveBtn").addEventListener("click", saveResults);