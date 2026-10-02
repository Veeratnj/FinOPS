# Authentication API Documentation

## Overview
This document describes the authentication and user management endpoints for the AI FinOps Platform API.

**Important:** Organizations are required before users can register. Each organization has one admin user with up to 3 additional users initially. Users can only register for existing organizations by providing the organization slug and admin name for verification.

## Base URL
```
http://localhost:8000
```

## Authentication Endpoints

### 1. Register Organization with Admin
Create a new organization with an organization admin user.

**Endpoint:** `POST /tenants/register-org`

**Request:**
```bash
curl -X POST "http://localhost:8000/tenants/register-org" \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "My Company",
    "org_slug": "my-company",
    "org_plan": "starter",
    "admin_email": "admin@mycompany.com",
    "admin_password": "securepassword123",
    "admin_name": "John Doe"
  }'
```

**Request Body:**
```json
{
  "org_name": "My Company",
  "org_slug": "my-company",
  "org_plan": "starter",
  "admin_email": "admin@mycompany.com",
  "admin_password": "securepassword123",
  "admin_name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "message": "Organization created successfully",
  "org_id": "org-uuid",
  "org_name": "My Company",
  "org_slug": "my-company",
  "admin_email": "admin@mycompany.com",
  "admin_name": "John Doe"
}
```

**Error Responses:**
- `400 Bad Request`: Organization slug already exists or email already registered
```json
{
  "detail": "Organization with this slug already exists"
}
```

### 2. User Registration (for existing organization)
Register a new user for an existing organization. User must provide the organization slug and admin name for verification.

**Endpoint:** `POST /auth/register`

**Request:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "userpassword123",
    "org_slug": "my-company",
    "org_admin_name": "John Doe",
    "role": "viewer"
  }'
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "userpassword123",
  "org_slug": "my-company",
  "org_admin_name": "John Doe",
  "role": "viewer"
}
```

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "email": "newuser@example.com",
  "role": "viewer",
  "is_active": true,
  "tenant_id": "org-uuid",
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid organization, admin name doesn't match, or email already registered
```json
{
  "detail": "Invalid organization admin name"
}
```
```json
{
  "detail": "Email already registered"
}
```

### 3. User Login
Authenticate a user and receive access/refresh tokens.

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=yourpassword"
```

**Request Body (Form Data):**
- `username` (string, required): User's email address
- `password` (string, required): User's password

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "viewer",
    "is_active": true,
    "tenant_id": "tenant-uuid",
    "created_at": "2026-04-19T10:00:00Z",
    "updated_at": "2026-04-19T10:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
```json
{
  "detail": "Incorrect email or password"
}
```

### 4. User Logout
Logout the current user.

**Endpoint:** `POST /auth/logout`

**Request:**
```bash
curl -X POST "http://localhost:8000/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token

### 5. Refresh Access Token
Refresh an expired access token using a valid refresh token.

**Endpoint:** `POST /auth/refresh`

**Request:**
```bash
curl -X POST "http://localhost:8000/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "viewer",
    "is_active": true,
    "tenant_id": "tenant-uuid",
    "created_at": "2026-04-19T10:00:00Z",
    "updated_at": "2026-04-19T10:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid refresh token
```json
{
  "detail": "Invalid refresh token"
}
```

## User Management Endpoints

### 6. Create User (Admin Only)
Create a new user for an organization. Requires authentication and admin role.

**Endpoint:** `POST /user-operations/create-user`

**Request:**
```bash
curl -X POST "http://localhost:8000/user-operations/create-user" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "viewer",
    "tenant_id": "tenant-uuid"
  }'
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "role": "viewer",
  "tenant_id": "tenant-uuid"
}
```

**Response (200 OK):**
```json
{
  "id": "new-user-uuid",
  "email": "newuser@example.com",
  "role": "viewer",
  "is_active": true,
  "tenant_id": "tenant-uuid",
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "viewer",
    "tenant_id": "tenant-uuid"
  }'
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "role": "viewer",
  "tenant_id": "tenant-uuid"
}
```

