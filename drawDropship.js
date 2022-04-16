wall = [
	{
		start: [6, -4.5],
		end: [30, -4.5]
	},
	{
		start: [30, -4.5],
		end: [30, 13.5]
	},
	{
		start: [30, 13.5],
		end: [6, 13.5]
	},
	{
		start: [6, 13.5],
		end: [6, -4.5]
	},
	{
		start: [6, 0],
		end: [15, -4.5]
	},
	{
		start: [21, -4.5],
		end: [30, 0]
	},
]
document.write('<canvas id="aa"></canvas>')
aa = document.getElementById('aa')
aa.style.height = '100%'
aa.style.width = '100%'
cc = aa.getContext("2d");

wb = [
	[0, -18],
	[36, 30]
]
aa.height = (wb[1][1] - wb[0][1]) * 100
aa.width = (wb[1][0] - wb[0][0]) * 100
function cp([x, y]) { return [(x - wb[0][0]) / (wb[1][0] - wb[0][0]) * aa.width, (y - wb[0][1]) / (wb[1][1] - wb[0][1]) * aa.height] }
wp = wall.map(x => [cp(x.start), cp(x.end)])
wp.map(([x, y]) => {
	cc.moveTo(...x); cc.lineTo(...y);
	u = [y[0] - x[0], y[1] - x[1]];
	mid = [(y[0] + x[0]) / 2, (y[1] + x[1]) / 2];
	v = [-u[1], u[0]];
	tt = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
	v = [v[0] / tt * 50, v[1] / tt * 50];
	tar = [mid[0] + v[0], mid[1] + v[1]];
	cc.moveTo(...mid); cc.lineTo(...tar);

})
cc.stroke();

sp = [[[16.5, 3],
[19.5, 3],
[19.5, 6],
[16.5, 6],],

[[15, -4.5],
[20.5, -4.5],
[20.5, -3],
[15, -3],]
];

sp2 = [[7.5, 0],
[28.5, 0],
[9, -0.75],
[27, -0.75],
[10.5, -1.5],
[25.5, -1.5],
[12, -2.25],
[24, -2.25],
[13.5, -3],
[22.5, -3],
[15, -3.75],
[21, -3.75],];
sp.map(x => {
	xc = x.map(v => cp(v));
	cc.moveTo(...xc[0]); xc.slice(1).map(x => cc.lineTo(...x));
	cc.lineTo(...xc[0]);
	cc.stroke();
})
sp2.map(x => {
	v = cp(x);
	cc.beginPath();
	cc.arc(...v, 50, 0, 2 * Math.PI, false);
	cc.stroke();
})