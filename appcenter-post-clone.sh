#!/usr/bin/env bash
echo "---------NODE VERSION---------"
node -v
echo "---------START YARN INSTALL AND TEST---------"
yarn && yarn test
cd ios && pod install && cd ..
