function charSelect(t) {
	var v_code = $("#tradInfo .viewTxt .row.two .tradName span:eq(1)").text();
	candle(v_code, t.value);
}

var highcharts;
var interval;

function candle(markcode, minute) {
	if(highcharts != null) {
		highcharts.destroy();
		highcharts = null;
	}

	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});

	// create the chart
	highcharts = new Highcharts.StockChart({
		lang: {
			contextButtonTitle: "图表导出菜单",
			decimalPoint: ".",
			downloadJPEG: "下载JPEG图片",
			downloadPDF: "下载PDF文件",
			downloadPNG: "下载PNG文件",
			downloadSVG: "下载SVG文件",
			drillUpText: "返回 {series.name}",
			loading: "加载中",
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			noData: "没有数据",
			numericSymbols: ["千", "兆", "G", "T", "P", "E"],
			printChart: "打印图表",
			resetZoom: "恢复缩放",
			rangeSelectorZoom: "11",
			resetZoomTitle: "恢复图表",
			shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			thousandsSep: ",",
			weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
		},
		chart: {
			renderTo: "container_char",
			animation: Highcharts.svg, // don't animate in old IE
			plotBorderColor: '#3C94C4',
			plotBorderWidth: 0.2,
			backgroundColor: "#262626",
			height: $(window).height() - 360,
			width: $(window).width(),
			events: {
				load: function() {
					if(interval != null) {
						clearInterval(interval);
					}
					interval = setInterval(function() {
						var myDate = new Date()
						if(myDate.getSeconds() == 0) {
							$.getJSON(getContextPath() + '/app/service/stockApi/getManyMinuteMarket', {
								minute: minute,
								metcalSymbol: markcode
							}, function(data) {
								highcharts.series[0].setData([]);
								highcharts.series[0].setData(data);
								highcharts.redraw();
							});
						}
					}, 1000 * 10);
				}
			}
		},
		navigator: {
			enabled: false
		},
		scrollbar: {
			buttonTheme: {
				display: 'none' // 不显示按钮
			},
			barBorderWidth: 0,
			enabled: false,
			height: 1
		},
		plotOptions: {
			//修改蜡烛颜色
			candlestick: {
				color: '#33AA11',
				upColor: '#DD2200',
				lineColor: '#33AA11',
				upLineColor: '#DD2200',
				maker: {
					states: {
						hover: {
							enabled: false
						}
					}
				}
			},
			//去掉曲线和蜡烛上的hover事件
			series: {
				states: {
					hover: {
						enabled: false
					}
				},
				line: {
					marker: {
						enabled: false
					}
				}
			}
		}, //格式化悬浮框
		tooltip: {
			formatter: function() {
				var open = this.points[0].point.open;
				var high = this.points[0].point.high;
				var low = this.points[0].point.low;
				var close = this.points[0].point.close;
				var tip = '<b>' + Highcharts.dateFormat('%Y-%m-%d  %H:%M', this.x) + '</b><br/>';
				tip += '开盘：<span style="color: #DD2200;">' + open + ' </span>';
				tip += '最高：<span style="color: #DD2200;">' + high + ' </span><br/>';
				tip += '收盘：<span style="color: #DD2200;">' + close + ' </span>';
				tip += '最低：<span style="color: #DD2200;">' + low + ' </span><br/>';
				return tip;
			},
			crosshairs: {
				dashStyle: 'dash'
			},
			shadow: false
		},
		credits: { //水印
			enabled: false
		},
		title: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 70,
			lineColor: "#383739",
			gridLineColor: "#383739",
			gridLineWidth: 0.5
			// minRange: 3600 * 1000*24*30, // one month  
		},
		yAxis: [{
			title: {
				enable: false
			},
			labels: {
				align: 'left',
				x: 0,
				y: -2
			},
			lineColor: "#383739",
			gridLineColor: "#383739",
			gridLineWidth: 0.5,
			opposite: true,
			tickPixelInterval: 10
		}],
		rangeSelector: {
			buttonTheme: {
				display: 'none' // 不显示按钮
			},
			title: "",
			enabled: false,
			buttons: [{
				type: 'minute',
				count: 5,
				text: '5M'
			}, {
				type: 'hour',
				count: 1,
				text: '1h'
			}, {
				type: 'day',
				count: 1,
				text: '1D'
			}],
			selected: 2,
			inputEnabled: false
		},
		series: [{
			type: 'candlestick',
			data: [],
			tooltip: {
				valueDecimals: 4
			}
		}]
	});
	$(".highcharts-scrollbar").css("display", "none");
	$(".highcharts-range-selector-buttons").css("display", "none");
	$.getJSON(getContextPath() + '/app/service/stockApi/getManyMinuteMarket', {
		minute: minute,
		metcalSymbol: markcode
	}, function(data) {
		highcharts.series[0].setData([]);
		highcharts.series[0].setData(data);
		highcharts.redraw();
	});
}

