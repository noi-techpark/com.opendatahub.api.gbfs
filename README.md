<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->
[![REUSE Compliance](https://github.com/noi-techpark/com.opendatahub.api.gbfs/actions/workflows/reuse.yml/badge.svg)](https://github.com/noi-techpark/odh-docs/wiki/REUSE#badges)

# GBFS API server

This repo contains the Open Data Hub GBFS API

It's goal is to provide a single access point where Open Data Hub users can discover GBFS feeds and some metadata related to them.

# Usage
A calls.http file with example calls is provided. To use it, you have to install the VSCode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or something compatible

## List available datasets
```
GET /v1/dataset -> application/json  
```  

Returns a map of available GBFS datasets by ID
```
{
    "<dataset id>": {
        "description": String,
        "endpoint": String(URL),
        "origin": String
        "license": String
        "metadata": JSON
    },
...
```
`dataset id` the unique identifier of the dataset used in other calls  
`description` A short description of the dataset  
`endpoint` URL that points to the raw GBFS zip file download  
`origin` Name of the data provider  
`license` SPDX license identifier under which the data is provided  
`medadata` A free form JSON that may provide additional information

For the most part, these are defined verbatim in the [datasets.yml](datasets.yml) file 

## Get metadata information of a specific dataset
```
GET /v1/dataset/<dataset id> -> application/json  
```  

The same as [this call](#list-available-datasets) but restricted to a specific dataset


# Development
## Installation
`docker-compose up` to start your local development environment

if you don't want to use docker, try
`npm install`
`npm run dev`

## Dataset configuration
Datasets are configured in datasets.yml

## REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:
```bash
pip install pre-commit
```
Then install the pre-commit hook via the config file by running:
```bash
pre-commit install
```