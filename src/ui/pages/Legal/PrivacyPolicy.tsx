import React, { useState } from "react";

const PrivacyPolicy: React.FC = () => {
  const [lang, setLang] = useState<"en" | "np">("en");

  return (
    <div className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lang === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`rounded-md px-4 py-1.5 text-sm transition ${
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("np")}
              className={`rounded-md px-4 py-1.5 text-sm transition ${
                lang === "np"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              नेपाली
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
            {lang === "en" ? (
              <>
                <p className="text-sm text-muted-foreground">
                  <strong>Effective Date:</strong> [Insert Date]
                </p>

                <section>
                  <h2>1. Introduction</h2>
                  <p>
                    Welcome to <strong>Avisekh Bag Pashal</strong>. This Privacy
                    Policy explains how we collect, use, store, protect, and
                    disclose your personal information when you use our
                    platform.
                  </p>
                </section>

                <section>
                  <h2>2. Information We Collect</h2>
                  <ul>
                    <li>Full name and email address</li>
                    <li>Hashed passwords and authentication data</li>
                    <li>
                      Login timestamps, IP address, and device information
                    </li>
                    <li>
                      Approximate location during login for security purposes
                    </li>
                    <li>Order history and transaction status</li>
                  </ul>
                </section>

                <section>
                  <h2>3. Use of Information</h2>
                  <p>
                    We use collected data to manage accounts, authenticate
                    users, process payments, prevent fraud, improve system
                    performance, and comply with legal obligations.
                  </p>
                </section>

                <section>
                  <h2>4. Payments</h2>
                  <p>
                    Payments in Nepal are processed via eSewa. International
                    payments may be processed via Stripe. We do not store
                    payment credentials.
                  </p>
                </section>

                <section>
                  <h2>5. AI Features</h2>
                  <p>
                    Our platform may include AI-powered features using Gemini.
                    Conversations may be processed to generate responses and
                    improve service quality. Data is never sold or used for
                    advertising.
                  </p>
                </section>

                <section>
                  <h2>6. Data Security</h2>
                  <p>
                    We implement encryption, token-based authentication, rate
                    limiting, login alerts, and role-based access controls to
                    protect your data.
                  </p>
                </section>

                <section>
                  <h2>7. Your Rights</h2>
                  <p>
                    You may request access, correction, or deletion of your
                    personal data by contacting us at{" "}
                    <strong>support@avisekhbagpashal.com</strong>.
                  </p>
                </section>

                <section>
                  <h2>8. Contact</h2>
                  <p>
                    Email: <strong>support@avisekhbagpashal.com</strong>
                    <br />
                    Website: <strong>www.avisekhbagpashal.com</strong>
                  </p>
                </section>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  <strong>प्रभावी मिति:</strong> 2026-01-01
                </p>

                <section>
                  <h2>१. परिचय</h2>
                  <p>
                    <strong>Avisekh Bag Pashal</strong> मा स्वागत छ। यस गोपनीयता
                    नीतिले तपाईंले हाम्रो प्लेटफर्म प्रयोग गर्दा व्यक्तिगत
                    जानकारी कसरी सङ्कलन, प्रयोग, सुरक्षा र व्यवस्थापन गरिन्छ
                    भन्ने स्पष्ट गर्दछ।
                  </p>
                </section>

                <section>
                  <h2>२. हामीले सङ्कलन गर्ने जानकारी</h2>
                  <ul>
                    <li>पूरा नाम र इमेल ठेगाना</li>
                    <li>सुरक्षित रूपमा ह्यास गरिएको पासवर्ड</li>
                    <li>लगइन मिति, IP ठेगाना र उपकरण विवरण</li>
                    <li>सुरक्षाका लागि लगइन समयमा अनुमानित स्थान</li>
                    <li>अर्डर तथा कारोबार स्थिति</li>
                  </ul>
                </section>

                <section>
                  <h2>३. जानकारी प्रयोग गर्ने उद्देश्य</h2>
                  <p>
                    खाता व्यवस्थापन, प्रयोगकर्ता प्रमाणीकरण, भुक्तानी प्रक्रिया,
                    ठगी रोकथाम, सेवा सुधार तथा कानुनी दायित्व पूरा गर्न जानकारी
                    प्रयोग गरिन्छ।
                  </p>
                </section>

                <section>
                  <h2>४. भुक्तानी</h2>
                  <p>
                    नेपालभित्र eSewa मार्फत र अन्तर्राष्ट्रिय रूपमा Stripe
                    मार्फत भुक्तानी प्रशोधन गरिन्छ। हामी भुक्तानी विवरण भण्डारण
                    गर्दैनौं।
                  </p>
                </section>

                <section>
                  <h2>५. AI सुविधा</h2>
                  <p>
                    Gemini प्रयोग गरी AI-आधारित सेवा उपलब्ध गराइन्छ। संवादहरू
                    प्रतिक्रियाका लागि प्रशोधन हुन सक्छन् तर डाटा बिक्री वा
                    विज्ञापनका लागि प्रयोग हुँदैन।
                  </p>
                </section>

                <section>
                  <h2>६. डाटा सुरक्षा</h2>
                  <p>
                    हामी इन्क्रिप्सन, सुरक्षित टोकन प्रणाली, लगइन चेतावनी, rate
                    limiting तथा भूमिका-आधारित पहुँच प्रयोग गर्छौं।
                  </p>
                </section>

                <section>
                  <h2>७. प्रयोगकर्ताका अधिकार</h2>
                  <p>
                    तपाईंले आफ्नो डाटा पहुँच, सच्याउन वा हटाउन अनुरोध गर्न
                    <strong> support@avisekhbagpashal.com</strong> मा सम्पर्क
                    गर्न सक्नुहुन्छ।
                  </p>
                </section>

                <section>
                  <h2>८. सम्पर्क</h2>
                  <p>
                    इमेल: <strong>support@avisekhbagpashal.com</strong>
                    <br />
                    वेबसाइट: <strong>www.avisekhbagpashal.com</strong>
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
