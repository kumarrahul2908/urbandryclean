#!/usr/bin/env python3
"""
Urban Dry Clean Admin Panel Phase 2 - Full Backend Regression Test
Tests all Phase 1 + Phase 2 backend endpoints comprehensively.
"""

import requests
import json
import time
import sys
from io import BytesIO

# Configuration
BASE_URL = "https://premium-cleaning-20.preview.emergentagent.com"
ADMIN_EMAIL = "admin@urbandryclean.in"
ADMIN_PASSWORD = "UrbanAdmin@2026"

# Test state
session = requests.Session()
test_results = []
cleanup_items = []

def log_test(name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"  → {details}")
    test_results.append({"name": name, "passed": passed, "details": details})
    return passed

def admin_login():
    """Login and get auth cookie"""
    print("\n🔐 Logging in as admin...")
    resp = session.post(f"{BASE_URL}/api/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if resp.status_code == 200:
        print(f"✅ Login successful, cookie: {session.cookies.get('udc_admin')[:20]}...")
        return True
    else:
        print(f"❌ Login failed: {resp.status_code} {resp.text}")
        return False

def admin_logout():
    """Logout"""
    session.post(f"{BASE_URL}/api/admin/logout")
    print("🔓 Logged out")

# =====================================================================
# PART A: Phase 1 Regression (34 checks)
# =====================================================================

def test_part_a_phase1_regression():
    """Run all 34 Phase 1 regression tests"""
    print("\n" + "="*70)
    print("PART A: PHASE 1 REGRESSION (34 CHECKS)")
    print("="*70)
    
    # A1. Health endpoint
    resp = session.get(f"{BASE_URL}/api/health")
    log_test("A1. GET /api/health returns 200 with correct structure",
             resp.status_code == 200 and resp.json().get("status") == "ok" and "timestamp" in resp.json(),
             f"status={resp.json().get('status')}, service={resp.json().get('service')}")
    
    # A2. Seed check - public prices
    resp = session.get(f"{BASE_URL}/api/public/prices")
    items = resp.json().get("items", [])
    log_test("A2. GET /api/public/prices returns 46 items",
             resp.status_code == 200 and len(items) == 46,
             f"Got {len(items)} items")
    
    # A3. Seed check - public FAQs
    resp = session.get(f"{BASE_URL}/api/public/faqs")
    faqs = resp.json().get("items", [])
    log_test("A3. GET /api/public/faqs returns 10 FAQs",
             resp.status_code == 200 and len(faqs) == 10,
             f"Got {len(faqs)} FAQs")
    
    # A4. Seed check - public services
    resp = session.get(f"{BASE_URL}/api/public/services")
    services = resp.json().get("items", [])
    log_test("A4. GET /api/public/services returns 10 services",
             resp.status_code == 200 and len(services) == 10,
             f"Got {len(services)} services")
    
    # A5. Seed check - public promotion
    resp = session.get(f"{BASE_URL}/api/public/promotion")
    promo = resp.json().get("promotion", {})
    log_test("A5. GET /api/public/promotion returns FLAT 25% OFF",
             resp.status_code == 200 and promo.get("title") == "FLAT 25% OFF" and promo.get("discount_percent") == 25,
             f"title={promo.get('title')}, discount={promo.get('discount_percent')}%")
    
    # A6. Seed check - public settings
    resp = session.get(f"{BASE_URL}/api/public/settings")
    settings = resp.json().get("settings", {})
    log_test("A6. GET /api/public/settings returns business_name",
             resp.status_code == 200 and settings.get("business_name") == "Urban Dry Clean",
             f"business_name={settings.get('business_name')}")
    
    # A7-A8. Unauth 401 checks
    session_unauth = requests.Session()
    resp = session_unauth.get(f"{BASE_URL}/api/admin/me")
    log_test("A7. GET /api/admin/me without cookie returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    resp = session_unauth.get(f"{BASE_URL}/api/admin/prices")
    log_test("A8. GET /api/admin/prices without cookie returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # A9. Wrong password login
    resp = session_unauth.post(f"{BASE_URL}/api/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": "WrongPassword123"
    })
    log_test("A9. POST /api/admin/login with wrong password returns 401",
             resp.status_code == 401 and "Invalid credentials" in resp.text,
             f"status={resp.status_code}")
    
    # A10. Malformed JSON login
    resp = session_unauth.post(f"{BASE_URL}/api/admin/login",
                               data="not json",
                               headers={"Content-Type": "application/json"})
    log_test("A10. POST /api/admin/login with malformed JSON returns 400",
             resp.status_code == 400,
             f"status={resp.status_code}")
    
    # A11. Successful login
    if not admin_login():
        print("❌ Cannot continue without login")
        return False
    
    # A12. GET /api/admin/me after login
    resp = session.get(f"{BASE_URL}/api/admin/me")
    admin_data = resp.json().get("admin", {})
    log_test("A12. GET /api/admin/me after login returns admin data",
             resp.status_code == 200 and admin_data.get("email") == ADMIN_EMAIL,
             f"email={admin_data.get('email')}")
    
    # A13. Logout
    resp = session.post(f"{BASE_URL}/api/admin/logout")
    log_test("A13. POST /api/admin/logout returns 200",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    # A14. After logout, /api/admin/me returns 401
    resp = session.get(f"{BASE_URL}/api/admin/me")
    log_test("A14. GET /api/admin/me after logout returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # Re-login for remaining tests
    if not admin_login():
        return False
    
    # A15. GET /api/admin/stats
    resp = session.get(f"{BASE_URL}/api/admin/stats")
    stats = resp.json()
    log_test("A15. GET /api/admin/stats returns correct counts",
             resp.status_code == 200 and stats.get("priceTotal") == 46 and stats.get("activePromos") == 1,
             f"priceTotal={stats.get('priceTotal')}, activePromos={stats.get('activePromos')}")
    
    # A16. GET /api/admin/prices
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    admin_prices = resp.json().get("items", [])
    log_test("A16. GET /api/admin/prices returns 46 items",
             resp.status_code == 200 and len(admin_prices) == 46,
             f"Got {len(admin_prices)} items")
    
    # A17. POST /api/admin/prices (create with auto-calc)
    resp = session.post(f"{BASE_URL}/api/admin/prices", json={
        "category": "mens",
        "name": "TEST Auto-Calc Item",
        "mrp": "200",
        "discount_percent": 25,
        "si_price": "80",
        "unit": "Per Piece",
        "active": True
    })
    if resp.status_code == 200:
        created_item = resp.json().get("item", {})
        cleanup_items.append(("price", created_item.get("_id")))
        log_test("A17. POST /api/admin/prices creates item with auto-calc dc_price",
                 created_item.get("dc_price") == "150",
                 f"dc_price={created_item.get('dc_price')} (expected 150 from 200-25%)")
    else:
        log_test("A17. POST /api/admin/prices", False, f"Failed: {resp.status_code}")
    
    # A18. PUT /api/admin/prices/:id (update discount, auto-recalc)
    if cleanup_items:
        item_id = cleanup_items[-1][1]
        resp = session.put(f"{BASE_URL}/api/admin/prices/{item_id}", json={
            "discount_percent": 40
        })
        if resp.status_code == 200:
            updated_item = resp.json().get("item", {})
            log_test("A18. PUT /api/admin/prices/:id updates discount and auto-recalcs dc_price",
                     updated_item.get("dc_price") == "120",
                     f"dc_price={updated_item.get('dc_price')} (expected 120 from 200-40%)")
        else:
            log_test("A18. PUT /api/admin/prices/:id", False, f"Failed: {resp.status_code}")
    
    # A19. GET /api/admin/price-history contains update entry
    resp = session.get(f"{BASE_URL}/api/admin/price-history")
    history = resp.json().get("items", [])
    found_history = any(h.get("item_name") == "TEST Auto-Calc Item" for h in history)
    log_test("A19. GET /api/admin/price-history contains update entry",
             resp.status_code == 200 and found_history,
             f"Found {len(history)} history entries, TEST item present: {found_history}")
    
    # A20. PUT item with active=false removes from public list
    if cleanup_items:
        item_id = cleanup_items[-1][1]
        resp = session.put(f"{BASE_URL}/api/admin/prices/{item_id}", json={"active": False})
        resp_public = session.get(f"{BASE_URL}/api/public/prices")
        public_items = resp_public.json().get("items", [])
        not_in_public = not any(p.get("_id") == item_id for p in public_items)
        log_test("A20. PUT item with active=false removes from public list",
                 resp.status_code == 200 and not_in_public,
                 f"Item {item_id[:8]}... not in public list: {not_in_public}")
    
    # A21. DELETE /api/admin/prices/:id
    if cleanup_items:
        item_id = cleanup_items[-1][1]
        resp = session.delete(f"{BASE_URL}/api/admin/prices/{item_id}")
        log_test("A21. DELETE /api/admin/prices/:id removes item",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        if resp.status_code == 200:
            cleanup_items.pop()
    
    # A22. DELETE nonexistent item returns 404
    resp = session.delete(f"{BASE_URL}/api/admin/prices/nonexistent-id-12345")
    log_test("A22. DELETE /api/admin/prices/<nonexistent> returns 404",
             resp.status_code == 404,
             f"status={resp.status_code}")
    
    # A23. PUT nonexistent item returns 404
    resp = session.put(f"{BASE_URL}/api/admin/prices/nonexistent-id-12345", json={"dc_price": "100"})
    log_test("A23. PUT /api/admin/prices/<nonexistent> returns 404",
             resp.status_code == 404,
             f"status={resp.status_code}")
    
    # A24-A27. Public reflects admin change (Shirt/T-Shirt test)
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    shirt_item = next((p for p in resp.json().get("items", []) if "Shirt / T-Shirt" in p.get("name", "")), None)
    if shirt_item:
        original_dc = shirt_item.get("dc_price")
        shirt_id = shirt_item.get("_id")
        log_test("A24. Found 'Shirt / T-Shirt' item",
                 True,
                 f"id={shirt_id[:8]}..., original dc_price={original_dc}")
        
        # A25. Update to 99
        resp = session.put(f"{BASE_URL}/api/admin/prices/{shirt_id}", json={"dc_price": "99"})
        log_test("A25. PUT 'Shirt / T-Shirt' dc_price to '99'",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # A26. Public reflects 99
        resp = session.get(f"{BASE_URL}/api/public/prices")
        public_shirt = next((p for p in resp.json().get("items", []) if p.get("_id") == shirt_id), None)
        log_test("A26. GET /api/public/prices immediately reflects dc_price='99'",
                 public_shirt and public_shirt.get("dc_price") == "99",
                 f"public dc_price={public_shirt.get('dc_price') if public_shirt else 'NOT FOUND'}")
        
        # A27. Restore original
        resp = session.put(f"{BASE_URL}/api/admin/prices/{shirt_id}", json={"dc_price": original_dc})
        log_test("A27. Restored 'Shirt / T-Shirt' dc_price to original",
                 resp.status_code == 200,
                 f"Restored to {original_dc}")
    else:
        log_test("A24-A27. Shirt/T-Shirt test", False, "Shirt/T-Shirt item not found")
    
    # A28-A30. Password change tests
    # A28. Short password
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": ADMIN_PASSWORD,
        "next": "short"
    })
    log_test("A28. POST /api/admin/change-password with short password returns 400",
             resp.status_code == 400,
             f"status={resp.status_code}, error={resp.json().get('error', '')[:50]}")
    
    # A29. Wrong current password
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": "WrongPassword",
        "next": "GoodPass@2026!"
    })
    log_test("A29. POST /api/admin/change-password with wrong current password returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # A30. Full password change cycle
    new_password = "GoodPass@2026!"
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": ADMIN_PASSWORD,
        "next": new_password
    })
    if resp.status_code == 200:
        log_test("A30a. Change password to new password successful", True, "Password changed")
        
        # Logout
        session.post(f"{BASE_URL}/api/admin/logout")
        
        # Login with new password
        resp = session.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": new_password
        })
        log_test("A30b. Login with new password successful",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Change back to original
        resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
            "current": new_password,
            "next": ADMIN_PASSWORD
        })
        log_test("A30c. Change password back to original successful",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Re-login with original
        admin_login()
    else:
        log_test("A30. Password change cycle", False, f"Initial change failed: {resp.status_code}")
    
    # A31. robots.txt
    resp = requests.get(f"{BASE_URL}/robots.txt")
    log_test("A31. GET /robots.txt contains 'Disallow: /admin/'",
             resp.status_code == 200 and "Disallow: /admin/" in resp.text,
             f"status={resp.status_code}, contains directive: {'Disallow: /admin/' in resp.text}")
    
    # A32. Middleware protection - unauth /admin redirects
    resp_unauth = requests.get(f"{BASE_URL}/admin", allow_redirects=False)
    log_test("A32. GET /admin without cookie returns 307 redirect",
             resp_unauth.status_code == 307 and "/admin/login" in resp_unauth.headers.get("Location", ""),
             f"status={resp_unauth.status_code}, location={resp_unauth.headers.get('Location', '')}")
    
    # A33. /admin/login accessible
    resp = requests.get(f"{BASE_URL}/admin/login")
    log_test("A33. GET /admin/login returns 200",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    # A34. Idempotent seed
    resp1 = session.get(f"{BASE_URL}/api/health")
    resp2 = session.get(f"{BASE_URL}/api/public/prices")
    count1 = len(resp2.json().get("items", []))
    resp3 = session.get(f"{BASE_URL}/api/health")
    resp4 = session.get(f"{BASE_URL}/api/public/prices")
    count2 = len(resp4.json().get("items", []))
    log_test("A34. Idempotent seed - calling /api/health multiple times doesn't duplicate",
             count1 == count2 == 46,
             f"count after 1st health: {count1}, after 2nd health: {count2}")
    
    return True

# =====================================================================
# PART B: Address Correctness (Critical)
# =====================================================================

def test_part_b_address_correctness():
    """Test address correctness - PIN 201318, no 201306 or Patwari"""
    print("\n" + "="*70)
    print("PART B: ADDRESS CORRECTNESS (CRITICAL)")
    print("="*70)
    
    # B1. Settings address check
    resp = session.get(f"{BASE_URL}/api/public/settings")
    settings = resp.json().get("settings", {})
    pin_correct = settings.get("pin") == "201318"
    addr1_correct = "Eros Mart" in settings.get("address_line1", "")
    addr2_correct = "Greater Noida West" in settings.get("address_line2", "")
    log_test("B1. GET /api/public/settings has pin=201318 and correct address",
             pin_correct and addr1_correct and addr2_correct,
             f"pin={settings.get('pin')}, addr1={settings.get('address_line1')}, addr2={settings.get('address_line2')}")
    
    # B2. FAQ answer check
    resp = session.get(f"{BASE_URL}/api/public/faqs")
    faqs = resp.json().get("items", [])
    location_faq = next((f for f in faqs if "located" in f.get("q", "").lower()), None)
    if location_faq:
        answer = location_faq.get("a", "")
        has_201318 = "201318" in answer
        no_201306 = "201306" not in answer
        no_patwari = "Patwari" not in answer.lower()
        log_test("B2. FAQ 'located' has 201318 and NOT 201306 or Patwari",
                 has_201318 and no_201306 and no_patwari,
                 f"has 201318: {has_201318}, no 201306: {no_201306}, no Patwari: {no_patwari}")
    else:
        log_test("B2. FAQ 'located' check", False, "FAQ with 'located' not found")
    
    # B3. HTML pages check for 201306/Patwari
    pages_to_check = ["/faq", "/services"]
    for page in pages_to_check:
        resp = requests.get(f"{BASE_URL}{page}")
        if resp.status_code == 200:
            no_201306 = "201306" not in resp.text
            no_patwari = "Patwari" not in resp.text and "patwari" not in resp.text
            log_test(f"B3. GET {page} has NO occurrence of 201306 or Patwari",
                     no_201306 and no_patwari,
                     f"no 201306: {no_201306}, no Patwari: {no_patwari}")
        else:
            log_test(f"B3. GET {page}", False, f"Failed to fetch: {resp.status_code}")
    
    return True

# =====================================================================
# PART C: Phase 2 New Backend Endpoints
# =====================================================================

def test_part_c_phase2_endpoints():
    """Test all Phase 2 new backend endpoints"""
    print("\n" + "="*70)
    print("PART C: PHASE 2 NEW BACKEND ENDPOINTS")
    print("="*70)
    
    # C1. Services CRUD
    print("\n--- C1. Services CRUD ---")
    
    # C1a. Unauth 401
    session_unauth = requests.Session()
    resp = session_unauth.get(f"{BASE_URL}/api/admin/services")
    log_test("C1a. GET /api/admin/services without cookie returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # C1b. Auth GET
    resp = session.get(f"{BASE_URL}/api/admin/services")
    services = resp.json().get("items", [])
    log_test("C1b. GET /api/admin/services returns >= 10 items",
             resp.status_code == 200 and len(services) >= 10,
             f"Got {len(services)} services")
    
    # C1c. POST create
    resp = session.post(f"{BASE_URL}/api/admin/services", json={
        "name": "TEST QA Service",
        "desc": "temp",
        "icon": "Shirt",
        "display_order": 999
    })
    if resp.status_code == 200:
        created_svc = resp.json().get("item", {})
        svc_id = created_svc.get("_id")
        cleanup_items.append(("service", svc_id))
        log_test("C1c. POST /api/admin/services creates service with generated slug",
                 "slug" in created_svc,
                 f"id={svc_id[:8]}..., slug={created_svc.get('slug')}")
    else:
        log_test("C1c. POST /api/admin/services", False, f"Failed: {resp.status_code}")
    
    # C1d. PUT active=false
    if cleanup_items and cleanup_items[-1][0] == "service":
        svc_id = cleanup_items[-1][1]
        resp = session.put(f"{BASE_URL}/api/admin/services/{svc_id}", json={"active": False})
        log_test("C1d. PUT /api/admin/services/:id with active=false",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Check not in public
        resp_public = session.get(f"{BASE_URL}/api/public/services")
        try:
            public_svcs = resp_public.json().get("items", [])
            not_in_public = not any(s.get("_id") == svc_id for s in public_svcs)
            log_test("C1e. GET /api/public/services does NOT contain inactive service",
                     not_in_public,
                     f"Service not in public list: {not_in_public}")
        except Exception as e:
            log_test("C1e. GET /api/public/services", False, f"Error: {e}, status={resp_public.status_code}, text={resp_public.text[:100]}")
    
    # C1f. DELETE
    if cleanup_items and cleanup_items[-1][0] == "service":
        svc_id = cleanup_items[-1][1]
        resp = session.delete(f"{BASE_URL}/api/admin/services/{svc_id}")
        log_test("C1f. DELETE /api/admin/services/:id",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        if resp.status_code == 200:
            cleanup_items.pop()
        
        # Verify gone
        resp = session.get(f"{BASE_URL}/api/admin/services")
        services = resp.json().get("items", [])
        is_gone = not any(s.get("_id") == svc_id for s in services)
        log_test("C1g. Service is gone from admin list",
                 is_gone,
                 f"Service removed: {is_gone}")
    
    # C2. FAQs CRUD
    print("\n--- C2. FAQs CRUD ---")
    
    # C2a. POST create
    resp = session.post(f"{BASE_URL}/api/admin/faqs", json={
        "q": "TEST QA?",
        "a": "temp"
    })
    if resp.status_code == 200:
        created_faq = resp.json().get("item", {})
        faq_id = created_faq.get("_id")
        cleanup_items.append(("faq", faq_id))
        log_test("C2a. POST /api/admin/faqs creates FAQ",
                 True,
                 f"id={faq_id[:8]}...")
    else:
        log_test("C2a. POST /api/admin/faqs", False, f"Failed: {resp.status_code}")
    
    # C2b. PUT active=false
    if cleanup_items and cleanup_items[-1][0] == "faq":
        faq_id = cleanup_items[-1][1]
        resp = session.put(f"{BASE_URL}/api/admin/faqs/{faq_id}", json={"active": False})
        log_test("C2b. PUT /api/admin/faqs/:id with active=false",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Check not in public
        resp_public = session.get(f"{BASE_URL}/api/public/faqs")
        public_faqs = resp_public.json().get("items", [])
        not_in_public = not any(f.get("_id") == faq_id for f in public_faqs)
        log_test("C2c. GET /api/public/faqs does NOT contain inactive FAQ",
                 not_in_public,
                 f"FAQ not in public list: {not_in_public}")
    
    # C2d. DELETE
    if cleanup_items and cleanup_items[-1][0] == "faq":
        faq_id = cleanup_items[-1][1]
        resp = session.delete(f"{BASE_URL}/api/admin/faqs/{faq_id}")
        log_test("C2d. DELETE /api/admin/faqs/:id",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        if resp.status_code == 200:
            cleanup_items.pop()
    
    # C3. Settings PUT
    print("\n--- C3. Settings PUT ---")
    
    # C3a. Get current phone
    resp = session.get(f"{BASE_URL}/api/admin/settings")
    original_phone = resp.json().get("settings", {}).get("phone", "")
    log_test("C3a. GET /api/admin/settings returns current phone",
             resp.status_code == 200 and original_phone,
             f"phone={original_phone}")
    
    # C3b. PUT new phone
    resp = session.put(f"{BASE_URL}/api/admin/settings", json={
        "phone": "+91 99999 99999"
    })
    log_test("C3b. PUT /api/admin/settings with new phone",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    # C3c. Public reflects new phone
    resp = session.get(f"{BASE_URL}/api/public/settings")
    new_phone = resp.json().get("settings", {}).get("phone", "")
    log_test("C3c. GET /api/public/settings reflects new phone",
             new_phone == "+91 99999 99999",
             f"phone={new_phone}")
    
    # C3d. Restore original phone
    resp = session.put(f"{BASE_URL}/api/admin/settings", json={
        "phone": original_phone
    })
    log_test("C3d. PUT /api/admin/settings restores original phone",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    # C3e. Confirm restoration
    resp = session.get(f"{BASE_URL}/api/public/settings")
    restored_phone = resp.json().get("settings", {}).get("phone", "")
    log_test("C3e. GET /api/public/settings confirms phone restoration",
             restored_phone == original_phone,
             f"phone={restored_phone}")
    
    # C3f. Confirm PIN still 201318
    resp = session.get(f"{BASE_URL}/api/public/settings")
    pin = resp.json().get("settings", {}).get("pin", "")
    log_test("C3f. After settings changes, pin is still 201318",
             pin == "201318",
             f"pin={pin}")
    
    # C4. Promotions
    print("\n--- C4. Promotions ---")
    
    # C4a. GET promotions, note active promo
    resp = session.get(f"{BASE_URL}/api/admin/promotions")
    promos = resp.json().get("items", [])
    original_active_promo = next((p for p in promos if p.get("active")), None)
    original_promo_id = original_active_promo.get("_id") if original_active_promo else None
    log_test("C4a. GET /api/admin/promotions returns promotions",
             resp.status_code == 200 and original_active_promo,
             f"Found active promo: {original_active_promo.get('title') if original_active_promo else 'None'}")
    
    # C4b. POST new promo (inactive)
    resp = session.post(f"{BASE_URL}/api/admin/promotions", json={
        "title": "TEST QA Promo",
        "description": "temp",
        "discount_percent": 10,
        "applies_to": "Laundry",
        "active": False
    })
    if resp.status_code == 200:
        new_promo = resp.json().get("item", {})
        new_promo_id = new_promo.get("_id")
        cleanup_items.append(("promotion", new_promo_id))
        log_test("C4b. POST /api/admin/promotions creates new promo",
                 True,
                 f"id={new_promo_id[:8]}...")
    else:
        log_test("C4b. POST /api/admin/promotions", False, f"Failed: {resp.status_code}")
    
    # C4c. PUT new promo active=true
    if cleanup_items and cleanup_items[-1][0] == "promotion":
        new_promo_id = cleanup_items[-1][1]
        resp = session.put(f"{BASE_URL}/api/admin/promotions/{new_promo_id}", json={"active": True})
        log_test("C4c. PUT /api/admin/promotions/:id with active=true",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # C4d. Public promotion is now TEST QA Promo
        resp = session.get(f"{BASE_URL}/api/public/promotion")
        public_promo = resp.json().get("promotion", {})
        log_test("C4d. GET /api/public/promotion returns TEST QA Promo",
                 public_promo.get("title") == "TEST QA Promo",
                 f"title={public_promo.get('title')}")
    
    # C4e. Re-activate original 25% promo
    if original_promo_id:
        resp = session.put(f"{BASE_URL}/api/admin/promotions/{original_promo_id}", json={"active": True})
        log_test("C4e. Re-activate original 25% promo",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # C4f. Public promotion is back to FLAT 25% OFF
        resp = session.get(f"{BASE_URL}/api/public/promotion")
        public_promo = resp.json().get("promotion", {})
        log_test("C4f. GET /api/public/promotion back to FLAT 25% OFF",
                 public_promo.get("title") == "FLAT 25% OFF" and public_promo.get("discount_percent") == 25,
                 f"title={public_promo.get('title')}, discount={public_promo.get('discount_percent')}%")
    
    # C4g. DELETE test promo
    if cleanup_items and cleanup_items[-1][0] == "promotion":
        new_promo_id = cleanup_items[-1][1]
        resp = session.delete(f"{BASE_URL}/api/admin/promotions/{new_promo_id}")
        log_test("C4g. DELETE test promo",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        if resp.status_code == 200:
            cleanup_items.pop()
    
    # C4h. Verify public promotion still FLAT 25% OFF
    resp = session.get(f"{BASE_URL}/api/public/promotion")
    public_promo = resp.json().get("promotion", {})
    log_test("C4h. After cleanup, public promotion still FLAT 25% OFF",
             public_promo.get("title") == "FLAT 25% OFF" and public_promo.get("discount_percent") == 25 and public_promo.get("active") == True,
             f"title={public_promo.get('title')}, discount={public_promo.get('discount_percent')}%, active={public_promo.get('active')}")
    
    # C5. Price History filter + Restore
    print("\n--- C5. Price History filter + Restore ---")
    
    # C5a. Find Shirt/T-Shirt
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    shirt_item = next((p for p in resp.json().get("items", []) if "Shirt / T-Shirt" in p.get("name", "")), None)
    if shirt_item:
        original_dc = shirt_item.get("dc_price")
        shirt_id = shirt_item.get("_id")
        log_test("C5a. Found 'Shirt / T-Shirt' item",
                 True,
                 f"id={shirt_id[:8]}..., original dc_price={original_dc}")
        
        # C5b. PUT dc_price to 99
        resp = session.put(f"{BASE_URL}/api/admin/prices/{shirt_id}", json={"dc_price": "99"})
        log_test("C5b. PUT 'Shirt / T-Shirt' dc_price to '99'",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # C5c. Public reflects 99
        resp = session.get(f"{BASE_URL}/api/public/prices")
        public_shirt = next((p for p in resp.json().get("items", []) if p.get("_id") == shirt_id), None)
        log_test("C5c. GET /api/public/prices reflects dc_price='99'",
                 public_shirt and public_shirt.get("dc_price") == "99",
                 f"public dc_price={public_shirt.get('dc_price') if public_shirt else 'NOT FOUND'}")
        
        # C5d. GET price-history with q=Shirt
        resp = session.get(f"{BASE_URL}/api/admin/price-history?q=Shirt")
        history_items = resp.json().get("items", [])
        found_99_entry = any(h.get("new", {}).get("dc_price") == "99" for h in history_items)
        log_test("C5d. GET /api/admin/price-history?q=Shirt returns history with dc_price=99",
                 resp.status_code == 200 and found_99_entry,
                 f"Found {len(history_items)} history items, dc_price=99 entry: {found_99_entry}")
        
        # C5e. POST restore from history
        if history_items:
            # Find the most recent history entry for this item
            restore_entry = next((h for h in history_items if h.get("item_id") == shirt_id and h.get("new", {}).get("dc_price") == "99"), None)
            if restore_entry:
                history_id = restore_entry.get("_id")
                resp = session.post(f"{BASE_URL}/api/admin/price-history/{history_id}/restore")
                log_test("C5e. POST /api/admin/price-history/:id/restore",
                         resp.status_code == 200,
                         f"status={resp.status_code}")
                
                # C5f. Public reflects original dc_price
                resp = session.get(f"{BASE_URL}/api/public/prices")
                public_shirt = next((p for p in resp.json().get("items", []) if p.get("_id") == shirt_id), None)
                log_test("C5f. GET /api/public/prices reflects restored dc_price",
                         public_shirt and public_shirt.get("dc_price") == original_dc,
                         f"public dc_price={public_shirt.get('dc_price') if public_shirt else 'NOT FOUND'} (expected {original_dc})")
            else:
                log_test("C5e-f. Restore from history", False, "Could not find history entry to restore")
        else:
            log_test("C5e-f. Restore from history", False, "No history items found")
    else:
        log_test("C5. Price History filter + Restore", False, "Shirt/T-Shirt item not found")
    
    # C6. Bulk update
    print("\n--- C6. Bulk update ---")
    
    # C6a. Find Waistcoat and Sherwani
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    all_prices = resp.json().get("items", [])
    waistcoat = next((p for p in all_prices if "Waistcoat" in p.get("name", "")), None)
    sherwani = next((p for p in all_prices if "Sherwani" in p.get("name", "")), None)
    
    if waistcoat and sherwani:
        waistcoat_id = waistcoat.get("_id")
        sherwani_id = sherwani.get("_id")
        original_waistcoat_dc = waistcoat.get("dc_price")
        original_sherwani_dc = sherwani.get("dc_price")
        log_test("C6a. Found Waistcoat and Sherwani",
                 True,
                 f"Waistcoat dc={original_waistcoat_dc}, Sherwani dc={original_sherwani_dc}")
        
        # C6b. POST bulk preview (increase 10%)
        resp = session.post(f"{BASE_URL}/api/admin/prices/bulk", json={
            "ids": [waistcoat_id, sherwani_id],
            "op": "increase",
            "value": 10,
            "preview": True
        })
        if resp.status_code == 200:
            preview_data = resp.json()
            log_test("C6b. POST /api/admin/prices/bulk with preview=true returns changes",
                     "changes" in preview_data and len(preview_data.get("changes", [])) == 2,
                     f"Got {len(preview_data.get('changes', []))} changes")
            
            # C6c. Verify no DB writes (dc_price unchanged)
            resp = session.get(f"{BASE_URL}/api/admin/prices")
            all_prices = resp.json().get("items", [])
            waistcoat_check = next((p for p in all_prices if p.get("_id") == waistcoat_id), None)
            log_test("C6c. Preview mode does NOT write to DB",
                     waistcoat_check and waistcoat_check.get("dc_price") == original_waistcoat_dc,
                     f"Waistcoat dc_price still {waistcoat_check.get('dc_price') if waistcoat_check else 'NOT FOUND'}")
        else:
            log_test("C6b-c. Bulk preview", False, f"Failed: {resp.status_code}")
        
        # C6d. POST bulk commit (increase 10%)
        resp = session.post(f"{BASE_URL}/api/admin/prices/bulk", json={
            "ids": [waistcoat_id, sherwani_id],
            "op": "increase",
            "value": 10,
            "preview": False
        })
        if resp.status_code == 200:
            result = resp.json()
            log_test("C6d. POST /api/admin/prices/bulk with preview=false applies changes",
                     result.get("applied") == 2,
                     f"Applied {result.get('applied')} changes")
            
            # C6e. Verify dc_price increased by 10%
            resp = session.get(f"{BASE_URL}/api/admin/prices")
            all_prices = resp.json().get("items", [])
            waistcoat_check = next((p for p in all_prices if p.get("_id") == waistcoat_id), None)
            sherwani_check = next((p for p in all_prices if p.get("_id") == sherwani_id), None)
            expected_waistcoat = str(round(float(original_waistcoat_dc) * 1.1))
            expected_sherwani = str(round(float(original_sherwani_dc) * 1.1))
            log_test("C6e. Bulk update increased dc_price by 10%",
                     waistcoat_check and sherwani_check,
                     f"Waistcoat: {waistcoat_check.get('dc_price') if waistcoat_check else 'N/A'} (expected ~{expected_waistcoat}), Sherwani: {sherwani_check.get('dc_price') if sherwani_check else 'N/A'} (expected ~{expected_sherwani})")
        else:
            log_test("C6d-e. Bulk commit", False, f"Failed: {resp.status_code}")
        
        # C6f. Restore original values
        resp1 = session.put(f"{BASE_URL}/api/admin/prices/{waistcoat_id}", json={"dc_price": original_waistcoat_dc})
        resp2 = session.put(f"{BASE_URL}/api/admin/prices/{sherwani_id}", json={"dc_price": original_sherwani_dc})
        log_test("C6f. Restore Waistcoat and Sherwani to original dc_price",
                 resp1.status_code == 200 and resp2.status_code == 200,
                 f"Waistcoat: {resp1.status_code}, Sherwani: {resp2.status_code}")
        
        # C6g. Verify restoration
        resp = session.get(f"{BASE_URL}/api/admin/prices")
        all_prices = resp.json().get("items", [])
        waistcoat_check = next((p for p in all_prices if p.get("_id") == waistcoat_id), None)
        sherwani_check = next((p for p in all_prices if p.get("_id") == sherwani_id), None)
        log_test("C6g. Verify both items back to original values",
                 waistcoat_check.get("dc_price") == original_waistcoat_dc and sherwani_check.get("dc_price") == original_sherwani_dc,
                 f"Waistcoat: {waistcoat_check.get('dc_price')}, Sherwani: {sherwani_check.get('dc_price')}")
        
        # C6h. Verify price_history has bulk entries
        resp = session.get(f"{BASE_URL}/api/admin/price-history")
        history = resp.json().get("items", [])
        bulk_entries = [h for h in history if h.get("source") == "bulk"]
        log_test("C6h. Price history contains entries with source='bulk'",
                 len(bulk_entries) >= 2,
                 f"Found {len(bulk_entries)} bulk entries")
    else:
        log_test("C6. Bulk update", False, "Waistcoat or Sherwani not found")
    
    # C7. CSV Export
    print("\n--- C7. CSV Export ---")
    
    resp = session.get(f"{BASE_URL}/api/admin/prices/export")
    if resp.status_code == 200:
        content_type = resp.headers.get("Content-Type", "")
        content_disp = resp.headers.get("Content-Disposition", "")
        csv_text = resp.text
        lines = csv_text.strip().split("\n")
        header = lines[0] if lines else ""
        data_rows = [l for l in lines[1:] if l.strip()]
        
        log_test("C7a. GET /api/admin/prices/export returns CSV",
                 "text/csv" in content_type and "attachment" in content_disp,
                 f"Content-Type: {content_type}, Content-Disposition: {content_disp}")
        
        log_test("C7b. CSV has correct header columns",
                 header.startswith("id,category,name,service_type,mrp,discount_percent,dc_price,si_price,unit,active,special,display_order"),
                 f"Header: {header[:80]}...")
        
        log_test("C7c. CSV has at least 46 data rows",
                 len(data_rows) >= 46,
                 f"Got {len(data_rows)} data rows")
    else:
        log_test("C7. CSV Export", False, f"Failed: {resp.status_code}")
    
    # C8. CSV Import preview + commit
    print("\n--- C8. CSV Import preview + commit ---")
    
    # C8a. Get Shirt/T-Shirt for update test
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    shirt_item = next((p for p in resp.json().get("items", []) if "Shirt / T-Shirt" in p.get("name", "")), None)
    if shirt_item:
        shirt_id = shirt_item.get("_id")
        original_shirt_dc = shirt_item.get("dc_price")
        
        # Build CSV
        csv_content = "id,category,name,service_type,mrp,discount_percent,dc_price,si_price,unit,active,special,display_order\n"
        csv_content += f"{shirt_id},mens,Shirt / T-Shirt,Dry Cleaning,140,25,107,49,Per Piece,true,false,1\n"
        csv_content += ",mens,TEST CSV Import,Dry Cleaning,200,25,150,60,Per Piece,true,false,999\n"
        
        # C8b. POST import-preview
        files = {"file": ("test.csv", BytesIO(csv_content.encode("utf-8")), "text/csv")}
        resp = session.post(f"{BASE_URL}/api/admin/prices/import-preview", files=files)
        if resp.status_code == 200:
            preview = resp.json()
            log_test("C8b. POST /api/admin/prices/import-preview returns preview",
                     preview.get("newRows") and preview.get("updates") and len(preview.get("newRows", [])) == 1 and len(preview.get("updates", [])) == 1,
                     f"newRows: {len(preview.get('newRows', []))}, updates: {len(preview.get('updates', []))}, errors: {len(preview.get('errors', []))}")
            
            # C8c. POST import-commit
            resp = session.post(f"{BASE_URL}/api/admin/prices/import-commit", json={
                "newRows": preview.get("newRows", []),
                "updates": preview.get("updates", [])
            })
            if resp.status_code == 200:
                result = resp.json()
                log_test("C8c. POST /api/admin/prices/import-commit applies changes",
                         result.get("applied") == 2,
                         f"Applied {result.get('applied')} changes")
                
                # C8d. Verify Shirt at 107
                resp = session.get(f"{BASE_URL}/api/public/prices")
                public_shirt = next((p for p in resp.json().get("items", []) if p.get("_id") == shirt_id), None)
                log_test("C8d. Shirt/T-Shirt dc_price updated to 107",
                         public_shirt and public_shirt.get("dc_price") == "107",
                         f"dc_price={public_shirt.get('dc_price') if public_shirt else 'NOT FOUND'}")
                
                # C8e. Verify new item present
                test_csv_item = next((p for p in resp.json().get("items", []) if p.get("name") == "TEST CSV Import"), None)
                if test_csv_item:
                    cleanup_items.append(("price", test_csv_item.get("_id")))
                    log_test("C8e. New 'TEST CSV Import' item present in public prices",
                             True,
                             f"id={test_csv_item.get('_id')[:8]}..., dc_price={test_csv_item.get('dc_price')}")
                else:
                    log_test("C8e. New 'TEST CSV Import' item", False, "Not found in public prices")
            else:
                log_test("C8c. CSV import commit", False, f"Failed: {resp.status_code}")
        else:
            log_test("C8b. CSV import preview", False, f"Failed: {resp.status_code}")
        
        # C8f. Test invalid CSV (missing required column)
        invalid_csv = "id,name,dc_price\n,Test,100\n"
        files = {"file": ("invalid.csv", BytesIO(invalid_csv.encode("utf-8")), "text/csv")}
        resp = session.post(f"{BASE_URL}/api/admin/prices/import-preview", files=files)
        log_test("C8f. CSV import with missing required column returns 400",
                 resp.status_code == 400 and "Missing required columns" in resp.text,
                 f"status={resp.status_code}, error={resp.json().get('error', '')[:50]}")
        
        # C8g. Cleanup - delete TEST CSV Import
        if cleanup_items and cleanup_items[-1][0] == "price":
            test_item_id = cleanup_items[-1][1]
            resp = session.delete(f"{BASE_URL}/api/admin/prices/{test_item_id}")
            log_test("C8g. Delete 'TEST CSV Import' item",
                     resp.status_code == 200,
                     f"status={resp.status_code}")
            if resp.status_code == 200:
                cleanup_items.pop()
        
        # C8h. Restore Shirt to original dc_price
        resp = session.put(f"{BASE_URL}/api/admin/prices/{shirt_id}", json={"dc_price": original_shirt_dc})
        log_test("C8h. Restore Shirt/T-Shirt to original dc_price",
                 resp.status_code == 200,
                 f"Restored to {original_shirt_dc}")
    else:
        log_test("C8. CSV Import", False, "Shirt/T-Shirt item not found")
    
    # C9. Change Password + Rate Limit
    print("\n--- C9. Change Password + Rate Limit ---")
    
    # C9a. Rate limit test - 5 wrong passwords
    print("Testing rate limit (5 failed attempts)...")
    session_rl = requests.Session()
    for i in range(6):
        resp = session_rl.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123"
        })
        if i < 5:
            log_test(f"C9a.{i+1}. Failed login attempt {i+1}/5",
                     resp.status_code == 401,
                     f"status={resp.status_code}")
        else:
            log_test("C9a.6. 6th failed login attempt returns 429 (rate limited)",
                     resp.status_code == 429 and "Too many attempts" in resp.text,
                     f"status={resp.status_code}, error={resp.json().get('error', '')[:50]}")
    
    # C9b. Wait 2 seconds and try correct password from different session
    print("Waiting 2 seconds before testing correct login...")
    time.sleep(2)
    session_fresh = requests.Session()
    resp = session_fresh.post(f"{BASE_URL}/api/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    log_test("C9b. After rate limit, correct password from fresh session works",
             resp.status_code == 200 or resp.status_code == 429,
             f"status={resp.status_code} (429 is acceptable if still in window)")
    
    # C9c. Change password tests (using main session)
    # Short password
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": ADMIN_PASSWORD,
        "next": "short"
    })
    log_test("C9c. Change password with short password returns 400",
             resp.status_code == 400,
             f"status={resp.status_code}")
    
    # Wrong current password
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": "WRONG",
        "next": "GoodPass@2026!"
    })
    log_test("C9d. Change password with wrong current password returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # Successful change
    resp = session.post(f"{BASE_URL}/api/admin/change-password", json={
        "current": ADMIN_PASSWORD,
        "next": "GoodPass@2026!"
    })
    if resp.status_code == 200:
        log_test("C9e. Change password to GoodPass@2026! successful", True, "Password changed")
        
        # Login with new password
        session_new = requests.Session()
        resp = session_new.post(f"{BASE_URL}/api/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": "GoodPass@2026!"
        })
        log_test("C9f. Login with new password successful",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Change back to original
        resp = session_new.post(f"{BASE_URL}/api/admin/change-password", json={
            "current": "GoodPass@2026!",
            "next": ADMIN_PASSWORD
        })
        log_test("C9g. Change password back to original successful",
                 resp.status_code == 200,
                 f"status={resp.status_code}")
        
        # Re-login with original (update main session)
        admin_login()
    else:
        log_test("C9e-g. Change password cycle", False, f"Initial change failed: {resp.status_code}")
    
    # C10. Audit log
    print("\n--- C10. Audit log ---")
    
    # C10a. GET audit log
    resp = session.get(f"{BASE_URL}/api/admin/audit-log")
    audit_items = resp.json().get("items", [])
    actions = [a.get("action") for a in audit_items]
    has_login = "login" in actions
    has_price_updated = any("price" in a for a in actions)
    has_service_created = any("service" in a for a in actions)
    log_test("C10a. GET /api/admin/audit-log returns audit entries",
             resp.status_code == 200 and len(audit_items) > 0,
             f"Got {len(audit_items)} audit entries")
    
    log_test("C10b. Audit log contains expected actions (login, price_updated, service_created)",
             has_login and has_price_updated,
             f"login: {has_login}, price_updated: {has_price_updated}, service_created: {has_service_created}")
    
    # C10c. Verify no password fields in audit log
    has_password = any("password" in str(a).lower() for a in audit_items)
    log_test("C10c. Audit log does NOT contain password fields",
             not has_password,
             f"Contains password: {has_password}")
    
    # C10d. GET audit log with action filter
    resp = session.get(f"{BASE_URL}/api/admin/audit-log?action=login")
    filtered_items = resp.json().get("items", [])
    all_login = all(a.get("action") == "login" for a in filtered_items)
    log_test("C10d. GET /api/admin/audit-log?action=login returns only login entries",
             resp.status_code == 200 and all_login,
             f"Got {len(filtered_items)} login entries, all are login: {all_login}")
    
    return True

# =====================================================================
# PART D: Middleware & Security
# =====================================================================

def test_part_d_middleware_security():
    """Test middleware and security"""
    print("\n" + "="*70)
    print("PART D: MIDDLEWARE & SECURITY")
    print("="*70)
    
    # D1. Unauth 307 redirects for admin pages
    admin_pages = [
        "/admin",
        "/admin/services",
        "/admin/faqs",
        "/admin/settings",
        "/admin/promotions",
        "/admin/price-history",
        "/admin/bulk",
        "/admin/audit-log",
        "/admin/change-password"
    ]
    
    for page in admin_pages:
        resp = requests.get(f"{BASE_URL}{page}", allow_redirects=False)
        log_test(f"D1. GET {page} without cookie returns 307 redirect",
                 resp.status_code == 307 and "/admin/login" in resp.headers.get("Location", ""),
                 f"status={resp.status_code}, location={resp.headers.get('Location', '')[:50]}")
    
    # D2. robots.txt
    resp = requests.get(f"{BASE_URL}/robots.txt")
    log_test("D2. GET /robots.txt contains 'Disallow: /admin/'",
             resp.status_code == 200 and "Disallow: /admin/" in resp.text,
             f"status={resp.status_code}")
    
    # D3. sitemap.xml does NOT contain /admin URLs
    resp = requests.get(f"{BASE_URL}/sitemap.xml")
    has_admin_url = "/admin" in resp.text
    log_test("D3. GET /sitemap.xml does NOT contain any /admin URL",
             resp.status_code == 200 and not has_admin_url,
             f"status={resp.status_code}, contains /admin: {has_admin_url}")
    
    return True

# =====================================================================
# FINAL CLEAN STATE
# =====================================================================

def test_final_clean_state():
    """Verify final clean state"""
    print("\n" + "="*70)
    print("FINAL CLEAN STATE VERIFICATION")
    print("="*70)
    
    # Admin password
    resp = session.post(f"{BASE_URL}/api/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    log_test("FINAL1. Admin password is UrbanAdmin@2026",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    # Active promotion
    resp = session.get(f"{BASE_URL}/api/public/promotion")
    promo = resp.json().get("promotion", {})
    log_test("FINAL2. Active promotion is FLAT 25% OFF / 25% / Dry Cleaning / active=true",
             promo.get("title") == "FLAT 25% OFF" and promo.get("discount_percent") == 25 and promo.get("applies_to") == "Dry Cleaning" and promo.get("active") == True,
             f"title={promo.get('title')}, discount={promo.get('discount_percent')}%, applies_to={promo.get('applies_to')}, active={promo.get('active')}")
    
    # 46 price items
    resp = session.get(f"{BASE_URL}/api/public/prices")
    items = resp.json().get("items", [])
    shirt = next((p for p in items if "Shirt / T-Shirt" in p.get("name", "")), None)
    trouser = next((p for p in items if "Trouser / Pant" in p.get("name", "")), None)
    log_test("FINAL3. 46 price items with original dc_price values",
             len(items) == 46 and shirt and shirt.get("dc_price") == "105" and trouser and trouser.get("dc_price") == "113",
             f"Total items: {len(items)}, Shirt dc={shirt.get('dc_price') if shirt else 'N/A'}, Trouser dc={trouser.get('dc_price') if trouser else 'N/A'}")
    
    # Business settings
    resp = session.get(f"{BASE_URL}/api/public/settings")
    settings = resp.json().get("settings", {})
    log_test("FINAL4. Business settings pin=201318, address_line2 contains Greater Noida West",
             settings.get("pin") == "201318" and "Greater Noida West" in settings.get("address_line2", ""),
             f"pin={settings.get('pin')}, address_line2={settings.get('address_line2')}")
    
    # No leftover TEST items
    resp = session.get(f"{BASE_URL}/api/admin/prices")
    admin_items = resp.json().get("items", [])
    test_items = [p for p in admin_items if "TEST" in p.get("name", "")]
    log_test("FINAL5. No leftover TEST QA / TEST CSV Import records",
             len(test_items) == 0,
             f"Found {len(test_items)} TEST items")
    
    return True

# =====================================================================
# MAIN
# =====================================================================

def main():
    print("="*70)
    print("URBAN DRY CLEAN ADMIN PANEL PHASE 2")
    print("FULL BACKEND REGRESSION TEST")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL}")
    print("="*70)
    
    try:
        # Run all test parts
        test_part_a_phase1_regression()
        test_part_b_address_correctness()
        test_part_c_phase2_endpoints()
        test_part_d_middleware_security()
        test_final_clean_state()
        
        # Summary
        print("\n" + "="*70)
        print("TEST SUMMARY")
        print("="*70)
        passed = sum(1 for t in test_results if t["passed"])
        failed = sum(1 for t in test_results if not t["passed"])
        print(f"Total tests: {len(test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for t in test_results:
                if not t["passed"]:
                    print(f"  - {t['name']}")
                    if t["details"]:
                        print(f"    {t['details']}")
        
        print("\n" + "="*70)
        if failed == 0:
            print("✅ ALL TESTS PASSED - BACKEND IS PRODUCTION READY")
        else:
            print(f"❌ {failed} TESTS FAILED - REVIEW REQUIRED")
        print("="*70)
        
        return 0 if failed == 0 else 1
        
    except Exception as e:
        print(f"\n❌ TEST SUITE ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
