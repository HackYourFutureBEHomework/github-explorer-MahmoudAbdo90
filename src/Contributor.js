'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
        const contributorli = Util.createAndAppend('li', contributorList, {class: 'cont-name'});
        Util.createAndAppend('img', contributorli, {class: 'image', src: this.data.avatar_url});
        const contributeData = Util.createAndAppend('div', contributorli, {class: 'contribute-data'});
        Util.createAndAppend('a', contributeData, {class: 'contributor-name', html: `${this.data.login}`, href: this.data.html_url});
        Util.createAndAppend('div', contributeData, {class: 'contributor-badge', html: `${this.data.contributions}`});
    
  }
}


