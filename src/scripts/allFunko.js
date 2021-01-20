const fs = require('fs')
const leadsOnLocation = require('../lists/LeadsOnLocation.js')
const oaHunt = require('../lists/OAHunt.js')
const resellingTeacher = require('../lists/ResellingTeacher.js')
const onLocationTre = require('../lists/OnLocationTre.js')

const allFunko = () => {
  const funko = 'funko'
  const amazonPrefix = 'https://amzn.com/'
  const webPrefix = 'https://'
  const domainArray = [] // [BuyDomain: string]
  const amazonArray = [] // [AmzDomain: string]

  const checkForFunko = (item) => {
    if (item.toLowerCase().includes(funko)) {
      let domain = ''
      let amazonLink = ''
      let finished = false

      item.split('	').forEach((portion) => {
        if (portion.includes(webPrefix) && !domain.length) {
          // get buy domain https as string
          domain = portion
        } else {
          if (!finished && domain.length) {
            if (!portion.includes(webPrefix)) {
              // get amazon ASIN as string and add amazon prefix
              amazonLink = amazonPrefix + portion
            } else if (portion.includes(webPrefix)) {
              amazonLink = portion
            }
            finished = true
          }
        }
      })

      // add to domainArray
      domainArray.push(domain)

      // add to amazonArray
      amazonArray.push(amazonLink)
    }
  }

  // build up results & domain array
  leadsOnLocation.forEach(checkForFunko)
  oaHunt.forEach(checkForFunko)
  resellingTeacher.forEach(checkForFunko)
  onLocationTre.forEach(checkForFunko)

  domainArray.forEach((domain) => {
    fs.appendFileSync('src/results/funkoBuy.txt', `${domain}\n`)
  })

  amazonArray.forEach((amazonLink) => {
    fs.appendFileSync('src/results/funkoAmazon.txt', `${amazonLink}\n`)
  })
}

allFunko()
