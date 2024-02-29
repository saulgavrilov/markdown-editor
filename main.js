const filename = document.querySelector(".filename");
const saveBtn = document.querySelector(".save-btn");
const editor = document.querySelector(".editor textarea");
const preview = document.querySelector(".preview");
let tabbed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
  }
});
// &#9; tab code

function save(codes, fileNmae = "README") {
  const blob = new Blob([codes.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${filename.textContent || fileNmae}.md`;
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
    italic: [/\*(.*?)\*|_(.*?)_/g, "<i>$1$2</i>"],
    blockquotes: [/^>\s(.*)$/gm, "<blockquote>$1</blockquote>"],
    image: [/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">'],
    link: [/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'],
    strikethrough: [/\~\~(.*?)\~\~/g, "<s>$1</s>"],
    code: [/```(.*?)\n([\s\S]+?)```/g, "<pre><code>$2</code></pre>"],
    hr: [/^([---])/g, "<hr />"],
    li: [/^- (.+?)$/gm, "<li>$1</li>"],
    nli: [/^\t- (.+?)$/gm, '<li class="nli">$1</li>'],
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
  const code = (text) => text.replace(...regexs.code);
  const hr = (text) => text.replace(...regexs.hr);
  const li = (text) => text.replace(...regexs.li);
  const nli = (text) => text.replace(...regexs.nli);

  markdown = headings(markdown);
  markdown = bold(markdown);
  markdown = italic(markdown);
  markdown = blockquotes(markdown);
  markdown = image(markdown);
  markdown = link(markdown);
  markdown = strikethrough(markdown);
  markdown = code(markdown);
  markdown = hr(markdown);
  markdown = li(markdown);
  markdown = nli(markdown);

  return markdown;
}

editor.addEventListener("input", (e) => {
  preview.innerHTML = convertor(editor.value);
  preview.innerHTML.trim();
});

editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    tabbed = true;
    editor.setRangeText(
      "\t",
      editor.selectionStart,
      editor.selectionStart,
      "end"
    );
  }

  if (e.key === "Enter") {
    tabbed = false;
  }
});

saveBtn.addEventListener("click", () => save(editor));
