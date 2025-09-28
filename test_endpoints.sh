#!/bin/bash

# Message Access API Test Script
# Make sure to replace YOUR_JWT_TOKEN_HERE with a valid JWT token

# Configuration
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"
BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Testing Message Access API ===${NC}"
echo

# Test 1: Health Check
echo -e "${YELLOW}1. Health Check${NC}"
response=$(curl -s -X GET $BASE_URL/ -H "Content-Type: application/json")
if [[ $response == *"Doctor voicemail API is running"* ]]; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not responding${NC}"
    echo "Response: $response"
fi
echo

# Test 2: Patient Messages (Unauthenticated)
echo -e "${YELLOW}2. Patient Messages (Unauthenticated - Should Fail)${NC}"
response=$(curl -s -X GET $BASE_URL/api/v1/patients/1/messages \
  -H "Content-Type: application/json")
if [[ $response == *"Unauthorized"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected unauthenticated request${NC}"
else
    echo -e "${RED}✗ Should have been rejected${NC}"
    echo "Response: $response"
fi
echo

# Test 3: Doctor Messages (Unauthenticated)
echo -e "${YELLOW}3. Doctor Messages (Unauthenticated - Should Fail)${NC}"
response=$(curl -s -X GET $BASE_URL/api/v1/doctors/1/messages \
  -H "Content-Type: application/json")
if [[ $response == *"Unauthorized"* ]]; then
    echo -e "${GREEN}✓ Correctly rejected unauthenticated request${NC}"
else
    echo -e "${RED}✗ Should have been rejected${NC}"
    echo "Response: $response"
fi
echo

# Test 4: Patient Messages (Authenticated) - Only if JWT token is provided
if [[ $JWT_TOKEN != "YOUR_JWT_TOKEN_HERE" ]]; then
    echo -e "${YELLOW}4. Patient Messages (Authenticated)${NC}"
    response=$(curl -s -X GET $BASE_URL/api/v1/patients/1/messages \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT_TOKEN")
    echo "Response: $response"
    echo
else
    echo -e "${YELLOW}4. Patient Messages (Authenticated) - SKIPPED${NC}"
    echo -e "${RED}Please set a valid JWT token in the script${NC}"
    echo
fi

# Test 5: Doctor Messages (Authenticated) - Only if JWT token is provided
if [[ $JWT_TOKEN != "YOUR_JWT_TOKEN_HERE" ]]; then
    echo -e "${YELLOW}5. Doctor Messages (Authenticated)${NC}"
    response=$(curl -s -X GET $BASE_URL/api/v1/doctors/1/messages \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $JWT_TOKEN")
    echo "Response: $response"
    echo
else
    echo -e "${YELLOW}5. Doctor Messages (Authenticated) - SKIPPED${NC}"
    echo -e "${RED}Please set a valid JWT token in the script${NC}"
    echo
fi

# Test 6: All Messages (No Auth Required)
echo -e "${YELLOW}6. All Messages (No Auth Required)${NC}"
response=$(curl -s -X GET $BASE_URL/api/v1/messages \
  -H "Content-Type: application/json")
echo "Response: $response"
echo

# Test 7: Invalid Patient ID
echo -e "${YELLOW}7. Invalid Patient ID${NC}"
response=$(curl -s -X GET $BASE_URL/api/v1/patients/invalid/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Response: $response"
echo

# Test 8: Invalid Doctor ID
echo -e "${YELLOW}8. Invalid Doctor ID${NC}"
response=$(curl -s -X GET $BASE_URL/api/v1/doctors/invalid/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN")
echo "Response: $response"
echo

echo -e "${BLUE}=== Test Complete ===${NC}"
echo
echo -e "${YELLOW}Note:${NC} To test authenticated endpoints, replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token"
echo -e "${YELLOW}Note:${NC} Make sure your server is running on $BASE_URL"
