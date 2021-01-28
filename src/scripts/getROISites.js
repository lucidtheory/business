const fs = require('fs')
const bigRoiLinks = require('../lists/BigROIAsins.js')
const leadsOnLocation = require('../lists/LeadsOnLocation.js')
const oaHunt = require('../lists/OAHunt.js')
const resellingTeacher = require('../lists/ResellingTeacher.js')

const findMatchingWebLink = (asin) => {
  const webPrefix = 'https://'
  const unsafeWebPrefix = 'http://'
  const amzn = 'amzn.com'
  const amazon = 'amazon.com'
  let webLink = ''

  const searchListForAsin = entry => {
    if (webLink) {
      return
    }

    if (entry.includes(asin)) {
      if (asin === 'B00Q1Y5ZPO') {
        console.log('we made it in', entry)
      }
      entry.split('	').forEach((portion) => {
        if (
          (portion.includes(webPrefix) || portion.includes(unsafeWebPrefix)) &&
          !portion.includes(amzn) &&
          !portion.includes(amazon)) {
          webLink = portion
        }
      })
    }
  }

  leadsOnLocation.forEach(searchListForAsin)
  oaHunt.forEach(searchListForAsin)
  resellingTeacher.forEach(searchListForAsin)

  fs.appendFileSync('src/results/ROISites.txt', `${webLink}\n`)
  if (!webLink) {
    fs.appendFileSync('src/results/MissingROISites.txt', `${asin}\n`)
  }
}

const getROISites = () => {
  const asins = bigRoiLinks.map(link => link.split('/').pop())

  asins.forEach(findMatchingWebLink)
}

getROISites()
