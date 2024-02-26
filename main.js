const editorContainer = document.querySelector(".editor-container");
const lineNumbers = document.querySelector(".line-numbers");
const codeInput = document.querySelector(".code-input");
const output = document.querySelector(".output");
const editorBtn = document.querySelector(".editor-btn");
const previewBtn = document.querySelector(".preview-btn");
const saveBtn = document.querySelector(".save-btn");
const settingsBtn = document.querySelector(".settings-btn");

function updateUI() {
  previewBtn.addEventListener("click", () => {
    editorContainer.style.display = "none";
    output.style.display = "block";
  });

  editorBtn.addEventListener("click", () => {
    editorContainer.style.display = "flex";
    output.style.display = "none";
  });
}

function updateLineNumbers() {
  const lines = codeInput.value.split("\n");
  lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join("");
}

function save(codes, fileNmae = "README") {
  const blob = new Blob([codes.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${fileNmae}.md`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function convertor(markdown) {
  const regexs = {
    headings: {
      h1: [/^#\s(.*)$/gm, "<h1>$1</h1>"],
      h2: [/^##\s(.*)$/gm, "<h2>$1</h2>"],
      h3: [/^###\s(.*)$/gm, "<h3>$1</h3>"],
      h4: [/^####\s(.*)$/gm, "<h4>$1</h4>"],
      h5: [/^#####\s(.*)$/gm, "<h5>$1</h5>"],
      h6: [/^######\s(.*)$/gm, "<h6>$1</h6>"],
    },
    bold: [/\*\*(.*?)\*\*/g, "<strong>$1</strong>"],
    italic: [/\*(.*?)\*/g, "<i>$1</i>"],
    blockquotes: [/^>\s(.*)$/gm, "<blockquote>$1</blockquote>"],
    image: [/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">'],
    link: [/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'],
    strikethrough: [/\~\~(.*?)\~\~/g, "<s>$1</s>"],
  };

  const headings = (text) => {
    return text
      .replace(...regexs.headings.h1)
      .replace(...regexs.headings.h2)
      .replace(...regexs.headings.h3)
      .replace(...regexs.headings.h4)
      .replace(...regexs.headings.h5)
      .replace(...regexs.headings.h6);
  };

  const bold = (text) => text.replace(...regexs.bold);
  const italic = (text) => text.replace(...regexs.italic);
  const blockquotes = (text) => text.replace(...regexs.blockquotes);
  const link = (text) => text.replace(...regexs.link);
  const image = (text) => text.replace(...regexs.image);
  const strikethrough = (text) => text.replace(...regexs.strikethrough);

  markdown = headings(markdown);
  markdown = bold(markdown);
  markdown = italic(markdown);
  markdown = blockquotes(markdown);
  markdown = image(markdown);
  markdown = link(markdown);
  markdown = strikethrough(markdown);

  return markdown;
}

updateLineNumbers();
updateUI();

codeInput.addEventListener("input", () => {
  updateLineNumbers();
  output.innerHTML = convertor(codeInput.value);
});
saveBtn.addEventListener("click", () => save(codeInput));
