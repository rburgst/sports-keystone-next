/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-next/keystone'
import * as dotenv from 'dotenv'
// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema'

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth'
import { insertSeedData } from './ks/seed-data/insert-seed-data'

dotenv.config({ debug: true, path: process.env.DOTENV_CONFIG_PATH })

const databaseURL = process.env.DATABASE_URL
const databaseProvider = process.env.DATABASE_PROVIDER
if (!databaseURL) {
  throw new Error('no DATABASE_URL in env')
}
if (!databaseProvider) {
  throw new Error('no DATABASE_PROVIDER in env')
}

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: databaseProvider as 'sqlite' | 'postgresql',
      url: databaseURL,
      enableLogging: true,
      async onConnect(context) {
        console.log('Connected to the database!')
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(context)
        }
      },
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: context => !!context.session?.data,
    },
    lists,
    session,
  })
)
