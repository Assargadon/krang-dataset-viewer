let markersArray = [];
const markersLayer = L.layerGroup();
const overlayMaps = { 'Markers': markersLayer };
const layerControl = L.control.layers(null, overlayMaps).addTo(map);
map.addLayer(markersLayer)
function createMarker(xPos, yPos) {
	let counter = markersArray.length+1
	let newMarker = L.marker([xPos, yPos]).addTo(markersLayer).bindPopup(counter + " x " + xPos + " y " + yPos)
	console.log("New Marker" + counter + " x " + xPos + " y " + yPos)
	markersArray.push(newMarker)
	document.getElementById('markArrLength').innerHTML = markersArray.length
	//console.log(newMarker)
}
document.getElementById('mapClick').addEventListener('change', e => {
	if (document.getElementById('mapClick').checked){
		map.addEventListener('click', createMarkerOnClick)
	} else {
		map.removeEventListener('click', createMarkerOnClick)
		}
	})
function createMarkerOnClick(e) {
		let lat = Math.round(e.latlng.lat);
		let lng = Math.round(e.latlng.lng);
	createMarker(lat, lng)
}
function showCoord(xPos, yPos) {
  map.flyTo([xPos, yPos], map.getZoom())
}
function flyToMarker(arrayIndex) {
	let { lat, lng } = markersArray.at(arrayIndex-1)._latlng;
	showCoord(lat, lng)
}
function showMarkArr() {
	let newTable = document.createElement('div');
  newTable.setAttribute("id", "popup-list");
  let table = document.createElement('table');
  newTable.appendChild(table)
	let counter = 1;
	for (marker of markersArray) {
		let { lat, lng } = marker._latlng;
		let tr = table.insertRow();
		let tdNum =  tr.insertCell();
		tdNum.appendChild(document.createTextNode(counter))
		counter++;
		let tdX = tr.insertCell();
		tdX.appendChild(document.createTextNode(lat))
		let tdY = tr.insertCell();
		tdY.appendChild(document.createTextNode(lng))
	}
	document.body.appendChild(newTable)
}
map.addEventListener('mousemove', (event) => {
	let lat = Math.round(event.latlng.lat);
	let lng = Math.round(event.latlng.lng);
	document.getElementById('xMouseCoord').innerHTML = lat;
	document.getElementById('yMouseCoord').innerHTML = lng;
})
//
document.getElementById('showMarkersArr').addEventListener('click', (e) => {
	if (document.getElementById('showMarkersArr').innerHTML.includes("Show")) {
		showMarkArr()
		document.getElementById('showMarkersArr').innerHTML = "Hide markers list";
	} else {
		let table = document.getElementById('popup-list')
		table.remove()
		document.getElementById('showMarkersArr').innerHTML = "Show markers list";
	}
})