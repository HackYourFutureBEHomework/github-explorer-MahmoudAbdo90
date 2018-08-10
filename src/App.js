'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, {class: 'header'});
    const headerDiv = Util.createAndAppend('div', header, {class: 'header-div', html: 'HYF Repositories'});
    const select = Util.createAndAppend('select', headerDiv, {class: 'select'});
    select.addEventListener('change', () => this.fetchContributorsAndRender(select.value)),
    Util.createAndAppend('div', root, {class: 'container'})

    try {
      // ...
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      this.repos.forEach((url, repos) => {
        Util.createAndAppend('option', select, {class: 'option', html: url.name(), value: repos});
    //});
      //this.repos.forEach((res) => {
        //til.createAndAppend('option', select, {class: 'option', html: url.name()});
      });

      


    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();
      const container = document.querySelector('.container');
      // Erase previously generated inner HTML from the container div
      container.innerHTML = '';

      const leftDiv = Util.createAndAppend('div', container, {class: 'left-box'});
      const rightDiv = Util.createAndAppend('div', container, {class: 'right-box'});

      const contributorList = Util.createAndAppend('ul', rightDiv, {class: 'cont-list'});

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    Util.createAndAppend('div', root, {class: 'error', html: 'There is an error'});

  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
