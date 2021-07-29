#!/usr/bin/env bash

yarn inject:secrets
yarn setenv
yarn remove:nfc
