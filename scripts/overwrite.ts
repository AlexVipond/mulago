import { readFileSync, writeFileSync } from 'fs'
import { Organization } from './get'

const portfolio = JSON.parse(readFileSync('src/portfolio.json', 'utf8')) as Organization[],
      overwritten = portfolio.map(org => ({
        ...org,
        investments: org.investments.map(({ amount, type }) => ({
          amount,
          type: type.toLowerCase() === 'in convertible debt'
            ? 'convertible debt'
            : type.toLowerCase() === 'unrestricted grant'
              ? 'unrestricted grants'
              : type,
        }))
      }))

writeFileSync(
  'src/portfolio.json',
  JSON.stringify(overwritten, null, 2),
)
