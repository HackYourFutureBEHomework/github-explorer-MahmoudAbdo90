
'use strict';

{

    function fetchJSON(url) {
        return new Promise(function(resolve, reject) {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.responseType = "json";
          xhr.onload = () => {
            if (xhr.status < 400) {
              resolve(xhr.response);
            } else {
              reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
            }
          };
          xhr.onerror = () => reject(new Error("Network request failed"));
          xhr.send();
        });
      }

    function createAndAppend(name, parent, options = {}) {
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach((key) => {
            const value = options[key];
            if (key === 'html') {
                elem.innerHTML = value;
            } else {
                elem.setAttribute(key, value);
            }
        });
        return elem;
    }

    function main(url) {
        const root = document.getElementById('root');
        fetchJSON(url)
        .then(data => {
            const header = createAndAppend('header', root, {class: 'header'});
            const headerDiv = createAndAppend('div', header, {class: 'header-div', html: 'HYF Repositories'});
        
        const select = createAndAppend('select', headerDiv, {class: 'select'});
        const option = createAndAppend('option', select, {class: 'option', html: 'Select Repository'});
        data.forEach(repo => {
            createAndAppend('option', select, {class: 'option', html: repo.name});
        });
        const container = createAndAppend('div', root, {class: 'container'});
        const leftBox = createAndAppend('div', container, {class: 'left-box'});
        const rightBox = createAndAppend('div', container, {class: 'right-box'});
        

        select.addEventListener('change', ()=> {
            const repo = data.find(r=> r.name === select.value);
            leftBox.innerHTML = "";
            rightBox.innerHTML = "";
            renderRepo(leftBox, repo);
            renderContributors(rightBox, repo);
        });
    })
    .catch(err => {
        const root = document.getElementById('root');
        createAndAppend('div', root, {class: 'error-here', html: 'There is an Error'});

    });
        
    }

    function renderRepo(parent, repo) {
        const details = createAndAppend('div', parent, {class: 'details'});
        const name = createAndAppend('h4', details, {html: 'Repository: '});
        createAndAppend('a', name, {class: 'name-url', html: `${repo.name}`, href: repo.html_url});
        if(repo.description !== null){
            const description  = createAndAppend('h4', details, {html: 'Description: '});
            createAndAppend('p', description, {html: `${repo.description }`});
        } 

        const forks = createAndAppend('h4', details, {html: 'Forks: '});
        createAndAppend('p', forks, {html: ` ${repo.forks_count}`});
        const updated = createAndAppend('h4', details, {html: 'Updated: '});
        createAndAppend('p', updated, {html: `${repo.updated_at}`});
    }


    function renderContributors(parent, repo) {
        const url = repo.contributors_url;
        fetchJSON(url)
        .then(contributors => {
            createAndAppend('h5', parent, {class: 'title',  html: 'Contributors'});
            const contributorList = createAndAppend('ul', parent, {class: 'cont-list'});
            contributors.forEach(contributor => {
                const contributorli = createAndAppend('li', contributorList, {class: 'cont-name'});
                createAndAppend('img', contributorli, {class: 'image', src: contributor.avatar_url});
                const contributeData = createAndAppend('div', contributorli, {class: 'contribute-data'});
                const contributorName = createAndAppend('a', contributeData, {class: 'contributor-name', html: `${contributor.login}`, href: contributor.html_url});
                const contributorbadge = createAndAppend('div', contributeData, {class: 'contributor-badge', html: `${contributor.contributions}`});
            });

        })
        .catch(err => {
            createAndAppend('div', parent, {html: err.message, class: 'alert-error'});
        });
        


    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}
