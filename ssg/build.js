const fs = require("fs");
const path = require("path");
const marked = require("marked");
const customHeadingId = require("marked-custom-heading-id");
const matter = require("gray-matter");
const Handlebars = require("handlebars");
const minimist = require("minimist");

const path_root = path.join(__dirname, "../");    // this is: repository/
const path_db = path.join(path_root, 'db');                 // this is: repository/db      
const path_ssg = path.join(path_root, 'ssg');               // this is: repository/ssg
const path_docs = path.join(path_root, 'docs');             // this is: repository/docs

const path_hbs_template = path.join(path_ssg, 'template.hbs');
console.log(path_hbs_template);

function compileHBSTemplate(path) {
  // Reads the content of the template.
  hbsTemplateContent = fs.readFileSync(path, "utf-8");
  
  // Compile the template content, this returns a function that builds the HTML later.
  const hbsCompiledTemplate = Handlebars.compile(hbsTemplateContent);
  
  // We return the pre-compiled template.
  return hbsCompiledTemplate;
}

// We get the precompile template that we'll use later to create the html.
const hbsCompiledTemplate = compileHBSTemplate(path_hbs_template);

// Defining the build HTML file function.
function buildHTMLfile(fileName, metadata, mdContent, hbsTemplate) {
  
  const htmlContent = marked.parse(mdContent);

  console.log(hbsTemplate);

  const html = hbsTemplate({
    title: metadata.title,
    content: htmlContent,
  });

  const htmlFileName = fileName.replace(".md", ".html");
  const outputPath = path.join(path_docs, htmlFileName);

  fs.writeFileSync(outputPath, html);
}

const mdEntries = fs.readdirSync(path_db);

if (mdEntries && mdEntries.length > 0) {

  // 3. Iterating over the list.
  mdEntries.forEach((fileName) => {
    
    // Form the filename path
    const path_filename = path.join(path_db, fileName);

    // Reads its content
    const content = fs.readFileSync(path_filename, "utf-8");

    // Get the frontmatter and body content.
    const { data, content: mdContent } = matter(content);

    // Calling the build HTML function
    buildHTMLfile(fileName, data, mdContent, hbsCompiledTemplate);

  });
}