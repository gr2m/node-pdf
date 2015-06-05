module.exports = PDF

var add = require('./lib/add')
var getContent = require('./lib/get-content')
var uniqueNr = require('./lib/utils/unique-nr')

PDF.version = '1.3'
PDF.plugins = require('./lib/core-plugins')
PDF.plugin = require('./lib/plugin').bind(null, PDF.plugins)

/**
 * Constructor
 *
 * doc = new PDF(options)
 **/
function PDF (options) {
  var internals = {
    uniqueNr: 0
  }

  var infoId = uniqueNr({internals: internals})
  var catalogId = uniqueNr({internals: internals})
  var pageTreeId = uniqueNr({internals: internals})
  var resourcesId = uniqueNr({internals: internals})
  var firstPageId = uniqueNr({internals: internals})

  var currentPage = {
    id: firstPageId,
    contents: []
  }
  var state = {
    version: PDF.version,
    ids: {
      info: infoId,
      catalog: catalogId,
      pageTree: pageTreeId,
      resources: resourcesId
    },
    options: setDefault(options),
    currentPage: currentPage,
    pages: [currentPage],
    resources: {
      fonts: {}
    },
    internals: internals,
    plugins: PDF.plugins
  }

  var api = {
    add: add.bind(null, state),
    getContent: getContent.bind(null, state)
  }

  return api
}

function setDefault (options) {
  if (!options) options = {}
  if (!options.creator) options.creator = 'dream-pdf'
  if (!options.producer) options.producer = 'dream-pdf'
  if (!options.createdAt) options.createdAt = new Date()
  if (!options.dimensions) {
    options.dimensions = {
      // A4 portrait in pdf points (1/72 inch)
      width: 595.28,
      height: 841.89
    }
  }
  return options
}
