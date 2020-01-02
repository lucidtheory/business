const cheerio = require('cheerio')
const { ProxyCrawlAPI } = require('proxycrawl')
const fs = require('fs')
const request = require('request')
const links = require('./links.js')

const api = new ProxyCrawlAPI({ token: 'eousczPwSb-U5_97Ll8DSg' })

const IMAGE_LARGE_REGEX = /._([A-Z])\w+_./

const getLargeImageLink = (link) => link.replace(IMAGE_LARGE_REGEX, '.')

let affiliateData = []

const downloadImage = ({ imageLink, fileName }) => {
  request.head(imageLink, (err, res, body) => {
    if (err) {
      return
    }

    request(imageLink).pipe(fs.createWriteStream(`images/${fileName}.jpg`))
  })
}

const getKindleData = async ({ html, isRefetch, link }) => {
  const $ = cheerio.load(html)
  const isKindle = $('span.a-button-selected').text().trim().includes('Kindle') || isRefetch

  if (isKindle) {
    // it's kindle now!
    // load all the data and get the photo
    const title = $('meta[property="og:title"]').attr('content')
    const author = $('a.authorNameLink').text().trim()
    const affiliateLink = link
    const imageLink = $('img.frontImage').attr('src')
    const largeImageLink = getLargeImageLink(imageLink)
    downloadImage({ imageLink: largeImageLink, fileName: title })
    affiliateData = [...affiliateData, {
      title,
      author,
      affiliateLink
    }]
  } else {
    const kindleExtension = $('a[href*="_kin_swatch_"]').attr('href')
    if (!kindleExtension) {
      // inform us that there is no kindle edition of this book
      // lets do this super last, we don't even know where or how we are storing info
    } else {
      const kindleLink = `https://www.amazon.com${kindleExtension}`
      const response = await api.get(kindleLink)
      getKindleData({ html: response.body, isRefetch: true, link })
    }
  }
}

const fetchData = () => {
  links.forEach(async (link, index) => {
    const response = await api.get(link)

    await getKindleData({ html: response.body, link })
    if (index === links.length - 1) {
      fs.writeFileSync('affiliateData.js', `module.exports = ${JSON.stringify(affiliateData)}`)
    }
  })
}

fetchData()
