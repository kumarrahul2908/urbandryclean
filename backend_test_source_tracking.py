#!/usr/bin/env python3
"""
Targeted backend test for pickup-lead source tracking.
Tests POST /api/leads with different source values and verifies admin GET returns correct source.
"""
import os
import sys
import httpx

# Read from .env file
def read_env():
    env_path = '/app/.env'
    env_vars = {}
    try:
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    except Exception as e:
        print(f"Warning: Could not read .env file: {e}")
    return env_vars

env_vars = read_env()
BASE_URL = env_vars.get('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@urbandryclean.in"
ADMIN_PASSWORD = "UrbanAdmin@2026"

print(f"Testing on: {BASE_URL}")
print("=" * 80)

# Track test IDs for cleanup
test_ids = []

def test_post_leads_header_form():
    """Test 1: POST /api/leads with source=header_form"""
    print("\n[TEST 1] POST /api/leads with source='header_form'")
    payload = {
        "phone": "+91 9876500001",
        "name": "Header Test",
        "address": "Addr 1",
        "date": "2026-06-05",
        "time": "10:00",
        "source": "header_form"
    }
    try:
        r = httpx.post(f"{API_BASE}/leads", json=payload, timeout=10)
        print(f"  Status: {r.status_code}")
        print(f"  Response: {r.text[:200]}")
        
        if r.status_code != 200:
            print(f"  ❌ FAILED: Expected 200, got {r.status_code}")
            return None
        
        data = r.json()
        if not data.get('ok'):
            print(f"  ❌ FAILED: Expected ok=true, got {data}")
            return None
        
        lead_id = data.get('id')
        if not lead_id:
            print(f"  ❌ FAILED: No id in response")
            return None
        
        print(f"  ✅ PASSED: Created lead with id={lead_id}")
        return lead_id
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return None

def test_post_leads_book_pickup_page():
    """Test 2: POST /api/leads with source=book_pickup_page"""
    print("\n[TEST 2] POST /api/leads with source='book_pickup_page'")
    payload = {
        "phone": "+91 9876500002",
        "name": "Standalone Test",
        "address": "Addr 2",
        "date": "2026-06-06",
        "time": "11:00",
        "source": "book_pickup_page"
    }
    try:
        r = httpx.post(f"{API_BASE}/leads", json=payload, timeout=10)
        print(f"  Status: {r.status_code}")
        print(f"  Response: {r.text[:200]}")
        
        if r.status_code != 200:
            print(f"  ❌ FAILED: Expected 200, got {r.status_code}")
            return None
        
        data = r.json()
        if not data.get('ok'):
            print(f"  ❌ FAILED: Expected ok=true, got {data}")
            return None
        
        lead_id = data.get('id')
        if not lead_id:
            print(f"  ❌ FAILED: No id in response")
            return None
        
        print(f"  ✅ PASSED: Created lead with id={lead_id}")
        return lead_id
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return None

def test_post_leads_empty_phone():
    """Test 3: POST /api/leads with empty phone"""
    print("\n[TEST 3] POST /api/leads with empty phone")
    payload = {"phone": ""}
    try:
        r = httpx.post(f"{API_BASE}/leads", json=payload, timeout=10)
        print(f"  Status: {r.status_code}")
        print(f"  Response: {r.text[:200]}")
        
        if r.status_code != 400:
            print(f"  ❌ FAILED: Expected 400, got {r.status_code}")
            return False
        
        data = r.json()
        error_msg = data.get('error', '')
        if 'mobile' not in error_msg.lower() or 'required' not in error_msg.lower():
            print(f"  ❌ FAILED: Expected error about mobile required, got: {error_msg}")
            return False
        
        print(f"  ✅ PASSED: Got 400 with error: {error_msg}")
        return True
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return False

def test_post_leads_invalid_phone():
    """Test 4: POST /api/leads with invalid phone"""
    print("\n[TEST 4] POST /api/leads with invalid phone 'abc'")
    payload = {"phone": "abc"}
    try:
        r = httpx.post(f"{API_BASE}/leads", json=payload, timeout=10)
        print(f"  Status: {r.status_code}")
        print(f"  Response: {r.text[:200]}")
        
        if r.status_code != 400:
            print(f"  ❌ FAILED: Expected 400, got {r.status_code}")
            return False
        
        data = r.json()
        error_msg = data.get('error', '')
        if 'valid' not in error_msg.lower() or 'mobile' not in error_msg.lower():
            print(f"  ❌ FAILED: Expected error about valid mobile, got: {error_msg}")
            return False
        
        print(f"  ✅ PASSED: Got 400 with error: {error_msg}")
        return True
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return False

def test_admin_login():
    """Test 5: Login as admin"""
    print("\n[TEST 5] POST /api/admin/login")
    payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    try:
        # Use a client to maintain cookies
        client = httpx.Client(timeout=10)
        r = client.post(f"{API_BASE}/admin/login", json=payload)
        print(f"  Status: {r.status_code}")
        
        if r.status_code != 200:
            print(f"  ❌ FAILED: Expected 200, got {r.status_code}")
            print(f"  Response: {r.text[:200]}")
            client.close()
            return None
        
        cookies = r.cookies
        if 'udc_admin' not in cookies:
            print(f"  ❌ FAILED: No udc_admin cookie in response")
            client.close()
            return None
        
        print(f"  ✅ PASSED: Login successful, cookie set")
        return client
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return None

def test_admin_get_leads(client, header_id, page_id):
    """Test 6: GET /api/admin/leads and verify source values"""
    print("\n[TEST 6] GET /api/admin/leads with cookie")
    try:
        r = client.get(f"{API_BASE}/admin/leads")
        print(f"  Status: {r.status_code}")
        
        if r.status_code != 200:
            print(f"  ❌ FAILED: Expected 200, got {r.status_code}")
            print(f"  Response: {r.text[:200]}")
            return False
        
        data = r.json()
        items = data.get('items', [])
        print(f"  Total leads returned: {len(items)}")
        
        # Check that items have required fields
        if not items:
            print(f"  ❌ FAILED: No items returned")
            return False
        
        sample = items[0]
        required_fields = ['_id', 'phone', 'source', 'status', 'created_at']
        missing = [f for f in required_fields if f not in sample]
        if missing:
            print(f"  ❌ FAILED: Missing fields in items: {missing}")
            return False
        
        print(f"  ✅ Items have required fields: {required_fields}")
        
        # Find our test leads
        header_lead = None
        page_lead = None
        
        for item in items:
            if item['_id'] == header_id:
                header_lead = item
            if item['_id'] == page_id:
                page_lead = item
        
        if not header_lead:
            print(f"  ❌ FAILED: Header lead (id={header_id}) not found in items")
            return False
        
        if not page_lead:
            print(f"  ❌ FAILED: Page lead (id={page_id}) not found in items")
            return False
        
        print(f"  ✅ Both test leads found in items")
        
        # Verify source values
        header_source = header_lead.get('source')
        page_source = page_lead.get('source')
        
        print(f"  Header lead source: '{header_source}' (expected: 'header_form')")
        print(f"  Page lead source: '{page_source}' (expected: 'book_pickup_page')")
        
        if header_source != 'header_form':
            print(f"  ❌ FAILED: Header lead source mismatch. Expected 'header_form', got '{header_source}'")
            return False
        
        if page_source != 'book_pickup_page':
            print(f"  ❌ FAILED: Page lead source mismatch. Expected 'book_pickup_page', got '{page_source}'")
            return False
        
        print(f"  ✅ PASSED: Both source values match exactly")
        return True
        
    except Exception as e:
        print(f"  ❌ FAILED: {e}")
        return False

def cleanup_test_leads(client, lead_ids):
    """Cleanup: Delete test leads"""
    print("\n[CLEANUP] Deleting test leads")
    for lead_id in lead_ids:
        try:
            r = client.delete(f"{API_BASE}/admin/leads/{lead_id}")
            if r.status_code == 200:
                print(f"  ✅ Deleted lead {lead_id}")
            else:
                print(f"  ⚠️  Failed to delete lead {lead_id}: {r.status_code}")
        except Exception as e:
            print(f"  ⚠️  Error deleting lead {lead_id}: {e}")

def main():
    print("\n" + "=" * 80)
    print("TARGETED TEST: Pickup-Lead Source Tracking")
    print("=" * 80)
    
    results = {
        'passed': 0,
        'failed': 0,
        'total': 6
    }
    
    # Test 1: POST with source=header_form
    header_id = test_post_leads_header_form()
    if header_id:
        results['passed'] += 1
        test_ids.append(header_id)
    else:
        results['failed'] += 1
    
    # Test 2: POST with source=book_pickup_page
    page_id = test_post_leads_book_pickup_page()
    if page_id:
        results['passed'] += 1
        test_ids.append(page_id)
    else:
        results['failed'] += 1
    
    # Test 3: Empty phone validation
    if test_post_leads_empty_phone():
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Test 4: Invalid phone validation
    if test_post_leads_invalid_phone():
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Test 5: Admin login
    client = test_admin_login()
    if client:
        results['passed'] += 1
    else:
        results['failed'] += 1
        print("\n" + "=" * 80)
        print(f"FINAL RESULTS: {results['passed']}/{results['total']} PASSED")
        print("=" * 80)
        sys.exit(1)
    
    # Test 6: Admin GET leads and verify source
    if header_id and page_id:
        if test_admin_get_leads(client, header_id, page_id):
            results['passed'] += 1
        else:
            results['failed'] += 1
    else:
        print("\n[TEST 6] SKIPPED: Missing test lead IDs")
        results['failed'] += 1
    
    # Cleanup
    if test_ids and client:
        cleanup_test_leads(client, test_ids)
        client.close()
    
    # Final summary
    print("\n" + "=" * 80)
    print(f"FINAL RESULTS: {results['passed']}/{results['total']} PASSED")
    if results['failed'] > 0:
        print(f"FAILED: {results['failed']} tests")
    print("=" * 80)
    
    if results['failed'] > 0:
        sys.exit(1)
    else:
        print("\n✅ ALL TESTS PASSED - Source tracking is working correctly")
        sys.exit(0)

if __name__ == '__main__':
    main()
