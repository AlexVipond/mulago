import { readFileSync } from 'fs'
import { Organization } from './get';

const portfolio: Organization[] = JSON.parse(readFileSync('lib/portfolio.json', 'utf8'));

console.log(portfolio.map(org => ({ [org.name]: !!org.imageUrls.header })));


