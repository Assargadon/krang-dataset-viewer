const fragmentId = document.URL.slice(-53)
const img = document.getElementById('fragment')

const fragmentViewer = $('#fragment_viewer')
const markerTable = document.getElementById("markerInfo");

let font_size = 80;
let x_offset = font_size * 0.448125;
let y_offset = font_size * 0.75;

function addMarkerToTable(x, y, count) {
	fragmentViewer.append(`<span class="marker" id='marker${count}' style="left: ${x - x_offset}px; top: ${y - y_offset}px; font-size: ${font_size}px;">&#9737; <span class="comment">${count}</span></span>`)
	markerTable.insertAdjacentHTML('beforeend', `<tr><td class="marker-link" id="link${count}" onclick="jumpToMarker(${count})">Маркер ${count}</td><td>${Math.round(x)}</td><td>${Math.round(y)}</td></tr>`)

	console.log("Created marker "+ count +" at Left: " + x + " Top: " + y);
}

function jumpToMarker(markerId) {
	let markerTarget = document.getElementById(`marker${markerId}`)
	markerTarget.scrollIntoView()
}

function createMarkerOnClick(e) {
	var rect = e.target.getBoundingClientRect();
	var xPos = Math.round(e.clientX - rect.left);
	var yPos = Math.round(e.clientY - rect.top);
	let newCount = markersSource.length+1
	addMarkerToTable(xPos, yPos, newCount)
	markersSource.push({ x: xPos, y: yPos, count: newCount })
}

const markersSource = [
{x: 312, y: 5723, count: 1},
{x: 476, y: 6319, count: 2},
{x: 861, y: 5907, count: 3},
{x: 1688, y: 6101, count: 4},
{x: 2517, y: 6856, count: 5},
{x: 2723, y: 6731, count: 6},
{x: 2780, y: 6567, count: 7},
{x: 2425, y: 6330, count: 8},
{x: 4475, y: 7110, count: 9},
{x: 4684, y: 6744, count: 10},
{x: 4744, y: 6593, count: 11},
{x: 4869, y: 6576, count: 12},
{x: 5372, y: 6519, count: 13},
{x: 5895, y: 6423, count: 14},
{x: 5677, y: 6652, count: 15},
{x: 6038, y: 5696, count: 16},
{x: 6026, y: 5106, count: 17},
{x: 3692, y: 3266, count: 18},
{x: 3654, y: 2135, count: 19},
{x: 3456, y: 1040, count: 20},
{x: 3648, y: 326, count: 21},
{x: 4929, y: 823, count: 22},
{x: 5117, y: 794, count: 23},
{x: 6364, y: 305, count: 24},
{x: 6283, y: 230, count: 25},
{x: 5048, y: 309, count: 26},
{x: 3722, y: 895, count: 27},
{x: 1541, y: 4073, count: 28},
{x: 123, y: 4256, count: 29},
{x: 625, y: 774, count: 30},
{x: 1142, y: 790, count: 31},
{x: 2125, y: 765, count: 32},
{x: 2303, y: 496, count: 33},
{x: 2579, y: 747, count: 34},
{x: 2510, y: 941, count: 35},
{x: 3698, y: 66, count: 36},
{x: 4396, y: 776, count: 37},
{x: 4553, y: 35, count: 38},
{x: 5021, y: 774, count: 39},
{x: 4247, y: 1447, count: 40},
{x: 4130, y: 1665, count: 41},
{x: 3967, y: 1794, count: 42},
{x: 3322, y: 1654, count: 43},
{x: 3032, y: 1538, count: 44},
{x: 2942, y: 2084, count: 45},
{x: 2020, y: 1298, count: 46},
{x: 1207, y: 1584, count: 47},
{x: 1697, y: 2103, count: 48},
{x: 1736, y: 2140, count: 49},
{x: 1684, y: 2305, count: 50 }
];

$(document).ready(() => {
	$('.fragmentId').append(fragmentId)
	$('#downloadfragment').append(`<a href="https://krang-dataset.website.yandexcloud.net/${fragmentId}.tiff">Скачать фрагмент ${fragmentId}.tiff</a>`);
	img.src = `https://krang-dataset.website.yandexcloud.net/cuts/${fragmentId}.jpg`;


	markersSource.forEach(point => {
		addMarkerToTable(point.x, point.y, point.count)
	});
});

fragmentViewer.click(createMarkerOnClick);
