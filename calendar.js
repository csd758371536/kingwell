(function(window, undefined) {
	var fn;

	function CalendarDefault() {}
	CalendarDefault.prototype = {
		weekStart: 0,
		error: function() {},
		callback: function() {},
		selected: function() {},
		top: 5,
		left: 0,
		minDate: '',
		maxDate: '',
		readOnly: true,
		showAllDate: false, //显示所有日期，包括上月，下月的日期
		showWeek: false,
		weekText: ['日', '一', '二', '三', '四', '五', '六'],
		headerUnit: ['年', '月', '日'],
		monthUnit: ['月'],
	};

	function Calendar(options) {
		var ops = options || {};
		this.el = ops.el;
		for (var key in options) {
			this[key] = options[key];
		}
		this.maxDate = this.compatibleDateFormat(this.maxDate);
		this.minDate = this.compatibleDateFormat(this.minDate);

		this.DATE = this.getDate(); /*new Date('2016-03-25');*/ //
		this.Y = this.DATE.getFullYear();
		this.M = this.DATE.getMonth();
		this.D = this.DATE.getDate();
		this.init();
	}
	Calendar.prototype = fn = {
		name: 'calendar',
		setValue: function() {
			var _this = this;
			_this.defaultValue = _this.el.value;
			if (_this.readOnly) {
				_this.el.readOnly = true;
			}
		},
		setPostion: function() {
			var _this = this,
				pos = _this.getPosition(_this.el);
			_this.setCss(_this.box, {
				top: pos.top + pos.height + _this.top + 'px',
				left: pos.left + _this.left + 'px'
			});
		},
		init: function() {
			this.dateError = this.getDateStatus();
			this.yearNum = 0;
			this.create();
			this.events();
			this.setPostion();
			this.setValue();
			if (!this.dateError) {
				this.error.call(this, '最小日期不能大于最大日期');
			}

		},
		getDateStatus: function() { //判断最小日期是否大于最大日历
			var status = true;
			if (this.minDate && this.maxDate) {
				if (this.getDates(this.minDate, this.maxDate) < 0) {
					status = false;
				}
			}
			return status;
		},
		select: function() {
			var _this = this,
				date = this.getNewDate(this.Y, this.M, this.D);
			try {

				if (_this.isElement(_this.el)) {
					_this.el.value = _this.getCurrentDate(date);
				}
			} catch (e) {}
		},
		events: function() {
			var _this = this;

			_this.el.onfocus = function() {
				//_this.create();
			};
			_this.yearPrev.onclick = function() {
				_this.yearNum -= 10;
				_this.updateYear({
					year: _this.yearNum
				});
			};
			_this.yearNext.onclick = function() {
				_this.yearNum += 10;
				_this.updateYear({
					year: _this.yearNum
				});
			};
		},
		__createYear: function() {
			var _this = this;
			_this.box = _this.createElement('div', {
				className: _this.name + '-box'
			});
			//年份
			var yearTableElement = [{
				yearHeader: ['div', {
					className: _this.name + '-year-header'
				}]
			}, {
				yearBox: ['div', {
					className: _this.name + '-year-box'
				}]
			}, {
				yearTableBox: ['div', {
					className: _this.name + '-year-table-box'
				}]
			}, {
				yearTable: ['table', {
					className: _this.name + '-year-table'
				}]
			}, {
				yearThead: ['thead', {
					className: _this.name + '-year-thead'
				}]
			}, {
				yearTbody: ['tbody', {
					className: _this.name + '-year-body'
				}]
			}, {
				yearPage: ['div', {
					className: _this.name + '-year-page'
				}]
			}, {
				yearPrev: ['div', {
					className: _this.name + '-year-prev'
				}]
			}, {
				yearNext: ['div', {
					className: _this.name + '-year-next'
				}]
			}];
			_this.createElements(_this, yearTableElement);
			_this.append(_this.yearThead, _this.yearTable);
			_this.append(_this.yearTbody, _this.yearTable);
			_this.updateYear();
			_this.append(_this.yearHeader, _this.yearBox);
			_this.append(_this.yearTable, _this.yearTableBox);
			_this.append(_this.yearTableBox, _this.yearBox);
			_this.yearPrev.innerHTML = '<span>＜</span>';
			_this.yearNext.innerHTML = '<span>＞</span>';
			_this.append(_this.yearPrev, _this.yearPage);
			_this.append(_this.yearNext, _this.yearPage);
			_this.append(_this.yearPage, _this.yearBox);
			_this.append(_this.yearBox, _this.box);
		},
		__createMonth: function() {
			var _this = this;
			//月份
			var monthTableElements = [{
				monthBox: ['div', {
					className: _this.name + '-month-box'
				}]
			}, {
				monthHeader: ['div', {
					className: _this.name + '-month-header'
				}]
			}, {
				monthTableBox: ['div', {
					className: _this.name + '-month-table-box'
				}]
			}, {
				monthTable: ['table', {
					className: _this.name
				}]
			}, {
				monthThead: ['thead', {
					className: _this.name
				}]
			}, {
				monthTbody: ['tbody', {
					className: _this.name
				}]
			}, {
				monthTfoot: ['tfoot', {
					className: _this.name
				}]
			}];
			_this.createElements(_this, monthTableElements);
			_this.append(_this.monthThead, _this.monthTable);
			_this.append(_this.monthTfoot, _this.monthTable);
			_this.append(_this.monthTbody, _this.monthTable);
			_this.updateMonth();
			_this.append(_this.monthHeader, _this.monthBox);
			_this.append(_this.monthTable, _this.monthTableBox);
			_this.append(_this.monthTableBox, _this.monthBox);
			_this.append(_this.monthBox, _this.box);
		},
		__createDate: function() {
			var _this = this;
			//天数
			var dateTableElments = [{
				dateBox: ['div', {
					className: _this.name + '-date-box'
				}]
			}, {
				dateHeader: ['div', {
					className: _this.name + '-date-header'
				}]
			}, {
				dateTableBox: ['div', {
					className: _this.name + '-date-table-box'
				}]
			}, {
				dateTable: ['table', {
					className: _this.name
				}]
			}, {
				dateThead: ['thead', {
					className: _this.name
				}]
			}, {
				dateTbody: ['tbody', {
					className: _this.name
				}]
			}, {
				dateTfoot: ['tfoot', {
					className: _this.name
				}]
			}];
			_this.createElements(_this, dateTableElments);
			_this.append(_this.dateThead, _this.dateTable);
			_this.append(_this.dateTfoot, _this.dateTable);
			_this.append(_this.dateTbody, _this.dateTable);
			_this.append(_this.dateHeader, _this.dateBox);
			_this.updateDate();

			_this.append(_this.dateTable, _this.dateTableBox);
			_this.append(_this.dateTableBox, _this.dateBox);

			_this.append(_this.dateBox, _this.box);
			_this.append(_this.box);
		},
		create: function() {
			this.__createYear();
			this.__createMonth();
			this.__createDate();
		},
		createElements: function(context, attr) {
			var _this = this,
				attrs = attr || [];
			for (var e = 0; e < attrs.length; e++) {
				for (var key in attrs[e]) {
					context[key] = _this.createElement(attrs[e][key][0], attrs[e][key][1]);
				}
			}
			return context;
		},
		getEnableStatus: function(value, type) { //获取日期范围
			var _this = this,
				status = true,
				minStatus, maxStatus,
				date,
				minDate = new Date(_this.minDate),
				maxDate = new Date(_this.maxDate);
			switch (type) {
				case 'year':
					minStatus = value < minDate.getFullYear();
					maxStatus = value > maxDate.getFullYear();
					break;
				case 'month':
					date = new Date();
					date.setYear(_this.Y);
					date.setMonth(value);
					if (_this.minDate) {
						date.setDate(_this.getMaxDates(_this.Y, value));
						minStatus = _this.getDates(_this.minDate, _this.getCurrentDate(date)) < 0;
					}
					if (_this.maxDate) {
						date.setDate(1);
						maxStatus = _this.getDates(_this.maxDate, _this.getCurrentDate(date)) > 0;
					}
					break;
				case 'date':
					minStatus = _this.getDates(_this.getCurrentDate(value), _this.maxDate) < 0;
					maxStatus = _this.getDates(_this.getCurrentDate(value), _this.minDate) > 0;
					break;
			}
			//最小日期
			if (_this.minDate) {
				if (minStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			//最大日期
			if (_this.maxDate) {
				if (maxStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			//两个都存在
			if (_this.minDate && _this.maxDate) {
				if (minStatus || maxStatus) {
					status = false;
				} else {
					status = true;
				}
			}
			if (status) {
				status = _this.getDateStatus();
			}
			return status;
		},
		getNewDate: function(year, month, date) {
			var _date = new Date();
			_date.setYear(year);
			_date.setMonth(month);
			_date.setDate(date);
			return _date;
		},
		updateYear: function(options) {
			var _this = this,
				ops = options || {},
				dateObj = ops.date || _this.DATE,
				year = ops.year || 0,
				grid = ops.grid || 2,
				_year = dateObj.getFullYear() + year,
				fra = document.createDocumentFragment(),
				theadTr, th,
				tbodyTr, td, i = 0;
			_this.empty(_this.yearTbody);
			_this.yearHeader.innerHTML = _this.Y + _this.headerUnit[0];
			console.log(_this.Y);
			for (var y = _year - 5; y < _year + 5; y++) {
				var status = true;
				if (i % grid === 0) {
					tbodyTr = _this.createElement('tr');
				}
				td = _this.createElement('td');
				td.innerHTML = y;
				if (y === _this.Y) {
					_this.addClass(td, _this.name + '-this-year');
				}
				status = _this.getEnableStatus(y, 'year');
				if (status) {
					(function(year) {
						td.onclick = function() {
							_this.Y = year;
							_this.updateYear({
								year: _this.yearNum
							});
							_this.updateMonth();
							_this.updateDate();
						};
					})(y);
					_this.addClass(td, _this.name + '-enabled');
				} else {
					_this.addClass(td, _this.name + '-disabled');
				}
				_this.append(td, tbodyTr);
				_this.append(tbodyTr, fra);
				i++;
			}
			_this.append(fra, _this.yearTbody);
		},
		updateMonth: function(options) {
			var _this = this,
				ops = options || {},
				month = ops.month,
				frg = document.createDocumentFragment(),
				tBodyTr, th, i = 0;
			_this.monthHeader.innerHTML = _this.M + 1 + _this.headerUnit[1];
			_this.empty(_this.monthTbody);
			for (var m = 0; m < 12; m++) {
				var status = true;
				td = _this.createElement('td');
				td.innerHTML = m + 1 + _this.monthUnit[0];
				if (i % 2 === 0) {
					tBodyTr = _this.createElement('tr');
				}
				i++;
				if (m === _this.M) {
					_this.addClass(td, _this.name + '-this-month');
				}
				status = _this.getEnableStatus(m, 'month');

				if (status) {
					(function(month) {

						td.onclick = function() {
							_this.M = month;
							_this.updateMonth();
							var date = new Date();
							date.setYear(_this.Y);
							date.setMonth(_this.M);
							_this.updateDate({
								date: date
							});
						};
					})(m);
				}
				if (!status) {
					_this.addClass(td, _this.name + '-disabled');
				} else {
					_this.addClass(td, _this.name + '-enabled');
				}
				_this.append(td, tBodyTr);
				_this.append(tBodyTr, frg);
			}
			_this.append(frg, _this.monthTbody);
		},

		updateDate: function(options) {
			var _this = this,
				ops = options || {},
				dateObj = ops.date || _this.DATE,
				_year, _month, _date,
				days, firstDay,
				nowMonthDate, prevMonthDate, nextMonthDate = 1,
				currentDate,
				dateObj, frg = document.createDocumentFragment();

			_year = _this.Y || dateObj.getFullYear();
			_month = _this.M || dateObj.getMonth();
			_date = _this.D || dateObj.getDate();
			days = _this.getMaxDates(_year, _month);

			firstDay = new Date(_year, _month, 1).getDay(), showMonth = _month + 1;
			_this.dateHeader.innerHTML = _this.D + _this.headerUnit[2];
			//Clear Table
			if (_this.showWeek) {
				_this.empty(_this.dateThead);
			}

			_this.empty(_this.dateTbody);

			for (var i = 0; i < 6; i++) {
				var tr = _this.createElement('tr');
				//this.dateTbody.insertRow(i);
				for (var j = 0; j < 7; j++) {
					var th,
						//td = this.dateTbody.rows[i].insertCell(j),
						td = _this.createElement('td'),
						num = i * 7 + j,
						status = true,
						current, month = 0,
						showAllDate = true;

					nowMonthDate = num - firstDay + 1;
					prevMonthDate = Math.abs(firstDay - j - _this.getMaxDates(_year, _month - 1) - 1);
					if (_this.showWeek) {
						//插件头部-星期
						if (!i && !j) {
							this.dateThead.insertRow(i);
						}
						if (!i) {
							th = this.dateThead.rows[i].insertCell(j);
							th.innerHTML = _this.weekText[j];
							//设置样式
							if (j === 5 || j === 6) { //周末
								_this.addClass(th, _this.name + '-weekend');
							}
						}
					}

					//设置文本内容
					if (num < firstDay) { //上个月
						current = prevMonthDate;
						month = -1;
						currentDate = _this.getNewDate(_year, _month - 1, prevMonthDate);
						showAllDate = _this.showAllDate;
						if (showAllDate) {
							td.innerHTML = prevMonthDate;
						}
					} else if (num >= days + firstDay) { //下个月
						current = nextMonthDate;
						currentDate = _this.getNewDate(_year, _month, nowMonthDate);
						showAllDate = _this.showAllDate;
						if (showAllDate) {
							td.innerHTML = nextMonthDate;
						}
						nextMonthDate++;
					} else { //本月
						td.innerHTML = nowMonthDate;
						current = nowMonthDate;
						month = 1;
						currentDate = _this.getNewDate(_year, _month, nowMonthDate);
					}
					status = _this.getEnableStatus(currentDate, 'date');

					if (status) {
						(function(date, month, currentDate, showAllDate) {
							td.title = _this.getCurrentDate(currentDate);
							if (!showAllDate) {
								return;
							}
							td.onclick = function() {
								var result;
								result = _this.getDateAll(currentDate);
								_this.Y = result.year;
								_this.M = result.month;
								_this.D = result.date;
								_this.updateYear({
									year: _this.yearNum
								});
								_this.updateMonth({
									date: currentDate
								});
								_this.updateDate({
									date: currentDate
								});
								_this.select();
							};
						})(current, month, currentDate, showAllDate);
					}

					//设置样式
					if (j === 0 || j === 6) { //周末
						_this.addClass(td, _this.name + '-weekend');
					}
					if (nowMonthDate === _date) {
						_this.addClass(td, _this.name + '-today');
					}
					if (num < firstDay || num >= days + firstDay) {
						_this.addClass(td, _this.name + '-non-current');
					} else {
						_this.addClass(td, _this.name + '-current');
					}
					if (!status) {
						_this.addClass(td, _this.name + '-disabled');
					} else {
						if (showAllDate) {
							_this.addClass(td, _this.name + '-enabled');
						}

					}
					_this.append(td, tr);
				}
				_this.append(tr, frg);
			}
			_this.append(frg, _this.dateTbody);
		}
	};

	KW.extend(fn, new KW.Type);
	KW.extend(fn, new KW.Dom);
	KW.extend(fn, new KW.Css);
	KW.extend(fn, new KW.Date);
	KW.extend(fn, new KW.Event);
	KW.extend(fn, new KW.Box);
	KW.extend(fn, new KW.Kingwell);
	KW.extend(fn, new CalendarDefault);

	window.Calendar = Calendar;

})(this);

var c1 = new Calendar({
	el: document.getElementById('calendar1'),
	minDate: '2001-02-01',
	maxDate: '2001-02-02',
	left: 0,
	top: 10,
	showAllDate: false,
	readOnly: true,
	error: function(err) {
		console.error(err);
	}
});
var c2 = new Calendar({
	el: document.getElementById('calendar2'),
	minDate: '2015-02-02',
	maxDate: '2019-01-01',
	left: 0,
	top: 10,
	showAllDate: false,
	readOnly: true,
	error: function(err) {
		console.error(err);
	}
});