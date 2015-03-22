'use strict';

let Controller = require('../../server/controller');

class Home extends Controller {
	
	static index() {
		
	}
	
	static foo(request, response) {
		this.view('foo', {
			title: 'Test Templating',
			foo: {
				bar: 'Read this text!',
				baz: {
					hoo: 'yes, this is placeholder text.'
				}
			},
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
					name: 'Some Person',
					age: 99
				}
			]
		}, response);
	}
	
}

module.exports = Home;