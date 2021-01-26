// Run this to generate the schema.graphql file used by relay compiler.
// This is just the schema that is passed to the apollo server.

import { typeDefs } from './src/schema'
import fs from 'fs'
import { DocumentNode } from 'graphql'
import matchAll from 'string.prototype.matchall'
matchAll.shim()

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body
}

let concat = typeDefs.map(getGqlString).join('\n')

// unfortunately, relay compiler won't detect `extend type ...` fields for some reason.
// So combine them into the same type here!
const extended = concat.matchAll(
  /  extend type ([a-zA-Z]+)\s*{((?:.|\n)*?)\n {2}}/g,
)
for (const match of extended) {
  const entire = match[0]
  const typeName = match[1]
  const contents = match[2]

  concat = concat.replace(entire, '')

  const rootTypeRegex = new RegExp('\n  type ' + typeName + ' {')
  concat = concat.replace(rootTypeRegex, (substring) => substring + contents)
}

if (!fs.existsSync('./src/__generated__/')) {
  fs.mkdirSync('./src/__generated__/')
}
fs.writeFileSync('./src/__generated__/schema.graphql', concat)
