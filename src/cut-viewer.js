const fragmentId = document.URL.slice(-53)
const img = document.getElementById('fragment')

const fragmentViewer = $('#fragment_viewer')
const markerTable = document.getElementById("markerInfo");

let font_size = 80;
let x_offset = font_size * 0.448125;
let y_offset = font_size * 0.75;
let counter = 1;

function addMarker(e) {
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	fragmentViewer.append(`<span class="marker" id='marker${counter}' style="left: ${x - x_offset}px; top: ${y - y_offset}px; font-size: ${font_size}px;">&#9737; <span class="comment">${counter}</span></span>`)
	markerTable.insertAdjacentHTML('beforeend', `<tr><td class="marker-link" id="link${counter}" onclick="jumpToMarker(${counter})">Маркер ${counter}</td><td>${x}</td><td>${y}</td></tr>`)

	console.log("Created marker "+ counter +" at Left: " + x + " Top: " + y);
	counter++;
}

function jumpToMarker(markerId) {
	let markerTarget = document.getElementById(`marker${markerId}`)
	markerTarget.scrollIntoView()
}

const positive = [
			{x: 312, y: 5723},
			{x: 476, y: 6319},
			{x: 861, y: 5907},
			{x: 1688, y: 6101},
			{x: 2517, y: 6856},
			{x: 2723, y: 6731},
			{x: 2780, y: 6567},
			{x: 2425, y: 6330},
			{x: 4475, y: 7110},
			{x: 4684, y: 6744},
			{x: 4744, y: 6593},
			{x: 4869, y: 6576},
			{x: 5372, y: 6519},
			{x: 5895, y: 6423},
			{x: 5677, y: 6652},
			{x: 6038, y: 5696},
			{x: 6026, y: 5106},
			{x: 3692, y: 3266},
			{x: 3654, y: 2135},
			{x: 3456, y: 1040},
			{x: 3648, y: 326},
			{x: 4929, y: 823},
			{x: 5117, y: 794},
			{x: 6364, y: 305},
			{x: 6283, y: 230},
			{x: 5048, y: 309},
			{x: 3722, y: 895},
			{x: 1541, y: 4073},
			{x: 123, y: 4256},
			{x: 625, y: 774},
			{x: 1142, y: 790},
			{x: 2125, y: 765},
			{x: 2303, y: 496},
			{x: 2579, y: 747},
			{x: 2510, y: 941},
			{x: 3698, y: 66},
			{x: 4396, y: 776},
			{x: 4553, y: 35},
			{x: 5021, y: 774},
			{x: 4247, y: 1447},
			{x: 4130, y: 1665},
			{x: 3967, y: 1794},
			{x: 3322, y: 1654},
			{x: 3032, y: 1538},
			{x: 2942, y: 2084},
			{x: 2020, y: 1298},
			{x: 1207, y: 1584},
			{x: 1697, y: 2103},
			{x: 1736, y: 2140},
			{x: 1684, y: 2305},
];

$(document).ready(() => {
	$('.fragmentId').append(fragmentId)
	$('#downloadfragment').append(`<a href="https://krang-dataset.website.yandexcloud.net/${fragmentId}.tiff">Скачать фрагмент ${fragmentId}.tiff</a>`);
	img.src = `https://krang-dataset.website.yandexcloud.net/cuts/${fragmentId}.jpg`;


	positive.forEach(point => {
		fragmentViewer.append(`<span class="marker" style="left: ${point.x - x_offset}px; top: ${point.y - y_offset}px; font-size: ${font_size}px;">&#9737;</span>`)
	});
});

fragmentViewer.click(addMarker);