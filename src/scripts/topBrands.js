const fs = require('fs')
const brands = require('../lists/Brands.js')
const leadsOnLocation = require('../lists/LeadsOnLocation.js')
const oaHunt = require('../lists/OAHunt.js')
const resellingTeacher = require('../lists/ResellingTeacher.js')

const findTopUsedBrands = () => {
  const results = {}

  brands.forEach(brand => {
    const addToBrandCount = item => {
      if (item.toLowerCase().includes(brand.toLowerCase())) {
        if (!results[brand]) {
          results[brand] = 1
        } else {
          results[brand] += 1
        }
      }
    }

    // iterate through each list and count occurences of brand
    leadsOnLocation.forEach(addToBrandCount)
    oaHunt.forEach(addToBrandCount)
    resellingTeacher.forEach(addToBrandCount)
  })

  brands.sort((a, b) => (results[b] || 0) - (results[a] || 0)).forEach(brand => {
    if (results[brand]) {
      fs.appendFileSync('src/scripts/brands.txt', `${brand} ${results[brand]}\n`)
    }
  })
}

findTopUsedBrands()
