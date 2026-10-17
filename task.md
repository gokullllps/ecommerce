# PABLO — Comprehensive Feature & Audit Checklist

## A. Homepage
- [x] Announcement bar / promotional message *(Implemented in `src/components/ui/PromotionalTicker.tsx` with luxury diamond dividers, marquee, and pause-on-hover)*
- [x] Header with logo, navigation, search, account and cart *(Implemented in `src/components/layout/Navbar.tsx` with popovers and mega-menu)*
- [x] Hero banner with campaign imagery and CTA *(Implemented in `src/components/sections/HeroSection.tsx` with editorial transitions)*
- [x] Featured collections / categories *(Implemented in `src/components/sections/CategoriesSection.tsx` and `src/components/sections/FeaturedCollectionSection.tsx`)*
- [x] New arrivals and bestsellers *(Implemented in `src/components/sections/NewArrivalsSection.tsx`, `src/components/sections/BestsellersSection.tsx`, and `src/components/sections/NewInSection.tsx`)*
- [x] Editorial / brand story section *(Implemented in `src/components/sections/CampaignEditorialSection.tsx`)*
- [x] Featured products carousel or grid *(Implemented in `src/components/sections/CategoriesSection.tsx` and `src/components/catalogue/ProductCarousel.tsx`)*
- [x] Promotional or seasonal campaign sections *(Implemented in `src/components/sections/CampaignEditorialSection.tsx` and `/sale` destination)*
- [x] Newsletter subscription *(Implemented in `src/components/sections/NewsletterSection.tsx` with validation and feedback states)*
- [x] Footer with customer service, policies and social links *(Implemented in `src/components/layout/Footer.tsx`)*

---

## B. Product listing & discovery
- [x] Category and collection listing pages *(`/men`, `/women`, `/kids`, `/sale`, `/new-in`, `/collections`)*
- [x] Product cards with images, name and price *(Implemented in `src/components/catalogue/ProductCard.tsx`)*
- [x] Hover image / alternate product image *(Implemented with smooth dual-image reveal on hover)*
- [x] Search with suggestions and empty results *(Implemented with live dropdown and zero-result handling)*
- [x] Filters: size, colour, price, category and availability *(Implemented in `src/components/catalogue/ProductFilters.tsx` & `src/components/catalogue/filters/useProductFilters.ts`)*
- [x] Sorting: featured, newest, price *(Implemented in `src/components/catalogue/ProductSort.tsx`)*
- [x] Active filter chips and clear-all action *(Implemented in `src/components/catalogue/filters/AppliedFilters.tsx`)*
- [x] Pagination or load-more behaviour *(Implemented)*
- [x] Wishlist action on product cards *(Implemented with instant heart toggle)*
- [x] Responsive grid for mobile, tablet and desktop *(Implemented with 2-col mobile, 3-col tablet, 4-col desktop)*

---

## C. Product detail page
- [x] Product image gallery with zoom *(Implemented with overlapping card stack, swipe, sideways water-fill arrow hover animation, and 2s auto-rotation in `src/app/product/[slug]/ProductDetailClient.tsx`)*
- [x] Product name, price and description *(Implemented)*
- [x] Colour and size/variant selection *(Implemented with dynamic image, size, and stock synchronization)*
- [x] Size guide and fit information *(Implemented via Size Guide modal with garment measurements)*
- [x] Stock / availability feedback *(Implemented with real-time stock alerts)*
- [x] Quantity selector where appropriate *(Implemented with +/- stepper)*
- [x] Add-to-cart and wishlist actions *(Implemented with variant data binding)*
- [x] Delivery estimate and shipping information *(Complimentary shipping & 30-day returns callouts)*
- [x] Materials, care instructions and product details *(Implemented via expandable accordions)*
- [ ] Returns policy and customer reviews *(Returns policy is present, but customer review submission and ratings are not yet integrated)*
- [x] Related products / complete-the-look recommendations *(Implemented via related product carousel grid)*
- [x] Clear feedback after adding to cart *(Implemented with confirmation toast and header badge increment)*

---

## D. Cart & wishlist
- [x] Cart drawer or cart page *(Both floating drawer in `src/components/layout/Navbar.tsx` and dedicated page at `src/app/cart/page.tsx`)*
- [x] Product thumbnail, variant, quantity and price *(Implemented)*
- [x] Increase/decrease quantity and remove item *(Implemented with instant subtotal updates)*
- [x] Subtotal, discounts, shipping and total breakdown *(Implemented)*
- [x] Promo code application and error states *(Supports codes like `PABLO10`, `VIP10`, `KIDS10`, `ARCHIVE20` with validation)*
- [x] Continue shopping and proceed-to-checkout actions *(Implemented)*
- [ ] Out-of-stock or price-change feedback *(Cart calculates totals, but dynamic out-of-stock warning badges inside the cart are pending)*
- [x] Empty-cart state with shopping CTA *(Implemented with curated luxury category links)*
- [x] Wishlist page with remove and move-to-cart actions *(Implemented at `src/app/wishlist/page.tsx`)*
- [x] Cart persistence when navigating or refreshing *(Persisted in `localStorage` via `src/context/ShopContext.tsx`)*

