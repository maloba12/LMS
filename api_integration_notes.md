Directus ↔ LMS API Documentation
Base URLs
LMS (Local): http://localhost:3000
Directus (Prod): https://loans.cairoai.africa

Authentication (Directus)
Header Format
Authorization: Bearer DIRECTUS_TOKEN

Token is generated from a Directus service account user, not Access Policies.

Directus Collections Used
Collection Purpose
loan_products Loan product metadata
vendors Vendor profiles
notifications Admin/system notifications
loan_applications Workflow status sync
LMS API Endpoints
🔹 Get Loan Products (via Directus)
GET /api/products

Flow

LMS calls Directus /items/loan_products

If successful → returns Directus data

If Directus fails → fallback to LMS database

Expected Response

[
{
"id": 1,
"name": "Salary Advance",
"interest_rate": "15.00",
"currency": "ZMW",
"loan_type": "personal",
"status": "active"
}
]

🔹 Get Vendors
GET /api/vendors

Notes

Requires Directus permission: vendors → read

Items must be published/active in Directus

DirectusService Layer

File

lib/directus-service.ts

Responsibilities

Fetch content from Directus

Send notifications to Directus

Keep CMS logic separate from LMS logic

Testing Commands
Test Directus Directly
curl https://loans.cairoai.africa/items/loan_products \
 -H "Authorization: Bearer DIRECTUS_TOKEN"

Test LMS API
http://localhost:3000/api/products

Security Notes

LMS never exposes Directus tokens to the frontend

All CMS access is server-side only

Permissions controlled via Directus Access Policies
