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
			listTarget.insertAdjacentHTML('beforeend', `<li><a href="/${filename}">${filename}</a></li>`)
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

		var bounds = [[0, 0], [-1500, 1000]];

		// Init Leaflet
		var map = L.map('map', {
			crs: L.CRS.Simple,
			maxBounds: bounds
		});


		L.tileLayer('http://krang-dataset.website.yandexcloud.net/deepzoom/{id}/{z}/{y}/{x}.jpg', {
			id: slideId,
			minZoom: -3,
			maxZoom: 8,
			minNativeZoom: 0,
			maxNativeZoom: 7,
			tileSize: 2048,
			noWrap: true,
			attributionControl: false,
			bounds: bounds
		}).addTo(map);

		map.setView([-200, 180], -1)

		map.on('click', e => { console.debug("Clicked on:", e.latlng) });
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
				listTarget.insertAdjacentHTML('beforeend', `<p>Скачать фрагмент: <a href="/${filename}">${filename}</a></p>`)
			});
		//console.log(filenames.length)
		if (filenames.length == 0){listTarget.remove()}
	}
	catch (e) {
		console.error("Can't load list of files: ", e);
	}
}