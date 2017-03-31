#!/bin/bash

# A simple script to check licenses of transitive npm packages

# Install lerna to run the project build and node-license-validator to check licenses of transitive deps
npm install -g lerna node-license-validator

# Run npm install only for production (bundled) dependencies
npm install --production

# Check licenses for each lerna package
for d in packages/*; do
  echo "Validating licenses on $d..."
  node-license-validator --dir $d --allow-licenses WTFPL Apache Apache-2 "Apache License, Version 2.0" BSD-like BSD BSD-2-Clause BSD-3-Clause Apache-2.0 MIT ISC Unlicense MIT/X11 "MIT / http://rem.mit-license.org" "Public Domain" --allow-packages buffers@0.1.1 extsprintf@1.0.2 map-stream@0.1.0 verror@1.3.6
done
