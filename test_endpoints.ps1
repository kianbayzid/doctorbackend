# Message Access API Test Script for PowerShell
# Make sure to replace YOUR_JWT_TOKEN_HERE with a valid JWT token

# Configuration
$JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"
$BASE_URL = "http://localhost:3000"

Write-Host "=== Testing Message Access API ===" -ForegroundColor Blue
Write-Host ""

# Test 1: Health Check
Write-Host "1. Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/" -Method GET -ContentType "application/json"
    if ($response -like "*Doctor voicemail API is running*") {
        Write-Host "✓ Server is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Server response unexpected" -ForegroundColor Red
        Write-Host "Response: $response"
    }
} catch {
    Write-Host "✗ Server is not responding" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
}
Write-Host ""

# Test 2: Patient Messages (Unauthenticated)
Write-Host "2. Patient Messages (Unauthenticated - Should Fail)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/patients/1/messages" -Method GET -ContentType "application/json"
    Write-Host "✗ Should have been rejected" -ForegroundColor Red
    Write-Host "Response: $response"
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Correctly rejected unauthenticated request" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)"
    }
}
Write-Host ""

# Test 3: Doctor Messages (Unauthenticated)
Write-Host "3. Doctor Messages (Unauthenticated - Should Fail)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/doctors/1/messages" -Method GET -ContentType "application/json"
    Write-Host "✗ Should have been rejected" -ForegroundColor Red
    Write-Host "Response: $response"
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Correctly rejected unauthenticated request" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)"
    }
}
Write-Host ""

# Test 4: Patient Messages (Authenticated) - Only if JWT token is provided
if ($JWT_TOKEN -ne "YOUR_JWT_TOKEN_HERE") {
    Write-Host "4. Patient Messages (Authenticated)" -ForegroundColor Yellow
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $JWT_TOKEN"
        }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/patients/1/messages" -Method GET -Headers $headers
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "4. Patient Messages (Authenticated) - SKIPPED" -ForegroundColor Yellow
    Write-Host "Please set a valid JWT token in the script" -ForegroundColor Red
}
Write-Host ""

# Test 5: Doctor Messages (Authenticated) - Only if JWT token is provided
if ($JWT_TOKEN -ne "YOUR_JWT_TOKEN_HERE") {
    Write-Host "5. Doctor Messages (Authenticated)" -ForegroundColor Yellow
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $JWT_TOKEN"
        }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/doctors/1/messages" -Method GET -Headers $headers
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "5. Doctor Messages (Authenticated) - SKIPPED" -ForegroundColor Yellow
    Write-Host "Please set a valid JWT token in the script" -ForegroundColor Red
}
Write-Host ""

# Test 6: All Messages (No Auth Required)
Write-Host "6. All Messages (No Auth Required)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/messages" -Method GET -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Invalid Patient ID
Write-Host "7. Invalid Patient ID" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $JWT_TOKEN"
    }
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/patients/invalid/messages" -Method GET -Headers $headers
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Invalid Doctor ID
Write-Host "8. Invalid Doctor ID" -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $JWT_TOKEN"
    }
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/doctors/invalid/messages" -Method GET -Headers $headers
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Blue
Write-Host ""
Write-Host "Note: To test authenticated endpoints, replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token" -ForegroundColor Yellow
Write-Host "Note: Make sure your server is running on $BASE_URL" -ForegroundColor Yellow
