import React, { useState } from "react";

export const TermsOfUse: React.FC = () => {
  const [lang, setLang] = useState<"en" | "np">("en");

  return (
    <div className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lang === "en" ? "Terms of Use" : "प्रयोगका सर्तहरू"}
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
                  <strong>Effective Date:</strong> 2026-01-01
                </p>

                <section>
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    These Terms of Use (“Terms”) govern your access to and use
                    of
                    <strong> Avisekh Bag Pashal</strong>, including all
                    features, services, content, and related technologies. By
                    accessing, registering, or using the platform, you confirm
                    that you have read, understood, and agreed to be legally
                    bound by these Terms.
                  </p>
                </section>

                <section>
                  <h2>2. Eligibility & User Representation</h2>
                  <p>
                    You must be at least 13 years of age to use this platform.
                    By using the service, you represent that you have the legal
                    capacity to enter into a binding agreement and that all
                    information you provide is accurate and truthful.
                  </p>
                </section>

                <section>
                  <h2>3. Account Registration & Security</h2>
                  <ul>
                    <li>
                      You are responsible for safeguarding your login
                      credentials
                    </li>
                    <li>
                      You must notify us immediately of unauthorized access
                    </li>
                    <li>
                      You are fully responsible for activities under your
                      account
                    </li>
                    <li>Account sharing or resale is strictly prohibited</li>
                  </ul>
                </section>

                <section>
                  <h2>4. Acceptable Use Policy</h2>
                  <p>You agree not to:</p>
                  <ul>
                    <li>
                      Use the platform for unlawful or fraudulent purposes
                    </li>
                    <li>
                      Attempt to bypass security or authentication systems
                    </li>
                    <li>Interfere with platform performance or availability</li>
                    <li>Upload malware, harmful scripts, or abusive content</li>
                    <li>Scrape, reverse-engineer, or exploit system data</li>
                  </ul>
                </section>

                <section>
                  <h2>5. Products, Orders & Availability</h2>
                  <p>
                    Product descriptions, pricing, and availability may change
                    at any time. We reserve the right to refuse or cancel orders
                    due to errors, fraud detection, or inventory limitations.
                  </p>
                </section>

                <section>
                  <h2>6. Payments & Billing</h2>
                  <p>
                    Payments are processed through authorized third-party
                    providers. We do not store card or wallet credentials.
                    Transaction references may be retained for compliance.
                  </p>
                </section>

                <section>
                  <h2>7. Refunds, Returns & Disputes</h2>
                  <p>
                    Refund and return eligibility may vary by product and
                    payment method. Disputes must be raised within a reasonable
                    timeframe and may require verification.
                  </p>
                </section>

                <section>
                  <h2>8. AI-Powered Features</h2>
                  <p>
                    The platform may include AI-assisted tools for automation or
                    support. AI-generated responses are provided for convenience
                    only and may contain inaccuracies.
                  </p>
                </section>

                <section>
                  <h2>9. Intellectual Property Rights</h2>
                  <p>
                    All software, designs, logos, and content are the
                    intellectual property of <strong>Avisekh Bag Pashal</strong>
                    . Unauthorized use is strictly prohibited.
                  </p>
                </section>

                <section>
                  <h2>10. Suspension & Termination</h2>
                  <p>
                    We may suspend or terminate accounts without prior notice if
                    policy violations, fraud, or security risks are detected.
                  </p>
                </section>

                <section>
                  <h2>11. Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, we shall not be
                    liable for indirect, incidental, or consequential damages.
                  </p>
                </section>

                <section>
                  <h2>12. Disclaimer of Warranties</h2>
                  <p>
                    The platform is provided “as is” and “as available” without
                    warranties of any kind.
                  </p>
                </section>

                <section>
                  <h2>13. Force Majeure</h2>
                  <p>
                    We are not responsible for service disruptions caused by
                    events beyond reasonable control.
                  </p>
                </section>

                <section>
                  <h2>14. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms at any time.
                    Continued use constitutes acceptance of the revised Terms.
                  </p>
                </section>

                <section>
                  <h2>15. Governing Law & Jurisdiction</h2>
                  <p>
                    These Terms shall be governed by the laws of Nepal, and
                    courts of Nepal shall have exclusive jurisdiction.
                  </p>
                </section>

                <section>
                  <h2>16. Contact Information</h2>
                  <p>
                    Email: <strong>support@avisekhbagpashal.com</strong>
                    <br />
                    Website: <strong>www.avisekhbagpashal.com</strong>
                  </p>
                </section>
              </>
            ) : (
              <>
                <p>
                  <strong>प्रभावी मिति:</strong> [मिति राख्नुहोस्]
                </p>

                <h2>१. सर्तहरूको स्वीकृति</h2>
                <p>
                  यी प्रयोगका सर्तहरूले <strong>[Project Name]</strong> को
                  सम्पूर्ण सेवा, सुविधा र सामग्रीको प्रयोग नियमन गर्छन्।
                  प्लेटफर्म प्रयोग गरेर तपाईं कानुनी रूपमा यी सर्तहरूमा बाध्य
                  हुनुहुन्छ।
                </p>

                <h2>२. योग्यता तथा प्रतिनिधित्व</h2>
                <p>
                  सेवा प्रयोग गर्न तपाईं कम्तीमा १३ वर्षको हुनुपर्छ र सम्झौता
                  गर्न सक्षम हुनुपर्छ।
                </p>

                <h2>३. खाता दर्ता तथा सुरक्षा</h2>
                <ul>
                  <li>
                    खाताको गोपनीयता सुरक्षित राख्ने जिम्मा प्रयोगकर्ताको हो
                  </li>
                  <li>अनधिकृत पहुँच तुरुन्त जानकारी गराउनुपर्छ</li>
                  <li>
                    खाताबाट हुने सबै गतिविधिको जिम्मेवारी प्रयोगकर्ताको हुन्छ
                  </li>
                  <li>खाता साझेदारी निषेध गरिएको छ</li>
                </ul>

                <h2>४. स्वीकार्य प्रयोग नीति</h2>
                <ul>
                  <li>अवैध, ठगी वा हानिकारक उद्देश्यका लागि प्रयोग निषेध</li>
                  <li>सुरक्षा प्रणाली तोड्ने प्रयास निषेध</li>
                  <li>सेवामा अवरोध सिर्जना गर्न नपाइने</li>
                  <li>मालिसियस वा अपमानजनक सामग्री अपलोड गर्न नपाइने</li>
                </ul>

                <h2>५. उत्पादन, अर्डर तथा उपलब्धता</h2>
                <p>
                  मूल्य र उपलब्धता परिवर्तन हुन सक्छ। त्रुटि वा शंकास्पद
                  गतिविधिका कारण अर्डर रद्द गर्न सकिन्छ।
                </p>

                <h2>६. भुक्तानी तथा बिलिङ</h2>
                <p>
                  भुक्तानी तेस्रो-पक्ष सेवा मार्फत प्रशोधन गरिन्छ। भुक्तानी
                  विवरण हामी भण्डारण गर्दैनौं।
                </p>

                <h2>७. फिर्ता, रिफन्ड तथा विवाद</h2>
                <p>
                  फिर्ता तथा रिफन्ड नीति उत्पादनअनुसार फरक हुन सक्छ। विवाद समयमै
                  जानकारी गराउनुपर्छ।
                </p>

                <h2>८. AI आधारित सुविधा</h2>
                <p>
                  AI सुविधाहरू सहयोगका लागि मात्र हुन्। प्रदान गरिएका उत्तरहरू
                  पूर्ण रूपमा सही हुने ग्यारेन्टी हुँदैन।
                </p>

                <h2>९. बौद्धिक सम्पत्ति अधिकार</h2>
                <p>
                  सम्पूर्ण सामग्री र सफ्टवेयर <strong>[Project Name]</strong>
                  को स्वामित्वमा रहेको छ।
                </p>

                <h2>१०. खाता निलम्बन वा समाप्ति</h2>
                <p>
                  सर्त उल्लङ्घन वा सुरक्षा जोखिम भएमा खाता बन्द गर्न सकिन्छ।
                </p>

                <h2>११. दायित्व सीमाना</h2>
                <p>
                  कानूनले अनुमति दिएको हदसम्म अप्रत्यक्ष क्षतिप्रति हामी
                  जिम्मेवार हुँदैनौं।
                </p>

                <h2>१२. अस्वीकरण</h2>
                <p>सेवा “जस्ताको तस्तै” उपलब्ध गराइन्छ।</p>

                <h2>१३. बाध्यकारी परिस्थितिहरू</h2>
                <p>
                  प्राकृतिक प्रकोप, नेटवर्क समस्या, वा सरकारी आदेशका कारण सेवा
                  अवरुद्ध भएमा हामी जिम्मेवार हुने छैनौं।
                </p>

                <h2>१४. सर्त परिवर्तन</h2>
                <p>
                  सर्तहरू परिवर्तन हुन सक्छन्। निरन्तर प्रयोगले परिवर्तनप्रति
                  सहमति जनाउँछ।
                </p>

                <h2>१५. लागू हुने कानून</h2>
                <p>यी सर्तहरू नेपालका कानूनअनुसार व्याख्या गरिनेछन्।</p>

                <h2>१६. सम्पर्क</h2>
                <p>
                  इमेल: <strong>[Support Email]</strong>
                  <br />
                  वेबसाइट: <strong>[Domain]</strong>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
