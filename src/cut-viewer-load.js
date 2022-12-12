const fragmentId = document.URL.slice(-53)

const markersSource = [
//!!! lat is horizontal(x), lng is vertical(y)!!!
	{y: 312, x: 5723},
	{y: 476, x: 6319},
	{y: 861, x: 5907},
	{y: 1688, x: 6101},
	{y: 2517, x: 6856},
	{y: 2723, x: 6731},
	{y: 2780, x: 6567},
	{y: 2425, x: 6330},
	{y: 4475, x: 7110},
	{y: 4684, x: 6744},
	{y: 4744, x: 6593},
	{y: 4869, x: 6576},
	{y: 5372, x: 6519},
	{y: 5895, x: 6423},
	{y: 5677, x: 6652},
	{y: 6038, x: 5696},
	{y: 6026, x: 5106},
	{y: 3692, x: 3266},
	{y: 3654, x: 2135},
	{y: 3456, x: 1040},
	{y: 3648, x: 326},
	{y: 4929, x: 823},
	{y: 5117, x: 794},
	{y: 6364, x: 305},
	{y: 6283, x: 230},
	{y: 5048, x: 309},
	{y: 3722, x: 895},
	{y: 1541, x: 4073},
	{y: 123, x: 4256},
	{y: 625, x: 774},
	{y: 1142, x: 790},
	{y: 2125, x: 765},
	{y: 2303, x: 496},
	{y: 2579, x: 747},
	{y: 2510, x: 941},
	{y: 3698, x: 66},
	{y: 4396, x: 776},
	{y: 4553, x: 35},
	{y: 5021, x: 774},
	{y: 4247, x: 1447},
	{y: 4130, x: 1665},
	{y: 3967, x: 1794},
	{y: 3322, x: 1654},
	{y: 3032, x: 1538},
	{y: 2942, x: 2084},
	{y: 2020, x: 1298},
	{y: 1207, x: 1584},
	{y: 1697, x: 2103},
	{y: 1736, x: 2140},
	{y: 1684, x: 2305}
];

$(document).ready(() => {
	$('.fragmentId').append(fragmentId)
	$('#downloadfragment').append(`<a href="https://krang-dataset.website.yandexcloud.net/${fragmentId}.tiff">Скачать фрагмент ${fragmentId}.tiff</a>`);

	markersSource.forEach(point => {
		createMarker(point.x, point.y)
	});
});

//init leaflet.js
var imageUrl = `https://krang-dataset.website.yandexcloud.net/cuts/${fragmentId}.jpg`
var imageBounds = [[0, 0], [7168, 7168]];
const map = L.map('map', {
	crs: L.CRS.Simple,
	minZoom: -2,
	maxZoom: 1,
	maxBounds: imageBounds
})
var image = L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds)