function tickChart(metcal_symbol) {
	var v_metcal_symbol = metcal_symbol;
	Highcharts.setOptions({
		global: {
			useUTC: false
		},
		lang: {
			shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
		}
	});
	var v_data = [];
	$.ajaxSettings.async = false;
	$.getJSON(getContextPath() + '/app/service/stockApi/getLineMarket', {
		metcalSymbol: v_metcal_symbol
	}, function(data) {
		data.forEach(function(e) {
			v_data.push({
				x: e[0],
				y: e[1] / e[2]
			});
		})
	});
	if(highcharts != null) {
		highcharts.destroy();
		highcharts = null;
	}
	// create the chart
	var v_decimal_digits = 3;
	var v_height = $(window).height() - 360;
	highcharts = new Highcharts.StockChart({
		chart: {
			renderTo: "container_char",
			backgroundColor: "#262626",
			height: v_height,
			width: $(window).width(),
			events: {
				load: function() {
					if(interval != null) {
						clearInterval(interval);
					}
					interval = setInterval(function() {
						$.getJSON(getContextPath() + '/app/service/stockApi/getLineMarket', {
							metcalSymbol: v_metcal_symbol
						}, function(data) {
							v_data = new Array();
							data.forEach(function(e) {
								v_data.push({
									x: e[0],
									y: e[1] / e[2]
								});
							})
							highcharts.series[0].setData(v_data, true);
							highcharts.redraw();
						});
					}, 1000 * 30);
				}
			}
		},
		animation: true,
		rangeSelector: {
			enabled: false,
			buttons: [{
				count: 5,
				type: 'minute',
				text: '5分钟'
			}, {
				count: 10,
				type: 'minute',
				text: '10分钟'
			}, {
				count: 30,
				type: 'minute',
				text: '30分钟'
			}],
			putEnabled: false,
			inlected: 1
		},
		title: {
			enabled: false
		},
		tooltip: {

			formatter: function() {
				return Highcharts.dateFormat('%m/%d %H:%M', this.x) + '<br/>' +
					"行情：" + Highcharts.numberFormat(this.y, v_decimal_digits);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		credits: { //水印
			enabled: false
		},
		navigator: {
			enabled: false
		},
		scrollbar: {
			enabled: true,
			height: 0
		},
		plotOptions: {
			line: {
				lineWidth: 0.5
			}
		},
		yAxis: [{
			title: {
				enable: false
			},
			labels: {
				align: 'left',
				x: 0,
				y: -2
			},
			lineColor: "#383739",
			gridLineColor: "#383739",
			height: v_height - 40,
			// gridLineDashStyle: 'longdash',  
			opposite: true,
			tickPixelInterval: 50
		}],
		xAxis: [{
			height: v_height - 40,
			crosshair: {
				width: 1,
				color: 'red',
				label: {
					align: 'right',
					formatter: function() {
						return Highcharts.dateFormat('%m/%d %H:%M', this.x) + '<br/>' +
							"行情：" + Highcharts.numberFormat(this.y, v_decimal_digits);
					}
				}

			},
			//tickPixelInterval:10,
			tickInterval: 60 * 1000 * 30
		}],
		series: [{
			name: 'Random data',
			color: "#ffffff",
			data: (function() {
				return v_data;
			}())
		}]

	});
	return false;
}