const fs = require('fs')
const links = require('./links.js')

const longestRoot = (s) => s
  .substring(8)
  .split('.')
  .sort((a, b) => b.length - a.length)
  .filter((a) => !['www', 'com'].includes(a))[0]

const getDomains = () => {
  const rootDomains = []
  const domainMap = {}

  links.forEach((link) => {
    const rootDomain = link.split('/', 3).join('/')
    const root = longestRoot(rootDomain)
    if (!domainMap[root]) {
      domainMap[root] = 1
      rootDomains.push(rootDomain)
    } else {
      domainMap[root] += 1
    }
  })

  const sorted = rootDomains.sort((a, b) => {
    const rootA = longestRoot(a)
    const rootB = longestRoot(b)

    return domainMap[rootB] - domainMap[rootA]
  })

  sorted.forEach((domain) => {
    fs.appendFileSync('scripts/fba/domains.js', `"${domain} ${domainMap[longestRoot(domain)]}",\n`)
  })
}

getDomains()
