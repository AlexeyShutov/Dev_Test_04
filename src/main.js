import Cycle from '@cycle/core';
import {button, h4, hr, a, div, label, input, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function main(sources) {
  const USERS_URL = 'http://jsonplaceholder.typicode.com/users/';
  const getAllUsers$ = sources.DOM.select('.get-all').events('click')
    .map(() => {
      return {
        url: USERS_URL,
        method: 'GET'
      };
    });

  const users$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    .startWith([]);

  const inputEvent$ = sources.DOM.select('.field').events('input');
  const search$ = inputEvent$.map(ev => ev.target.value).startWith('');
	
  const vtree$ = users$.map(users => {
    return div('.users', [
	  label('Search user name: '),
      input('.field', {type: 'text'}),
      button('.search', 'Search'),
      button('.get-all', 'Get all users'),
	  hr(),
      ...users.map(user => 
        div('.user-details', [
          h4('.user-name', user.name),
		  h4('.user-username', user.username),
          h4('.user-email', user.email),
          a('.user-website', {href: user.website}, user.website)
        ])
      )
    ]);
  });

  return {
    DOM: vtree$,
    HTTP: getAllUsers$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app-main'),
  HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);
