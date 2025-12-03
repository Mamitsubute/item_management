#!/bin/bash -e
# (Using -e, terminate processing at the line where there is a command error)

# Download and unzip the latest version of magicpod-api-client to the current directory
# For security, MAGICPOD_API_TOKEN is set using the GitHub Actions environment variables
OS=linux  # Specify windows for builds on Windows machines and linux for builds on Linux machines
FILENAME=magicpod-api-client  # Any file name
curl -L "https://app.magicpod.com/api/v1.0/magicpod-clients/api/${OS}/latest/" -H "Authorization: Token ${MAGICPOD_API_TOKEN}" --output ${FILENAME}.zip
unzip -q ${FILENAME}.zip

# Set the various environment variables used on MagicPod
export MAGICPOD_ORGANIZATION= "MagicPod-ishii"
export MAGICPOD_PROJECT="DemoBrowser"

# Run batch test
TEST_SETTING_NUMBER=27
./magicpod-api-client batch-run -S ${TEST_SETTING_NUMBER}
