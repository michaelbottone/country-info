const temp = document.querySelector('#temp')
const feels = document.querySelector('#feels')
const rain = document.querySelector('#rain')
const airQ = document.querySelector('#air-quality')
const topCenter = document.querySelector('#top-center')
const pollenGrass = document.querySelector('#pollen-grass')
const pollenWeeds = document.querySelector('#pollen-weeds')
const pollenTrees = document.querySelector('#pollen-trees')
const helloContainer = document.querySelector('#hello-container')
const locationContainer = document.querySelector('#location')
const mapContainer = document.querySelector('#map-container')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const countryCode = urlParams.get('cc')
const countryName = urlParams.get('countryName')
const breezeApiKey = '2995c6b87cb74d0fae2e8244e4cb8129'
const apiKey =
  'AiwZaKSOpDkgpIQGX2rMFIsMkvcd_Nv98haULE_IvmMaDv4H5ckuSlGYt3hLoYY-'
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
  let latitude =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[0]
  let longitude =
    mapRepsonse.data.resourceSets[0].resources[0].point.coordinates[1]
  locationContainer.innerHTML = `You can find ${countryName} here:`
  if (response.data.hello === '') {
    document.querySelector('.left-container').style.display = 'none'
  } else {
    helloContainer.innerHTML = `<h1>You can say <em>"hello"</em> while you're in ${countryName} like this:<br><a href="https://www.google.com/search?q=how+to+pronounce+${howHello}" target="_blank"><span id="hola">${howHello}</span></a></h1>`
  }
  GetMap = () => {
    let map = new Microsoft.Maps.Map(mapContainer, {
      credentials: apiKey,
      center: new Microsoft.Maps.Location(latitude, longitude)
    })

    let center = map.getCenter()
    let pin = new Microsoft.Maps.Pushpin(center, {
      title: countryName,
      subtitle: howHello,
      color: '#ff3333'
    })
    let title = `<a id="googleLink" href="https://www.google.com/search?q=${countryName}" target="_blank" title="click to google this country">${countryName}</a>`
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

  let currentConditions
  let pollenCount
  let airQuality
  try {
    currentConditions = await axios.get(
      `https://api.breezometer.com/weather/v1/current-conditions?lat=${latitude}&lon=${longitude}&key=${breezeApiKey}`
    )
  } catch (error) {
    document.querySelector('#top-left').style.display = 'none'
  }
  try {
    pollenCount = await axios.get(
      `https://api.breezometer.com/pollen/v2/forecast/daily?lat=${latitude}&lon=${longitude}&days=1&key=${breezeApiKey}`
    )
  } catch (error) {
    document.querySelector('#top-center').style.display = 'none'
  }
  try {
    airQuality = await axios.get(
      `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${latitude}&lon=${longitude}&key=${breezeApiKey}`
    )
  } catch (error) {
    document.querySelector('#top-right').style.display = 'none'
  }
  let baqi = airQuality.data.data.indexes.baqi.aqi
  airQ.style.color = airQuality.data.data.indexes.baqi.color
  airQ.innerHTML = baqi

  let currentTemp = currentConditions.data.data.temperature.value
  let feelsLike = currentConditions.data.data.feels_like_temperature.value
  let rainChance =
    currentConditions.data.data.precipitation.precipitation_probability

  let grassInSeason = pollenCount.data.data[0].types.grass.in_season
  let weedsInSeason = pollenCount.data.data[0].types.weed.in_season
  let treesInSeason = pollenCount.data.data[0].types.tree.in_season
  let grass = pollenCount.data.data[0].types.grass.display_name
  let weeds = pollenCount.data.data[0].types.weed.display_name
  let trees = pollenCount.data.data[0].types.tree.display_name

  pollenGrass.innerHTML = `<p>${grass}: ${grassInSeason}`
  pollenWeeds.innerHTML = `<p>${weeds}s: ${weedsInSeason}`
  pollenTrees.innerHTML = `<p>${trees}s: ${treesInSeason}`

  const celciusToFar = (temp) => {
    let converted = Math.round((temp * 9) / 5 + 32)
    return parseInt(converted)
  }

  temp.innerHTML = celciusToFar(currentTemp) + '&deg;' + ' '
  feels.innerHTML = celciusToFar(feelsLike) + '&deg;' + ' '
  rain.innerHTML = rainChance + '%'
  GetMap()
}

apiCall()
