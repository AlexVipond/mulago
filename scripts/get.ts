import { chromium } from 'playwright'

export type Organization = {
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

export async function get (): Promise<Organization[]> {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
  const page = await browser.newPage()
  await page.goto('https://www.mulagofoundation.org/our-portfolio')

  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.card-portfolio-index-new'))
      .map(link => (link as HTMLAnchorElement).href)
  )

  const organizations: Organization[] = []
  
  for (const link of links) {
    await page.goto(link)
    
    const organization: Organization = await page.evaluate(link => {
      return {
        name: document.title,
        portfolioUrl: link,
        imageUrls: {
          header: (document.querySelector('header img') as HTMLImageElement).src,
          logo: (document.querySelector('.logo-org') as HTMLImageElement).src,
        },
        socialUrls: {
          facebook: (document.querySelector('.link-block-social-icon[href*="facebook.com"]') as HTMLAnchorElement)?.href || '',
          twitter: (document.querySelector('.link-block-social-icon:is([href*="twitter.com"], [href*="x.com"])') as HTMLAnchorElement)?.href || '',
          linkedin: (document.querySelector('.link-block-social-icon[href*="linkedin.com"]') as HTMLAnchorElement)?.href || '',
          instagram: (document.querySelector('.link-block-social-icon[href*="instagram.com"]') as HTMLAnchorElement)?.href || '',
        },
        website: (document.querySelector('.link-view-website') as HTMLAnchorElement).href,
        donate: (document.querySelector('.link-block-donate .link-view-website') as HTMLAnchorElement)?.href || '',
        investments: document.querySelector('.investment-block').textContent.includes('$')
          ? document.querySelector('.investment-block .investment-text:nth-child(2)').textContent
            .split(/(?:,|;)/g)
            .map(text => {
              const amountMatch = text.trim().match(/\$((?:\d|\.)+)(M|K|\smillion)/) ?? [],
                    amountBase = (() => {
                      switch (amountMatch[2]) {
                        case 'M':
                        case ' million':
                          return 1000000
                        case 'K':
                          return 1000
                        default:
                          return 0
                      }
                    })(),
                    amountMultiplier = Number(amountMatch[1]) ?? 0,
                    amount = amountBase * amountMultiplier,
                    typeMatch = text.match(/(?:M|K|million)(.+)/),
                    type = (typeMatch[1] ?? '')
                      .trim()
                      .toLowerCase()
                      .replace(/in convertible debt/, 'convertible debt')
                      .replace(/unrestricted grant$/, 'unrestricted grants') as Organization['investments'][0]['type']

              return { amount, type }
            })
            : [],
        created: Number((document.querySelector('.investment-block').textContent.match(/Funded since (\d+)/) ?? [])[1]) ?? 0,
        fellows: {
          rainer: document.querySelector('.investment-block .rainer a')?.textContent || '',
          henry: document.querySelector('.investment-block .henry a')?.textContent || '',
        },
        why: Array.from(document.querySelectorAll('.paragraph-block-portfolio p')).map(p => p.textContent).filter(p => p.length > 1 && p !== 'Why we invest'),
      }
    }, link)
    
    organizations.push(organization)

    console.log(organization.name)
  }

  await browser.close()

  console.log(`Scraped data on ${organizations.length} organizations`)

  return organizations
}
