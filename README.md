*MyCote* is a small Node.js microservices test project which features [Cote](http://cote.js.org).

It is built in _Node.js_, _Espress_, _MongoDB_, _Cote.js_.

NPM commands available:
1. `$ npm start` -> start the REST API server
2. `$ npm run contactsaver` -> start the service in charge of saving the contact passed in HTTP request, to MongoDB
3. `$ npm run emailer` -> start the service in charge of sending the email to the contact passed in HTTP request

_Cote_ is built to be zero-configuration, and relies on IP broadcast/multicast to work.
If in the configuration file a redis host is configured (defaults to 127.0.0.1), _Redis_ will be used as the central discovery tool.

Have a look at the author's portfolio [Danilo Carrabino](http://myportfolio.danilocarrabino.net/portfolios/danilo.carrabino)
