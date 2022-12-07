const fragmentId = document.URL.slice(-53)

const img = document.getElementById('fragment')
const $fragmentViewer = $('#fragment_viewer')

function addMarkerToTable(x, y, markerName) {
	const markerTable = document.getElementById("markerInfo");
	markerTable.insertAdjacentHTML('beforeend', `<tr><td class="marker-link" id="link${markerName}" onclick="jumpToMarker(${x}, ${y})">Маркер ${markerName}</td><td>${Math.round(x)}</td><td>${Math.round(y)}</td></tr>`)
}

function jumpToMarker(x, y) {
	map.flyTo([x, y], 0)
}

/* function createMarkerOnClick(e) {
	console.log("You clicked the map at " + e.latlng);
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	var lastCount = markersSource[(markersSource.length-1).count]
	createMarker(x, y, lastCount)
} */

const markersSource = [
//!!! lat is horizontal(x), lng is vertical(y)!!!
	{y: 312, x: 5723, count: 1},
	{y: 476, x: 6319, count: 2},
	{y: 861, x: 5907, count: 3},
	{y: 1688, x: 6101, count: 4},
	{y: 2517, x: 6856, count: 5},
	{y: 2723, x: 6731, count: 6},
	{y: 2780, x: 6567, count: 7},
	{y: 2425, x: 6330, count: 8},
	{y: 4475, x: 7110, count: 9},
	{y: 4684, x: 6744, count: 10},
	{y: 4744, x: 6593, count: 11},
	{y: 4869, x: 6576, count: 12},
	{y: 5372, x: 6519, count: 13},
	{y: 5895, x: 6423, count: 14},
	{y: 5677, x: 6652, count: 15},
	{y: 6038, x: 5696, count: 16},
	{y: 6026, x: 5106, count: 17},
	{y: 3692, x: 3266, count: 18},
	{y: 3654, x: 2135, count: 19},
	{y: 3456, x: 1040, count: 20},
	{y: 3648, x: 326, count: 21},
	{y: 4929, x: 823, count: 22},
	{y: 5117, x: 794, count: 23},
	{y: 6364, x: 305, count: 24},
	{y: 6283, x: 230, count: 25},
	{y: 5048, x: 309, count: 26},
	{y: 3722, x: 895, count: 27},
	{y: 1541, x: 4073, count: 28},
	{y: 123, x: 4256, count: 29},
	{y: 625, x: 774, count: 30},
	{y: 1142, x: 790, count: 31},
	{y: 2125, x: 765, count: 32},
	{y: 2303, x: 496, count: 33},
	{y: 2579, x: 747, count: 34},
	{y: 2510, x: 941, count: 35},
	{y: 3698, x: 66, count: 36},
	{y: 4396, x: 776, count: 37},
	{y: 4553, x: 35, count: 38},
	{y: 5021, x: 774, count: 39},
	{y: 4247, x: 1447, count: 40},
	{y: 4130, x: 1665, count: 41},
	{y: 3967, x: 1794, count: 42},
	{y: 3322, x: 1654, count: 43},
	{y: 3032, x: 1538, count: 44},
	{y: 2942, x: 2084, count: 45},
	{y: 2020, x: 1298, count: 46},
	{y: 1207, x: 1584, count: 47},
	{y: 1697, x: 2103, count: 48},
	{y: 1736, x: 2140, count: 49},
	{y: 1684, x: 2305, count: 50 }
	];
$(document).ready(() => {
	$('.fragmentId').append(fragmentId)
	$('#downloadfragment').append(`<a href="https://krang-dataset.website.yandexcloud.net/${fragmentId}.tiff">Скачать фрагмент ${fragmentId}.tiff</a>`);

	markersSource.forEach(point => {
		createMarker(point.x, point.y, point.count)
	});
	createOverlay();
	//$fragmentViewer.click(createMarkerOnClick())
	map.on('click', e => { console.log("Clicked on:", e.latlng);console.log(map.getBounds) });
});

//init leaflet.js
var imageUrl = `https://krang-dataset.website.yandexcloud.net/cuts/${fragmentId}.jpg`
var imageBounds = [[0, 0], [7168, 7168]];
var markersArray = []
const map = L.map('fragment_viewer', {
	crs: L.CRS.Simple,
	minZoom: -2,
	maxZoom: 1,
	maxBounds: imageBounds
})
var image = L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds)

//markers
function createMarker(xPos, yPos, popupText) {
	let message = popupText.toString()
	let newMarker = L.marker([xPos, yPos]).bindPopup(message)
	markersArray.push(newMarker)
	addMarkerToTable(xPos, yPos, popupText)
}

function createOverlay() {
	var markersLayer = L.layerGroup(markersArray).addTo(map);
	var overlayMaps = { 'Markers': markersLayer };
	var layerControl = L.control.layers(null, overlayMaps).addTo(map)
}