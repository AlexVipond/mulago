import { readFileSync, writeFileSync } from 'fs'
import { Organization } from './get'

const portfolio = JSON.parse(readFileSync('lib/portfolio.json', 'utf8')) as Organization[],
      overwritten = portfolio.map(org => ({
        ...org,
        why: org.why.filter(why => why !== 'Why we invest')
      }))

writeFileSync(
  'lib/portfolio.json',
  JSON.stringify(overwritten, null, 2),
)
