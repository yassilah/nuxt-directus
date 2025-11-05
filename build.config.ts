import { defineBuildConfig } from 'unbuild'
import fs from 'node:fs'
import path from 'node:path'

export default defineBuildConfig({
  hooks: {
    'build:done': async (ctx) => {
      const aliasPattern = '<Schema>'
      for (const file of ctx.buildEntries) {
        const filePath = path.join(ctx.options.outDir, file.path)
        if (filePath.endsWith('.d.ts')) {
          let content = fs.readFileSync(filePath, 'utf8')
          content = content.replaceAll(aliasPattern, '<import(\'#directus/types\').Schema>')
          fs.writeFileSync(filePath, content)
        }
      }
    },
  },
})
