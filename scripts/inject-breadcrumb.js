const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const faviconTag = `<link rel="icon" href="/favicon.png" type="image/png">`;

const breadcrumbHtml = `<nav style="position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(255,255,255,0.95);border-bottom:1px solid #e5e5e5;padding:6px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;backdrop-filter:blur(4px)"><a href="/" style="color:#888;text-decoration:none">Slides</a> <span style="color:#ccc;margin:0 6px">/</span> <span style="color:#444">{{title}}</span></nav>`;

const slides = fs
  .readdirSync(rootDir)
  .filter((d) => /^20\d{6}$/.test(d))
  .flatMap((dir) => {
    const dirPath = path.join(rootDir, dir);
    return fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".html"))
      .map((f) => path.join(dirPath, f));
  });

for (const file of slides) {
  let html = fs.readFileSync(file, "utf-8");

  // Skip if already injected
  if (html.includes("<!-- breadcrumb -->")) continue;

  // Extract title from corresponding .md header frontmatter, fallback to filename
  const mdFile = file.replace(/\.html$/, ".md");
  let title = path.basename(file, ".html").replace(/[_-]/g, " ");
  if (fs.existsSync(mdFile)) {
    const md = fs.readFileSync(mdFile, "utf-8");
    const headerMatch = md.match(/^header:\s*"?(.+?)"?\s*$/m);
    if (headerMatch) title = headerMatch[1];
  }

  // Inject favicon into <head>
  if (!html.includes('rel="icon"')) {
    html = html.replace(/<\/head>/, `${faviconTag}\n</head>`);
  }

  const nav = `<!-- breadcrumb -->${breadcrumbHtml.replace("{{title}}", title)}`;
  html = html.replace(/<body([^>]*)>/, `<body$1>${nav}`);

  fs.writeFileSync(file, html, "utf-8");
  console.log(`Injected breadcrumb: ${path.relative(rootDir, file)}`);
}
