
let REPOS = [];
let CONTRIBUTORS = [];
let SELECTED_REPO_INDEX = -1;

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === "html") {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

async function onSelectRepo(e) {
  const name = e.target.value;
  SELECTED_REPO_INDEX = REPOS.findIndex(repo => repo.name === name);
  const repo = REPOS[SELECTED_REPO_INDEX];
  // const repo = REPOS[e.target.selectedIndex];
  const res = await fetch(repo.contributors_url);
  const json = await res.json();
  CONTRIBUTORS = json;

  update();
}

function update() {
  const $container = document.querySelector("#container");
  
  const $select = document.querySelector('.select');
  $select.addEventListener("change", onSelectRepo);

  const $firstOption = createAndAppend("option", $select, {
    class: 'option',
    html: 'Click to select a repository'
  });

  for (const repo of REPOS) {
    const $option = createAndAppend("option", $select, {
      class: 'option',
      html: repo.name
    });
  }
  $select.selectedIndex = SELECTED_REPO_INDEX + 1;
  // Render repo details
  if (SELECTED_REPO_INDEX >= 0) {
    const repo = REPOS[SELECTED_REPO_INDEX];
    const repoUrl = `https://github.com/hackyourfuture/${repo.name}`;
    const $leftBox = document.querySelector('.left-box');

    const $repoName = createAndAppend("ul", $leftBox, {
      class: 'repo-name'
    });

    const $repoList = createAndAppend("li", $repoName, {
      class: 'repo-list'
    });

    const $repoLink = createAndAppend("a", $repoList, {
      html: `<strong>Repository URL:</strong> ${repo.name}`,
      href: repoUrl,
      target: "_blank",
      class: 'repo-link'
    });

    const $repoDescription = createAndAppend("p", $repoList, {
      class: 'ddescription'
    });

    if (repo.description !== null) {
      $repoDescription.innerHTML = `<strong>Description:</strong> ${repo.description}`;
    }
    const $forked = createAndAppend("p", $repoList, {
      class: 'forked',
      html: `<strong>Forked:</strong> ${repo.forks_count}`
    });

    const $updated = createAndAppend("p", $repoList, {
      class: 'updated',
      html: `<strong>Updated at:</strong> ${repo.updated_at.replace(/T.*Z/, "")}`
    });
    const $rightBox = document.querySelector('.right-box');
    // contributors Section
    const $contributorsDiv = createAndAppend("div", $rightBox, {
      class: 'contributor-div'
    });

    const $contributorsList = createAndAppend("ul", $contributorsDiv, {
      class: 'contributor-list',
      html: '<h5>Contributions</h5>'
    });

    for (const contributor of CONTRIBUTORS) {
      const $contributorItem = createAndAppend("li", $contributorsList, {
        class: 'contributor-item'
      });
      const $contributorAvatar = createAndAppend('img', $contributorItem, {
        class: 'contributor-avatar',
        src: contributor.avatar_url
      });

      const $contributorLink = createAndAppend('a', $contributorItem, {
        html: contributor.login,
        class: "contributor-login",
        href: contributor.html_url,
        target: "_blank"
      });

      const $contributions = createAndAppend('h5', $contributorItem, {
        class: 'contribution',
        html: contributor.contributions
      });
    }
  }
}

async function fetchRepos() {
  const res = await fetch(
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=100"
  );
  const json = await res.json();
  REPOS = json;
  // SELECTED_REPO_INDEX = 1;
  update();
}

fetchRepos();