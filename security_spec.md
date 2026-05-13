# Security Specification for CyberShop AI

## 1. Data Invariants
- A `Product` must have a valid `name`, `price`, and `category`. `price` must be non-negative.
- An `Order` must be linked to a valid `userId` matching the authenticated user during creation.
- A `CartItem` can only be modified by the owner of the user document it resides under.
- `isAdmin` role can only be assigned by an existing admin or a one-time bootstrap (handled by system check).

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create an order for `target_user_id` while authenticated as `victim_user_id`.
2. **Privilege Escalation**: User tries to update their own profile to set `role: 'admin'`.
3. **Price Manipulation**: Creating an order with `total: 0.1` while items actually cost more (though client does sum, rules should ideally verify or limit update gaps).
4. **Infinite Stock**: Admin attempt to update product stock to `-1` (negative values).
5. **Orphaned Write**: Creating a cart item for a non-existent product ID.
6. **Query Scraping**: Attempting to list all `orders` without a user filter.
7. **Terminal State Bypass**: Attempting to move an order from `delivered` back to `pending`.
8. **Malicious ID**: Creating a product with a 1MB string as the document ID.
9. **Ghost Fields**: Adding `isVerified: true` to a UserProfile.
10. **Timestamp Fraud**: Setting `createdAt` to a date in the future.
11. **PII Exposure**: Non-admin user trying to `get` another user's profile.
12. **Denial of Wallet**: Sending a massive 1MB string in the `name` field of a product.

## 3. Test Runner (Draft Logic)
The `firestore.rules.test.ts` will verify these denials.
