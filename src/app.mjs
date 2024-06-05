// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as dotenv from 'dotenv'
import express, { Router } from 'express'
import yaml from 'js-yaml'
import fs from 'fs'
import pino from 'pino-http'
import cors from 'cors'


dotenv.config()
const datastoreConfigs = yaml.load(fs.readFileSync('datasets.yml')).datasets
const app = express()
const router = Router()
const port = 3000
const pinoHttp = pino({ level: process.env.LOG_LEVEL })

app.use(pinoHttp)
app.use(cors())
app.set('trust proxy')

function assembleMetadata(id, cfg) {
  return {
    description: cfg.description,
    endpoint: cfg.endpoint,
    origin: cfg.origin,
    license: cfg.license,
    metadata: cfg.metadata,
  }
}

function error(res, status, msg) {
  res.status(status)
  res.send({ error: msg })
}

router.get('/dataset', (req, res) => {
  res.json(Object.fromEntries(
    Object.entries(datastoreConfigs)
      .map(([id, cfg]) => [id, assembleMetadata(id, cfg)])))
})

router.get('/dataset/:dataset', (req, res) => {
  const datasetId = req.params.dataset
  const config = datastoreConfigs[datasetId]
  if (!config) {
    return error(res, 404, `Dataset ${datasetId} not found!`)
  }
  res.json(assembleMetadata(datasetId, config))
})

// Openapi stuff
const apiSpecUrl = `${process.env.API_BASE_URL}/v1/apispec`
const redirectSwagger = (req, res) => {
  res.redirect(`https://swagger.opendatahub.com/?url=${apiSpecUrl}`)
}
const openapiRouter = Router()
openapiRouter.get('/', redirectSwagger)
router.get('/', redirectSwagger)

// Load openapi spec in memory, replace the Server URL placeholder with our configured one
const apiSpecContent = fs.readFileSync('openapi3.yml', { encoding: 'utf8' })
  .replace('__API_BASE_URL__', process.env.API_BASE_URL)

router.get('/apispec', (req, res) => {
  res.set('Content-Type', 'application/yaml')
  res.send(apiSpecContent)
})

app.use('/', openapiRouter)
app.use('/v1/', router) // use v1 prefix for all URLs
app.listen(port, () => {
  console.log(`GBFS API listening on port ${port}`)
})
