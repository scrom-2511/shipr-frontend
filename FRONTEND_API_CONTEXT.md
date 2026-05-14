# API Endpoints Context for Frontend

This document provides the API endpoint specifications for the Shipr authentication system.

## Base URL

```
http://localhost:9000
```

---

## Authentication Endpoints

### 1. Signup Endpoint

**URL:** `POST /signup`

**Request Body:**

```typescript
interface SignupRequest {
  name: string;      // Required, min 1 character
  email: string;    // Required, valid email format
  password: string; // Required, min 8 characters
}
```

**Example Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**

```typescript
interface SignupResponse {
  message: string;
}
```

**Example Response:**

```json
{
  "message": "User created successfully"
}
```

**Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | ValidationError | Invalid request body |
| 400 | InvalidEmail | Invalid email format |
| 400 | PasswordTooShort | Password less than 8 characters |
| 409 | UserAlreadyExists | User with email already exists |
| 500 | DatabaseError | Server error |

---

### 2. Signin Endpoint

**URL:** `POST /signin`

**Request Body:**

```typescript
interface SigninRequest {
  email: string;    // Required, valid email format
  password: string; // Required, min 8 characters
}
```

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

```typescript
interface SigninResponse {
  message: string;
  token: string; // JWT token for subsequent requests
}
```

**Example Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | ValidationError | Invalid request body |
| 400 | InvalidEmail | Invalid email format |
| 400 | PasswordTooShort | Password less than 8 characters |
| 401 | InvalidCredentials | Wrong email or password |
| 404 | UserNotFound | No user with this email |

---

## Error Response Format

All error responses follow this structure:

```typescript
interface ErrorResponse {
  error_code: "InvalidGitUrl" | "UnknownProjectType" | "InvalidEmail" | "PasswordTooShort" | "UserAlreadyExists" | "ValidationError" | "InvalidCredentials" | "UserNotFound" | "GithubOAuthError" | "IdAllocationFailed" | "FailedToGetIdFromPool" | "StartingFirecrackerFailed" | "DatabaseError" | "InternalServerError";
  message: string;
}
```

---

## JWT Token

Upon successful login, a JWT token is returned. This token should be included in subsequent API requests as a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

The token expires after 24 hours.

**Token Payload:**

```typescript
interface Claims {
  sub: string;    // User ID (UUID)
  email: string;  // User email
  iat: number;    // Issued at timestamp
  exp: number;    // Expiration timestamp
}
```

---

## Usage Notes for Frontend

1. **Validation:** Perform client-side validation before sending requests:
   - Email: valid email format
   - Password: minimum 8 characters

2. **Error Handling:** Map `error_code` from responses to user-friendly messages

3. **Authentication:** Store the JWT token securely (localStorage or sessionStorage) and include it in requests to protected endpoints

4. **Port:** The server runs on port `9000` (configured in `src/bin/app.rs`)