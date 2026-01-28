import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('PAYLOAD_SECRET loaded:', process.env.PAYLOAD_SECRET ? 'YES' : 'NO')
console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO')

async function seed() {
  console.log('Starting seeding...')
  try {
    // Dynamic imports to ensure dotenv.config() has run
    const { getPayload } = await import('payload')
    const configModule = await import('../src/payload.config')
    const config = configModule.default

    const payload = await getPayload({ config })

    const countries = [
      {
        name: 'Slovensko',
        code: 'SK',
        regions: [
          'Bratislavský kraj',
          'Trnavský kraj',
          'Trenčiansky kraj',
          'Nitriansky kraj',
          'Žilinský kraj',
          'Banskobystrický kraj',
          'Prešovský kraj',
          'Košický kraj',
        ],
      },
      {
        name: 'Česko',
        code: 'CZ',
        regions: [
          'Praha',
          'Středočeský kraj',
          'Jihočeský kraj',
          'Plzeňský kraj',
          'Karlovarský kraj',
          'Ústecký kraj',
          'Liberecký kraj',
          'Královéhradecký kraj',
          'Pardubický kraj',
          'Kraj Vysočina',
          'Jihomoravský kraj',
          'Olomoucký kraj',
          'Zlínský kraj',
          'Moravskoslezský kraj',
        ],
      },
    ]

    for (const countryData of countries) {
      // Check if country exists
      const existingCountries = await payload.find({
        collection: 'countries',
        where: {
          code: {
            equals: countryData.code,
          },
        },
      })

      let countryId: number

      if (existingCountries.docs.length > 0) {
        countryId = Number(existingCountries.docs[0].id)
        console.log(`Country ${countryData.name} already exists (ID: ${countryId}).`)
      } else {
        const country = await payload.create({
          collection: 'countries',
          data: {
            name: countryData.name,
            code: countryData.code,
          },
        })
        countryId = Number(country.id)
        console.log(`Created country ${countryData.name} (ID: ${countryId}).`)
      }

      // Add regions
      for (const regionName of countryData.regions) {
        const existingRegions = await payload.find({
          collection: 'regions',
          where: {
            and: [
              {
                name: {
                  equals: regionName,
                },
              },
              {
                country: {
                  equals: countryId,
                },
              },
            ],
          },
        })

        if (existingRegions.docs.length > 0) {
          console.log(`Region ${regionName} already exists for ${countryData.name}.`)
        } else {
          await payload.create({
            collection: 'regions',
            data: {
              name: regionName,
              country: countryId,
            },
          })
          console.log(`Created region ${regionName} for ${countryData.name}.`)
        }
      }
    }

    console.log('Seeding completed successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

seed()
