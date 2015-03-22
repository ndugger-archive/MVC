'use strict';

let fs = require('fs'),
	url = require('url'),
	http = require('http');

let Router = require('./router');

class Server {
	
	static run() {
		this.getSettings().then(this.getRoutes).then(this.startServer);
	}
	
	// look for settings.json in 'root' dir:
	static getSettings() {
		return new Promise(function(resolve) {
			fs.readFile('settings.json', {encoding: 'utf8'}, function(error, settings) {
				if (error) {
					resolve({
						port: 80
					});
				} else {
					resolve(JSON.parse(settings));
				}
			});
		});
	}
	
	// look for routes.json in 'app/' dir:
	static getRoutes(settings) {
		return new Promise(function(resolve, reject) {
			fs.readFile('app/routes.json', {encoding: 'utf8'}, function(error, routes) {
				if (error) {
					reject('Missing or inaccessable "app/routes.json" file');
				} else {
					settings.routes = JSON.parse(routes.toLowerCase());
				}
				resolve(settings);
			});
		});
	}
	
	// create server and listen for requests:
	static startServer(settings) {
		http.createServer(function(request, response) {
			let path = url.parse(request.url).pathname;
			if (path === '/favicon.ico') {
				
			} else if (path.match(/\/?public\//)) {
				Server.serveFile(path, response);
			} else {
				let found = Router.find(path.toLowerCase(), settings.routes),
					route = settings.routes[found.path],
					controller = require('../app/controllers/' + route.controller);
				if ('data' in found) { // path contains variables
					request.parameters = found.data;
				}
				if (route.action in controller) { // action exists in controller
					controller[route.action](request, response);
				}
			}
			
			request.on('data', function(data) {
				
			});
		}).listen(settings.port || 80);
	}
	
	static serveFile(path, response) {
		let ext = path.split('.').pop();
		fs.readFile('public/' + path.replace(/\/?(.*?)\//, ''), {encoding: 'utf8'}, function(error, file) {
			if (error) {
				response.writeHead(404);
			} else {
				let type = Server.contentTypes[ext] || 'text/plain';
				response.writeHead(200, { "Content-Type": type });
				response.write(file);
			}
			response.end();
		});
	}
	
	static get contentTypes() {
		return {
			png: 'image/png',
			jpg: 'image/jpeg',
			gif: 'image/gif',
			css: 'text/css',
			js: 'text/javascript',
			json: 'application/json'
		}
	}
	
}

module.exports = Server;