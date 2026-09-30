"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/catalogueUtils";
import PageWrapper from "@/components/layout/PageWrapper";
import { serverCreateDemoOrder } from "@/app/actions/checkoutActions";


export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useShop();

  const [deliveryMethod, setDeliveryMethod] = useState<"express" | "white-glove">("express");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "concierge">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    firstName: "Gokul",
    lastName: "Prasath",
    email: "gokul@example.com",
    phone: "+91 98765 43210",
    address: "74 Luxury Boulevard, Suite 12B",
    apartment: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvv: "888",
    upiId: "gokul@okhdfcbank",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const shippingCost = deliveryMethod === "white-glove" ? 1500 : 0;
  const grandTotal = cartSubtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {

    e.preventDefault();

    // Simple validation
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.postalCode.trim()) errors.postalCode = "PIN code is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsProcessing(true);

    try {
      const result = await serverCreateDemoOrder({
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          line1: formData.address + (formData.apartment ? `, ${formData.apartment}` : ""),
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          colorName: item.color,
          sizeName: item.size,
        })),
        deliveryMethod,
        paymentMethod,
      });

      if (result.success && result.orderNumber) {
        setCompletedOrderNumber(result.orderNumber);
        setOrderComplete(true);
        clearCart();
      } else {
        setFormErrors({ general: result.error || "Order creation failed. Please try again." });
      }
    } catch {
      const orderNum = `PAB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setCompletedOrderNumber(orderNum);
      setOrderComplete(true);
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };


  // If order is completed, show confirmation view
  if (orderComplete) {
    return (
      <PageWrapper navbarProps={{ isStaticPage: true }}>
        <main className="flex-1 page-container-narrow py-12 sm:py-16 text-center relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-900 text-white flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            ACQUISITION CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] mt-2 mb-4">
            Thank You For Your Order
          </h1>

          <p className="text-sm text-[#666666] max-w-lg mx-auto leading-relaxed">
            Your order <strong className="text-[#111111]">{completedOrderNumber}</strong> has been received by Maison PABLO and is being prepared with bespoke packaging at our atelier.
          </p>

          {/* Details Card */}
          <div className="mt-10 bg-white/80 border border-[#D9D8D3] p-8 text-left space-y-6">
            <div className="flex justify-between items-baseline border-b border-[#D9D8D3] pb-4">
              <div>
                <p className="text-xs text-[#666666] uppercase tracking-wider">Order Reference</p>
                <p className="font-serif text-lg font-medium text-[#111111]">{completedOrderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#666666] uppercase tracking-wider">Estimated Delivery</p>
                <p className="font-sans text-xs font-semibold text-[#111111]">
                  {deliveryMethod === "white-glove" ? "Tomorrow via White Glove" : "2–3 Business Days"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">Shipping Destination</p>
              <p className="text-xs text-[#111111] font-medium">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-xs text-[#666666]">
                {formData.address}, {formData.apartment && `${formData.apartment}, `}{formData.city}, {formData.state} {formData.postalCode}
              </p>
              <p className="text-xs text-[#666666] mt-1">Confirmation sent to: {formData.email}</p>
            </div>

            <div className="border-t border-[#D9D8D3] pt-4 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-[#666666]">Total Charged</span>
              <span className="font-serif text-xl font-medium text-[#111111]">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3.5 pablo-btn-dark text-xs font-medium uppercase tracking-[0.24em]"
            >
              RETURN TO HOMEPAGE
            </Link>
            <Link
              href="/account"
              className="px-8 py-3.5 border border-[#181818] text-[#181818] text-xs font-medium uppercase tracking-[0.24em] hover:bg-black hover:text-white transition-colors"
            >
              VIEW ORDER IN ACCOUNT
            </Link>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container py-8 sm:py-10 lg:py-12 relative z-10">
        {/* Header */}
        <div className="border-b border-[#D9D8D3] pb-4 mb-8">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#666666]">
            SECURE CHECKOUT
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
            CLIENT ACQUISITION
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-serif text-2xl text-[#111111]">Your shopping bag is empty</p>
            <p className="text-xs text-[#666666]">Please select garments before checking out.</p>
            <Link
              href="/men"
              className="inline-block px-6 py-3 pablo-btn-dark text-xs uppercase tracking-widest"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Fields: 7 Columns */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Contact Information */}
              <div className="bg-white/60 border border-[#D9D8D3] p-6 sm:p-8">
                <h2 className="font-serif text-xl text-[#111111] mb-4">
                  1. Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.email && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="bg-white/60 border border-[#D9D8D3] p-6 sm:p-8">
                <h2 className="font-serif text-xl text-[#111111] mb-4">
                  2. Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Building, street, landmark"
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.address && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      Apartment / Suite (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.city && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666666] uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-600 text-[11px] mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div className="bg-white/60 border border-[#D9D8D3] p-6 sm:p-8">
                <h2 className="font-serif text-xl text-[#111111] mb-4">
                  3. Shipping Method
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "border-[#111111] bg-white"
                        : "border-[#D9D8D3] bg-white/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="mt-0.5 accent-[#111111]"
                      />
                      <div>
                        <p className="text-xs font-medium text-[#111111]">
                          Complimentary Express Courier
                        </p>
                        <p className="text-[11px] text-[#666666] mt-0.5">
                          Delivery within 2–3 business days with Maison PABLO signature garment bag.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800">Free</span>
                  </label>

                  <label
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                      deliveryMethod === "white-glove"
                        ? "border-[#111111] bg-white"
                        : "border-[#D9D8D3] bg-white/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "white-glove"}
                        onChange={() => setDeliveryMethod("white-glove")}
                        className="mt-0.5 accent-[#111111]"
                      />
                      <div>
                        <p className="text-xs font-medium text-[#111111]">
                          Atelier White Glove & Private Fitting
                        </p>
                        <p className="text-[11px] text-[#666666] mt-0.5">
                          Direct courier by appointment with on-site garment hanging and complimentary alteration assessment.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#111111]">{formatPrice(1500)}</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Selection */}
              <div className="bg-white/60 border border-[#D9D8D3] p-6 sm:p-8">
                <h2 className="font-serif text-xl text-[#111111] mb-4">
                  4. Payment
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-3 px-2 text-center border text-xs uppercase tracking-wider font-medium transition-all ${
                      paymentMethod === "card"
                        ? "border-[#111111] bg-[#181818] text-[#EAE8E1]"
                        : "border-[#D9D8D3] bg-white text-[#666666]"
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-3 px-2 text-center border text-xs uppercase tracking-wider font-medium transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#111111] bg-[#181818] text-[#EAE8E1]"
                        : "border-[#D9D8D3] bg-white text-[#666666]"
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("concierge")}
                    className={`py-3 px-2 text-center border text-xs uppercase tracking-wider font-medium transition-all ${
                      paymentMethod === "concierge"
                        ? "border-[#111111] bg-[#181818] text-[#EAE8E1]"
                        : "border-[#D9D8D3] bg-white text-[#666666]"
                    }`}
                  >
                    Concierge Pay
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[#666666] uppercase tracking-wider mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#666666] uppercase tracking-wider mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#666666] uppercase tracking-wider mb-1">
                          Security Code (CVV)
                        </label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          maxLength={4}
                          className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[#666666] uppercase tracking-wider mb-1">
                        VPA / UPI ID
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#D9D8D3] px-3 py-2 text-[#111111] focus:outline-none"
                      />
                      <p className="text-[11px] text-[#666666] mt-1.5">
                        A payment request will be sent to your UPI application upon placing order.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "concierge" && (
                  <div className="p-4 bg-white border border-[#D9D8D3] text-xs text-[#666666] leading-relaxed">
                    Our concierge will contact you to arrange payment via bank wire or secure on-arrival POS terminal upon delivery.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Summary: 5 Columns */}
            <div className="lg:col-span-5">
              <div className="bg-white/70 border border-[#D9D8D3] p-6 sm:p-8 space-y-6 sticky top-8">
                <h2 className="font-serif text-xl text-[#111111] border-b border-[#D9D8D3] pb-3">
                  ACQUISITION SUMMARY
                </h2>

                {/* Items preview */}
                <div className="divide-y divide-[#D9D8D3] max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3 text-xs">
                      <div className="relative w-14 h-18 bg-[#DFDDD6] overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-serif font-medium text-[#111111] line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-[#666666]">Size: {item.size} &bull; Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-[#111111]">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="border-t border-[#D9D8D3] pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#666666]">
                    <span>Garments Subtotal</span>
                    <span className="text-[#111111]">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Shipping</span>
                    <span className="text-[#111111]">
                      {shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Duties & Taxes</span>
                    <span className="text-[#111111]">Included</span>
                  </div>
                  <div className="border-t border-[#D9D8D3] pt-4 flex justify-between items-baseline">
                    <span className="font-sans text-sm uppercase tracking-wider text-[#111111] font-semibold">
                      Total
                    </span>
                    <span className="font-serif text-2xl text-[#111111] font-normal">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 pablo-btn-dark text-[#EAE8E1] text-xs font-sans font-medium uppercase tracking-[0.24em] border border-[#222222] hover:border-white transition-all disabled:opacity-50"
                >
                  {isProcessing ? "SECURING ACQUISITION..." : "CONFIRM & PLACE ORDER"}
                </button>

                <p className="text-[11px] text-[#666666] text-center leading-relaxed">
                  By clicking Place Order you agree to the Maison PABLO Terms of Sale and Privacy Charter.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>
    </PageWrapper>
  );
}
