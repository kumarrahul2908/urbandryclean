#!/usr/bin/env python3
"""
Backend API Test Suite for Urban Dry Clean
Tests all API endpoints, sitemap, robots.txt, and static assets on preview environment.
"""

import requests
import json
import sys

BASE_URL = "https://premium-cleaning-20.preview.emergentagent.com"

def test_get_health():
    """Test GET /api/health endpoint"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/health")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify JSON structure
        data = response.json()
        assert 'status' in data, "Missing 'status' field"
        assert data['status'] == 'ok', f"Expected status='ok', got {data['status']}"
        assert 'service' in data, "Missing 'service' field"
        assert data['service'] == 'Urban Dry Clean', f"Expected service='Urban Dry Clean', got {data['service']}"
        assert 'timestamp' in data, "Missing 'timestamp' field"
        assert isinstance(data['timestamp'], str), "Timestamp should be a string"
        
        print("✅ TEST PASSED: GET /api/health returns correct health payload")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_get_api_root():
    """Test GET /api/ (empty catch-all root)"""
    print("\n" + "="*80)
    print("TEST 2: GET /api/ (empty catch-all)")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify JSON structure (same as health)
        data = response.json()
        assert 'status' in data, "Missing 'status' field"
        assert data['status'] == 'ok', f"Expected status='ok', got {data['status']}"
        assert 'service' in data, "Missing 'service' field"
        assert data['service'] == 'Urban Dry Clean', f"Expected service='Urban Dry Clean', got {data['service']}"
        assert 'timestamp' in data, "Missing 'timestamp' field"
        
        print("✅ TEST PASSED: GET /api/ returns health payload")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_get_unknown_path():
    """Test GET /api/unknown-path returns 404"""
    print("\n" + "="*80)
    print("TEST 3: GET /api/unknown-path (expect 404)")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/api/unknown-path", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        # Verify JSON structure
        data = response.json()
        assert 'error' in data, "Missing 'error' field"
        assert data['error'] == 'Not found', f"Expected error='Not found', got {data['error']}"
        
        print("✅ TEST PASSED: GET /api/unknown-path returns 404 with error")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_post_enquiry_valid():
    """Test POST /api/enquiry with valid JSON payload"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/enquiry (valid payload)")
    print("="*80)
    try:
        payload = {
            "name": "Test User",
            "phone": "+919999999999",
            "service": "Dry Cleaning"
        }
        headers = {"Content-Type": "application/json"}
        response = requests.post(f"{BASE_URL}/api/enquiry", json=payload, headers=headers, timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify JSON structure
        data = response.json()
        assert 'status' in data, "Missing 'status' field"
        assert data['status'] == 'received', f"Expected status='received', got {data['status']}"
        assert 'echo' in data, "Missing 'echo' field"
        assert data['echo']['name'] == payload['name'], "Echo name mismatch"
        assert data['echo']['phone'] == payload['phone'], "Echo phone mismatch"
        assert data['echo']['service'] == payload['service'], "Echo service mismatch"
        
        print("✅ TEST PASSED: POST /api/enquiry with valid payload returns 200 with echo")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_post_enquiry_invalid():
    """Test POST /api/enquiry with invalid JSON payload"""
    print("\n" + "="*80)
    print("TEST 5: POST /api/enquiry (invalid payload)")
    print("="*80)
    try:
        headers = {"Content-Type": "application/json"}
        # Send malformed JSON
        response = requests.post(f"{BASE_URL}/api/enquiry", data="invalid json", headers=headers, timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        
        # Verify JSON structure
        data = response.json()
        assert 'error' in data, "Missing 'error' field"
        assert data['error'] == 'Invalid payload', f"Expected error='Invalid payload', got {data['error']}"
        
        print("✅ TEST PASSED: POST /api/enquiry with invalid payload returns 400 with error")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_post_unknown():
    """Test POST /api/unknown returns 404"""
    print("\n" + "="*80)
    print("TEST 6: POST /api/unknown (expect 404)")
    print("="*80)
    try:
        payload = {"test": "data"}
        response = requests.post(f"{BASE_URL}/api/unknown", json=payload, timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Verify status code
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        # Verify JSON structure
        data = response.json()
        assert 'error' in data, "Missing 'error' field"
        assert data['error'] == 'Not found', f"Expected error='Not found', got {data['error']}"
        
        print("✅ TEST PASSED: POST /api/unknown returns 404 with error")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_get_sitemap():
    """Test GET /sitemap.xml"""
    print("\n" + "="*80)
    print("TEST 7: GET /sitemap.xml")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/sitemap.xml", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"✓ Response Body (first 500 chars): {response.text[:500]}")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify content type
        content_type = response.headers.get('Content-Type', '')
        assert 'xml' in content_type.lower(), f"Expected XML content type, got {content_type}"
        
        # Verify XML structure
        body = response.text
        assert body.startswith('<?xml'), "XML should start with <?xml"
        
        # Verify all 6 URLs are present
        expected_urls = [
            'https://urbandryclean.in',
            'https://urbandryclean.in/services',
            'https://urbandryclean.in/price-list',
            'https://urbandryclean.in/about',
            'https://urbandryclean.in/faq',
            'https://urbandryclean.in/contact'
        ]
        
        for url in expected_urls:
            assert url in body, f"Missing URL in sitemap: {url}"
        
        print(f"✓ All 6 expected URLs found in sitemap")
        print("✅ TEST PASSED: GET /sitemap.xml returns valid XML with all URLs")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_get_robots():
    """Test GET /robots.txt"""
    print("\n" + "="*80)
    print("TEST 8: GET /robots.txt")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/robots.txt", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"✓ Response Body:\n{response.text}")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify content type
        content_type = response.headers.get('Content-Type', '')
        assert 'text' in content_type.lower(), f"Expected text content type, got {content_type}"
        
        # Verify required content
        body = response.text
        assert 'User-Agent: *' in body or 'User-agent: *' in body, "Missing 'User-Agent: *'"
        assert 'Allow: /' in body, "Missing 'Allow: /'"
        assert 'Disallow: /api/' in body, "Missing 'Disallow: /api/'"
        assert 'Sitemap: https://urbandryclean.in/sitemap.xml' in body, "Missing sitemap URL"
        assert 'Host: https://urbandryclean.in' in body, "Missing host URL"
        
        print("✅ TEST PASSED: GET /robots.txt returns valid robots.txt with all required directives")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def test_get_logo():
    """Test GET /logo.jpg"""
    print("\n" + "="*80)
    print("TEST 9: GET /logo.jpg")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/logo.jpg", timeout=10)
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"✓ Content-Length: {len(response.content)} bytes")
        
        # Verify status code
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Verify content type
        content_type = response.headers.get('Content-Type', '')
        assert 'image/jpeg' in content_type.lower() or 'image/jpg' in content_type.lower(), f"Expected image/jpeg, got {content_type}"
        
        # Verify size (approximately 60 KB = ~60000 bytes, allow ±10KB range)
        size = len(response.content)
        assert 50000 <= size <= 70000, f"Expected size ~60KB (50-70KB range), got {size} bytes"
        
        print(f"✓ Logo size is within expected range (~60KB)")
        print("✅ TEST PASSED: GET /logo.jpg returns valid JPEG image")
        return True
    except Exception as e:
        print(f"❌ TEST FAILED: {str(e)}")
        return False

def main():
    """Run all tests and report results"""
    print("\n" + "="*80)
    print("URBAN DRY CLEAN - BACKEND API TEST SUITE")
    print(f"Testing against: {BASE_URL}")
    print("="*80)
    
    tests = [
        ("GET /api/health", test_get_health),
        ("GET /api/ (root)", test_get_api_root),
        ("GET /api/unknown-path (404)", test_get_unknown_path),
        ("POST /api/enquiry (valid)", test_post_enquiry_valid),
        ("POST /api/enquiry (invalid)", test_post_enquiry_invalid),
        ("POST /api/unknown (404)", test_post_unknown),
        ("GET /sitemap.xml", test_get_sitemap),
        ("GET /robots.txt", test_get_robots),
        ("GET /logo.jpg", test_get_logo),
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
