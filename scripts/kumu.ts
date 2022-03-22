import { readFileSync, writeFileSync } from 'fs'
import type { Organization } from './get'

function kumu () {
  const portfolio: Organization[] = JSON.parse(readFileSync('src/portfolio.json', 'utf8'))
  const kumu = toKumu(portfolio)

  writeFileSync('src/kumu.json', JSON.stringify(kumu, null, 2))

  console.log(`Formatted ${portfolio.length} organizations for Kumu`)
}

function toKumu (portfolio: Organization[]): {
  elements: {
    label: string,
    type: 'Organization',
    portfolioUrl: string,
    imageUrls_header: string,
    imageUrls_logo: string,
    website: string,
    totalInvestments: number,
    investmentTypes: string[],
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
      portfolioUrl: organization.portfolioUrl,
      imageUrls_header: organization.imageUrls.header,
      imageUrls_logo: organization.imageUrls.logo,
      website: organization.website,
      totalInvestments: organization.investments.reduce((total, investment) => total + investment.amount, 0),
      investmentTypes: Array.from(new Set(organization.investments.map(investment => investment.type))),
      created: organization.created,
      fellows_rainer: organization.fellows.rainer,
      fellows_henry: organization.fellows.henry,
      why: organization.why.join('\n'),
    })
    return kumu
  }, { elements: [] } as ReturnType<typeof toKumu>)
}

kumu()
