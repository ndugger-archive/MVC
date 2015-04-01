'use strict';

let fs = require('fs');

class Template {

	static get tag() {
		return {
			open: '\@\{',
			close: '\}'
		}
	}

	static get patterns() {
		return {
			layout: this.tag.open + 'layout ([a-zA-Z0-9/]*)' + this.tag.close,
			render: this.tag.open + 'render ([a-zA-Z0-9]*)' + this.tag.close,
			partial: this.tag.open + 'include ([a-zA-Z0-9.\/]*)' + this.tag.close,
			section: this.tag.open + 'section ([a-zA-Z0-9]*?)' + this.tag.close + '([^]*?)' + this.tag.open + '\/section' + this.tag.close,
			logic: this.tag.open + 'if ([a-zA-Z0-9. <!=+>-]*)' + this.tag.close + '([^]*?)' + this.tag.open + '\/if' + this.tag.close,
			each: this.tag.open + 'each ([a-zA-Z0-9.>-]*)' + this.tag.close + '([^]*?)' + this.tag.open + '\/each'  + this.tag.close,
			single: this.tag.open + '([a-zA-Z0-9.]*?)' + this.tag.close
		}
	}

	static construct(view, data) {
		let layout;
		if (layout = view.match(new RegExp(this.patterns.layout))) {
			view = this.layout(view, layout).replace(layout[0], '');
		}
		
		let partial;
		if (partial = view.match(new RegExp(this.patterns.partial, 'g'))) {
			for (let include of partial) {
				view = view.replace(include, this.partial(include));
			}
		}

		let logic;
		if (logic = view.match(new RegExp(this.patterns.logic, 'g'))) {
			for (let condition of logic) {
				view = view.replace(condition, this.logic(condition, data));
			}
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
				if (section === this.tag.open + 'render body' + this.tag.close) {
					layout = layout.replace(section, view.replace(new RegExp(this.patterns.layout), ''));
				} else {
					//layout = layout.replace(section, this.section(section, view))
				}
			}
		}
		return layout;
	}
	
	static partial(partial) {
		partial = partial.match(new RegExp(this.patterns.partial));
		return fs.readFileSync('views/' + partial[1] + '.html', {encoding: 'utf8'});
	}

	static logic(logic, data) {
		logic = logic.match(new RegExp(this.patterns.logic)); 

		let variable = logic[1].match(new RegExp('[a-zA-Z0-9.]*(?= ?!?[<=+>-])'));
		let statement = logic[1].replace(variable, this.single(this.tag.open + variable + this.tag.close, data));

		if (eval(statement)) {
			return logic[2].replace(new RegExp(this.tag.open + 'else' + this.tag.close + '([^]*)'), '')
		} else if (logic[2].match(new RegExp(this.tag.open + 'else' + this.tag.close))) {
			return logic[2].replace(new RegExp('([^]*)' + this.tag.open + 'else' + this.tag.close), '');
		} else {
			return '';
		}
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