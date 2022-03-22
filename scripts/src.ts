import { writeFileSync} from 'fs'
import { get, Organization } from './get'

async function write () {
  const portfolio = await get()
  const kumu = toKumu(portfolio)

  writeFileSync('src/portfolio.json', JSON.stringify(portfolio, null, 2))
  writeFileSync('src/kumu.json', JSON.stringify(kumu, null, 2))
}

function toKumu (portfolio: Organization[]): {
  elements: {
    label: string,
    type: 'Organization',
    imageUrls_header: string,
    imageUrls_logo: string,
    website: string,
    investments: string,
    created: number,
    fellows_rainer: string,
    fellows_henry: string,
    why: string,
  }[]
} {
  return portfolio.reduce((kumu, organization) => {
    kumu.elements.push({
      label: organization.name,
      type: 'Organization',
      imageUrls_header: organization.imageUrls.header,
      imageUrls_logo: organization.imageUrls.logo,
      website: organization.website,
      investments: organization.investments.map(investment => investment.amount + ' ' + investment.type).join('\n'),
      created: organization.created,
      fellows_rainer: organization.fellows.rainer,
      fellows_henry: organization.fellows.henry,
      why: organization.why.join('\n'),
    })
    return kumu
  }, { elements: [] })
}


write()
