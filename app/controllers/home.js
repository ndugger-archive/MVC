'use strict';

let Controller = require('../../server/controller');

class Home extends Controller {
	
	static index() {
		
	}
	
	static foo(request, response) {
		let stuff = request.parameters;
		this.view('foo', {
			title: 'Test Templating',
			foo: {
				bar: 'Read this text!',
				baz: {
					hoo: 'yes, this is placeholder text.'
				}
			},
			a: 3,
			people: [
				{
					name: 'Nick Dugger',
					age: 22
				},
				{
					name: 'Joe Schmo',
					age: 18
				},
				{
					name: stuff.foo + ' ' + stuff.bar,
					age: 99
				}
			]
		}, response);
	}
	
}

module.exports = Home;