# Footers — Project TODO

## Completed

- [x] MongoDB product catalog with CRUD
- [x] Public storefront (Home, Products, Featured, Product Detail)
- [x] Product search, filters, categories, brands from API
- [x] Cart with localStorage persistence
- [x] Checkout with customer details, address, payment method
- [x] Public order API (`POST /orders/checkout`)
- [x] Inventory reduction on order creation
- [x] Stock restore on order cancellation
- [x] Admin ERP dashboard (owner/staff)
- [x] Role-based permissions
- [x] Invoice generation (HTML)
- [x] Email invoice (SMTP via env vars)
- [x] Shipping abstraction with DummyShippingProvider
- [x] Order tracking page
- [x] Image storage abstraction (LocalImageProvider)
- [x] Tracking number generation on checkout

## Remaining

- [ ] Online payment gateway (Razorpay/Stripe)
- [ ] Customer account / order history login
- [ ] Saved addresses for returning customers
- [ ] Product reviews from real users
- [ ] Wishlist persistence

## Production Enhancements

- [ ] Rate limiting on checkout endpoint
- [ ] Order idempotency keys
- [ ] Input validation (Joi) on checkout
- [ ] Soft delete for orders
- [ ] Audit log for admin actions
- [ ] CDN for product images
- [ ] Redis session/cache
- [ ] CI/CD pipeline
- [ ] E2E test suite (Playwright/Cypress)

## Courier API Integration

1. Set `SHIPPING_PROVIDER=shiprocket` (or delhivery/bluedart)
2. Add API keys to `.env`
3. Implement `createShipment()` and `getTrackingStatus()` in the adapter
4. No changes needed in order controller or frontend

## Payment Gateway Integration

1. Add Razorpay/Stripe SDK to backend
2. Create payment intent before order confirmation
3. Verify payment webhook before reducing inventory
4. Update checkout UI with payment widget

## Cloud Image Storage

1. Set `IMAGE_PROVIDER=cloudinary|s3|firebase`
2. Implement `buildUrlsFromFiles()` and `deleteImage()` in provider
3. Update admin ProductForm if upload flow changes

## Notifications

- [ ] SMS order confirmation
- [ ] Push notifications for order status
- [ ] Admin alert for low stock

## Analytics

- [ ] Google Analytics / Mixpanel
- [ ] Sales funnel tracking
- [ ] Product performance reports

## Backups

- [ ] Automated MongoDB backups
- [ ] Upload directory backup strategy
