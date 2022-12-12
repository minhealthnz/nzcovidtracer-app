#!/usr/bin/env bash
echo "---------NODE VERSION---------"
node -v
echo "---------START YARN INSTALL ---------"
yarn
cd ios && pod install && cd ..
