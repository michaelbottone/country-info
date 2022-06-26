const helloContainer = document.querySelector('#hello-container')
const locationContainer = document.querySelector('#location')
const mapContainer = document.querySelector('#map-container')
const apiKey =
  'AiwZaKSOpDkgpIQGX2rMFIsMkvcd_Nv98haULE_IvmMaDv4H5ckuSlGYt3hLoYY-'
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const countryCode = urlParams.get('cc')
const countryName = urlParams.get('countryName')
const infoboxTemplate =
  '<div class="customInfobox"><div class="title">{title}</div>{description}</div>'

const apiCall = async () => {
  let response = await axios.get(
    `https://fourtonfish.com/hellosalut/?cc=${countryCode}`
  )
  let mapRepsonse = await axios.get(
    `https://dev.virtualearth.net/REST/v1/Locations?query='${countryName}'jsonp=GeocodeCallback&key=${apiKey}`
  )
  let howHello = response.data.hello
  let coordinatesA =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[0]
  let coordinatesB =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[1]
  locationContainer.innerHTML = `You can find ${countryName} here:`
  if (response.data.hello === '') {
    document.querySelector('.left-container').style.display = 'none'
  } else {
    helloContainer.innerHTML = `<h1>You can say <em>"hello"</em> while your're in ${countryName} like this:<br> <span id="hola">${howHello}</span></h1>`
  }
  GetMap = () => {
    let map = new Microsoft.Maps.Map(mapContainer, {
      credentials: apiKey,
      center: new Microsoft.Maps.Location(coordinatesA, coordinatesB)
    })

    let center = map.getCenter()
    let pin = new Microsoft.Maps.Pushpin(center, {
      title: countryName,
      subtitle: howHello,
      color: '#ff3333'
    })
    let title = countryName
    let description = `You can say hello in ${countryName} like this: <br><span id="infobox-desc">${howHello}</span>`

    if (howHello === '') {
    } else {
      let infobox = new Microsoft.Maps.Infobox(center, {
        htmlContent: infoboxTemplate
          .replace('{title}', title)
          .replace('{description}', description)
      })
      infobox.setMap(map)
    }
    map.setView({
      zoom: 4
    })

    map.entities.push(pin)
  }

  GetMap()
}

apiCall()
