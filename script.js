const helloContainer = document.querySelector('#hello-container')
const locationContainer = document.querySelector('#location')
const mapContainer = document.querySelector('#map-container')
const apiKey =
  'AiwZaKSOpDkgpIQGX2rMFIsMkvcd_Nv98haULE_IvmMaDv4H5ckuSlGYt3hLoYY-'

const apiCall = async () => {
  let countryCode = button.value
  let pick = button.selectedIndex
  let countryName = countryArray[pick]

  let response = await axios.get(
    `https://fourtonfish.com/hellosalut/?cc=${countryCode}`
  )
  let mapRepsonse = await axios.get(
    `https://dev.virtualearth.net/REST/v1/Locations?query='${countryName}'jsonp=GeocodeCallback&key=${apiKey}`
  )
  let coordinatesA =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[0]
  let coordinatesB =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[1]
  if (response.data.countryCode === '') {
    helloContainer.style.display = 'none'
  } else {
    helloContainer.innerHTML = `<h1>You can say <em>"hello"</em> while your're in ${countryName} like this:<br> <span id="hola">${response.data.hello}</span></h1>`
  }
  GetMap = () => {
    let map = new Microsoft.Maps.Map(mapContainer, {
      credentials: apiKey,
      center: new Microsoft.Maps.Location(coordinatesA, coordinatesB)
    })
    let center = map.getCenter()
    let pin = new Microsoft.Maps.Pushpin(center, {
      title: countryName,
      color: 'blue'
    })
    map.setView({
      zoom: 4
    })

    map.entities.push(pin)
  }

  GetMap()
  locationContainer.innerHTML = `You can find ${countryName} here:`
}

button.addEventListener('change', apiCall)
