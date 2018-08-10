'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    //
    // Replace this comment with your code
    //
    const details = Util.createAndAppend('div', parent, {class: 'details'});
    const name = Util.createAndAppend('h4', details, {html: 'Repository: '});
    Util.createAndAppend('a', name, {class: 'name-url', html: `${this.data.name}`, href: this.data.html_url});
    if(this.data.description !== null){
        const description  = Util.createAndAppend('h4', details, {html: 'Description: '});
        Util.createAndAppend('p', description, {html: `${this.data.description }`});
    } 

    const forks = Util.createAndAppend('h4', details, {html: 'Forks: '});
    Util.createAndAppend('p', forks, {html: ` ${this.data.forks_count}`});
    const updated = Util.createAndAppend('h4', details, {html: 'Updated: '});
    Util.createAndAppend('p', updated, {html: `${this.data.updated_at}`});
}
  

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}
