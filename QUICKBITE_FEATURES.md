# QuickBite Cart & Checkout System - Implementation Guide

## 📋 Features Overview

### 🛒 **Cart Page** (`cart.html`)

#### 1. **Food Items Display**
- Shows all items added to cart
- Displays food image, name, price
- Shows quantity and total per item
- Real-time updates with localStorage

#### 2. **Dynamic Quantity Control**
- `+` and `−` buttons to adjust quantities
- Automatically updates:
  - Item total (price × quantity)
  - Subtotal, discount, delivery, tax
  - Final total amount
- Remove item down to 1, then remove completely

#### 3. **Remove Item Option**
- Red "Remove" button for each item
- Instantly updates cart summary
- Saves to localStorage

#### 4. **Live Total Calculation**
- **Subtotal**: Sum of all items
- **Discount**: Applied via coupon code
- **Delivery Charge**: ₹40 (auto-calculated)
- **Tax (5%)**: Auto-calculated on subtotal
- **Final Total**: Sum of all above

#### 5. **Coupon Code Feature** ⭐
Pre-configured coupon codes:
- **SAVE50** → ₹50 fixed discount
- **SAVE100** → ₹100 fixed discount
- **FOOD10** → 10% off on total
- **FOOD20** → 20% off on total
- **WELCOME** → ₹75 off (new users)
- **QUICKBITE** → 15% off (special)

**Usage:**
1. Enter coupon code in input field
2. Click "Apply" button or press Enter
3. Success/error message appears
4. Discount automatically applied to totals
5. Savings displayed in green

---

### 💳 **Checkout Page** (`checkout.html`)

#### 1. **User Details Form**
Collects the following information:
- **Full Name** - Required, letters only, min 2 characters
- **Email** - Required, valid email format
- **Phone Number** - Required, exactly 10 digits
- **Delivery Address** - Required, min 10 characters
- **Special Instructions** - Optional (e.g., extra spice, allergies)

**Validation Features:**
- Real-time validation on blur
- Clear error messages
- Red error styling on invalid fields
- Form won't submit with errors

#### 2. **Payment Method Selection**
Three options with icons and descriptions:

**💵 Cash on Delivery (COD)**
- Default selected option
- Pay when food arrives
- No upfront payment required

**📱 UPI Payment**
- Fast digital payment
- Multiple UPI apps supported
- Instant confirmation

**💳 Card Payment**
- Visa, MasterCard, Rupay
- Secure payment gateway
- Instant confirmation

#### 3. **Order Summary Box**
Sticky sidebar showing:
- **Order Items List**
  - Each item with name, quantity, price
  - Scrollable if many items
  
- **Price Breakdown**
  - Subtotal
  - Discount (if coupon applied)
  - Delivery charge
  - Tax (5%)
  - **Total Amount** (highlighted)

- **Back to Cart** button

#### 4. **Place Order Button**
- Large, prominent button at bottom of form
- Green success feedback on valid form
- Shows order processing confirmation
- Submits all data when clicked

