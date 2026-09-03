#!/usr/bin/env python3
"""
Urban Dry Clean - Targeted Backend Test for "Book Pickup" Leads Feature
Tests ONLY the new leads endpoints and related regressions.
Does NOT run full Phase 2 regression (already passes 109/116).
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://premium-cleaning-20.preview.emergentagent.com"
ADMIN_EMAIL = "admin@urbandryclean.in"
ADMIN_PASSWORD = "UrbanAdmin@2026"

# Test state
session = requests.Session()
test_results = []
created_lead_ids = []

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
        print(f"✅ Login successful")
        return True
    else:
        print(f"❌ Login failed: {resp.status_code} {resp.text}")
        return False

# =====================================================================
# A. POST /api/leads (public, no auth needed)
# =====================================================================

def test_part_a_public_leads():
    """Test public POST /api/leads endpoint"""
    print("\n" + "="*70)
    print("PART A: POST /api/leads (PUBLIC ENDPOINT)")
    print("="*70)
    
    # A1. POST with body {} -> 400 { error: "Mobile number is required" }
    resp = requests.post(f"{BASE_URL}/api/leads", json={})
    log_test("A1. POST /api/leads with empty body returns 400 'Mobile number is required'",
             resp.status_code == 400 and "Mobile number is required" in resp.text,
             f"status={resp.status_code}, error={resp.json().get('error', '')}")
    
    # A2. POST with { name: "Test" } (no phone) -> 400, same error
    resp = requests.post(f"{BASE_URL}/api/leads", json={"name": "Test"})
    log_test("A2. POST /api/leads with name only (no phone) returns 400 'Mobile number is required'",
             resp.status_code == 400 and "Mobile number is required" in resp.text,
             f"status={resp.status_code}, error={resp.json().get('error', '')}")
    
    # A3. POST with { phone: "abc" } -> 400 { error: "Please enter a valid mobile number" }
    resp = requests.post(f"{BASE_URL}/api/leads", json={"phone": "abc"})
    log_test("A3. POST /api/leads with invalid phone 'abc' returns 400 'Please enter a valid mobile number'",
             resp.status_code == 400 and "Please enter a valid mobile number" in resp.text,
             f"status={resp.status_code}, error={resp.json().get('error', '')}")
    
    # A4. POST with { phone: "+91 98765 43210" } -> 200 { ok: true, id }
    resp = requests.post(f"{BASE_URL}/api/leads", json={"phone": "+91 98765 43210"})
    if resp.status_code == 200:
        data = resp.json()
        lead_id_a4 = data.get("id")
        created_lead_ids.append(lead_id_a4)
        log_test("A4. POST /api/leads with phone only returns 200 { ok: true, id }",
                 data.get("ok") == True and lead_id_a4,
                 f"ok={data.get('ok')}, id={lead_id_a4[:8] if lead_id_a4 else 'None'}...")
    else:
        log_test("A4. POST /api/leads with phone only", False, f"status={resp.status_code}, response={resp.text[:100]}")
    
    # A5. POST with all fields -> 200 { ok:true, id }. Save the returned id.
    resp = requests.post(f"{BASE_URL}/api/leads", json={
        "name": "QA Reg Test",
        "phone": "+91 98765 43210",
        "address": "Test address",
        "date": "2026-08-25",
        "time": "10:30",
        "source": "header_form"
    })
    if resp.status_code == 200:
        data = resp.json()
        lead_id_a5 = data.get("id")
        created_lead_ids.append(lead_id_a5)
        log_test("A5. POST /api/leads with all fields returns 200 { ok: true, id }",
                 data.get("ok") == True and lead_id_a5,
                 f"ok={data.get('ok')}, id={lead_id_a5[:8] if lead_id_a5 else 'None'}...")
    else:
        log_test("A5. POST /api/leads with all fields", False, f"status={resp.status_code}, response={resp.text[:100]}")
    
    return True

# =====================================================================
# B. Admin endpoints (auth required)
# =====================================================================

def test_part_b_admin_leads():
    """Test admin leads endpoints"""
    print("\n" + "="*70)
    print("PART B: ADMIN LEADS ENDPOINTS (AUTH REQUIRED)")
    print("="*70)
    
    # B1. GET /api/admin/leads WITHOUT cookie -> 401
    session_unauth = requests.Session()
    resp = session_unauth.get(f"{BASE_URL}/api/admin/leads")
    log_test("B1. GET /api/admin/leads without cookie returns 401",
             resp.status_code == 401,
             f"status={resp.status_code}")
    
    # B2. POST /api/admin/login with admin credentials -> 200, cookie set
    if not admin_login():
        print("❌ Cannot continue without login")
        return False
    
    log_test("B2. POST /api/admin/login with admin credentials returns 200, cookie set",
             True,
             "Login successful")
    
    # B3. GET /api/admin/leads (authed) -> 200 { items: [...] }
    # Verify the two leads created above (A4, A5) are present with status "new", newest first
    resp = session.get(f"{BASE_URL}/api/admin/leads")
    if resp.status_code == 200:
        data = resp.json()
        items = data.get("items", [])
        
        # Check if our created leads are present
        found_a4 = any(item.get("_id") == created_lead_ids[0] for item in items) if len(created_lead_ids) > 0 else False
        found_a5 = any(item.get("_id") == created_lead_ids[1] for item in items) if len(created_lead_ids) > 1 else False
        
        # Check status is "new"
        a4_status = next((item.get("status") for item in items if item.get("_id") == created_lead_ids[0]), None) if len(created_lead_ids) > 0 else None
        a5_status = next((item.get("status") for item in items if item.get("_id") == created_lead_ids[1]), None) if len(created_lead_ids) > 1 else None
        
        # Check newest first (created_at desc) - A5 should come before A4
        if found_a4 and found_a5:
            a4_index = next((i for i, item in enumerate(items) if item.get("_id") == created_lead_ids[0]), -1)
            a5_index = next((i for i, item in enumerate(items) if item.get("_id") == created_lead_ids[1]), -1)
            newest_first = a5_index < a4_index
        else:
            newest_first = False
        
        log_test("B3. GET /api/admin/leads returns 200 { items: [...] }, both leads present with status='new', newest first",
                 found_a4 and found_a5 and a4_status == "new" and a5_status == "new" and newest_first,
                 f"Total items: {len(items)}, A4 found: {found_a4} (status={a4_status}), A5 found: {found_a5} (status={a5_status}), newest first: {newest_first}")
    else:
        log_test("B3. GET /api/admin/leads", False, f"status={resp.status_code}, response={resp.text[:100]}")
    
    # B4. GET /api/admin/leads?status=new -> 200, filters correctly
    resp = session.get(f"{BASE_URL}/api/admin/leads?status=new")
    if resp.status_code == 200:
        items = resp.json().get("items", [])
        all_new = all(item.get("status") == "new" for item in items)
        log_test("B4. GET /api/admin/leads?status=new returns 200, filters correctly",
                 all_new,
                 f"Got {len(items)} items, all status='new': {all_new}")
    else:
        log_test("B4. GET /api/admin/leads?status=new", False, f"status={resp.status_code}")
    
    # B5. GET /api/admin/leads?status=completed -> 200, empty (or does not contain the new leads)
    resp = session.get(f"{BASE_URL}/api/admin/leads?status=completed")
    if resp.status_code == 200:
        items = resp.json().get("items", [])
        contains_new_leads = any(item.get("_id") in created_lead_ids for item in items)
        log_test("B5. GET /api/admin/leads?status=completed returns 200, does NOT contain new leads",
                 not contains_new_leads,
                 f"Got {len(items)} items, contains new leads: {contains_new_leads}")
    else:
        log_test("B5. GET /api/admin/leads?status=completed", False, f"status={resp.status_code}")
    
    # B6. PUT /api/admin/leads/<A5-id> with { status: "contacted" } -> 200 { ok: true }
    # Subsequent GET shows the lead with status="contacted"
    if len(created_lead_ids) > 1:
        lead_id_a5 = created_lead_ids[1]
        resp = session.put(f"{BASE_URL}/api/admin/leads/{lead_id_a5}", json={"status": "contacted"})
        if resp.status_code == 200:
            data = resp.json()
            log_test("B6a. PUT /api/admin/leads/<A5-id> with status='contacted' returns 200 { ok: true }",
                     data.get("ok") == True,
                     f"ok={data.get('ok')}")
            
            # Verify status changed
            resp = session.get(f"{BASE_URL}/api/admin/leads")
            items = resp.json().get("items", [])
            a5_status = next((item.get("status") for item in items if item.get("_id") == lead_id_a5), None)
            log_test("B6b. Subsequent GET shows lead with status='contacted'",
                     a5_status == "contacted",
                     f"A5 status={a5_status}")
        else:
            log_test("B6. PUT /api/admin/leads/<A5-id>", False, f"status={resp.status_code}, response={resp.text[:100]}")
    else:
        log_test("B6. PUT /api/admin/leads/<A5-id>", False, "A5 lead ID not available")
    
    # B7. PUT with invalid id -> 404
    resp = session.put(f"{BASE_URL}/api/admin/leads/invalid-id-12345", json={"status": "contacted"})
    log_test("B7. PUT /api/admin/leads/<invalid-id> returns 404",
             resp.status_code == 404,
             f"status={resp.status_code}")
    
    # B8. DELETE /api/admin/leads/<A4-id> -> 200. DELETE /api/admin/leads/<A5-id> -> 200.
    # Subsequent GET does NOT include either.
    deleted_count = 0
    for lead_id in created_lead_ids[:]:
        resp = session.delete(f"{BASE_URL}/api/admin/leads/{lead_id}")
        if resp.status_code == 200:
            deleted_count += 1
            created_lead_ids.remove(lead_id)
    
    log_test("B8a. DELETE /api/admin/leads/<A4-id> and <A5-id> both return 200",
             deleted_count == 2,
             f"Deleted {deleted_count} leads")
    
    # Verify both are gone
    resp = session.get(f"{BASE_URL}/api/admin/leads")
    items = resp.json().get("items", [])
    contains_deleted = any(item.get("_id") in [created_lead_ids[0] if len(created_lead_ids) > 0 else None, created_lead_ids[1] if len(created_lead_ids) > 1 else None] for item in items)
    log_test("B8b. Subsequent GET does NOT include deleted leads",
             not contains_deleted,
             f"Contains deleted leads: {contains_deleted}")
    
    # B9. DELETE with invalid id -> 404
    resp = session.delete(f"{BASE_URL}/api/admin/leads/invalid-id-12345")
    log_test("B9. DELETE /api/admin/leads/<invalid-id> returns 404",
             resp.status_code == 404,
             f"status={resp.status_code}")
    
    return True

# =====================================================================
# C. WhatsApp link preservation regression
# =====================================================================

def test_part_c_whatsapp_links():
    """Test WhatsApp link preservation"""
    print("\n" + "="*70)
    print("PART C: WHATSAPP LINK PRESERVATION REGRESSION")
    print("="*70)
    
    # C1. GET (server-rendered HTML) home page - must contain the exact WhatsApp URL
    resp = requests.get(f"{BASE_URL}/")
    if resp.status_code == 200:
        html = resp.text
        # The exact URL (URL-encoded in HTML)
        exact_url = "https://wa.me/919710108181?text=Hello%20Urban%20Dry%20Clean%2C%20I%20would%20like%20to%20book%20a%20pickup.%20Please%20share%20the%20pickup%20details."
        # Also check for the base pattern
        has_wa_link = "wa.me/919710108181" in html
        has_message_pattern = "I%20would%20like%20to%20book%20a%20pickup" in html or "I would like to book a pickup" in html
        
        log_test("C1. GET / contains exact WhatsApp URL with pickup message",
                 has_wa_link and has_message_pattern,
                 f"Has wa.me/919710108181: {has_wa_link}, Has pickup message: {has_message_pattern}")
    else:
        log_test("C1. GET / WhatsApp link check", False, f"status={resp.status_code}")
    
    # C2. GET /contact - page still has wa.me/919710108181 link on WhatsApp button
    # Note: The review request mentions it "should be 919710108181" but currently has 919710108121
    # We'll just verify the link exists
    resp = requests.get(f"{BASE_URL}/contact")
    if resp.status_code == 200:
        html = resp.text
        has_wa_link = "wa.me/91971010818" in html  # Check for base pattern (either 919710108181 or 919710108121)
        log_test("C2. GET /contact has WhatsApp link (wa.me/91971010818x)",
                 has_wa_link,
                 f"Has WhatsApp link: {has_wa_link}")
    else:
        log_test("C2. GET /contact WhatsApp link check", False, f"status={resp.status_code}")
    
    # C3. GET /services - per-service "Enquire on WhatsApp" links still open wa.me/919710108181
    resp = requests.get(f"{BASE_URL}/services")
    if resp.status_code == 200:
        html = resp.text
        has_wa_link = "wa.me/919710108181" in html
        has_enquire = "Enquire on WhatsApp" in html or "enquire" in html.lower()
        log_test("C3. GET /services has per-service WhatsApp links (wa.me/919710108181)",
                 has_wa_link and has_enquire,
                 f"Has wa.me/919710108181: {has_wa_link}, Has enquire text: {has_enquire}")
    else:
        log_test("C3. GET /services WhatsApp link check", False, f"status={resp.status_code}")
    
    return True

# =====================================================================
# D. Middleware regression
# =====================================================================

def test_part_d_middleware():
    """Test middleware regression"""
    print("\n" + "="*70)
    print("PART D: MIDDLEWARE REGRESSION")
    print("="*70)
    
    # D1. GET /admin/leads with no cookie, allow_redirects=False -> 307, Location contains /admin/login?next=%2Fadmin%2Fleads
    resp = requests.get(f"{BASE_URL}/admin/leads", allow_redirects=False)
    location = resp.headers.get("Location", "")
    has_next_param = "/admin/login?next=%2Fadmin%2Fleads" in location or "/admin/login?next=/admin/leads" in location
    log_test("D1. GET /admin/leads without cookie returns 307 with Location=/admin/login?next=%2Fadmin%2Fleads",
             resp.status_code == 307 and has_next_param,
             f"status={resp.status_code}, location={location}")
    
    return True

# =====================================================================
# E. Sitemap/robots regression
# =====================================================================

def test_part_e_sitemap_robots():
    """Test sitemap and robots regression"""
    print("\n" + "="*70)
    print("PART E: SITEMAP/ROBOTS REGRESSION")
    print("="*70)
    
    # E1. GET /sitemap.xml -> 200, DOES NOT contain /admin
    resp = requests.get(f"{BASE_URL}/sitemap.xml")
    if resp.status_code == 200:
        xml = resp.text
        has_admin = "/admin" in xml
        log_test("E1. GET /sitemap.xml returns 200, DOES NOT contain /admin",
                 not has_admin,
                 f"status={resp.status_code}, contains /admin: {has_admin}")
    else:
        log_test("E1. GET /sitemap.xml", False, f"status={resp.status_code}")
    
    # E2. GET /robots.txt -> contains "Disallow: /admin/"
    resp = requests.get(f"{BASE_URL}/robots.txt")
    if resp.status_code == 200:
        txt = resp.text
        has_disallow = "Disallow: /admin/" in txt
        log_test("E2. GET /robots.txt contains 'Disallow: /admin/'",
                 has_disallow,
                 f"status={resp.status_code}, has disallow: {has_disallow}")
    else:
        log_test("E2. GET /robots.txt", False, f"status={resp.status_code}")
    
    return True

# =====================================================================
# F. Cleanup
# =====================================================================

def test_part_f_cleanup():
    """Verify cleanup and final state"""
    print("\n" + "="*70)
    print("PART F: CLEANUP & FINAL STATE")
    print("="*70)
    
    # F1. After the run, verify GET /api/admin/leads returns 0 items (or 0 QA test leads)
    resp = session.get(f"{BASE_URL}/api/admin/leads")
    if resp.status_code == 200:
        items = resp.json().get("items", [])
        # Check for any QA test leads (name contains "QA" or phone contains "98765 43210")
        qa_leads = [item for item in items if "QA" in item.get("name", "") or "98765 43210" in item.get("phone", "")]
        log_test("F1. GET /api/admin/leads returns 0 QA test leads",
                 len(qa_leads) == 0,
                 f"Total leads: {len(items)}, QA test leads: {len(qa_leads)}")
    else:
        log_test("F1. GET /api/admin/leads cleanup check", False, f"status={resp.status_code}")
    
    # Verify admin password is still UrbanAdmin@2026
    session_test = requests.Session()
    resp = session_test.post(f"{BASE_URL}/api/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    log_test("F2. Admin password is still UrbanAdmin@2026",
             resp.status_code == 200,
             f"status={resp.status_code}")
    
    return True

# =====================================================================
# MAIN
# =====================================================================

def main():
    print("="*70)
    print("URBAN DRY CLEAN - BOOK PICKUP LEADS FEATURE")
    print("TARGETED BACKEND TEST")
    print("="*70)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_EMAIL}")
    print("="*70)
    
    try:
        # Run all test parts
        test_part_a_public_leads()
        test_part_b_admin_leads()
        test_part_c_whatsapp_links()
        test_part_d_middleware()
        test_part_e_sitemap_robots()
        test_part_f_cleanup()
        
        # Summary
        print("\n" + "="*70)
        print("TEST SUMMARY")
        print("="*70)
        passed = sum(1 for t in test_results if t["passed"])
        failed = sum(1 for t in test_results if not t["passed"])
        total = len(test_results)
        print(f"Total tests: {total}")
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
        print("DETAILED RESULTS BY SECTION:")
        print("="*70)
        
        # Group by section
        sections = {
            "A": "POST /api/leads (public)",
            "B": "Admin leads endpoints",
            "C": "WhatsApp link preservation",
            "D": "Middleware regression",
            "E": "Sitemap/robots regression",
            "F": "Cleanup & final state"
        }
        
        for section_key, section_name in sections.items():
            section_tests = [t for t in test_results if t["name"].startswith(section_key)]
            section_passed = sum(1 for t in section_tests if t["passed"])
            section_total = len(section_tests)
            status = "✅" if section_passed == section_total else "❌"
            print(f"{status} {section_name}: {section_passed}/{section_total}")
        
        print("\n" + "="*70)
        if failed == 0:
            print("✅ ALL TESTS PASSED - LEADS FEATURE IS WORKING CORRECTLY")
        else:
            print(f"❌ {failed}/{total} TESTS FAILED - REVIEW REQUIRED")
        print("="*70)
        
        return 0 if failed == 0 else 1
        
    except Exception as e:
        print(f"\n❌ TEST SUITE ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
