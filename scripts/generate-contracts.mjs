import { readFile, writeFile } from 'node:fs/promises'
import openapiTS, { astToString } from 'openapi-typescript'
import ts from 'typescript'

const ast = await openapiTS(new URL('../contracts/openapi.json', import.meta.url), {
 transform(schema) {
  if (schema.type === 'integer' && schema.format === 'int64') {
   return ts.factory.createUnionTypeNode([
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword),
   ])
  }
  if (schema.type === 'number') {
   return ts.factory.createUnionTypeNode([
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword),
    ts.factory.createTypeReferenceNode('LosslessNumber'),
   ])
  }
 },
})
const output = "// Generated from contracts/openapi.json; do not edit.\nimport type { LosslessNumber } from 'lossless-json'\n" + astToString(ast)
const path = new URL('../src/api/schema.d.ts', import.meta.url)
if (process.argv.includes('--check')) {
 if (await readFile(path, 'utf8') !== output) throw new Error('Generated contract types are stale: npm run contracts:generate')
} else await writeFile(path, output)
