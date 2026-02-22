import React, { useState } from "react";

export const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Terms of Use
          </h1>

          <div className="flex gap-2">
            <button
              className={`rounded-md px-4 py-1.5 text-sm transition ${"bg-primary text-white hover:bg-primary/90"}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="
            prose prose-neutral max-w-none dark:prose-invert
            prose-p:leading-relaxed
            prose-headings:tracking-tight
            prose-headings:mt-10
            prose-headings:mb-4
            prose-ul:mt-3
            prose-ul:mb-6
            prose-li:mt-2
          "
        >
          <div className="mx-auto max-w-3xl space-y-10">
            <>
              <p className="text-sm text-muted-foreground">
                <strong>Effective Date:</strong> February 22, 2026
                <br />
                <strong>Last Updated:</strong> February 22, 2026
                <br />
                <strong>Version:</strong> 1.0
                <br />
                <em className="text-amber-600 dark:text-amber-500">
                  Note: Some features mentioned may not yet be fully
                  implemented.
                </em>
              </p>

              {/* 1. Introduction & Acceptance */}
              <section>
                <h2>1. Introduction & Acceptance of Terms</h2>

                <h3>1.1 Agreement to Terms</h3>
                <p>
                  Welcome to <strong>Avisekh Bag Pashal</strong> ("we," "our,"
                  "us," or "Platform"). These Terms of Use ("Terms,"
                  "Agreement") constitute a legally binding contract between you
                  ("User," "you," "your") and Avisekh Bag Pashal governing your
                  access to and use of our e-commerce platform, website, mobile
                  applications, APIs, and all related services, features,
                  content, and technologies (collectively, the "Services").
                </p>

                <h3>1.2 Binding Agreement</h3>
                <p>
                  By accessing, browsing, registering for an account, or using
                  any part of our Services, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms, along with
                  our{" "}
                  <a
                    href="/legal/privacy-policy"
                    className="text-blue-600 underline"
                  >
                    Privacy Policy
                  </a>
                  , Cookie Policy, and any additional terms applicable to
                  specific features or services.
                </p>

                <h3>1.3 Modifications to Terms</h3>
                <p>
                  We reserve the right to modify, amend, or update these Terms
                  at any time, at our sole discretion, to reflect changes in our
                  business practices, legal requirements, or service features.
                  Material changes will be notified via:
                </p>
                <ul>
                  <li>Email notification to your registered email address</li>
                  <li>Prominent banner on the Platform for 30 days</li>
                  <li>
                    In-app notification requiring acknowledgment before
                    continued use
                  </li>
                </ul>
                <p>
                  The "Last Updated" date at the top of this document reflects
                  the most recent revision. Your continued use of the Services
                  after such modifications constitutes your acceptance of the
                  updated Terms. If you do not agree with any changes, you must
                  immediately discontinue use of the Services and close your
                  account.
                </p>

                <h3>1.4 Additional Terms</h3>
                <p>
                  Certain features, services, or promotions may be subject to
                  additional terms and conditions ("Additional Terms"), which
                  will be presented to you at the time of use. Additional Terms
                  are incorporated by reference into these Terms. In the event
                  of a conflict between these Terms and Additional Terms, the
                  Additional Terms shall prevail with respect to that specific
                  feature or service.
                </p>
              </section>

              {/* 2. Eligibility & User Representations */}
              <section>
                <h2>2. Eligibility & User Representations</h2>

                <h3>2.1 Age Requirements</h3>
                <p>
                  You must be at least <strong>13 years of age</strong> to
                  create an account or use our Services. If you are between 13
                  and 18 years old (or the age of majority in your
                  jurisdiction), you may only use the Services with the consent
                  and supervision of a parent or legal guardian who agrees to be
                  bound by these Terms on your behalf.
                </p>

                <h3>2.2 Legal Capacity</h3>
                <p>By using the Services, you represent and warrant that:</p>
                <ul>
                  <li>
                    You have the legal capacity and authority to enter into a
                    binding contract
                  </li>
                  <li>
                    You are not prohibited by law from accessing or using the
                    Services
                  </li>
                  <li>
                    You will comply with all applicable local, state, national,
                    and international laws and regulations
                  </li>
                  <li>
                    All registration information you submit is truthful,
                    accurate, current, and complete
                  </li>
                  <li>
                    You will maintain the accuracy of such information and
                    promptly update it as necessary
                  </li>
                  <li>
                    You have not been previously suspended or removed from the
                    Platform for violating these Terms or our policies
                  </li>
                </ul>

                <h3>2.3 Restricted Jurisdictions</h3>
                <p>
                  Our Services may not be available in all countries or regions.
                  We reserve the right to restrict access from certain
                  jurisdictions due to legal, regulatory, or business reasons.
                  You may not use VPNs, proxies, or other methods to circumvent
                  geographical restrictions.
                </p>

                <h3>2.4 Business vs. Consumer Accounts</h3>
                <p>
                  If you are registering as a business entity, you represent
                  that you have the authority to bind that entity to these
                  Terms. You agree to provide accurate business registration
                  information and documentation as required.
                </p>
              </section>

              {/* 3. Account Registration & Security */}
              <section>
                <h2>3. Account Registration & Security</h2>

                <h3>3.1 Account Creation</h3>
                <p>
                  To access certain features, you must create an account by:
                </p>
                <ul>
                  <li>
                    <strong>Email & Password:</strong> Providing a valid email
                    address and creating a secure password
                  </li>
                  <li>
                    <strong>Google OAuth:</strong> Signing in with your Google
                    account (we receive your name, email, and profile picture
                    from Google)
                  </li>
                </ul>

                <h3>3.2 Email Verification</h3>
                <p>
                  Upon registration, you will receive a verification email
                  containing a secure link. You must verify your email address
                  within 24 hours. Unverified accounts may have limited
                  functionality, including:
                </p>
                <ul>
                  <li>Inability to make purchases</li>
                  <li>Limited access to certain features</li>
                  <li>
                    Automatic deletion after 30 days if email is not verified
                  </li>
                </ul>

                <h3>3.3 Account Security Obligations</h3>
                <p>
                  You are solely responsible for maintaining the confidentiality
                  and security of your account credentials. You agree to:
                </p>
                <ul>
                  <li>
                    Use a strong, unique password (minimum 8 characters with
                    letters, numbers, and symbols recommended)
                  </li>
                  <li>
                    Not share your password with any third party or allow others
                    to access your account
                  </li>
                  <li>
                    Immediately notify us at{" "}
                    <a
                      href="mailto:support@avisekhbagpashal.com"
                      className="text-blue-600 underline"
                    >
                      support@avisekhbagpashal.com
                    </a>{" "}
                    of any unauthorized access or security breach
                  </li>
                  <li>
                    Log out from your account at the end of each session,
                    especially on shared or public devices
                  </li>
                  <li>
                    Accept full responsibility for all activities that occur
                    under your account, whether authorized by you or not
                  </li>
                </ul>

                <h3>3.4 Login Security Features</h3>
                <p>We implement the following security measures:</p>
                <ul>
                  <li>
                    <strong>Email Alerts:</strong> You will receive
                    notifications when login occurs from:
                    <ul>
                      <li>A new device</li>
                      <li>A new location (city/country)</li>
                      <li>After multiple failed login attempts</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Rate Limiting:</strong> Maximum 5 login attempts per
                    15 minutes per IP address
                  </li>
                  <li>
                    <strong>Account Lockout:</strong> Temporary suspension after
                    10 consecutive failed login attempts
                  </li>
                  <li>
                    <strong>Session Management:</strong> Automatic logout after
                    7 days of inactivity
                  </li>
                  <li>
                    <strong>Multi-Device Support:</strong> View and manage all
                    active sessions in account settings
                  </li>
                  <li>
                    <strong>"Log Out All Devices" Feature:</strong> Instantly
                    terminate all active sessions
                  </li>
                </ul>

                <h3>3.5 Password Management</h3>
                <p>You can:</p>
                <ul>
                  <li>
                    Change your password at any time through account settings
                  </li>
                  <li>
                    Request a password reset via email if you forget your
                    password
                  </li>
                  <li>
                    Receive a One-Time Password (OTP) valid for 10 minutes to
                    reset your password
                  </li>
                </ul>
                <p>
                  When you change your password, all existing sessions will be
                  invalidated, and you will need to log in again on all devices.
                </p>

                <h3>3.6 Account Restrictions</h3>
                <p>You may NOT:</p>
                <ul>
                  <li>
                    Create multiple accounts for the same person (except for
                    legitimate business purposes)
                  </li>
                  <li>
                    Share, sell, rent, or transfer your account to another
                    person
                  </li>
                  <li>
                    Use another person's account without their explicit
                    permission
                  </li>
                  <li>
                    Create an account using false or misleading information
                  </li>
                  <li>
                    Create an account if you have been previously banned or
                    suspended
                  </li>
                  <li>Automate account creation using bots or scripts</li>
                </ul>
              </section>

              {/* 4. Guest Browsing */}
              <section>
                <h2>4. Guest Browsing</h2>

                <h3>4.1 Guest Access</h3>
                <p>
                  You may browse our product catalog without creating an
                  account. As a guest, you can:
                </p>
                <ul>
                  <li>View products, categories, and pricing</li>
                  <li>Search and filter products</li>
                  <li>Read product descriptions and reviews</li>
                </ul>

                <h3>4.2 Guest Limitations</h3>
                <p>Guest users cannot:</p>
                <ul>
                  <li>Add items to cart</li>
                  <li>Make purchases</li>
                  <li>Save items to wishlist</li>
                  <li>Track orders</li>
                  <li>Leave product reviews</li>
                  <li>Participate in loyalty programs or promotions</li>
                </ul>

                <h3>4.3 Account Creation Prompt</h3>
                <p>
                  When attempting restricted actions, you will be redirected to
                  the login/registration page with the option to return to your
                  intended action after authentication.
                </p>
              </section>

              {/* 5. Acceptable Use Policy */}
              <section>
                <h2>5. Acceptable Use Policy</h2>

                <h3>5.1 Prohibited Activities</h3>
                <p>
                  You agree NOT to engage in any of the following prohibited
                  activities:
                </p>

                <h4>5.1.1 Illegal or Fraudulent Activities</h4>
                <ul>
                  <li>
                    Using the Services for any unlawful, fraudulent, or
                    unauthorized purpose
                  </li>
                  <li>
                    Violating any applicable local, state, national, or
                    international law or regulation
                  </li>
                  <li>
                    Engaging in money laundering, terrorist financing, or other
                    financial crimes
                  </li>
                  <li>
                    Using stolen credit cards or fraudulent payment methods
                  </li>
                  <li>Creating fake orders or manipulating pricing</li>
                  <li>
                    Engaging in chargebacks fraud or payment disputes abuse
                  </li>
                </ul>

                <h4>5.1.2 Security & Technical Violations</h4>
                <ul>
                  <li>
                    Attempting to bypass, disable, or circumvent any security
                    features or authentication mechanisms
                  </li>
                  <li>
                    Hacking, reverse-engineering, decompiling, or disassembling
                    any part of the Platform
                  </li>
                  <li>
                    Using automated tools, bots, scrapers, or spiders to access,
                    collect, or extract data
                  </li>
                  <li>
                    Probing, scanning, or testing vulnerabilities in the system
                    or network
                  </li>
                  <li>
                    Introducing viruses, malware, trojans, worms, or other
                    harmful code
                  </li>
                  <li>
                    Conducting distributed denial-of-service (DDoS) attacks or
                    overloading servers
                  </li>
                  <li>
                    Accessing areas of the Platform not intended for public use
                  </li>
                  <li>Intercepting or monitoring network traffic or data</li>
                </ul>

                <h4>5.1.3 Content & Conduct Violations</h4>
                <ul>
                  <li>
                    Posting or transmitting abusive, defamatory, obscene,
                    pornographic, or offensive content
                  </li>
                  <li>
                    Harassing, threatening, stalking, or intimidating other
                    users or staff
                  </li>
                  <li>Impersonating another person or entity</li>
                  <li>
                    Infringing on intellectual property rights (trademarks,
                    copyrights, patents)
                  </li>
                  <li>
                    Posting spam, unsolicited advertising, or promotional
                    content
                  </li>
                  <li>Manipulating reviews, ratings, or feedback systems</li>
                  <li>Engaging in price manipulation or collusion</li>
                </ul>

                <h4>5.1.4 Commercial Misuse</h4>
                <ul>
                  <li>
                    Reselling products purchased through the Platform without
                    authorization
                  </li>
                  <li>
                    Using the Platform for commercial purposes without a seller
                    agreement
                  </li>
                  <li>
                    Bulk purchasing for inventory hoarding or price manipulation
                  </li>
                  <li>
                    Using competitor analysis tools to extract pricing or
                    inventory data
                  </li>
                </ul>

                <h3>5.2 Consequences of Violations</h3>
                <p>
                  Violation of this Acceptable Use Policy may result in, at our
                  sole discretion:
                </p>
                <ul>
                  <li>Warning or written notice</li>
                  <li>Temporary suspension of account (24 hours to 30 days)</li>
                  <li>
                    Permanent termination of account and all associated data
                  </li>
                  <li>Cancellation of pending orders without refund</li>
                  <li>Reporting to law enforcement authorities</li>
                  <li>
                    Legal action to recover damages and pursue injunctive relief
                  </li>
                  <li>
                    IP address ban preventing future access from your network
                  </li>
                </ul>

                <h3>5.3 Reporting Violations</h3>
                <p>
                  If you become aware of any violation of these Terms or illegal
                  activity, please report it immediately to{" "}
                  <a
                    href="mailto:abuse@avisekhbagpashal.com"
                    className="text-blue-600 underline"
                  >
                    abuse@avisekhbagpashal.com
                  </a>
                  . We review all reports within 48 hours and take appropriate
                  action.
                </p>
              </section>

              {/* 6. Products, Pricing & Availability */}
              <section>
                <h2>6. Products, Pricing & Availability</h2>

                <h3>6.1 Product Descriptions</h3>
                <p>
                  We make every effort to provide accurate product descriptions,
                  images, specifications, and pricing. However:
                </p>
                <ul>
                  <li>
                    Product images are for illustration purposes and may differ
                    slightly from the actual product
                  </li>
                  <li>
                    Colors may appear differently depending on your monitor
                    settings
                  </li>
                  <li>
                    Specifications are based on manufacturer information and may
                    be subject to change
                  </li>
                  <li>
                    We do not warrant that product descriptions are error-free,
                    complete, or current
                  </li>
                </ul>

                <h3>6.2 Pricing</h3>
                <ul>
                  <li>
                    All prices are displayed in Nepali Rupees (NPR) or US
                    Dollars (USD) as applicable
                  </li>
                  <li>
                    Prices include applicable taxes unless otherwise stated
                  </li>
                  <li>
                    Shipping and handling charges are calculated at checkout
                  </li>
                  <li>
                    Prices are subject to change at any time without prior
                    notice
                  </li>
                  <li>
                    The price applicable to your order is the price displayed at
                    the time you complete checkout
                  </li>
                </ul>

                <h3>6.3 Pricing Errors</h3>
                <p>
                  Despite our best efforts, pricing errors may occur. If a
                  product is listed at an incorrect price due to:
                </p>
                <ul>
                  <li>Typographical error</li>
                  <li>System malfunction</li>
                  <li>Outdated information</li>
                  <li>Third-party data feed error</li>
                </ul>
                <p>
                  We reserve the right to cancel any orders placed at the
                  incorrect price, even after order confirmation. You will
                  receive a full refund for canceled orders due to pricing
                  errors, and we will notify you via email.
                </p>

                <h3>6.4 Product Availability</h3>
                <ul>
                  <li>
                    Product availability is updated in real-time but is not
                    guaranteed
                  </li>
                  <li>
                    Items may sell out between the time you add to cart and
                    complete checkout
                  </li>
                  <li>
                    We reserve the right to limit quantities purchased per
                    customer
                  </li>
                  <li>
                    Pre-order and backorder items will be clearly marked with
                    estimated availability dates
                  </li>
                  <li>
                    We may discontinue products at any time without prior notice
                  </li>
                </ul>

                <h3>6.5 Stock Limitations</h3>
                <p>
                  We reserve the right to limit or prohibit orders that, in our
                  sole judgment:
                </p>
                <ul>
                  <li>
                    Appear to be placed by dealers, resellers, or distributors
                  </li>
                  <li>Exceed reasonable quantities for personal use</li>
                  <li>
                    Are suspected to be fraudulent or placed with malicious
                    intent
                  </li>
                </ul>
              </section>

              {/* 7. Shopping Cart & Checkout */}
              <section>
                <h2>7. Shopping Cart & Checkout</h2>

                <h3>7.1 Shopping Cart</h3>
                <ul>
                  <li>
                    Items added to your cart are reserved for 24 hours
                    (logged-in users)
                  </li>
                  <li>
                    Guest carts are temporary and cleared when browser session
                    ends
                  </li>
                  <li>
                    Cart contents do not constitute an order or reservation
                  </li>
                  <li>
                    Prices and availability are confirmed at the time of
                    checkout
                  </li>
                </ul>

                <h3>7.2 Order Placement</h3>
                <p>When you place an order, you agree to:</p>
                <ul>
                  <li>Provide accurate and complete delivery information</li>
                  <li>
                    Authorize us to charge your selected payment method for the
                    total amount
                  </li>
                  <li>
                    Accept these Terms and our Privacy Policy (checkbox
                    confirmation required)
                  </li>
                </ul>

                <h3>7.3 Order Confirmation</h3>
                <p>After successful order placement:</p>
                <ul>
                  <li>
                    You will receive an order confirmation email immediately
                  </li>
                  <li>
                    This email confirms receipt of your order but does NOT
                    constitute acceptance
                  </li>
                  <li>
                    We may contact you for additional verification before
                    processing
                  </li>
                  <li>
                    A shipping confirmation email will be sent when your order
                    is dispatched
                  </li>
                </ul>

                <h3>7.4 Order Acceptance & Cancellation Rights</h3>
                <p>
                  We reserve the right to refuse or cancel any order for reasons
                  including but not limited to:
                </p>
                <ul>
                  <li>Product unavailability or out of stock</li>
                  <li>Pricing or product information errors</li>
                  <li>Suspected fraudulent, abusive, or illegal activity</li>
                  <li>Payment authorization failure</li>
                  <li>Inability to verify customer information</li>
                  <li>Violation of these Terms</li>
                  <li>Geographic shipping restrictions</li>
                  <li>Unusual order patterns suggesting resale intent</li>
                </ul>
                <p>
                  If your order is canceled after payment, you will receive a
                  full refund within 5-7 business days.
                </p>
              </section>

              {/* 8. Payment & Billing */}
              <section>
                <h2>8. Payment & Billing</h2>

                <h3>8.1 Accepted Payment Methods</h3>
                <p>We accept the following payment methods:</p>
                <ul>
                  <li>
                    <strong>eSewa (Nepal):</strong> Digital wallet for Nepali
                    customers
                  </li>
                  <li>
                    <strong>Stripe (International):</strong> Credit/debit cards
                    (Visa, Mastercard, American Express)
                  </li>
                  <li>
                    <strong>Cash on Delivery (COD):</strong> Available for
                    select locations (subject to verification)
                  </li>
                </ul>

                <h3>8.2 Payment Processing</h3>
                <ul>
                  <li>
                    All online payments are processed by trusted third-party
                    payment gateways (eSewa, Stripe)
                  </li>
                  <li>
                    We do NOT store your credit card numbers, CVV codes, or
                    banking credentials
                  </li>
                  <li>
                    Payment information is encrypted and transmitted securely
                    using TLS 1.3
                  </li>
                  <li>
                    We may retain transaction IDs and payment status for order
                    tracking and accounting
                  </li>
                </ul>

                <h3>8.3 Payment Authorization</h3>
                <p>
                  By providing payment information, you represent and warrant
                  that:
                </p>
                <ul>
                  <li>You are authorized to use the payment method provided</li>
                  <li>The payment information is accurate and current</li>
                  <li>
                    You will maintain sufficient funds or credit to cover the
                    transaction
                  </li>
                  <li>
                    You authorize us (or our payment processor) to charge the
                    total amount
                  </li>
                </ul>

                <h3>8.4 Currency & Conversion</h3>
                <ul>
                  <li>
                    Nepali customers pay in NPR; international customers pay in
                    USD
                  </li>
                  <li>
                    Exchange rates are determined by the payment processor at
                    the time of transaction
                  </li>
                  <li>
                    Your bank or card issuer may charge additional foreign
                    transaction fees
                  </li>
                </ul>

                <h3>8.5 Failed Payments</h3>
                <p>If payment authorization fails:</p>
                <ul>
                  <li>Your order will not be processed</li>
                  <li>
                    You will receive an email with instructions to update
                    payment information
                  </li>
                  <li>
                    Items in your cart may not be reserved if stock is limited
                  </li>
                  <li>
                    You can retry payment or choose a different payment method
                  </li>
                </ul>

                <h3>8.6 Billing Information</h3>
                <p>You agree to provide:</p>
                <ul>
                  <li>Accurate billing name and address</li>
                  <li>
                    Valid email address for receipts and transaction
                    confirmations
                  </li>
                  <li>Phone number for order verification (if required)</li>
                </ul>

                <h3>8.7 Invoices & Receipts</h3>
                <ul>
                  <li>
                    Digital receipts are emailed immediately after successful
                    payment
                  </li>
                  <li>
                    Tax invoices are available for download in your account
                  </li>
                  <li>
                    Business customers can request VAT/GST invoices by providing
                    tax registration details
                  </li>
                </ul>
              </section>

              {/* 9. Shipping & Delivery */}
              <section>
                <h2>9. Shipping & Delivery</h2>

                <h3>9.1 Delivery Locations</h3>
                <ul>
                  <li>
                    <strong>Nepal:</strong> We deliver to all major cities and
                    towns
                  </li>
                  <li>
                    <strong>International:</strong> Selected countries (check
                    availability at checkout)
                  </li>
                  <li>
                    Remote or restricted areas may incur additional charges or
                    longer delivery times
                  </li>
                </ul>

                <h3>9.2 Shipping Costs</h3>
                <ul>
                  <li>
                    Calculated based on delivery location, weight, and
                    dimensions
                  </li>
                  <li>Displayed at checkout before payment confirmation</li>
                  <li>
                    Free shipping may be offered for orders above a certain
                    threshold
                  </li>
                </ul>

                <h3>9.3 Estimated Delivery Times</h3>
                <ul>
                  <li>
                    <strong>Kathmandu Valley:</strong> 1-3 business days
                  </li>
                  <li>
                    <strong>Other Cities (Nepal):</strong> 3-7 business days
                  </li>
                  <li>
                    <strong>International:</strong> 7-21 business days (customs
                    clearance may cause delays)
                  </li>
                </ul>
                <p>
                  Delivery times are estimates and not guaranteed. Delays may
                  occur due to weather, natural disasters, customs, courier
                  issues, or public holidays.
                </p>

                <h3>9.4 Delivery Responsibility</h3>
                <ul>
                  <li>
                    You must provide accurate and complete delivery information
                  </li>
                  <li>
                    You are responsible for being available to receive the
                    package
                  </li>
                  <li>
                    If delivery fails due to incorrect address or
                    unavailability, re-delivery fees may apply
                  </li>
                  <li>
                    Packages returned to us due to failed delivery may incur
                    return shipping charges
                  </li>
                </ul>

                <h3>9.5 Order Tracking</h3>
                <ul>
                  <li>
                    Tracking numbers are provided via email and available in
                    your account
                  </li>
                  <li>
                    Real-time tracking updates are available through courier
                    partners
                  </li>
                  <li>
                    You will receive SMS/email notifications at key delivery
                    milestones
                  </li>
                </ul>

                <h3>9.6 Damaged or Lost Packages</h3>
                <p>If your package arrives damaged or is lost:</p>
                <ul>
                  <li>
                    Contact us within 48 hours of delivery (for damaged items)
                  </li>
                  <li>
                    Provide photos of damaged packaging and products as evidence
                  </li>
                  <li>
                    We will investigate with the courier and provide a
                    replacement or refund
                  </li>
                  <li>
                    Lost packages are investigated after the maximum estimated
                    delivery time has passed
                  </li>
                </ul>
              </section>

              {/* 10. Returns, Refunds & Cancellations */}
              <section>
                <h2>10. Returns, Refunds & Cancellations</h2>

                <h3>10.1 Order Cancellation (Before Shipment)</h3>
                <p>You may cancel your order before it is shipped:</p>
                <ul>
                  <li>
                    Log in to your account and navigate to "Order History"
                  </li>
                  <li>Click "Cancel Order" next to the relevant order</li>
                  <li>
                    Cancellations are processed immediately if order has not
                    been dispatched
                  </li>
                  <li>Full refund will be issued within 5-7 business days</li>
                </ul>

                <h3>10.2 Return Eligibility</h3>
                <p>
                  You may return products within <strong>7 days</strong> of
                  delivery if:
                </p>
                <ul>
                  <li>Product is defective, damaged, or not as described</li>
                  <li>Wrong product was delivered</li>
                  <li>Product has manufacturing defects</li>
                </ul>

                <h3>10.3 Non-Returnable Items</h3>
                <p>The following items cannot be returned:</p>
                <ul>
                  <li>
                    Opened or used hygiene products (cosmetics, undergarments,
                    etc.)
                  </li>
                  <li>Personalized or custom-made items</li>
                  <li>Perishable goods (food, flowers, etc.)</li>
                  <li>Digital products or downloadable content</li>
                  <li>Gift cards or vouchers</li>
                  <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                </ul>

                <h3>10.4 Return Process</h3>
                <ol>
                  <li>
                    Contact customer support at{" "}
                    <a
                      href="mailto:support@avisekhbagpashal.com"
                      className="text-blue-600 underline"
                    >
                      support@avisekhbagpashal.com
                    </a>{" "}
                    within 7 days
                  </li>
                  <li>
                    Provide order number, reason for return, and photos (if
                    applicable)
                  </li>
                  <li>Wait for return authorization and instructions</li>
                  <li>
                    Ship the product in original packaging with all accessories
                  </li>
                  <li>
                    Use the provided return shipping label (if applicable)
                  </li>
                  <li>
                    Refund will be processed within 7-10 business days after
                    receiving returned item
                  </li>
                </ol>

                <h3>10.5 Return Shipping Costs</h3>
                <ul>
                  <li>
                    <strong>If product is defective/incorrect:</strong> We cover
                    return shipping
                  </li>
                  <li>
                    <strong>If customer changes mind:</strong> Customer pays
                    return shipping (where applicable)
                  </li>
                </ul>

                <h3>10.6 Refund Methods</h3>
                <ul>
                  <li>Refunds are issued to the original payment method</li>
                  <li>
                    <strong>eSewa/Stripe:</strong> 5-7 business days
                  </li>
                  <li>
                    <strong>Cash on Delivery:</strong> Bank transfer or eSewa
                    (provide account details)
                  </li>
                  <li>
                    Shipping charges are non-refundable (unless product is
                    defective)
                  </li>
                </ul>

                <h3>10.7 Exchanges</h3>
                <p>
                  We currently do not offer direct exchanges. To exchange a
                  product:
                </p>
                <ol>
                  <li>Return the original product for a refund</li>
                  <li>Place a new order for the desired item</li>
                </ol>

                <h3>10.8 Warranty Claims</h3>
                <p>
                  Products with manufacturer warranties should be claimed
                  directly with the manufacturer. We will assist with warranty
                  documentation and contact information as needed.
                </p>
              </section>

              {/* 11. Session Management & Token Refresh */}
              <section>
                <h2>11. Session Management & Token Refresh</h2>

                <h3>11.1 How Login Sessions Work</h3>
                <p>
                  When you log in, we use a two-token authentication system:
                </p>
                <ul>
                  <li>
                    <strong>Access Token:</strong> Short-lived (15 minutes),
                    stored in browser memory, used for API requests
                  </li>
                  <li>
                    <strong>Refresh Token:</strong> Long-lived (7 days), stored
                    in HTTP-only secure cookie, used to obtain new access tokens
                  </li>
                </ul>

                <h3>11.2 Automatic Token Refresh</h3>
                <p>
                  When your access token expires, our system automatically
                  requests a new one using your refresh token. This happens
                  seamlessly in the background without requiring you to log in
                  again, providing an uninterrupted browsing experience.
                </p>

                <h3>11.3 Session Expiration</h3>
                <p>
                  Your session will expire and require re-authentication if:
                </p>
                <ul>
                  <li>You are inactive for 7 consecutive days</li>
                  <li>You manually log out</li>
                  <li>You change your password</li>
                  <li>You use "Log out from all devices"</li>
                  <li>Suspicious activity is detected on your account</li>
                  <li>Your account is suspended or terminated</li>
                </ul>

                <h3>11.4 Session Security</h3>
                <ul>
                  <li>
                    <strong>Token Version:</strong> Each user has a token
                    version number that increments when password is changed or
                    sessions are revoked
                  </li>
                  <li>
                    <strong>Device Tracking:</strong> We log device type,
                    browser, IP address, and location for each session
                  </li>
                  <li>
                    <strong>Session History:</strong> View all active sessions
                    and their details in account settings
                  </li>
                  <li>
                    <strong>Revoke Sessions:</strong> Terminate individual
                    sessions or all sessions at once
                  </li>
                </ul>

                <h3>11.5 Session Cookies</h3>
                <p>
                  We use HTTP-only, secure, SameSite=Strict cookies to store
                  refresh tokens. These cookies:
                </p>
                <ul>
                  <li>
                    Cannot be accessed by JavaScript (protection against XSS
                    attacks)
                  </li>
                  <li>
                    Are only transmitted over HTTPS (encrypted connections)
                  </li>
                  <li>
                    Are not sent with cross-site requests (CSRF protection)
                  </li>
                  <li>Automatically expire after 7 days</li>
                </ul>
              </section>

              {/* 12. Maintenance Mode */}
              <section>
                <h2>12. Maintenance Mode</h2>

                <h3>12.1 Scheduled Maintenance</h3>
                <p>
                  We may occasionally perform scheduled maintenance to improve
                  performance, add features, or apply security updates. During
                  maintenance:
                </p>
                <ul>
                  <li>The Platform may be temporarily unavailable</li>
                  <li>
                    You will see a maintenance page with estimated completion
                    time
                  </li>
                  <li>Your data remains secure and is not affected</li>
                  <li>Active sessions may be terminated</li>
                </ul>

                <h3>12.2 Advance Notice</h3>
                <ul>
                  <li>
                    We will provide at least 24 hours' notice for planned
                    maintenance via email
                  </li>
                  <li>
                    Maintenance is typically scheduled during low-traffic hours
                  </li>
                  <li>
                    Emergency maintenance may occur without advance notice if
                    required for security
                  </li>
                </ul>

                <h3>12.3 No Liability for Downtime</h3>
                <p>
                  We are not liable for any loss, inconvenience, or damages
                  resulting from planned or unplanned downtime, including but
                  not limited to lost sales, missed opportunities, or data
                  inaccessibility.
                </p>
              </section>

              {/* 13. Intellectual Property Rights */}
              <section>
                <h2>13. Intellectual Property Rights</h2>

                <h3>13.1 Ownership</h3>
                <p>
                  All content, features, and functionality on the Platform,
                  including but not limited to:
                </p>
                <ul>
                  <li>Software code, algorithms, and architecture</li>
                  <li>Text, graphics, logos, icons, and images</li>
                  <li>User interface design and layout</li>
                  <li>Audio, video, and multimedia content</li>
                  <li>Database structure and organization</li>
                  <li>Trademarks, service marks, and trade names</li>
                </ul>
                <p>
                  are the exclusive property of{" "}
                  <strong>Avisekh Bag Pashal</strong>, its licensors, or content
                  providers, and are protected by international copyright,
                  trademark, patent, trade secret, and other intellectual
                  property laws.
                </p>

                <h3>13.2 Limited License</h3>
                <p>
                  Subject to your compliance with these Terms, we grant you a
                  limited, non-exclusive, non-transferable, non-sublicensable,
                  revocable license to:
                </p>
                <ul>
                  <li>
                    Access and use the Platform for personal, non-commercial
                    purposes
                  </li>
                  <li>View and download content solely for personal use</li>
                  <li>Print or save pages for personal reference</li>
                </ul>

                <h3>13.3 Restrictions</h3>
                <p>You may NOT:</p>
                <ul>
                  <li>
                    Copy, modify, distribute, sell, or lease any part of the
                    Platform
                  </li>
                  <li>
                    Reverse engineer, decompile, or disassemble the software
                  </li>
                  <li>
                    Remove, alter, or obscure any copyright, trademark, or
                    proprietary notices
                  </li>
                  <li>
                    Use our trademarks, logos, or brand elements without written
                    permission
                  </li>
                  <li>Create derivative works based on our Platform</li>
                  <li>Frame or mirror any content without authorization</li>
                  <li>
                    Use automated systems to scrape, extract, or collect data
                  </li>
                </ul>

                <h3>13.4 User-Generated Content</h3>
                <p>
                  If you submit reviews, comments, photos, or other content
                  ("User Content"), you grant us a worldwide, non-exclusive,
                  royalty-free, perpetual, irrevocable license to use,
                  reproduce, modify, adapt, publish, translate, distribute, and
                  display such content for the purpose of operating and
                  promoting the Platform.
                </p>

                <h3>13.5 Trademark Policy</h3>
                <p>
                  <strong>Avisekh Bag Pashal</strong> and associated logos are
                  trademarks of Avisekh Bag Pashal. Unauthorized use may
                  constitute trademark infringement and is prohibited.
                </p>

                <h3>13.6 Copyright Infringement Claims (DMCA)</h3>
                <p>
                  If you believe that content on our Platform infringes your
                  copyright, please send a notice to{" "}
                  <a
                    href="mailto:legal@avisekhbagpashal.com"
                    className="text-blue-600 underline"
                  >
                    legal@avisekhbagpashal.com
                  </a>{" "}
                  with:
                </p>
                <ul>
                  <li>Identification of the copyrighted work</li>
                  <li>Location of the infringing material</li>
                  <li>Your contact information</li>
                  <li>
                    A statement that you have a good faith belief that use is
                    not authorized
                  </li>
                  <li>A statement that the information is accurate</li>
                  <li>Your physical or electronic signature</li>
                </ul>
              </section>

              {/* 14. Limitation of Liability */}
              <section>
                <h2>14. Limitation of Liability</h2>

                <h3>14.1 Disclaimer</h3>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                  SHALL AVISEKH BAG PASHAL, ITS OFFICERS, DIRECTORS, EMPLOYEES,
                  AGENTS, OR AFFILIATES BE LIABLE FOR ANY:
                </p>
                <ul>
                  <li>
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                    DAMAGES
                  </li>
                  <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
                  <li>BUSINESS INTERRUPTION OR LOSS OF GOODWILL</li>
                  <li>
                    DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO YOUR ACCOUNT
                  </li>
                  <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT</li>
                  <li>PERSONAL INJURY OR PROPERTY DAMAGE</li>
                  <li>
                    THIRD-PARTY CONTENT, ACTIONS, OR OMISSIONS (INCLUDING
                    PAYMENT PROCESSORS, COURIERS)
                  </li>
                </ul>
                <p>
                  WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
                  NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, EVEN
                  IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>

                <h3>14.2 Maximum Liability Cap</h3>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR
                  RELATED TO THESE TERMS OR YOUR USE OF THE SERVICES SHALL NOT
                  EXCEED THE GREATER OF:
                </p>
                <ul>
                  <li>
                    The amount you paid to us in the 12 months preceding the
                    claim, OR
                  </li>
                  <li>NPR 10,000 (Ten Thousand Nepali Rupees) / USD 100</li>
                </ul>

                <h3>14.3 Jurisdictional Limitations</h3>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of
                  incidental or consequential damages. If these laws apply to
                  you, some or all of the above disclaimers and limitations may
                  not apply, and you may have additional rights.
                </p>
              </section>

              {/* 15. Disclaimer of Warranties */}
              <section>
                <h2>15. Disclaimer of Warranties</h2>

                <h3>15.1 "AS IS" and "AS AVAILABLE"</h3>
                <p>
                  THE PLATFORM AND ALL SERVICES ARE PROVIDED "AS IS" AND "AS
                  AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                  IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul>
                  <li>
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                    PURPOSE, OR NON-INFRINGEMENT
                  </li>
                  <li>
                    WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED,
                    ERROR-FREE, OR VIRUS-FREE
                  </li>
                  <li>
                    WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR
                    COMPLETENESS OF CONTENT
                  </li>
                  <li>
                    WARRANTIES THAT DEFECTS WILL BE CORRECTED OR THAT THE
                    PLATFORM IS FREE OF HARMFUL COMPONENTS
                  </li>
                </ul>

                <h3>15.2 No Guarantee of Availability</h3>
                <p>
                  We do not warrant that the Platform will be available at all
                  times or that access will be uninterrupted. The Platform may
                  be unavailable due to:
                </p>
                <ul>
                  <li>Scheduled or emergency maintenance</li>
                  <li>Technical failures or system overload</li>
                  <li>Internet service provider issues</li>
                  <li>Cybersecurity incidents</li>
                  <li>Force majeure events</li>
                </ul>

                <h3>15.3 Third-Party Services</h3>
                <p>
                  We rely on third-party service providers (payment gateways,
                  couriers, hosting). We make no warranties regarding the
                  performance, reliability, or availability of these services.
                </p>

                <h3>15.4 Product Warranties</h3>
                <p>
                  Product warranties, if any, are provided by manufacturers or
                  brands. We are not responsible for enforcing or honoring
                  manufacturer warranties unless explicitly stated otherwise.
                </p>
              </section>

              {/* 16. Indemnification */}
              <section>
                <h2>16. Indemnification</h2>

                <p>
                  You agree to indemnify, defend, and hold harmless Avisekh Bag
                  Pashal, its officers, directors, employees, agents,
                  affiliates, successors, and assigns from and against any and
                  all losses, damages, liabilities, deficiencies, claims,
                  actions, judgments, settlements, interest, awards, penalties,
                  fines, costs, or expenses of whatever kind (including
                  reasonable attorneys' fees) arising from or relating to:
                </p>
                <ul>
                  <li>Your use or misuse of the Platform or Services</li>
                  <li>Your breach of these Terms or any applicable law</li>
                  <li>
                    Your violation of the rights of any third party, including
                    intellectual property rights
                  </li>
                  <li>
                    Any content you submit, post, or transmit through the
                    Platform
                  </li>
                  <li>
                    Fraudulent, abusive, or illegal activity associated with
                    your account
                  </li>
                  <li>
                    Your negligence, willful misconduct, or violation of these
                    Terms
                  </li>
                </ul>

                <p>
                  We reserve the right to assume exclusive defense and control
                  of any matter subject to indemnification by you, and you agree
                  to cooperate fully with our defense.
                </p>
              </section>

              {/* 17. Force Majeure */}
              <section>
                <h2>17. Force Majeure</h2>

                <p>
                  We shall not be liable for any delay, failure, or interruption
                  of the Services resulting from causes beyond our reasonable
                  control, including but not limited to:
                </p>
                <ul>
                  <li>
                    Acts of God (earthquakes, floods, fires, storms, natural
                    disasters)
                  </li>
                  <li>
                    War, terrorism, civil unrest, riots, or government actions
                  </li>
                  <li>Epidemics, pandemics, or public health emergencies</li>
                  <li>Internet, telecommunications, or network failures</li>
                  <li>Power outages or electrical grid failures</li>
                  <li>Strikes, labor disputes, or supply chain disruptions</li>
                  <li>Cyberattacks, hacking, or security breaches</li>
                  <li>Changes in laws or regulations</li>
                </ul>

                <p>
                  In the event of force majeure, we will make reasonable efforts
                  to notify affected users and resume Services as soon as
                  practicable.
                </p>
              </section>

              {/* 18. Dispute Resolution & Arbitration */}
              <section>
                <h2>18. Dispute Resolution & Arbitration</h2>

                <h3>18.1 Informal Dispute Resolution</h3>
                <p>
                  Before initiating formal proceedings, you agree to attempt to
                  resolve any dispute informally by contacting us at{" "}
                  <a
                    href="mailto:legal@avisekhbagpashal.com"
                    className="text-blue-600 underline"
                  >
                    legal@avisekhbagpashal.com
                  </a>
                  . We will respond within 15 business days.
                </p>

                <h3>18.2 Binding Arbitration</h3>
                <p>
                  If informal resolution fails, disputes shall be resolved
                  through binding arbitration in accordance with the Arbitration
                  and Conciliation Act, 2071 (Nepal), conducted in Kathmandu,
                  Nepal.
                </p>

                <h3>18.3 Class Action Waiver</h3>
                <p>
                  YOU AGREE THAT DISPUTES WILL BE RESOLVED ON AN INDIVIDUAL
                  BASIS ONLY. YOU WAIVE YOUR RIGHT TO PARTICIPATE IN CLASS
                  ACTIONS, CLASS ARBITRATIONS, OR REPRESENTATIVE PROCEEDINGS.
                </p>

                <h3>18.4 Small Claims Court</h3>
                <p>
                  Either party may seek relief in small claims court for
                  disputes within the court's jurisdiction.
                </p>
              </section>

              {/* 19. Governing Law & Jurisdiction */}
              <section>
                <h2>19. Governing Law & Jurisdiction</h2>

                <h3>19.1 Governing Law</h3>
                <p>
                  These Terms shall be governed by and construed in accordance
                  with the laws of Nepal, without regard to its conflict of law
                  principles.
                </p>

                <h3>19.2 Exclusive Jurisdiction</h3>
                <p>
                  Subject to the arbitration provisions above, the courts of
                  Kathmandu, Nepal shall have exclusive jurisdiction over any
                  disputes arising out of or related to these Terms.
                </p>

                <h3>19.3 Waiver of Sovereign Immunity</h3>
                <p>
                  To the extent permitted by law, you waive any right to claim
                  sovereign immunity from jurisdiction or enforcement.
                </p>
              </section>

              {/* 20. Severability & Waiver */}
              <section>
                <h2>20. Severability & Waiver</h2>

                <h3>20.1 Severability</h3>
                <p>
                  If any provision of these Terms is found to be invalid,
                  illegal, or unenforceable by a court of competent
                  jurisdiction, such provision shall be modified to the minimum
                  extent necessary to make it valid and enforceable. If
                  modification is not possible, the provision shall be severed,
                  and the remaining provisions shall continue in full force and
                  effect.
                </p>

                <h3>20.2 No Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms
                  shall not constitute a waiver of such right or provision. Any
                  waiver must be in writing and signed by an authorized
                  representative of Avisekh Bag Pashal.
                </p>
              </section>

              {/* 21. Assignment & Transfer */}
              <section>
                <h2>21. Assignment & Transfer</h2>

                <p>
                  You may not assign, transfer, or delegate your rights or
                  obligations under these Terms without our prior written
                  consent. We may assign or transfer our rights and obligations
                  under these Terms to any third party at our sole discretion,
                  including in connection with a merger, acquisition,
                  reorganization, or sale of assets.
                </p>
              </section>

              {/* 22. Entire Agreement */}
              <section>
                <h2>22. Entire Agreement</h2>

                <p>
                  These Terms, together with our Privacy Policy and any
                  Additional Terms, constitute the entire agreement between you
                  and Avisekh Bag Pashal regarding your use of the Services and
                  supersede all prior or contemporaneous understandings,
                  agreements, representations, and warranties, whether written
                  or oral.
                </p>
              </section>

              {/* 23. Contact Information */}
              <section>
                <h2>23. Contact Information</h2>

                <p>
                  If you have any questions, concerns, or requests regarding
                  these Terms, please contact us:
                </p>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@avisekhbagpashal.com"
                      className="text-blue-600 underline"
                    >
                      legal@avisekhbagpashal.com
                    </a>
                  </p>
                  <p>
                    <strong>Support Email:</strong>{" "}
                    <a
                      href="mailto:support@avisekhbagpashal.com"
                      className="text-blue-600 underline"
                    >
                      support@avisekhbagpashal.com
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.avisekhbagpashal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      www.avisekhbagpashal.com
                    </a>
                  </p>
                  <p>
                    <strong>Business Hours:</strong> Monday - Friday, 9:00 AM -
                    6:00 PM NPT
                  </p>
                  <p>
                    <strong>Response Time:</strong> We aim to respond within 48
                    hours
                  </p>
                </div>
              </section>

              {/* 24. Acknowledgment */}
              <section>
                <h2>24. Acknowledgment</h2>

                <p>
                  BY ACCESSING OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU
                  HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF
                  USE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY
                  DISCONTINUE USE OF THE SERVICES.
                </p>

                <p className="mt-4 text-sm text-muted-foreground italic">
                  Last Updated: February 22, 2026
                  <br />
                  Version: 1.0
                </p>
              </section>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
