# Security Specification - SeniorEase

## Data Invariants
1. **Tickets**:
   - Must have a valid `ticketId`, `name`, `email`, and `source`.
   - `status` must be one of the predefined states.
   - `createdAt` must be the server time.
   - Publicly creatable, but only readable by Admins.
2. **New Joinees**:
   - Must have a valid `customerId`, `name`, `email`, `plan`, and `price`.
   - Publicly creatable during registration, but only readable/manageable by Admins.
3. **Customers**:
   - Sensitive PII (phone, password) must be protected.
   - Only Admins can create or delete customers.
   - Users can read their own profile (based on ID match or email).
4. **Login Logs**:
   - Publicly creatable (on login), but only readable by Admins.

## The "Dirty Dozen" Payloads (Denial Expected)
1. **Admin Spoofing**: Attempt to create a ticket with `isAdmin: true` field.
2. **Path Poisoning**: Attempt to write to `tickets/../..`.
3. **Identity Theft**: Attempt to update another customer's plan.
4. **Status Shortcut**: Public user attempting to mark a ticket as "Resolved".
5. **Ghost Field**: Adding `isVerified: true` to a `new_joinees` document.
6. **Large ID**: Document ID size > 128 characters.
7. **Invalid Type**: Sending a boolean for a `name` field.
8. **PII Leak**: Non-admin attempting to list all `new_joinees`.
9. **Timestamp Fraud**: Sending a client-side date for `createdAt` instead of `request.time`.
10. **Immutable field**: Attempting to change `customerId` on an existing joinee.
11. **Email Spoof**: Sending an admin email in a ticket without authentication.
12. **Status Lock**: Attempting to update a "Closed" ticket.

## Test Runner
I will verify these rules using the Firestore Emulator/logic simulation during Rule generation.
