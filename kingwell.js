(function(window, undefied) {
	'use strict';
	var doc = document,
		doe = doc.documentElement,
		kingwell,
		userAgent = navigator.userAgent.toLowerCase(),
		isIE = /msie/.test(userAgent),
		deepCopy = function(source) {
			var result = {};
			for (var key in source) {
				result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key];
			}
			return result;
		},
		extend = function(sub, parent, deep) {
			var subObj = sub || {};
			var parentObj = parent || {};
			parentObj = deepCopy(parentObj);
			for (var key in parentObj) {
				subObj[key] = parentObj[key];
			}
			return subObj;
		};
	//判断是否某种类型
	function IsType() {}
	IsType.prototype = {
		is: function(o, type) {
			var obj = Object.prototype.toString.call(o);
			if (arguments.length === 2) {
				return obj === '[object ' + type + ']';
			} else {
				return obj.slice(7, -1).toLowerCase();
			}
		},
		isArray: function(o) {
			return this.is(o, 'Array');
		},
		isObject: function(o) {
			return this.is(o, 'Object');
		},
		isFunction: function(o) {
			return this.is(o, 'Function');
		},
		isNumber: function(o) {
			return this.is(o, 'Number');
		},
		isString: function(o) {
			return this.is(o, 'String');
		},
		isElement: function(o) {
			return (o && o.nodeName) ? true : false;
		},
		isForm: function(obj) {
			var o = this.Dom.getId(obj);
			return this.isElement(o) && (o.tagName.toLowerCase() === 'input' || o.tagName.toLowerCase() === 'textarea');
		}
	};
	//Dom Edit
	function Dom() {}
	Dom.prototype = {
		getId: function(id) {
			return this.isString(id) ? doc.getElementById(id) : id;
		},
		swapNode: function(node1, node2) {
			var n1 = this.getId(node1),
				n2 = this.getId(node2),
				next, parent;
			if (this.isElement(n1) && this.isElement(n2)) {
				if (doc.swapNode) {
					n1.swapNode(n2);
				} else {
					next = n1.nextSibling;
					parent = n1.parentNode;
					n2.parentNode.replaceChild(n1, n2);
					parent.insertBefore(n2, next);
				}
				return true;
			}
		},
		create: function(elem, obj) {
			var element = doc.createElement(elem);
			for (var pro in obj) {
				if (pro === 'class' || pro === 'className') {
					element.className = obj[pro];
				} else {
					element.setAttribute(pro, obj[pro]);
				}
			}
			return element;
		},
		html: function(node, html) {
			var elem = this.getId(node);
			if (!this.isElement(elem)) {
				return '';
			}
			if (arguments.length > 1) {
				elem.innerHTML = html;
			} else {
				return elem.innerHTML;
			}
			return elem;
		},
		text: function(node, text) {
			if (!this.isElement(node)) {
				return;
			}
			if (arguments.length > 1) {
				if (!isIE) {
					node.textContent = text;
				} else {
					node.innerText = text;
				}
			} else {
				if (!isIE) {
					return node.textContent;
				} else {
					return node.innerText;
				}
			}
			return node;
		},
		val: function(elem, value) {
			if (this.isForm(elem)) {
				if (arguments.length === 2) {
					elem.value = value;
				} else {
					return elem.value;
				}
			} else {
				return null;
			}
		},
		append: function(child, parent) {
			var sonElem = this.isString(child) ? this.getId(child) : child,
				par = this.isString(parent) ? this.getId(parent) : parent;
			if (!this.isElement(par)) {
				par = doc.body;
			}
			if (!this.isElement(sonElem) || !this.isElement(par)) {
				return;
			}
			par.appendChild(sonElem);
		},
		insertBefore: function(newNode, oldNode) {
			if (this.isElement(newNode) && this.isElement(oldNode) && oldNode.parentNode) {
				oldNode.parentNode.insertBefore(newNode, oldNode);
			}
		},
		insertAfter: function() {},
		nextNode: function(node) {
			var nextNode;
			node = this.isString(node) ? this.getId(node) : node;
			if (!this.isElement(node)) {
				return null;
			}
			nextNode = node.nextSibling;
			if (!nextNode) {
				return null;
			}
			while (true) {
				if (nextNode.nodeType === 1) {
					break;
				} else {
					if (nextNode.nextSibling) {
						nextNode = nextNode.nextSibling;
					} else {
						break;
					}
				}
			}
			return nextNode.nodeType === 1 ? nextNode : null;
		}
	};

	function Kingwell() {}
	Kingwell.prototype = {
		trim: function(str) { //Trim String
			var result = '',
				reg = /^\s*(.*?)\s*$/;
			if (this.isString(str)) {
				if (this.isFunction(result.tirm)) {
					result = str.trim();
				} else {
					result = str.replace(reg, '$1');
				}
			} else {
				result = str;
			}
			return result;
		},
		escape: function(str) {
			var result = "";
			if (str.length === 0) {
				return result;
			}
			result = str.replace(/&/g, "&amp;");
			result = resulteplace(/</g, "&lt;");
			result = resulteplace(/>/g, "&gt;");
			result = resulteplace(/ /g, "&nbsp;");
			result = resulteplace(/\'/g, "&#39;");
			result = resulteplace(/\"/g, "&quot;");
			return result;
		}
	};
	extend(Kingwell.prototype, new IsType);
	extend(Kingwell.prototype, new Dom);
	window.kingwell = new Kingwell();
	console.log(window.kingwell);
})(this);