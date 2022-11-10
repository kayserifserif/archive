const MONTHS = "January February March April May June July August September October November December".split(" ");
const BYTE_SIZES = {"KB": 1000, "MB": 1000000, "GB": 1000000000};
const LIGHTEST_COLOR = 150;
const DARKEST_COLOR = 0;

const ARCHIVE_FILE = "archive.tsv"

const yearTemp = document.querySelector(".year");
yearTemp.remove();
const projectTemp = document.querySelector(".project");
projectTemp.remove();

let minBytes = Number.POSITIVE_INFINITY;
let maxBytes = Number.NEGATIVE_INFINITY;

const projects = {};
fetch(ARCHIVE_FILE)
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
        let [sizeNumber, sizeUnit] = entry["Size"].split(" ");
        if (sizeUnit === "KB" || sizeUnit === "MB" || sizeUnit === "GB") {
          sizeNumber = parseFloat(sizeNumber) * BYTE_SIZES[sizeUnit];
          minBytes = Math.min(minBytes, sizeNumber);
          maxBytes = Math.max(maxBytes, sizeNumber);
        }

        const year = parseInt(entry["Month"].split(" ")[1]);
        if (year in projects) {
          projects[year].push(entry);
        } else {
          projects[year] = [entry];
        }
      }
    }

    populate(projects);

  });

function populate(projects) {
  const years = Object.keys(projects);
  years.sort((a, b) => b - a);

  for (let year of years) {
    projects[year].sort((a, b) => {
      const monthA = parseInt(a["Month"].split(" ")[0]);
      const monthB = parseInt(b["Month"].split(" ")[0]);
      return monthB - monthA;
    });

    const yearContainer = yearTemp.cloneNode(true);
    yearContainer.querySelector(".year--heading").innerText = year;
    document.querySelector("main").appendChild(yearContainer);

    projects[year].forEach(project => {
      const projectItem = projectTemp.cloneNode(true);
      yearContainer.querySelector(".project-list").appendChild(projectItem);

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
        if (link.includes("twitter.com")) {
          a.innerText = "Twitter";
        } else if (link.includes("github.com")) {
          a.innerText = "GitHub";
        } else if (link.includes("youtu.be") || link.includes("youtube.com")) {
          a.innerText = "YouTube";
        } else if (link.includes("instagram.com")) {
          a.innerText = "Instagram";
        } else if (link.includes("vimeo.com")) {
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

      // category
      projectItem.querySelector(".project--category dd").innerText = project["Context"];
      
      // status
      projectItem.querySelector(".project--status dd").innerText = project["Status"];
      projectItem.classList.add(`status--${project["Status"].toLowerCase().replace(/ /g, "-")}`);

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

      // size
      const size = project["Size"];
      if (size) {
        const [sizeNumber, sizeUnit] = project["Size"].split(" ");
        const byteSize = parseFloat(sizeNumber) * BYTE_SIZES[sizeUnit];
        const relativeSize = (byteSize - minBytes) / (maxBytes - minBytes);
        const color = LIGHTEST_COLOR + relativeSize * (DARKEST_COLOR - LIGHTEST_COLOR);
        projectItem.querySelector(".size--number").innerText = sizeNumber;
        projectItem.querySelector(".size--unit").innerText = sizeUnit;
        projectItem.querySelector(".project--size dd").style.color = `rgb(${color}, ${color}, ${color})`;
      }

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
    })
  }
}

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