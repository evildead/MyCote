*MyCote* is a small Node.js microservices test project which features [Cote.js](http://cote.js.org).

It is built in _Node.js_, _Espress_, _MongoDB_, _Cote.js_.

NPM commands available:
* `$ npm start` -> start the REST API server
* `$ npm run contactsaver` -> start the service in charge of saving the contacts submitted in HTTP request, to MongoDB
* `$ npm run emailer` -> start the service in charge of sending the email to the contacts submitted in HTTP request
* `$ npm run monitor` -> Monitor is the “top” of cote. It lists all the daemons it discovers regardless of namespace or key; navigate to http://localhost:5555 in your browser to see your cote network graph in action

_Cote_ is built to be zero-configuration, and relies on IP broadcast/multicast to work.
If in the configuration file a redis host is configured (default value is 127.0.0.1), _Redis_ will be used as the central discovery tool.

Have a look at the author's portfolio [Danilo Carrabino](http://myportfolio.danilocarrabino.net/portfolios/danilo.carrabino)
