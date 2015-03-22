'use strict';

class Router {
	
	static find(path, routes) {
		let pattern = new RegExp("\{(.*)\}"),
			splitPath = path.split('/');
		for (let route in routes) {
			let variables = {};
			if (route.match(pattern)) { // Route contains variables
				route = route.split('/');
				if (route.length === splitPath.length) { // Route is compatable with path
					for (let i = 0, count = route.length; i < count; i++) {
						if (route[i].match(pattern)) { // 'Directory' is a variable
							variables[route[i].match(pattern).pop()] = splitPath[i];
						} else if (route[i] === splitPath[i]) { // 'Directory' is same as path
							continue;
						} else { // No match, try new route
							break;
						}
					}
					if (Object.keys(variables).length) { // Found correct route
						return {
							path: route.join('/'),
							data: variables
						}
					}
				}
			}
		}
		return {
			path: path
		}
	}
	
}

module.exports = Router;