---

## E. Checkout & delivery
- [x] Guest checkout and sign-in option *(Guest checkout is active by default)*
- [x] Customer contact details *(First name, last name, email, phone)*
- [x] Shipping address form and validation *(Address, city, state, PIN code with validation)*
- [ ] Saved address selection and editing *(Saved addresses exist in `/account`, but 1-click address picker dropdown in checkout is pending)*
- [x] Delivery method and estimated delivery date *(Express Complimentary vs White-Glove Concierge)*
- [ ] Billing address selection *(Currently defaults to shipping address; separate toggle pending)*
- [x] Order summary visible during checkout *(Sticky summary with line items, delivery fee, and grand total)*
- [x] Payment method selection and validation *(Card, UPI, and Concierge options)*
- [x] Payment success, failure, retry and loading states *(Processing indicator and error feedback)*
- [x] Order confirmation page and order number *(Bespoke order confirmation with generated order reference)*
- [x] Confirmation message / email UI *(On-screen atelier preparation and email dispatch notice)*
- [x] Mobile-friendly checkout with clear progress *(Responsive layout with step progression)*

---

## F. Customer account & post-purchase
- [x] Sign-up, login, logout and password reset *(Implemented in `/account` with sign-in/out state & security management)*
- [x] Profile details and saved addresses *(Client Profile and Delivery Addresses tabs in `src/app/account/page.tsx`)*
- [x] Order history and order details *(Acquisitions tab listing past orders, item lines, dates, and amounts)*
- [x] Order status and shipment tracking *(Real-time courier and delivery status badges)*
- [ ] Cancel order where eligible *(Cancellation charter is outlined, but self-service cancel action on order cards is pending)*
- [ ] Return / exchange request flow *(Return charter and steps are documented in `/returns`, but self-service form submission is pending)*
- [x] Refund status and return instructions *(Documented in `src/app/returns/page.tsx` and `src/app/faq/page.tsx`)*
- [ ] Product reviews and rating submission *(Not yet implemented)*
- [x] Help centre, contact support and FAQs *(Implemented across `src/app/faq/page.tsx`, `src/app/contact/page.tsx`, and `src/app/customer-service/page.tsx`)*

---

## G. Luxury brand experience
- [x] Consistent typography, spacing and colour palette *(Cormorant Garamond, Inter, `#EAE8E1`, `#111111`, `#D9D8D3`)*
- [x] High-quality product photography and art direction *(Curated high-resolution fashion assets)*
- [x] Minimal, premium visual hierarchy *(Generous whitespace, editorial composition, zero retail clutter)*
- [x] Subtle hover, transition and micro-interaction effects *(Diagonal light sweep, smooth stack transitions, gentle fades)*
- [x] Consistent buttons, forms, cards and iconography *(Strict Zero-Emojis policy, clean inline vector SVGs)*
- [x] Trust signals: authenticity, secure payment and returns *(Authenticity certificates, secure checkout badges, 30-day guarantee)*
- [x] Premium packaging / gift options if in scope *(Matte presentation box, wax seal, cedar hangers documented & in checkout)*
- [x] Accessibility: contrast, keyboard navigation and focus states *(ARIA labels, gallery keyboard arrow navigation)*
- [x] No clutter, broken imagery or inconsistent layouts *(Strict fallback handlers for missing/broken images)*

---

## H. Responsive, states & usability testing
- [x] Test desktop, tablet and mobile layouts *(Tested across 1920px, 1440px, 1024px, 768px, and 414px)*
- [x] Test all navigation links and interactive controls *(Nav links, filters, drawers, and modal triggers)*
- [x] Loading skeletons or loading indicators *(Startup sequence, image eager/lazy loading, checkout processing)*
- [x] Empty, error, success and disabled states *(Empty bags, empty curation, promo feedback, out-of-stock disabled states)*
- [x] Form validation and useful error messages *(Checkout inputs, newsletter submission)*
- [x] Slow network, refresh and back-button behaviour *(Browser history popstate sync, localStorage hydration)*
- [x] Image loading, fallback and broken-image handling *(Inline onError image fallback across cards and PDP)*
- [x] Keyboard navigation and accessible labels *(Focus rings, aria-expanded, keydown arrow listeners)*
- [x] No horizontal overflow or clipped content *(Audited with zero horizontal scroll leakage)*
- [x] Consistent spacing and alignment across pages *(Standardized `PageWrapper` and layout containers)*
