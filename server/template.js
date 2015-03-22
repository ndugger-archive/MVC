'use strict';

let fs = require('fs');

class Template {
	
	static get patterns() {
		return {
			layout: '@\{layout ([a-zA-Z0-9/]*)\}',
			render: '@\{render ([a-zA-Z0-9]*)\}',
			each: '@\{each ([a-zA-Z0-9.>-]*)\}([^]*?)@\{\/each}',
			single: '@\{([a-zA-Z0-9.]*?)\}'
		}
	}
	
	static construct(view, data) {
		let layout;
		if (layout = view.match(new RegExp(this.patterns.layout))) {
			view = this.layout(view, layout).replace(layout[0], '');
		}
		
		let each;
		if (each = view.match(new RegExp(this.patterns.each, 'g'))) {
			for (let loop of each) {
				view = view.replace(loop, this.each(loop, data));
			}
		}
		
		let single;
		if (single = view.match(new RegExp(this.patterns.single, 'g'))) {
			for (let name of single) {
				view = view.replace(name, this.single(name, data));
			}
		}
		
		return view;
	}
	
	static layout(view, layout) {
		layout = fs.readFileSync('views/' + layout[1] + '.html', {encoding: 'utf8'});
		let render;
		if (render = layout.match(new RegExp(this.patterns.render, 'g'))) {
			for (let section of render) {
				section = section.match(new RegExp(this.patterns.render));
				if (section[1] === 'body') {
					layout = layout.replace(section[0], view.replace(new RegExp(this.patterns.layout), ''));
					return layout;
				}
			}
		}
		return layout;
	}
	
	static each(loop, data) {
		loop = loop.match(new RegExp(this.patterns.each));
		
		let html = '',
			alias = loop[1].split('->'),
			content = loop[2];
		
		let single;
		if (single = content.match(new RegExp(this.patterns.single, 'g'))) {
			for (let item of data[alias[0]]) {
				let iData = {},
					iteration = content;
				iData[alias[1]] = item;
				for (let name of single) {
					iteration = iteration.replace(name, this.single(name, iData));
				}
				html += iteration;
			}
		}
		
		return html;
	}
	
	static single(name, data) {
		name = name.match(new RegExp(this.patterns.single));
		
		let key = name[1];
		if (key.includes('.')) {
			let obj = key.split('.'),
				realKey = data;
			for (let prop of obj) {
				if (prop in realKey) {
					realKey = realKey[prop];
				} else {
					realKey = undefined;
					break;
				}
			}
			key = realKey;
		} else {
			key = data[key];
		}
		
		return key;
	}
	
}

module.exports = Template;