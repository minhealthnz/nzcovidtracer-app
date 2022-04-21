#!/usr/bin/env bash
echo "---------NODE VERSION---------"
source ~/.nvm/nvm.sh
nvm use
nvm install
node -v
echo "---------START YARN INSTALL AND TEST---------"
yarn && yarn test
