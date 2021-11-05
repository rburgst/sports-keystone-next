/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from '@keystone-next/keystone'

// We're using some common fields in the starter. Check out https://keystonejs.com/docs/apis/fields#fields-api
// for the full list of fields.
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-next/keystone/fields'
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { User, Role } from './ks/schema/User'
import { Club } from './ks/schema/Club'
import { Athlete } from './ks/schema/Athlete'
import { Team } from './ks/schema/Team'

// We have a users list, a blogs list, and tags for blog posts, so they can be filtered.
// Each property on the exported object will become the name of a list (a.k.a. the `listKey`),
// with the value being the definition of the list, including the fields.
export const lists = {
  // Here we define the user list.
  User,
  Role,
  // Our second list is the Posts list. We've got a few more fields here
  // so we have all the info we need for displaying posts.
  Club,
  Athlete,
  Team,
}
