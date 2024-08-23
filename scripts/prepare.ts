import { readFileSync, writeFileSync } from 'fs'
import { Organization } from './get'

function prepare () {
  const portfolio = JSON.parse(readFileSync('src/portfolio.json', 'utf8')) as Organization[],
        names = portfolio.map(org => org.name)

  // JS
  const js = `\
export const portfolio = ${JSON.stringify(portfolio, null, 2)}

export const names = ${JSON.stringify(names, null, 2)}
`

  writeFileSync('lib/index.js', js)


  // CJS
  const cjs = `\
const portfolio = ${JSON.stringify(portfolio, null, 2)}
const names = ${JSON.stringify(names, null, 2)}
module.exports = { portfolio, names }
`

  writeFileSync('lib/index.cjs', cjs)


  // DTS
  const dts = `\
declare type Organization = {
  name: string,
  portfolioUrl: string,
  imageUrls: {
    header: string,
    logo: string,
  },
  website: string,
  donate: string,
  socialUrls: {
    twitter: string,
    linkedin: string,
    facebook: string,
    instagram: string,
  },
  investments: {
    amount: number,
    type: 'unrestricted grants' | 'equity' | 'loans' | 'convertible debt',
  }[],
  created: number,
  fellows: {
    rainer: string,
    henry: string,
  },
  why: string[],
}

declare const portfolio: Organization[]
declare const names: string[]

export { Organization, portfolio, names }
`
  writeFileSync('lib/index.d.ts', dts)
}

prepare()
