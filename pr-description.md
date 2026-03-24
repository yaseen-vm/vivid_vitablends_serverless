## Summary of Changes

Implemented a dynamic cart discount feature where orders with a subtotal strictly greater than ₹1999 receive an automatic ₹200 discount. This logic is synchronized across both the frontend and backend for security and accuracy.

## Related Issues

- Cart Discount Implementation

## Architectural Decisions

- **SRP & DRY**: Created a shared utility function `calculateCartTotals` in `frontend/src/lib/cartUtils.ts` to ensure that both the `CartPage` and `CheckoutPage` use the exact same logic for computing the subtotal, discount, and final total.
- **Security Validation**: Updated `backend/src/services/order.service.js` to recalculate the discount on the server-side. The backend fetches secure prices directly from the database and ensures that the total submitted by the client perfectly matches the server-computed discounted total.

## Testing Performed

- Ran frontend type checking and linting (`npm run lint`, `npm run format:check`).
- Ran backend formatting and checks (`npm run format:check`).
- Visual manual verification implemented via UI components showing "Subtotal", "Discount", and "Total".

## Screenshots

_(Add screenshots of the updated Cart and Checkout pages displaying the subtotal and discount if applicable)_