#### 5. **Order Completion & Success Modal** 🎉
After placing order:
1. **Success Modal Appears** with:
   - Green checkmark animation
   - "Order Placed Successfully!" message
   - Order ID (e.g., #QB-2024001)
   - Estimated delivery time: 30-40 minutes
   - "Continue Shopping" button

2. **Auto-redirect** after 3 seconds to menu page

3. **Data Saved** to browser:
   - Order stored in localStorage
   - Cart cleared
   - Order accessible for history

---

## 🔌 **Technical Architecture**

### **Data Flow**
```
Menu Page → Add to Cart
    ↓
Cart Page (localStorage)
    ↓
Checkout Page (sessionStorage + localStorage)
    ↓
Success Modal
    ↓
Menu Page (Fresh state)
```

### **Storage Details**

**localStorage:**
- `quickbiteCart` - Current cart items
- `quickbiteOrders` - Completed orders history

**sessionStorage:**
- `orderSummary` - Cart data passed to checkout

---

## 📱 **Files Structure**

```
menu page/
├── menu.html          (Main menu page)
├── menu.js            (Updated with localStorage)
├── menu.css           (Menu styling)
├── cart.html          (New: Cart page)
├── cart.js            (New: Cart logic + coupons)
├── cart.css           (New: Cart styling)
├── checkout.html      (New: Checkout page)
├── checkout.js        (New: Checkout logic)
├── checkout.css       (New: Checkout styling)
└── image/
    └── bg-image       (Background image)
```

---

## 🎨 **Design Features**

### **Glassmorphism Design**
- Frosted glass effect backgrounds
- Animated glowing borders
- Smooth floating shapes
- Warm gold/brown color scheme

### **Responsive Design**
- Desktop: Full 2-column layout
- Tablet: Adjusted spacing
- Mobile: Single column, hamburger menu
- All pages mobile-optimized

### **Animations**
- Smooth transitions (0.3s ease)
- Hover effects on buttons
- Success modal slide-up animation
- Success checkmark bounce animation
- Floating background shapes

---

## 🚀 **Quick Start Guide**

### **1. Add Items to Cart**
```
From menu.html:
1. Click any "Add to Cart" button
2. Item added to cart (visual feedback: "Added ✓")
3. Cart count updates in navbar
4. Data saved to localStorage
```

### **2. View & Manage Cart**
```
From menu.html or any page:
1. Click cart button in navbar
2. Redirects to cart.html
3. View all items with quantities
4. Use +/− buttons to adjust quantities
5. Click Remove to delete items
```

### **3. Apply Coupon Code**
```
On cart.html:
1. Enter coupon code (e.g., SAVE50)
2. Click "Apply" or press Enter
3. See green success message
4. Discount automatically applied
5. Totals update instantly
```

### **4. Proceed to Checkout**
```
From cart.html:
1. Click "Proceed to Checkout" button
2. Form and order summary load
3. Fill in required fields
4. Select payment method
5. Add optional special instructions
```

### **5. Place Order**
```
On checkout.html:
1. Form validates automatically
2. Click "Place Order"
3. Success modal displays
4. Order saved to localStorage
5. Auto-redirect after 3 seconds
```

---

## 🔍 **Validation Rules**

### **Name**
- ✓ Required
- ✓ Min 2 characters
- ✓ Letters only (no numbers/special chars)

### **Email**
- ✓ Required
- ✓ Valid format (name@domain.com)

### **Phone**
- ✓ Required
- ✓ Exactly 10 digits
- ✓ Numbers only

### **Address**
- ✓ Required
- ✓ Min 10 characters
- ✓ Descriptive address

### **Payment Method**
- ✓ One of: COD, UPI, Card
- ✓ Always defaults to COD

---

## 💰 **Pricing Calculation**

### **Example Order**
```
Items:
  Pepperoni Pizza ₹299 × 2 = ₹598
  Cheese Burger ₹199 × 1 = ₹199
  ─────────────────────────────────
  Subtotal = ₹797

Coupon Applied: FOOD10 (10% off)
  Discount = ₹79.70

After Discount = ₹717.30
Delivery Charge = ₹40
Tax (5%) = ₹37.87
─────────────────────────────────
TOTAL = ₹795.17
```

---

## 🔐 **Data Security Notes**

- Passwords NOT stored (demo app)
- Payment info NOT actually processed (demo)
- localStorage used for storage (client-side)
- No backend credentials exposed
- For production: Add backend API integration

---

## 🎯 **Usage Examples**

### **Valid Coupon Codes to Test:**
1. `SAVE50` → See ₹50 discount
2. `FOOD10` → See 10% discount
3. `WELCOME` → See ₹75 discount

### **Test Phone Numbers:**
- ✓ `9876543210`
- ✓ `8765432109`
- ✗ `987654321` (9 digits - invalid)
- ✗ `98765432101` (11 digits - invalid)

### **Test Addresses:**
- ✓ "123 Main Street, Flat 4B, Near Central Park, City - 110001"
- ✗ "123 Main St" (too short)

---

## 🐛 **Troubleshooting**

### **Cart Shows Empty**
- Clear browser cache
- Check localStorage: Open DevTools → Application → localStorage

### **Coupon Not Working**
- Verify coupon code spelling (case-insensitive)
- Check if coupon is in COUPONS database
- Ensure cart total > 0

### **Form Validation Fails**
- Check error messages below each field
- Ensure all required fields are filled
- Phone must be exactly 10 digits

### **Order Doesn't Save**
- Check if localStorage is enabled
- Open DevTools → Application → localStorage
- Look for `quickbiteOrders` key

---

## 📊 **Browser Compatibility**

- ✓ Chrome/Edge (Latest)
- ✓ Firefox (Latest)
- ✓ Safari (Latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

**Required Features:**
- ES6 JavaScript
- localStorage API
- CSS Grid/Flexbox
- CSS backdrop-filter

---

## 🎓 **Learning Points**

This implementation demonstrates:
1. **localStorage** for persistent data
2. **sessionStorage** for inter-page communication
3. **Form validation** with real-time feedback
4. **Dynamic pricing** calculations
5. **Responsive design** patterns
6. **Modal dialogs** and animations
7. **Event delegation** and listeners
8. **CSS Grid/Flexbox** layouts
9. **Mobile-first** responsive approach
10. **User experience** best practices

---

## 📝 **Notes**

- All prices are in Indian Rupees (₹)
- Tax rate is fixed at 5%
- Delivery charge is fixed at ₹40
- Coupon codes are case-insensitive
- Orders persist across page refreshes
- Cart persists until manually cleared

---

## 🚀 **Future Enhancements**

- Backend API integration
- Real payment gateway
- Email receipts
- Order tracking
- User accounts
- Saved addresses
- Order history dashboard
- Ratings & reviews
- Push notifications

