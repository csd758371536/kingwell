 function Calendar(options) {
 	var ops = options || {};
 	return;
 	this.yearWrap = kingwell.create('div');
 	this.monthWrap = kingwell.create('div', {
 		'className': 5
 	});
 	this.dateWrap = kingwell.create('div');
 	this.init();
 }
 Calendar.prototype = {
 	init: function() {
 		this.create();
 		this.render();
 	},
 	events: function() {

 	},
 	create: function() {
 		kingwell.append(this.yearWrap);
 		kingwell.append(this.monthWrap);
 		kingwell.append(this.dateWrap);
 	},
 	render: function() {
 		function renderYear() {};

 		function renderMonth() {
 			var monthResult = [];
 			var b = 2;
 			monthResult.push('<table>');
 			for (var i = 1; i <= 12; i++) {

 				if (i % b !== 0) {
 					monthResult.push('<tr>');
 				}
 				monthResult.push('<td>' + i + '月</td>');
 				if (i % b == 0) {
 					monthResult.push('</tr>');
 				}
 			}
 			monthResult.push('</table>');
 			return monthResult.join('');
 		};

 		function renderDate() {
 			var dateResult = [];
 			dateResult.push('<table>');
 			dateResult.push();
 			dateResult.push('</table>');
 			return dateResult.join('');
 		};
 		this.monthWrap.innerHTML = renderMonth();
 		this.dateWrap.innerHTML = renderDate();
 	}
 };
 new Calendar();

 storage.set('name','kingwell');
 storage.get('name');
 storage.remove('name');