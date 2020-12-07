#!/usr/bin/env bash

# TODO Remove temporary fix after https://github.com/realm/realm-js/pull/3321 is merged

cp ./scripts/fixRealmTests/extensions.js ./node_modules/realm/lib/extensions.js
