'use strict';

let fs = require('fs');

let Template = require('./template');

class Controller {
	
	static view(name, data, response) {
		let file = 'views/' + this.name.toLowerCase() + '/' + name + '.html';
		fs.readFile(file, {encoding: 'utf8'}, function(error, view) {
			if (error) {
				//reject('Missing or inaccessable "' + file + '" file');
				console.log(error);
				response.end();
			} else {
				view = Template.construct(view, data);
				response.writeHead(200, { "Content-Type": 'text/html' });
				response.write(view);
				response.end();
			}
		});
	}
	
}

module.exports = Controller;