
const fs = require('fs')
const handlebars = require('handlebars')
const puppeteer = require('puppeteer')

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

const availableArguments = [
  { names: ['-s', '--sort'], description: 'Sort by \'name\'|\'as-given\'' },
  { names: ['-o', '--output'], description: 'Name of output file' },
  { names: ['-i', '--input'], description: 'File / Image names to convert to PDF' },
  { names: ['-f', '--format'], description: 'Page format of PDF file e. g. A4' }
]

function parseArguments() {
  let arguments = process.argv.slice(2)

  let returnValue = {}
  let activeArgumentName = '_'
  arguments.forEach((argument, index, array) => {
    const givenArgument = availableArguments.find((item) => {
      let result = item.names.find((name) => {
        return name === argument
      })
      return result !== undefined
    })

    if (givenArgument != undefined) {
      activeArgumentName = givenArgument.names[0]
      return
    }

    if (returnValue[activeArgumentName] === undefined) {
      returnValue[activeArgumentName] = []
    }

    returnValue[activeArgumentName].push(argument)
  })

  if (returnValue['-s']) {
    if (returnValue['-s'].length == 1) {
      if (returnValue['-s'][0] === 'name') {
        returnValue['-i'] = returnValue['-i'].sort((a, b) => a.localeCompare(b, 'en', { numberic: true }))
      }
    }
  }

  return returnValue;
}

try {
  let data = { "data": [] };
  const arguments = parseArguments()
  arguments['-i'].forEach((item) => {
    const image = fs.readFileSync(item)
    const imageNameParts = item.split('.')
    const type = imageNameParts.length > 1 ? imageNameParts[imageNameParts.length-1] : 'png'

    data.data.push({ "src": `data:image/${type};base64,${image.toString('base64')}` })
  })

  const source = fs.readFileSync('./template.html', 'utf8')
  const template = handlebars.compile(source)
  const content = template(data)

  console.log('Creating PDF...')
  puppeteer.launch().then((browser) => {
    browser.newPage().then((page) => {
      page.setContent(content).then(() => {
        let output = arguments['-o'] ? arguments['-o'][0] : 'output.pdf'
        let format = arguments['-f'] ? arguments['-f'][0] : 'A4'
        page.pdf({path: output, format: format}).then(() => {
          browser.close().then(() => {
            console.log('PDF Created...')
          })
        })
      })
    })
  })
} catch(err) {
  console.error(`Not able to create PDF: ${err}`)
}
