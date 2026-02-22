import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
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
              </p>

              {/* 1. Introduction */}
              <section>
                <h2>1. Introduction</h2>
                <p>
                  Welcome to <strong>Avisekh Bag Pashal</strong> ("we," "our,"
                  or "us"). We are committed to protecting your privacy and
                  ensuring the security of your personal information. This
                  Privacy Policy explains in detail how we collect, use, store,
                  share, and protect your data when you use our e-commerce
                  platform.
                </p>
                <p>
                  By accessing or using our services, you agree to the terms
                  outlined in this Privacy Policy. If you do not agree with any
                  part of this policy, please do not use our platform.
                </p>
              </section>

              {/* 2. Information We Collect */}
              <section>
                <h2>2. Information We Collect</h2>

                <h3>2.1 Account Information</h3>
                <p>When you create an account, we collect:</p>
                <ul>
                  <li>
                    <strong>Full Name:</strong> Used for personalization and
                    order delivery
                  </li>
                  <li>
                    <strong>Email Address:</strong> For account verification,
                    communication, and order updates
                  </li>
                  <li>
                    <strong>Password:</strong> Stored as a hashed value using
                    bcrypt encryption (we never store plain-text passwords)
                  </li>
                  <li>
                    <strong>Phone Number (Optional):</strong> For order delivery
                    and customer support
                  </li>
                </ul>

                <h3>2.2 Authentication Data</h3>
                <p>We collect and store:</p>
                <ul>
                  <li>
                    <strong>Email Verification Status:</strong> To confirm
                    account ownership
                  </li>
                  <li>
                    <strong>OTP (One-Time Password):</strong> Sent via email for
                    secure verification (expires after use or time limit)
                  </li>
                  <li>
                    <strong>OAuth Provider Information:</strong> If you sign in
                    with Google, we receive your name, email, and profile
                    picture from Google
                  </li>
                  <li>
                    <strong>Token Version:</strong> Used to invalidate sessions
                    when you change your password or log out from all devices
                  </li>
                  <li>
                    <strong>Refresh Tokens:</strong> Stored in secure HTTP-only
                    cookies to maintain your login session (automatically
                    deleted after 7 days or when you log out)
                  </li>
                </ul>

                <h3>2.3 Login & Security Data</h3>
                <p>For security and fraud prevention, we log:</p>
                <ul>
                  <li>
                    <strong>Login Timestamps:</strong> Date and time of each
                    login attempt
                  </li>
                  <li>
                    <strong>IP Address:</strong> Your internet connection's
                    public IP address
                  </li>
                  <li>
                    <strong>Device Information:</strong> Browser type, operating
                    system, device model
                  </li>
                  <li>
                    <strong>Approximate Location:</strong> Derived from IP
                    address using ipapi.co (city/country level, not precise GPS)
                  </li>
                  <li>
                    <strong>Login Status:</strong> Success or failure of login
                    attempts
                  </li>
                  <li>
                    <strong>Failed Login Attempts:</strong> Number of failed
                    attempts to detect potential security threats
                  </li>
                </ul>

                <h3>2.4 Shopping & Transaction Data</h3>
                <ul>
                  <li>
                    <strong>Cart Items:</strong> Products you add to your
                    shopping cart
                  </li>
                  <li>
                    <strong>Order History:</strong> All purchases you make,
                    including product details, quantities, and prices
                  </li>
                  <li>
                    <strong>Delivery Address:</strong> Shipping information for
                    order fulfillment
                  </li>
                  <li>
                    <strong>Payment Method:</strong> Type of payment used
                    (eSewa, Stripe, etc.) but NOT payment card numbers or
                    credentials
                  </li>
                  <li>
                    <strong>Transaction Status:</strong> Pending, completed,
                    failed, or refunded
                  </li>
                </ul>

                <h3>2.5 Usage & Analytics Data</h3>
                <ul>
                  <li>
                    <strong>Pages Visited:</strong> Which pages you view on our
                    site
                  </li>
                  <li>
                    <strong>Products Viewed:</strong> Items you browse or search
                    for
                  </li>
                  <li>
                    <strong>Session Duration:</strong> How long you stay on our
                    site
                  </li>
                  <li>
                    <strong>Referral Source:</strong> How you found our website
                    (search engine, social media, direct link)
                  </li>
                </ul>

                <h3>2.6 Cookies & Tracking</h3>
                <ul>
                  <li>
                    <strong>Authentication Cookies:</strong> HTTP-only,
                    SameSite=Strict cookies containing refresh tokens
                  </li>
                  <li>
                    <strong>Session Cookies:</strong> To keep you logged in
                    during your visit
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> To remember your
                    language and theme settings
                  </li>
                </ul>
              </section>

              {/* 3. How We Use Your Information */}
              <section>
                <h2>3. How We Use Your Information</h2>

                <h3>3.1 Account Management</h3>
                <ul>
                  <li>Create and maintain your user account</li>
                  <li>Verify your email address and phone number</li>
                  <li>Authenticate your identity during login</li>
                  <li>Reset your password when requested</li>
                  <li>
                    Manage your profile settings (name, email, preferences)
                  </li>
                </ul>

                <h3>3.2 Order Processing</h3>
                <ul>
                  <li>Process your purchases and payments</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Handle returns, refunds, and customer support</li>
                  <li>Generate invoices and receipts</li>
                </ul>

                <h3>3.3 Security & Fraud Prevention</h3>
                <ul>
                  <li>
                    Detect and prevent unauthorized access to your account
                  </li>
                  <li>
                    Send email alerts when login occurs from a new device or
                    location
                  </li>
                  <li>Monitor for suspicious activity and fraudulent orders</li>
                  <li>
                    Implement rate limiting to prevent brute-force attacks
                  </li>
                  <li>
                    Automatically revoke sessions if unusual activity is
                    detected
                  </li>
                </ul>

                <h3>3.4 Communication</h3>
                <ul>
                  <li>Send transactional emails (order updates, receipts)</li>
                  <li>Send password reset links and OTP verification codes</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>
                    Send important updates about policy changes or service
                    disruptions
                  </li>
                  <li>
                    Send marketing emails ONLY if you opt-in (you can
                    unsubscribe anytime)
                  </li>
                </ul>

                <h3>3.5 Service Improvement</h3>
                <ul>
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Personalize your shopping experience</li>
                  <li>Optimize website performance and loading speed</li>
                  <li>Fix bugs and technical issues</li>
                </ul>

                <h3>3.6 Legal Compliance</h3>
                <ul>
                  <li>Comply with applicable laws and regulations</li>
                  <li>Respond to legal requests from authorities</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Protect our rights and property</li>
                </ul>
              </section>

              {/* 4. Payment Processing */}
              <section>
                <h2>4. Payment Processing</h2>

                <h3>4.1 Payment Gateways</h3>
                <p>We use trusted third-party payment processors:</p>
                <ul>
                  <li>
                    <strong>eSewa (Nepal):</strong> For local payments within
                    Nepal
                  </li>
                  <li>
                    <strong>Stripe (International):</strong> For international
                    credit/debit card payments
                  </li>
                </ul>

                <h3>4.2 What We DO NOT Store</h3>
                <ul>
                  <li>Credit or debit card numbers</li>
                  <li>CVV/CVC codes</li>
                  <li>Banking credentials or passwords</li>
                  <li>Full payment card information</li>
                </ul>

                <h3>4.3 What We DO Store</h3>
                <ul>
                  <li>Transaction ID from payment gateway</li>
                  <li>Payment status (pending, completed, failed)</li>
                  <li>Transaction amount and currency</li>
                  <li>Payment method type (eSewa, card, etc.)</li>
                </ul>

                <h3>4.4 PCI Compliance</h3>
                <p>
                  All payment processing is handled by PCI-DSS compliant
                  third-party providers. We never handle or store sensitive
                  payment card data on our servers.
                </p>
              </section>

              {/* 5. Third-Party OAuth (Google Sign-In) */}
              <section>
                <h2>5. Third-Party OAuth (Google Sign-In)</h2>

                <h3>5.1 What We Receive from Google</h3>
                <p>When you sign in with Google, we receive:</p>
                <ul>
                  <li>Your full name (as stored in Google account)</li>
                  <li>Your email address</li>

                  <li>A unique Google user ID</li>
                </ul>

                <h3>5.2 How OAuth Works</h3>
                <ul>
                  <li>
                    You are redirected to Google's secure login page (we never
                    see your Google password)
                  </li>
                  <li>
                    You grant permission for us to access your basic profile
                    information
                  </li>
                  <li>
                    Google sends us an authorization token (not your password)
                  </li>
                  <li>
                    We create or update your account using this information
                  </li>
                </ul>

                <h3>5.3 Your Control</h3>
                <p>
                  You can revoke our access to your Google account at any time
                  by visiting{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Google Account Permissions
                  </a>
                  .
                </p>
              </section>

              {/* 6. Email Verification & OTP */}
              <section>
                <h2>6. Email Verification & OTP</h2>

                <h3>6.1 Email Verification</h3>
                <ul>
                  <li>
                    When you register, we send a verification email to confirm
                    your email address
                  </li>
                  <li>
                    The verification link contains a secure token that expires
                    after 24 hours
                  </li>
                  <li>
                    Your account may have limited functionality until email is
                    verified
                  </li>
                </ul>

                <h3>6.2 OTP (One-Time Password)</h3>
                <ul>
                  <li>Used for password reset and account recovery</li>
                  <li>6-digit code sent to your registered email</li>
                  <li>
                    Expires after 10 minutes or after successful use, whichever
                    comes first
                  </li>
                  <li>Can only be used once</li>
                  <li>
                    Hashed before storage (we cannot see your actual OTP code)
                  </li>
                </ul>

                <h3>6.3 Email Service Provider</h3>
                <p>
                  We use Resend.com to send transactional emails. Resend may
                  temporarily process your email address to deliver messages but
                  does not store or use it for other purposes.
                </p>
              </section>

              {/* 7. Session Management & Token Refresh */}
              <section>
                <h2>7. Session Management & Token Refresh</h2>

                <h3>7.1 How Login Sessions Work</h3>
                <ul>
                  <li>
                    <strong>Access Token:</strong> Short-lived (15 minutes),
                    stored in memory, used for API requests
                  </li>
                  <li>
                    <strong>Refresh Token:</strong> Long-lived (7 days), stored
                    in HTTP-only cookie, used to get new access tokens
                  </li>
                  <li>
                    <strong>Token Version:</strong> Incremented when you change
                    password or log out from all devices (invalidates all old
                    tokens)
                  </li>
                </ul>

                <h3>7.2 Automatic Token Refresh</h3>
                <p>
                  When your access token expires, our system automatically
                  requests a new one using your refresh token. This happens
                  seamlessly without requiring you to log in again.
                </p>

                <h3>7.3 Session Expiration</h3>
                <ul>
                  <li>
                    Sessions automatically expire after 7 days of inactivity
                  </li>
                  <li>
                    You can manually log out to end your session immediately
                  </li>
                  <li>
                    Sessions are revoked if suspicious activity is detected
                  </li>
                  <li>
                    Password change or "Log out from all devices" invalidates
                    all sessions
                  </li>
                </ul>
              </section>

              {/* 8. Login Alerts & Security Notifications */}
              <section>
                <h2>8. Login Alerts & Security Notifications</h2>

                <h3>8.1 When We Send Alerts</h3>
                <p>You will receive an email notification when:</p>
                <ul>
                  <li>Someone logs into your account from a new device</li>
                  <li>Login occurs from a new location (city/country)</li>
                  <li>Your password is changed</li>
                  <li>Your email address is updated</li>
                  <li>Multiple failed login attempts are detected</li>
                  <li>
                    Your account is accessed after a long period of inactivity
                  </li>
                </ul>

                <h3>8.2 Information in Alerts</h3>
                <p>Login alert emails contain:</p>
                <ul>
                  <li>Date and time of login</li>
                  <li>Device type (Windows PC, iPhone, etc.)</li>
                  <li>Browser used (Chrome, Safari, etc.)</li>
                  <li>Approximate location (city and country)</li>
                  <li>IP address</li>
                  <li>Link to secure your account if it wasn't you</li>
                </ul>
              </section>

              {/* 9. Data Security */}
              <section>
                <h2>9. Data Security</h2>

                <h3>9.1 Encryption</h3>
                <ul>
                  <li>
                    <strong>In Transit:</strong> All data transmitted between
                    your browser and our servers is encrypted using TLS 1.3
                    (HTTPS)
                  </li>
                  <li>
                    <strong>At Rest:</strong> Passwords are hashed using bcrypt
                    with salt rounds
                  </li>
                  <li>
                    <strong>Database:</strong> Sensitive data is encrypted in
                    our database
                  </li>
                </ul>

                <h3>9.2 Access Controls</h3>
                <ul>
                  <li>
                    <strong>Role-Based Access:</strong> Admin, seller, and
                    customer roles with different permissions
                  </li>
                  <li>
                    <strong>Principle of Least Privilege:</strong> Users only
                    have access to data they need
                  </li>
                  <li>
                    <strong>Two-Factor Authentication (Coming Soon):</strong>{" "}
                    For admin accounts
                  </li>
                </ul>

                <h3>9.3 Rate Limiting & Abuse Prevention</h3>
                <ul>
                  <li>
                    Login attempts limited to 5 per 15 minutes per IP address
                  </li>
                  <li>API requests rate-limited to prevent abuse</li>
                  <li>
                    CAPTCHA verification for repeated failed login attempts
                  </li>
                  <li>
                    Account temporarily locked after 10 failed login attempts
                  </li>
                </ul>

                <h3>9.4 Server Security</h3>
                <ul>
                  <li>Hosted on secure Render.com infrastructure</li>
                  <li>Regular security patches and updates</li>
                  <li>Firewall protection and DDoS mitigation</li>
                  <li>Database backups every 24 hours</li>
                </ul>

                <h3>9.5 Data Breach Protocol</h3>
                <p>In the unlikely event of a data breach, we will:</p>
                <ul>
                  <li>Notify affected users within 72 hours</li>
                  <li>Report to relevant authorities as required by law</li>
                  <li>Provide details about what data was compromised</li>
                  <li>Offer guidance on protecting your account</li>
                  <li>Take immediate action to secure the breach</li>
                </ul>
              </section>

              {/* 10. Maintenance Mode */}
              <section>
                <h2>10. Maintenance Mode</h2>

                <h3>10.1 When Maintenance Occurs</h3>
                <p>
                  Occasionally, we need to perform system maintenance to improve
                  performance, add features, or apply security updates.
                </p>

                <h3>10.2 What Happens During Maintenance</h3>
                <ul>
                  <li>
                    You will see a maintenance page when trying to access the
                    site
                  </li>
                  <li>The page shows estimated completion time</li>
                  <li>Your data remains secure during maintenance</li>
                  <li>No data is lost or deleted</li>
                  <li>
                    The page automatically refreshes to check if we're back
                    online
                  </li>
                </ul>

                <h3>10.3 Advance Notice</h3>
                <p>
                  We try to schedule maintenance during low-traffic hours and
                  provide advance notice via email when possible.
                </p>
              </section>

              {/* 11. Data Retention */}
              <section>
                <h2>11. Data Retention</h2>

                <h3>11.1 How Long We Keep Your Data</h3>
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Data Type
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Retention Period
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Account Information
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Until account deletion
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Order History
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        7 years (tax compliance)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Login Logs
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        90 days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        OTP Codes
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        10 minutes or until used
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Refresh Tokens
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        7 days or until logout
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Email Verification Tokens
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        24 hours
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3>11.2 Inactive Accounts</h3>
                <p>
                  Accounts inactive for more than 3 years may be deleted after
                  email notification. Order history will be retained for legal
                  compliance.
                </p>
              </section>

              {/* 12. Data Sharing */}
              <section>
                <h2>12. Data Sharing & Third Parties</h2>

                <h3>12.1 Who We Share Data With</h3>
                <ul>
                  <li>
                    <strong>Payment Processors:</strong> eSewa and Stripe
                    (transaction data only)
                  </li>
                  <li>
                    <strong>Email Service:</strong> Resend.com (email addresses
                    for delivery only)
                  </li>
                  <li>
                    <strong>Hosting Provider:</strong> Render.com (server
                    infrastructure)
                  </li>
                  <li>
                    <strong>OAuth Provider:</strong> Google (for Google Sign-In
                    authentication)
                  </li>
                  <li>
                    <strong>Analytics:</strong> Google Analytics (anonymized
                    usage data)
                  </li>
                </ul>

                <h3>12.2 What We DO NOT Do</h3>
                <ul>
                  <li>We do NOT sell your personal data to anyone</li>
                  <li>
                    We do NOT share your data with advertisers or marketing
                    companies
                  </li>
                  <li>
                    We do NOT use your data for purposes other than what's
                    stated in this policy
                  </li>
                </ul>

                <h3>12.3 Legal Disclosure</h3>
                <p>We may disclose your information if required to:</p>
                <ul>
                  <li>Comply with court orders or legal processes</li>
                  <li>Respond to lawful government requests</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or illegal activity</li>
                </ul>
              </section>

              {/* 13. Your Rights & Choices */}
              <section>
                <h2>13. Your Rights & Choices</h2>

                <h3>13.1 Access Your Data</h3>
                <p>You can:</p>
                <ul>
                  <li>View your profile information in account settings</li>
                  <li>See your order history and transaction records</li>
                  <li>Request a copy of all data we hold about you</li>
                </ul>

                <h3>13.2 Update Your Information</h3>
                <p>You can update:</p>
                <ul>
                  <li>Your name and email address in profile settings</li>
                  <li>Your password at any time</li>
                  <li>Your delivery addresses</li>
                  <li>Your communication preferences</li>
                </ul>

                <h3>13.3 Delete Your Account</h3>
                <p>
                  You have the right to request account deletion. When you
                  delete your account:
                </p>
                <ul>
                  <li>Your personal information is permanently removed</li>
                  <li>All active sessions are immediately terminated</li>
                  <li>
                    Order history may be retained for 7 years for legal/tax
                    compliance, but anonymized (name removed)
                  </li>
                  <li>This action cannot be undone</li>
                </ul>

                <h3>13.4 Opt-Out of Marketing</h3>
                <ul>
                  <li>
                    Click "Unsubscribe" in any marketing email (transactional
                    emails cannot be opted out)
                  </li>
                  <li>Update preferences in account settings</li>
                  <li>Contact us at support@avisekhbagpashal.com</li>
                </ul>

                <h3>13.5 Revoke OAuth Access</h3>
                <p>
                  If you signed in with Google, you can revoke our access at{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Google Account Permissions
                  </a>
                  .
                </p>

                <h3>13.6 Export Your Data</h3>
                <p>
                  Request a machine-readable copy of your data (JSON format) by
                  contacting support@avisekhbagpashal.com. We will provide it
                  within 30 days.
                </p>
              </section>

              {/* 14. Children's Privacy */}
              <section>
                <h2>14. Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 13 years old.
                  We do not knowingly collect personal information from children
                  under 13. If we discover that we have collected data from a
                  child under 13, we will delete it immediately.
                </p>
                <p>
                  Parents or guardians who believe their child has provided
                  personal information should contact us at
                  support@avisekhbagpashal.com.
                </p>
              </section>

              {/* 16. Cookies Policy */}
              <section>
                <h2>16. Cookies Policy</h2>

                <h3>16.1 Types of Cookies We Use</h3>
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Cookie Type
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Purpose
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Authentication
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Keep you logged in
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        7 days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Session
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Maintain shopping cart
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Until browser closes
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Preferences
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Remember language/theme
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        1 year
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Analytics
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Track usage statistics
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        2 years
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3>16.2 Managing Cookies</h3>
                <p>
                  You can control cookies through your browser settings.
                  However, disabling authentication cookies will prevent you
                  from staying logged in.
                </p>
              </section>

              {/* 17. Changes to Privacy Policy */}
              <section>
                <h2>17. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, legal requirements, or service
                  features.
                </p>

                <h3>17.1 How We Notify You</h3>
                <ul>
                  <li>
                    Material changes: Email notification + banner on website
                  </li>
                  <li>
                    Minor updates: "Last Updated" date at the top of this page
                  </li>
                  <li>
                    You will be required to accept updated policy before
                    continuing to use the service
                  </li>
                </ul>

                <h3>17.2 Version History</h3>
                <p>
                  Previous versions of this policy will be archived and
                  available upon request.
                </p>
              </section>

              {/* 18. Contact Us */}
              <section>
                <h2>18. Contact Us</h2>
                <p>
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy or your personal data, please contact us:
                </p>

                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
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
                    <strong>Response Time:</strong> We aim to respond within 48
                    hours
                  </p>
                </div>

                <h3 className="mt-6">18.1 Data Protection Officer (DPO)</h3>
                <p>
                  For GDPR-related inquiries, you can contact our Data
                  Protection Officer at: dpo@avisekhbagpashal.com
                </p>
              </section>

              {/* 19. Acknowledgment */}
              <section>
                <h2>19. Acknowledgment</h2>
                <p>
                  By using Avisekh Bag Pashal, you acknowledge that you have
                  read, understood, and agree to this Privacy Policy. If you do
                  not agree with any part of this policy, please discontinue use
                  of our services immediately.
                </p>
              </section>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
