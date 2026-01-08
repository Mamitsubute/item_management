#!/bin/bash -e

OS=mac
FILENAME=magicpod-api-client

curl -L "https://app.magicpod.com/api/v1.0/magicpod-clients/api/${OS}/latest/" -H "Authorization: Token ${MAGICPOD_API_TOKEN}" --output ${FILENAME}.zip
unzip -q ${FILENAME}.zip

export MAGICPOD_ORGANIZATION="MagicPod-ishii"
export MAGICPOD_PROJECT="DemoBrowser"

# クラウド端末の空きが出るまで待機する (最大10分)
DEVICE_TYPE=browser  # 必要に応じて'mobile_app'に変更
API_ENDPOINT="https://app.magicpod.com/api/v1.0/${MAGICPOD_ORGANIZATION}/cloud-devices/"
MAX_WAIT_TIME=600
POLL_INTERVAL=30
START_TIME=$(date +%s)

echo "Waiting for cloud device availability..."

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED_TIME -ge $MAX_WAIT_TIME ]; then
        echo "Timeout: No cloud device available after 10 minutes"
        exit 1
    fi
    
    RESPONSE=$(curl -s -H "Authorization: Token ${MAGICPOD_API_TOKEN}" "${API_ENDPOINT}")
    
    AVAILABLE=$(echo "$RESPONSE" | jq -r ".${DEVICE_TYPE}.batch_test_run.available")

    if [ "$AVAILABLE" -ge 1 ]; then
        echo "Cloud device is available. Starting test run..."
        break
    fi
    
    echo "No available device. Retrying in ${POLL_INTERVAL} seconds..."
    sleep $POLL_INTERVAL
done

# Run batch test
TEST_SETTING_NUMBER=27
./magicpod-api-client batch-run -S ${TEST_SETTING_NUMBER}