**Response (200 OK):**
```json
{
  "id": "new-user-uuid",
  "email": "newuser@example.com",
  "role": "viewer",
  "is_active": true,
  "tenant_id": "tenant-uuid",
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: User already exists or invalid data
```json
{
  "detail": "User with this email already exists"
}
```

## Organization (Tenant) Management Endpoints

### 7. Create Organization with Admin
Create a new organization with an admin user (preferred method).

**Endpoint:** `POST /tenants/register-org`

See section: "Register Organization with Admin" under Authentication Endpoints.

### 8. Create Organization (No Admin)
Create a new organization without admin.

**Endpoint:** `POST /tenants/`

**Request:**
```bash
curl -X POST "http://localhost:8000/tenants/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "slug": "my-company",
    "plan": "starter"
  }'
```

**Request Body:**
```json
{
  "name": "My Company",
  "slug": "my-company",
  "plan": "starter"
}
```

**Response (200 OK):**
```json
{
  "id": "tenant-uuid",
  "name": "My Company",
  "slug": "my-company",
  "plan": "starter",
  "is_active": true,
  "metadata_": {},
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Tenant slug already exists
```json
{
  "detail": "Tenant with this slug already exists"
}
```

### 9. Get All Organizations
Retrieve all organizations (admin only).

**Endpoint:** `GET /tenants/`

**Request:**
```bash
curl -X GET "http://localhost:8000/tenants/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)

**Response (200 OK):**
```json
[
  {
    "id": "tenant-uuid-1",
    "name": "Company A",
    "slug": "company-a",
    "plan": "pro",
    "is_active": true,
    "metadata_": {},
    "created_at": "2026-04-19T09:00:00Z",
    "updated_at": "2026-04-19T09:00:00Z"
  },
  {
    "id": "tenant-uuid-2",
    "name": "Company B",
    "slug": "company-b",
    "plan": "starter",
    "is_active": true,
    "metadata_": {},
    "created_at": "2026-04-19T10:00:00Z",
    "updated_at": "2026-04-19T10:00:00Z"
  }
]
```

### 10. Get Organization by ID
Get organization details by ID.

**Endpoint:** `GET /tenants/{tenant_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/tenants/tenant-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "tenant-uuid",
  "name": "My Company",
  "slug": "my-company",
  "plan": "starter",
  "is_active": true,
  "metadata_": {},
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Tenant not found
```json
{
  "detail": "Tenant not found"
}
```

### 11. Get Organization by Slug
Get organization details by slug.

**Endpoint:** `GET /tenants/by-slug/{slug}`

**Request:**
```bash
curl -X GET "http://localhost:8000/tenants/by-slug/my-company"
```

**Response (200 OK):**
```json
{
  "id": "tenant-uuid",
  "name": "My Company",
  "slug": "my-company",
  "plan": "starter",
  "is_active": true,
  "metadata_": {},
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T10:00:00Z"
}
```

### 12. Update Organization
Update organization details.

**Endpoint:** `PUT /tenants/{tenant_id}`

**Request:**
```bash
curl -X PUT "http://localhost:8000/tenants/tenant-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Company Name",
    "plan": "pro"
  }'
```

**Request Body:**
```json
{
  "name": "Updated Company Name",
  "plan": "pro",
  "is_active": true,
  "metadata_": {"key": "value"}
}
```

**Response (200 OK):**
```json
{
  "id": "tenant-uuid",
  "name": "Updated Company Name",
  "slug": "my-company",
  "plan": "pro",
  "is_active": true,
  "metadata_": {"key": "value"},
  "created_at": "2026-04-19T10:00:00Z",
  "updated_at": "2026-04-19T11:00:00Z"
}
```

### 13. Delete Organization
Delete an organization.

**Endpoint:** `DELETE /tenants/{tenant_id}`

**Request:**
```bash
curl -X DELETE "http://localhost:8000/tenants/tenant-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "Tenant deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Tenant not found

### 5. Get Users
Retrieve all users in the organization. (Placeholder implementation)

**Endpoint:** `GET /user-operations/users`

**Request:**
```bash
curl -X GET "http://localhost:8000/user-operations/users" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
[]
```

### 6. Delete User
Delete a user by ID. (Placeholder implementation)

**Endpoint:** `DELETE /user-operations/users/{user_id}`

**Request:**
```bash
curl -X DELETE "http://localhost:8000/user-operations/users/user-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

## API Endpoints Created
```
POST /tenants/register-org
POST /auth/register
POST /auth/login
POST /auth/logout  
POST /auth/refresh
POST /user-operations/create-user
GET  /user-operations/users
DELETE /user-operations/users/{user_id}
POST /tenants/
GET  /tenants/
GET  /tenants/{tenant_id}
GET  /tenants/by-slug/{slug}
PUT  /tenants/{tenant_id}
DELETE /tenants/{tenant_id}
```

## Important: Organization-Based Registration

### Key Requirements
1. **Organization First**: Every user must belong to an organization. No standalone users are allowed.
2. **Organization Admin Required**: Each organization must have one admin user (with role "owner").
3. **Admin Verification**: When users register, they must provide the organization slug AND the admin's name for security verification.
4. **User Limits**: Organizations initially have 1 admin + up to 3 additional users.

### Registration Validations
When registering a new user, the system verifies:
- The organization slug exists
- The provided admin name matches the organization's registered admin name
- The email is not already registered
- The user is being added to the correct organization

### Security Notes
- Passwords are hashed using bcrypt
- JWT tokens are signed with HS256 algorithm
- Admin password must be different from user passwords
- Admin name is stored for verification during user registration
- All endpoints require proper authentication except public registration

## Authentication Details

### JWT Tokens
- **Access Token**: Short-lived token (8 days) for API access
- **Refresh Token**: Long-lived token (30 days) for obtaining new access tokens
- **Token Type**: Bearer

### Token Claims
Access tokens contain:
- `sub`: User ID
- `exp`: Expiration timestamp
- `type`: "access"
- `tenant_id`: User's tenant ID

Refresh tokens contain:
- `sub`: User ID
- `exp`: Expiration timestamp
- `type`: "refresh"
- `tenant_id`: User's tenant ID

### User Roles
- `owner`: Full access to organization
- `admin`: Administrative access
- `viewer`: Read-only access

### Tenant Plans
- `starter`: Basic plan with limited features
- `pro`: Professional plan with advanced features
- `enterprise`: Enterprise plan with all features

### Multi-Tenant Architecture
All operations are scoped to the user's tenant. The tenant ID is extracted from the JWT token and used for data isolation.

## Error Handling
All endpoints return appropriate HTTP status codes and JSON error responses:

- `200 OK`: Success
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid credentials
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing the API

1. **Start the server:**
```bash
cd /home/veera/workspace/Ctrls/Ctrls-API
python -m uvicorn app.main:app --reload
```

2. **Access Swagger UI:**
```
http://localhost:8000/docs
```

3. **Access ReDoc:**
```
http://localhost:8000/redoc
```

## Example Workflow

### For Organization Admin (First Time Setup)
1. **Register Organization** with admin user
```bash
curl -X POST "http://localhost:8000/tenants/register-org" \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "My Company",
    "org_slug": "my-company",
    "org_plan": "starter",
    "admin_email": "admin@mycompany.com",
    "admin_password": "adminpass123",
    "admin_name": "John Doe"
  }'
```

2. **Admin Login** to get tokens
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -d "username=admin@mycompany.com&password=adminpass123"
```

3. **Admin can create additional users** using authenticated endpoint

### For New Users Joining Organization
1. **Register with existing organization**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "userpass123",
    "org_slug": "my-company",
    "org_admin_name": "John Doe",
    "role": "viewer"
  }'
```

2. **Login** with the registered credentials
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -d "username=newuser@example.com&password=userpass123"
```

3. **Use access token** in Authorization header for subsequent requests

## Security Notes
- Passwords are hashed using bcrypt
- JWT tokens are signed with HS256 algorithm
- All endpoints require proper authentication except login
- Tenant-level data isolation prevents cross-tenant access