const MONTHS = "January February March April May June July August September October November December".split(" ");

const ARCHIVE_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRg5FVCk83wl4ScdDo3IM_M698aBuvtz9jgN40ceD_Ey8-jqOxsuNp9swUjnovb03TrzzD6OFdlUF5Y/pub?output=tsv";

const projectTemp = document.querySelector(".project");
projectTemp.remove();

const projects = [];
fetch(ARCHIVE_URL)
  .then(r => r.text())
  .then(text => {
    const allLines = text.split("\r\n");
    const header = allLines[0].split("\t");
    const lines = allLines.slice(1);

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const cols = line.split("\t");
      const entry = {};
      for (let i = 0; i < header.length; i++) {
        entry[header[i]] = cols[i];
      }
      if (entry["Portfolio"]) {
        projects.push(entry);
      }
    }
    
    projects.forEach(project => {
      const projectItem = projectTemp.cloneNode(true);

      const containerName = project["Portfolio"].replace(/ /g, "-");
      if (project["Portfolio"] === "work in progress") {
        projectItem.classList.add("small");
      }
      const container = document.querySelector(`.${containerName} .project-list`);
      container.appendChild(projectItem);

      // title
      projectItem.querySelector(".project--title").innerHTML = strToHtml(project["Title"]);

      // description
      projectItem.querySelector(".project--desc").innerHTML = strToHtml(project["Description"]);
      if (!project["Description"]) {
        projectItem.classList.add("small");
      }

      // links
      const links = project["Links"].split(" ");
      links.forEach(link => {
        if (!link) return;

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link;
        if (link.includes("twitter")) {
          a.innerText = "Twitter";
        } else if (link.includes("github")) {
          a.innerText = "GitHub";
        } else if (link.includes("youtu.be") || link.includes("youtube")) {
          a.innerText = "YouTube";
        } else if (link.includes("instagram")) {
          a.innerText = "Instagram";
        } else if (link.includes("Vimeo")) {
          a.innerText = "Vimeo";
        } else {
          a.innerText = "Link";
        }
        li.appendChild(a);
        projectItem.querySelector(".project--links .metadata-list").appendChild(li);
      });

      // date
      const [month, year] = project["Month"].split(" ").map(n => parseInt(n));
      const monthStr = MONTHS[month - 1];
      projectItem.querySelector(".project--date dd").innerText = `${monthStr} ${year}`;

      // material
      projectItem.querySelector(".project--material dd").innerText = project["Material"];

      // format
      const formats = project["Format"].split(", ");
      formats.forEach(format => {
        if (!format) return;

        const li = document.createElement("li");
        li.innerHTML = strToHtml(format);
        projectItem.querySelector(".project--format .metadata-list").appendChild(li);
      });

      // extension
      const extensions = project["File extension"].split(", ");
      extensions.forEach(extension => {
        if (!extension) return;

        const li = document.createElement("li");
        li.innerHTML = strToHtml(extension);
        projectItem.querySelector(".project--extension .metadata-list").appendChild(li);
      });

      // themes
      const themes = project["Themes"].split(", ");
      themes.sort((a, b) => a.localeCompare(b));
      themes.forEach(theme => {
        if (!theme) return;
        
        const li = document.createElement("li");
        li.innerText = theme;
        projectItem.querySelector(".project--themes .metadata-list").appendChild(li);
      });

      // location
      const location = project["Location"].replace(/; /g, "<br>");
      projectItem.querySelector(".project--location dd").innerHTML = location;

      // language
      projectItem.querySelector(".project--language dd").innerText = project["Language"];

      // tools
      const tools = project["Tools"].split(", ");
      tools.forEach(tool => {
        if (!tool) return;

        const li = document.createElement("li");
        li.innerHTML = strToHtml(tool);
        projectItem.querySelector(".project--tools .metadata-list").appendChild(li);
      });

      // collaborators
      projectItem.querySelector(".project--collaborators dd").innerText = project["Collaborators"];
      if (!project["Collaborators"]) {
        projectItem.querySelector(".project--collaborators").classList.add("hidden");
      }
    });
  });

function strToHtml(str) {
  const words = str.split(" ");
  let html = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length >= 3 && word.toUpperCase() === word) {
      const abbr = document.createElement("abbr");
      abbr.innerText = word;
      html += abbr.outerHTML;
    } else {
      html += word;
    }
    if (i < words.length - 1) {
      html += " ";
    }
  }
  return html;
}