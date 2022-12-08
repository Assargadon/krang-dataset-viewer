//Branch improve-map-script, TODO:
//Separate loader scripts from map tools scripts
//Remake tools on cuts viewer to match tools in deepzoom-viewer
//Think about storing marker data outside the scripts (in JSON files individual for every image)



//thumbnails page
const thumbnailsListLink = "https://storage.yandexcloud.net/krang-dataset?list-type=2&prefix=thumbnails/"
const thumbnailsPattern = /[0-9a-f]{12}-preview.jpg/

async function insertThumbnails() {
	try {
		const filenames = await createList(thumbnailsListLink, thumbnailsPattern);
		const cutsList = await createList(cutsListLink, cutsPattern);

		let cutsIcon = (data) => {
			let resultText = data ? "есть фрагменты" : "нет фрагментов";
			resultStyle = data ? 'green' : 'lightcoral';
			result = {
				resultText,
				resultStyle
			}
			return result
		}
		const cardTemplate = data => `
		<div>
		<a href='deepzoom.html#${data.id}' class='preview-card' style='background-image: url(${data.url})'>
			<p class='slide-id'>${data.id}</p>
		</a>
		<p class='preview-info' style="color: ${cutsIcon(data.hasCuts).resultStyle};">${cutsIcon(data.hasCuts).resultText}</p>
		</div>`;

		$(document).ready(() => {
			const overviewRoot = $("#overview")
			list.forEach(data => overviewRoot.append(cardTemplate(data)));
			;
		});

		let prefix = "https://krang-dataset.website.yandexcloud.net/"
		const list = filenames.map(filename => {
			return {
				url: prefix + filename,
				id: filename.slice(11, 23),
				hasCuts: false
			}
		})
		compareLists(list, cutsList)
	}
	catch (e) {
		document.body.insertAdjacentHTML('beforeend', `<h2 style="color: darkred">Не могу загрузить список слайдов!</h2>`)
		console.error("Can't load list of files: ", e);
	}
}
function compareLists(to, from) {
	for (cut of from) {
		cutId = cut.slice(0, 12)
		for (iter of to) {
			if (cutId == iter.id){iter.hasCuts = true}
		}
}
}

//cuts page
const cutsListLink = "https://storage.yandexcloud.net/krang-dataset?list-type=2"
const cutsPattern = /^[0-9a-f]{12}-cut__.*/

async function insertCuts() {
	try {
		const filenames = await createList(cutsListLink, cutsPattern);
		listTarget = document.getElementById("cuts_list");
		filenames.forEach((filename) => {
			const fragmentId = filename.slice(0,53);
			listTarget.insertAdjacentHTML('beforeend', `<li><a href="/${filename}">${fragmentId}.tiff</a> (<a href="cut.html#${fragmentId}">просмотреть</a>)</li>`)
		});
	} catch (e) {
		document.body.insertAdjacentHTML('beforeend', `<h2 style="color: darkred">Не могу загрузить список фрагментов!</h2>`)
		console.error("Can't load list of files: ", e);
	}
}
//general
function traverseXmlDoc(rootTag, maxDeepness, tagCallback, path = "") {
	if(!rootTag.tagName) return;
	var myPath = path + "." + rootTag.tagName;
	tagCallback(myPath, rootTag);
	if(maxDeepness > 0) {
		rootTag.childNodes.forEach((child) => {traverseXmlDoc(child, maxDeepness-1, tagCallback, myPath)})
	}
}

async function createList(link, pattern){
	try {
		let response = await fetch(link)
		let text = await response.text()
		console.log("response", response)
		let parser = new DOMParser()
		let doc = await parser.parseFromString(text, "text/xml")
		const filenames = []
		const previewPattern = pattern
		traverseXmlDoc(doc.documentElement, 5, (path, tag)=>{
			if(path == ".ListBucketResult.Contents.Key"){
				//console.log("filename", tag.textContent)
				if(previewPattern.test(tag.textContent)){
					filenames.push(tag.textContent);
				}
			}
		});
		//console.log("filenames", filenames);
		return filenames
	} catch(e) {
		console.error("Error while loading list of previews", e)
		return null;
	}
}

//deepzoom page
// Init Leaflet
//bounds = {topLeft, bottomRight}
//var bounds = [[0, 0], [-1500, 1000]];
var map = L.map('map', {
	crs: L.CRS.Simple,
	//maxBounds: bounds
});
L.tileLayer('http://krang-dataset.website.yandexcloud.net/deepzoom/{id}/{z}/{y}/{x}.jpg', {
	id: createSlideId(),
	minZoom: 0,
	maxZoom: 8,
	minNativeZoom: 0,
	maxNativeZoom: 7,
	tileSize: 2048,
	noWrap: true,
	attributionControl: false,
	//bounds: bounds
}).addTo(map);

map.setView([0, 0], 0)

map.on('click', e => {console.log("Clicked on:", e.latlng);});

let markersArray = [];
function createMarker(xPos, yPos) {
	let counter = markersArray.length+1
	let newMarker = L.marker([xPos, yPos]).addTo(map).bindPopup(counter + " x " + xPos + " y " + yPos)
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
function flyToMarker(arrayIndex) {
	let { lat, lng } = markersArray.at(arrayIndex-1)._latlng;
	console.log(lat+' '+lng)
	map.flyTo([lat, lng], 5)
}
function showMarkArr() {
	let newTable = document.createElement('table');
	newTable.setAttribute("id", "popup-list");
	let counter = 1;
	for (marker of markersArray) {
		let { lat, lng } = marker._latlng;
		//console.log(`this is lat: ${lat} and this is lng: ${lng}`)
		let tr = newTable.insertRow();
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

function createSlideId() {
	const slideId = document.URL.slice(-12);
	console.log('slideID: ' + slideId)
	return slideId;
}
function openDeepzoom() {
	let slideId = createSlideId();
	$(document).ready(() => {
		$('.slideId').append(slideId)
		$('#downloadslide').append(`<a href="https://krang-dataset.website.yandexcloud.net/${slideId}.tiff">Скачать слайд ${slideId}.tiff</a>`);
	});
}
async function insertCutsDeepzoom() {
	try {
		let slideId = createSlideId()
		//console.log('insertCutsDeepzoom exec: ' + slideId)
		let cutsPatternDeepzoom = new RegExp(`${slideId}-cut.*`)
		const filenames = await createList(cutsListLink, cutsPatternDeepzoom);
		//console.log('cuts Filenames: ' + filenames)
		let listTarget = document.getElementById("display-cuts");
		filenames.forEach((filename) => {
				listTarget.insertAdjacentHTML('beforeend', `<p>Просмотреть фрагмент: <a href="/krang-dataset-viewer/cut.html#${filename.slice(0, -5)}">${filename.slice(0, -5)}</a></p>`)
			});
		//console.log(filenames.length)
		if (filenames.length == 0){listTarget.remove()}
	}
	catch (e) {
		console.error("Can't load list of files: ", e);
	}
}