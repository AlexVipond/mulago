import { writeFileSync} from 'fs'
import { get } from './get'

async function write () {
  const portfolio = await get()

  writeFileSync('src/portfolio.json', JSON.stringify(portfolio, null, 2))
}

write()
