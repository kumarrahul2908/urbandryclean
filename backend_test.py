#!/usr/bin/env python3
"""
Comprehensive backend test for Urban Dry Clean Admin Panel MVP
Tests all 34 checks from the review request
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://premium-cleaning-20.preview.emergentagent.com"
ADMIN_EMAIL = "admin@urbandryclean.in"
ADMIN_PASSWORD = "UrbanAdmin@2026"

# Test results tracking
tests_passed = 0
tests_failed = 0
test_results = []

def log_test(test_num: int, description: str, passed: bool, details: str = ""):
    """Log test result"""
    global tests_passed, tests_failed
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{test_num}. {status}: {description}"
    if details:
        result += f"\n   Details: {details}"
    print(result)
    test_results.append({"num": test_num, "desc": description, "passed": passed, "details": details})
    if passed:
        tests_passed += 1
    else:
        tests_failed += 1

def check_json_response(response: requests.Response, expected_status: int, expected_keys: list = None) -> tuple[bool, str]:
    """Helper to validate JSON response"""
    if response.status_code != expected_status:
        return False, f"Expected status {expected_status}, got {response.status_code}"
    
    try:
        data = response.json()
    except Exception:
        return False, f"Response is not valid JSON: {response.text[:200]}"
    
    if expected_keys:
        for key in expected_keys:
            if key not in data:
                return False, f"Missing expected key '{key}' in response: {json.dumps(data)}"
    
    return True, json.dumps(data, indent=2)

def main():
    print("=" * 80)
    print("Urban Dry Clean Admin Panel - Comprehensive Backend Test")
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    print()

    # Create session for cookie persistence
    session = requests.Session()
    
    # Track created items for cleanup
    created_price_id = None
    shirt_item_id = None
    original_shirt_dc_price = None

    # ========== HEALTH & SEED (Tests 1-6) ==========
    print("\n### HEALTH & SEED ###\n")
    
    # Test 1: GET /api/health
    try:
        r = session.get(f"{BASE_URL}/api/health")
        passed, details = check_json_response(r, 200, ["status", "service", "timestamp"])
        if passed:
            data = r.json()
            if data.get("status") == "ok" and data.get("service") == "Urban Dry Clean":
                log_test(1, "GET /api/health returns correct structure", True, details)
            else:
                log_test(1, "GET /api/health returns incorrect data", False, details)
        else:
            log_test(1, "GET /api/health", False, details)
    except Exception as e:
        log_test(1, "GET /api/health", False, str(e))

    # Test 2: GET /api/public/prices - verify 46 items
    try:
        r = session.get(f"{BASE_URL}/api/public/prices")
        passed, details = check_json_response(r, 200, ["items"])
        if passed:
            data = r.json()
            items = data.get("items", [])
            if len(items) >= 46:
                # Check for sample item
                shirt = next((i for i in items if i.get("name") == "Shirt / T-Shirt" and i.get("category") == "mens"), None)
                if shirt and shirt.get("dc_price") == "105" and shirt.get("si_price") == "49" and shirt.get("mrp") == "140":
                    log_test(2, f"GET /api/public/prices returns {len(items)} items with correct sample", True, f"Found {len(items)} items")
                else:
                    log_test(2, "GET /api/public/prices missing expected sample item", False, f"Shirt item: {shirt}")
            else:
                log_test(2, "GET /api/public/prices has insufficient items", False, f"Expected >= 46, got {len(items)}")
        else:
            log_test(2, "GET /api/public/prices", False, details)
    except Exception as e:
        log_test(2, "GET /api/public/prices", False, str(e))

    # Test 3: GET /api/public/faqs - verify 10 FAQs
    try:
        r = session.get(f"{BASE_URL}/api/public/faqs")
        passed, details = check_json_response(r, 200, ["items"])
        if passed:
            data = r.json()
            items = data.get("items", [])
            if len(items) == 10:
                log_test(3, f"GET /api/public/faqs returns 10 FAQs", True, f"Found {len(items)} FAQs")
            else:
                log_test(3, "GET /api/public/faqs incorrect count", False, f"Expected 10, got {len(items)}")
        else:
            log_test(3, "GET /api/public/faqs", False, details)
    except Exception as e:
        log_test(3, "GET /api/public/faqs", False, str(e))

    # Test 4: GET /api/public/services - verify 10 services
    try:
        r = session.get(f"{BASE_URL}/api/public/services")
        passed, details = check_json_response(r, 200, ["items"])
        if passed:
            data = r.json()
            items = data.get("items", [])
            if len(items) == 10:
                log_test(4, f"GET /api/public/services returns 10 services", True, f"Found {len(items)} services")
            else:
                log_test(4, "GET /api/public/services incorrect count", False, f"Expected 10, got {len(items)}")
        else:
            log_test(4, "GET /api/public/services", False, details)
    except Exception as e:
        log_test(4, "GET /api/public/services", False, str(e))

    # Test 5: GET /api/public/promotion - verify 25% discount
    try:
        r = session.get(f"{BASE_URL}/api/public/promotion")
        passed, details = check_json_response(r, 200, ["promotion"])
        if passed:
            data = r.json()
            promo = data.get("promotion")
            if promo and promo.get("discount_percent") == 25 and promo.get("active") == True and promo.get("applies_to") == "Dry Cleaning":
                log_test(5, "GET /api/public/promotion returns correct promotion", True, f"Discount: {promo.get('discount_percent')}%")
            else:
                log_test(5, "GET /api/public/promotion incorrect data", False, f"Promotion: {promo}")
        else:
            log_test(5, "GET /api/public/promotion", False, details)
    except Exception as e:
        log_test(5, "GET /api/public/promotion", False, str(e))

    # Test 6: GET /api/public/settings - verify business_name
    try:
        r = session.get(f"{BASE_URL}/api/public/settings")
        passed, details = check_json_response(r, 200, ["settings"])
        if passed:
            data = r.json()
            settings = data.get("settings")
            if settings and settings.get("business_name") == "Urban Dry Clean":
                log_test(6, "GET /api/public/settings returns correct business name", True, f"Business: {settings.get('business_name')}")
            else:
                log_test(6, "GET /api/public/settings incorrect data", False, f"Settings: {settings}")
        else:
            log_test(6, "GET /api/public/settings", False, details)
    except Exception as e:
        log_test(6, "GET /api/public/settings", False, str(e))

    # ========== AUTH (Tests 7-14) ==========
    print("\n### AUTH ###\n")

    # Test 7: GET /api/admin/me WITHOUT cookie -> 401
    try:
        r = session.get(f"{BASE_URL}/api/admin/me")
        if r.status_code == 401:
            data = r.json()
            if data.get("error") == "Unauthorized":
                log_test(7, "GET /api/admin/me without cookie returns 401", True, "Unauthorized")
            else:
                log_test(7, "GET /api/admin/me without cookie wrong error", False, f"Got: {data}")
        else:
            log_test(7, "GET /api/admin/me without cookie", False, f"Expected 401, got {r.status_code}")
    except Exception as e:
        log_test(7, "GET /api/admin/me without cookie", False, str(e))

    # Test 8: GET /api/admin/prices WITHOUT cookie -> 401
    try:
        r = session.get(f"{BASE_URL}/api/admin/prices")
        if r.status_code == 401:
            log_test(8, "GET /api/admin/prices without cookie returns 401", True, "Unauthorized")
        else:
            log_test(8, "GET /api/admin/prices without cookie", False, f"Expected 401, got {r.status_code}")
    except Exception as e:
        log_test(8, "GET /api/admin/prices without cookie", False, str(e))

    # Test 9: POST /api/admin/login with wrong password -> 401
    try:
        r = session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": "wrongpassword"})
        if r.status_code == 401:
            data = r.json()
            if data.get("error") == "Invalid credentials":
                log_test(9, "POST /api/admin/login with wrong password returns 401", True, "Invalid credentials")
            else:
                log_test(9, "POST /api/admin/login wrong error message", False, f"Got: {data}")
        else:
            log_test(9, "POST /api/admin/login with wrong password", False, f"Expected 401, got {r.status_code}")
    except Exception as e:
        log_test(9, "POST /api/admin/login with wrong password", False, str(e))

    # Test 10: POST /api/admin/login with malformed JSON -> 400
    try:
        r = session.post(f"{BASE_URL}/api/admin/login", data="not json", headers={"Content-Type": "application/json"})
        if r.status_code == 400:
            log_test(10, "POST /api/admin/login with malformed JSON returns 400", True, "Invalid payload")
        else:
            log_test(10, "POST /api/admin/login with malformed JSON", False, f"Expected 400, got {r.status_code}")
    except Exception as e:
        log_test(10, "POST /api/admin/login with malformed JSON", False, str(e))

    # Test 11: POST /api/admin/login with correct credentials -> 200 + cookie
    try:
        r = session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        passed, details = check_json_response(r, 200, ["ok", "admin"])
        if passed:
            data = r.json()
            if data.get("ok") == True and data.get("admin", {}).get("email") == ADMIN_EMAIL:
                # Check for cookie
                if "udc_admin" in session.cookies:
                    log_test(11, "POST /api/admin/login with correct credentials returns 200 + cookie", True, f"Admin: {data.get('admin')}")
                else:
                    log_test(11, "POST /api/admin/login missing cookie", False, "No udc_admin cookie set")
            else:
                log_test(11, "POST /api/admin/login incorrect response data", False, details)
        else:
            log_test(11, "POST /api/admin/login with correct credentials", False, details)
    except Exception as e:
        log_test(11, "POST /api/admin/login with correct credentials", False, str(e))

    # Test 12: GET /api/admin/me after login -> 200
    try:
        r = session.get(f"{BASE_URL}/api/admin/me")
        passed, details = check_json_response(r, 200, ["admin"])
        if passed:
            data = r.json()
            if data.get("admin", {}).get("email") == ADMIN_EMAIL:
                log_test(12, "GET /api/admin/me after login returns admin data", True, f"Email: {data.get('admin', {}).get('email')}")
            else:
                log_test(12, "GET /api/admin/me incorrect admin data", False, details)
        else:
            log_test(12, "GET /api/admin/me after login", False, details)
    except Exception as e:
        log_test(12, "GET /api/admin/me after login", False, str(e))

    # Test 13: POST /api/admin/logout -> 200, then GET /api/admin/me -> 401
    try:
        r = session.post(f"{BASE_URL}/api/admin/logout")
        if r.status_code == 200:
            # Now try to access protected endpoint
            r2 = session.get(f"{BASE_URL}/api/admin/me")
            if r2.status_code == 401:
                log_test(13, "POST /api/admin/logout clears auth, subsequent request returns 401", True, "Logout successful")
            else:
                log_test(13, "POST /api/admin/logout but still authenticated", False, f"Expected 401, got {r2.status_code}")
        else:
            log_test(13, "POST /api/admin/logout", False, f"Expected 200, got {r.status_code}")
    except Exception as e:
        log_test(13, "POST /api/admin/logout", False, str(e))

    # Test 14: Log back in for CRUD tests
    try:
        r = session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if r.status_code == 200 and "udc_admin" in session.cookies:
            log_test(14, "Re-login for CRUD tests successful", True, "Authenticated")
        else:
            log_test(14, "Re-login for CRUD tests", False, f"Status: {r.status_code}")
    except Exception as e:
        log_test(14, "Re-login for CRUD tests", False, str(e))

    # ========== STATS (Test 15) ==========
    print("\n### STATS ###\n")

    # Test 15: GET /api/admin/stats
    try:
        r = session.get(f"{BASE_URL}/api/admin/stats")
        passed, details = check_json_response(r, 200, ["priceTotal", "priceActive", "svcTotal", "svcActive", "promos", "activePromos", "faqTotal"])
        if passed:
            data = r.json()
            if data.get("priceTotal", 0) >= 46 and data.get("activePromos", 0) >= 1:
                log_test(15, "GET /api/admin/stats returns correct counts", True, f"priceTotal={data.get('priceTotal')}, activePromos={data.get('activePromos')}")
            else:
                log_test(15, "GET /api/admin/stats incorrect counts", False, details)
        else:
            log_test(15, "GET /api/admin/stats", False, details)
    except Exception as e:
        log_test(15, "GET /api/admin/stats", False, str(e))

    # ========== PRICES CRUD (Tests 16-23) ==========
    print("\n### PRICES CRUD ###\n")

    # Test 16: GET /api/admin/prices
    try:
        r = session.get(f"{BASE_URL}/api/admin/prices")
        passed, details = check_json_response(r, 200, ["items"])
        if passed:
            data = r.json()
            items = data.get("items", [])
            log_test(16, f"GET /api/admin/prices returns {len(items)} items", True, f"Count: {len(items)}")
        else:
            log_test(16, "GET /api/admin/prices", False, details)
    except Exception as e:
        log_test(16, "GET /api/admin/prices", False, str(e))

    # Test 17: POST /api/admin/prices - create new item with auto-computed dc_price
    try:
        payload = {
            "category": "mens",
            "name": "TEST Sample Item",
            "mrp": "200",
            "discount_percent": 25,
            "si_price": "80"
        }
        r = session.post(f"{BASE_URL}/api/admin/prices", json=payload)
        passed, details = check_json_response(r, 200, ["ok", "item"])
        if passed:
            data = r.json()
            item = data.get("item", {})
            created_price_id = item.get("_id")
            # Check dc_price computation: 200 - 200*25/100 = 150
            if item.get("dc_price") == "150":
                log_test(17, "POST /api/admin/prices creates item with auto-computed dc_price", True, f"dc_price={item.get('dc_price')}, id={created_price_id}")
            else:
                log_test(17, "POST /api/admin/prices incorrect dc_price", False, f"Expected '150', got '{item.get('dc_price')}'")
        else:
            log_test(17, "POST /api/admin/prices", False, details)
    except Exception as e:
        log_test(17, "POST /api/admin/prices", False, str(e))

    # Test 18: PUT /api/admin/prices/<id> - update discount_percent, verify dc_price recomputed
    if created_price_id:
        try:
            payload = {"discount_percent": 40}
            r = session.put(f"{BASE_URL}/api/admin/prices/{created_price_id}", json=payload)
            passed, details = check_json_response(r, 200, ["ok", "item"])
            if passed:
                data = r.json()
                item = data.get("item", {})
                # Check dc_price recomputation: 200 - 200*40/100 = 120
                if item.get("dc_price") == "120":
                    log_test(18, "PUT /api/admin/prices/<id> updates discount and recomputes dc_price", True, f"dc_price={item.get('dc_price')}")
                else:
                    log_test(18, "PUT /api/admin/prices/<id> incorrect dc_price", False, f"Expected '120', got '{item.get('dc_price')}'")
            else:
                log_test(18, "PUT /api/admin/prices/<id>", False, details)
        except Exception as e:
            log_test(18, "PUT /api/admin/prices/<id>", False, str(e))
    else:
        log_test(18, "PUT /api/admin/prices/<id>", False, "No created_price_id from test 17")

    # Test 19: GET /api/admin/price-history - verify history entry
    if created_price_id:
        try:
            r = session.get(f"{BASE_URL}/api/admin/price-history")
            passed, details = check_json_response(r, 200, ["items"])
            if passed:
                data = r.json()
                items = data.get("items", [])
                # Find history entry for our item
                history = next((h for h in items if h.get("item_id") == created_price_id), None)
                if history:
                    old = history.get("old", {})
                    new = history.get("new", {})
                    if old.get("discount_percent") == 25 and new.get("discount_percent") == 40:
                        log_test(19, "GET /api/admin/price-history contains update entry", True, f"Found history for item {created_price_id}")
                    else:
                        log_test(19, "GET /api/admin/price-history incorrect values", False, f"old={old.get('discount_percent')}, new={new.get('discount_percent')}")
                else:
                    log_test(19, "GET /api/admin/price-history missing entry", False, f"No history found for item {created_price_id}")
            else:
                log_test(19, "GET /api/admin/price-history", False, details)
        except Exception as e:
            log_test(19, "GET /api/admin/price-history", False, str(e))
    else:
        log_test(19, "GET /api/admin/price-history", False, "No created_price_id from test 17")

    # Test 20: PUT item with active=false, verify not in public list
    if created_price_id:
        try:
            payload = {"active": False}
            r = session.put(f"{BASE_URL}/api/admin/prices/{created_price_id}", json=payload)
            if r.status_code == 200:
                # Check public list
                r2 = session.get(f"{BASE_URL}/api/public/prices")
                data2 = r2.json()
                items = data2.get("items", [])
                inactive_item = next((i for i in items if i.get("_id") == created_price_id), None)
                if inactive_item is None:
                    log_test(20, "PUT item with active=false removes from public list", True, "Item not in public list")
                else:
                    log_test(20, "PUT item with active=false still in public list", False, f"Item found: {inactive_item}")
            else:
                log_test(20, "PUT item with active=false", False, f"Expected 200, got {r.status_code}")
        except Exception as e:
            log_test(20, "PUT item with active=false", False, str(e))
    else:
        log_test(20, "PUT item with active=false", False, "No created_price_id from test 17")

    # Test 21: DELETE /api/admin/prices/<id>
    if created_price_id:
        try:
            r = session.delete(f"{BASE_URL}/api/admin/prices/{created_price_id}")
            if r.status_code == 200:
                # Verify it's gone from admin list
                r2 = session.get(f"{BASE_URL}/api/admin/prices")
                data2 = r2.json()
                items = data2.get("items", [])
                deleted_item = next((i for i in items if i.get("_id") == created_price_id), None)
                if deleted_item is None:
                    log_test(21, "DELETE /api/admin/prices/<id> removes item", True, "Item deleted")
                else:
                    log_test(21, "DELETE /api/admin/prices/<id> item still exists", False, f"Item found: {deleted_item}")
            else:
                log_test(21, "DELETE /api/admin/prices/<id>", False, f"Expected 200, got {r.status_code}")
        except Exception as e:
            log_test(21, "DELETE /api/admin/prices/<id>", False, str(e))
    else:
        log_test(21, "DELETE /api/admin/prices/<id>", False, "No created_price_id from test 17")

    # Test 22: DELETE nonexistent item -> 404
    try:
        r = session.delete(f"{BASE_URL}/api/admin/prices/nonexistent-id-12345")
        if r.status_code == 404:
            log_test(22, "DELETE /api/admin/prices/<nonexistent-id> returns 404", True, "Not found")
        else:
            log_test(22, "DELETE /api/admin/prices/<nonexistent-id>", False, f"Expected 404, got {r.status_code}")
    except Exception as e:
        log_test(22, "DELETE /api/admin/prices/<nonexistent-id>", False, str(e))

    # Test 23: PUT nonexistent item -> 404
    try:
        r = session.put(f"{BASE_URL}/api/admin/prices/nonexistent-id-12345", json={"dc_price": "99"})
        if r.status_code == 404:
            log_test(23, "PUT /api/admin/prices/<nonexistent-id> returns 404", True, "Not found")
        else:
            log_test(23, "PUT /api/admin/prices/<nonexistent-id>", False, f"Expected 404, got {r.status_code}")
    except Exception as e:
        log_test(23, "PUT /api/admin/prices/<nonexistent-id>", False, str(e))

    # ========== PUBLIC REFLECTS ADMIN CHANGE (Tests 24-27) ==========
    print("\n### PUBLIC REFLECTS ADMIN CHANGE ###\n")

    # Test 24-27: Find Shirt item, update dc_price, verify in public, restore
    try:
        # Get admin prices to find Shirt item
        r = session.get(f"{BASE_URL}/api/admin/prices")
        data = r.json()
        items = data.get("items", [])
        shirt = next((i for i in items if i.get("name") == "Shirt / T-Shirt" and i.get("category") == "mens"), None)
        
        if shirt:
            shirt_item_id = shirt.get("_id")
            original_shirt_dc_price = shirt.get("dc_price")
            log_test(24, f"Found 'Shirt / T-Shirt' item with dc_price={original_shirt_dc_price}", True, f"ID: {shirt_item_id}")
            
            # Test 25: Update dc_price to 99
            r = session.put(f"{BASE_URL}/api/admin/prices/{shirt_item_id}", json={"dc_price": "99"})
            if r.status_code == 200:
                log_test(25, "PUT 'Shirt / T-Shirt' dc_price to '99'", True, "Updated")
                
                # Test 26: Verify in public list
                r2 = session.get(f"{BASE_URL}/api/public/prices")
                data2 = r2.json()
                public_items = data2.get("items", [])
                public_shirt = next((i for i in public_items if i.get("_id") == shirt_item_id), None)
                if public_shirt and public_shirt.get("dc_price") == "99":
                    log_test(26, "GET /api/public/prices reflects updated dc_price='99'", True, "Public list updated")
                else:
                    log_test(26, "GET /api/public/prices does not reflect change", False, f"Got: {public_shirt}")
                
                # Test 27: Restore original dc_price
                r3 = session.put(f"{BASE_URL}/api/admin/prices/{shirt_item_id}", json={"dc_price": original_shirt_dc_price})
                if r3.status_code == 200:
                    log_test(27, f"Restored 'Shirt / T-Shirt' dc_price to '{original_shirt_dc_price}'", True, "Restored")
                else:
                    log_test(27, "Failed to restore original dc_price", False, f"Status: {r3.status_code}")
            else:
                log_test(25, "PUT 'Shirt / T-Shirt' dc_price", False, f"Status: {r.status_code}")
                log_test(26, "GET /api/public/prices reflects change", False, "Skipped due to test 25 failure")
                log_test(27, "Restore original dc_price", False, "Skipped due to test 25 failure")
        else:
            log_test(24, "Find 'Shirt / T-Shirt' item", False, "Item not found")
            log_test(25, "PUT 'Shirt / T-Shirt' dc_price", False, "Skipped")
            log_test(26, "GET /api/public/prices reflects change", False, "Skipped")
            log_test(27, "Restore original dc_price", False, "Skipped")
    except Exception as e:
        log_test(24, "Find 'Shirt / T-Shirt' item", False, str(e))
        log_test(25, "PUT 'Shirt / T-Shirt' dc_price", False, "Skipped")
        log_test(26, "GET /api/public/prices reflects change", False, "Skipped")
        log_test(27, "Restore original dc_price", False, "Skipped")

    # ========== PASSWORD CHANGE (Tests 28-30) ==========
    print("\n### PASSWORD CHANGE ###\n")

    # Test 28: Change password with too short password -> 400
    try:
        r = session.post(f"{BASE_URL}/api/admin/change-password", json={"current": ADMIN_PASSWORD, "next": "short"})
        if r.status_code == 400:
            data = r.json()
            if "8 characters" in data.get("error", ""):
                log_test(28, "POST /api/admin/change-password with short password returns 400", True, "Password too short")
            else:
                log_test(28, "POST /api/admin/change-password wrong error message", False, f"Got: {data}")
        else:
            log_test(28, "POST /api/admin/change-password with short password", False, f"Expected 400, got {r.status_code}")
    except Exception as e:
        log_test(28, "POST /api/admin/change-password with short password", False, str(e))

    # Test 29: Change password with wrong current password -> 401
    try:
        r = session.post(f"{BASE_URL}/api/admin/change-password", json={"current": "wrongpw", "next": "NewTestPass@2026"})
        if r.status_code == 401:
            log_test(29, "POST /api/admin/change-password with wrong current password returns 401", True, "Incorrect password")
        else:
            log_test(29, "POST /api/admin/change-password with wrong current password", False, f"Expected 401, got {r.status_code}")
    except Exception as e:
        log_test(29, "POST /api/admin/change-password with wrong current password", False, str(e))

    # Test 30: Change password successfully, logout, login with new password, change back
    try:
        # Change to new password
        r = session.post(f"{BASE_URL}/api/admin/change-password", json={"current": ADMIN_PASSWORD, "next": "NewTestPass@2026"})
        if r.status_code == 200:
            # Logout
            session.post(f"{BASE_URL}/api/admin/logout")
            
            # Login with new password
            r2 = session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": "NewTestPass@2026"})
            if r2.status_code == 200:
                # Change back to original password
                r3 = session.post(f"{BASE_URL}/api/admin/change-password", json={"current": "NewTestPass@2026", "next": ADMIN_PASSWORD})
                if r3.status_code == 200:
                    log_test(30, "POST /api/admin/change-password full cycle successful", True, "Password changed and restored")
                else:
                    log_test(30, "Failed to restore original password", False, f"Status: {r3.status_code}")
            else:
                log_test(30, "Failed to login with new password", False, f"Status: {r2.status_code}")
        else:
            log_test(30, "POST /api/admin/change-password", False, f"Expected 200, got {r.status_code}")
    except Exception as e:
        log_test(30, "POST /api/admin/change-password full cycle", False, str(e))

    # Re-login for remaining tests
    try:
        session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    except Exception:
        pass

    # ========== ROBOTS.TXT (Test 31) ==========
    print("\n### ROBOTS.TXT ###\n")

    # Test 31: GET /robots.txt
    try:
        r = session.get(f"{BASE_URL}/robots.txt")
        if r.status_code == 200:
            text = r.text
            if "Disallow: /admin/" in text or "Disallow: /admin" in text:
                log_test(31, "GET /robots.txt contains 'Disallow: /admin/'", True, "robots.txt correct")
            else:
                log_test(31, "GET /robots.txt missing admin disallow", False, f"Content: {text[:200]}")
        else:
            log_test(31, "GET /robots.txt", False, f"Expected 200, got {r.status_code}")
    except Exception as e:
        log_test(31, "GET /robots.txt", False, str(e))

    # ========== MIDDLEWARE PAGE PROTECTION (Tests 32-33) ==========
    print("\n### MIDDLEWARE PAGE PROTECTION ###\n")

    # Test 32: GET /admin without cookie -> 307 redirect
    try:
        # Create new session without auth
        unauth_session = requests.Session()
        r = unauth_session.get(f"{BASE_URL}/admin", allow_redirects=False)
        if r.status_code == 307:
            location = r.headers.get("Location", "")
            if "/admin/login" in location:
                log_test(32, "GET /admin without cookie returns 307 redirect to /admin/login", True, f"Location: {location}")
            else:
                log_test(32, "GET /admin redirect to wrong location", False, f"Location: {location}")
        else:
            log_test(32, "GET /admin without cookie", False, f"Expected 307, got {r.status_code}")
    except Exception as e:
        log_test(32, "GET /admin without cookie", False, str(e))

    # Test 33: GET /admin/login -> 200
    try:
        r = session.get(f"{BASE_URL}/admin/login")
        if r.status_code == 200:
            log_test(33, "GET /admin/login returns 200", True, "Login page accessible")
        else:
            log_test(33, "GET /admin/login", False, f"Expected 200, got {r.status_code}")
    except Exception as e:
        log_test(33, "GET /admin/login", False, str(e))

    # ========== IDEMPOTENT SEED (Test 34) ==========
    print("\n### IDEMPOTENT SEED ###\n")

    # Test 34: Call health 3 times, verify price count stays same
    try:
        # Get initial count
        r1 = session.get(f"{BASE_URL}/api/public/prices")
        count1 = len(r1.json().get("items", []))
        
        # Call health 3 times
        session.get(f"{BASE_URL}/api/health")
        session.get(f"{BASE_URL}/api/health")
        session.get(f"{BASE_URL}/api/health")
        
        # Get count again
        r2 = session.get(f"{BASE_URL}/api/public/prices")
        count2 = len(r2.json().get("items", []))
        
        if count1 == count2:
            log_test(34, f"Idempotent seed: price count unchanged ({count1} -> {count2})", True, "Seed is idempotent")
        else:
            log_test(34, "Idempotent seed: price count changed", False, f"Count changed from {count1} to {count2}")
    except Exception as e:
        log_test(34, "Idempotent seed", False, str(e))

    # ========== SUMMARY ==========
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests: {tests_passed + tests_failed}")
    print(f"✅ Passed: {tests_passed}")
    print(f"❌ Failed: {tests_failed}")
    print("=" * 80)
    
    if tests_failed > 0:
        print("\nFailed Tests:")
        for result in test_results:
            if not result["passed"]:
                print(f"  {result['num']}. {result['desc']}")
                if result["details"]:
                    print(f"     {result['details']}")
    
    return 0 if tests_failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
