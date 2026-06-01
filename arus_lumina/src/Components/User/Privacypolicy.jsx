export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", background: "#f9f9f9", minHeight: "100vh", fontSize: 15, color: "#222", lineHeight: 1.7 }}>

      {/* TOP BANNER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 0" }}>
          <h1 style={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: 30, fontWeight: 900, color: "#1a1a2e", textAlign: "center", letterSpacing: -0.5, margin: 0 }}>
            Privacy Policy
          </h1>
          <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 6, paddingBottom: 14 }}>
            <span style={{ color: "#888" }}>Home</span>
            <span style={{ margin: "0 6px", color: "#bbb" }}>›</span>
            <span>Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Main Heading */}
        <h2 style={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: 22, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>
          Privacy Policy
        </h2>

        {/* Intro */}
        <p style={{ fontSize: 14, color: "#444", marginBottom: 32, lineHeight: 1.75, borderBottom: "1px solid #ececec", paddingBottom: 24 }}>
          Welcome to <strong style={{ color: "#e91e8c" }}>ARUS LUMINA Pvt. Ltd.</strong> We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you disagree with its terms, please discontinue use of our platform.
        </p>

        {/* Section 1 */}
        <Section title="1. Information We Collect">
          <SubTitle>a. Information You Provide to Us:</SubTitle>
          <DotList items={[
            <><strong>Personal Identification:</strong> Name, email address, phone number, and date of birth provided during registration.</>,
            <><strong>Address Details:</strong> Home, office, or service location address for service delivery purposes.</>,
            <><strong>Payment Information:</strong> Bank account details, UPI ID, or card information for processing transactions (stored securely via payment gateways).</>,
            <><strong>Service Requests:</strong> Details of services requested, preferences, special instructions, and feedback.</>,
            <><strong>Identity Verification:</strong> Government-issued ID or Aadhaar details (for service providers) as required for verification.</>,
          ]} />
          <SubTitle>b. Information Collected Automatically:</SubTitle>
          <DotList items={[
            "Device information such as IP address, browser type, operating system, and device identifiers.",
            "Usage data including pages visited, time spent, links clicked, and features used on our platform.",
            "Location data (with your permission) to match you with nearby service providers.",
            "Cookies and similar tracking technologies to enhance your browsing experience.",
          ]} />
        </Section>

        <Divider />

        {/* Section 2 */}
        <Section title="2. How We Use Your Information">
          <SubTitle>We use the information we collect to:</SubTitle>
          <DotList items={[
            "Create and manage your account, and verify your identity on the platform.",
            "Connect you with relevant service providers based on your location and service requirements.",
            "Process bookings, payments, and send transactional notifications (SMS, email, WhatsApp).",
            "Provide customer support and resolve disputes between service seekers and providers.",
            "Send promotional offers, service updates, and platform announcements (you may opt out at any time).",
            "Improve our platform through analytics, research, and user feedback.",
            "Comply with legal obligations and enforce our Terms & Conditions.",
            "Detect, prevent, and address fraud, security breaches, or other illegal activity.",
          ]} />
        </Section>

        <Divider />

        {/* Section 3 */}
        <Section title="3. Sharing of Your Information">
          <p style={{ fontSize: 14, color: "#444", marginBottom: 12, lineHeight: 1.7 }}>
            We do not sell your personal information. We may share your data only in the following circumstances:
          </p>
          <DotList items={[
            <><strong>Service Providers:</strong> We share necessary details (name, contact, address) with service professionals to fulfill your booking.</>,
            <><strong>Payment Partners:</strong> Payment processors and banking partners receive transaction data to complete financial operations.</>,
            <><strong>Legal Authorities:</strong> We may disclose information when required by law, court order, or government regulation.</>,
            <><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</>,
            <><strong>Analytics Partners:</strong> Anonymized, aggregated data may be shared with analytics providers to improve our services.</>,
          ]} />
        </Section>

        <Divider />

        {/* Section 4 */}
        <Section title="4. Cookies & Tracking Technologies">
          <DotList items={[
            "We use cookies to remember your preferences, keep you logged in, and understand how you use our platform.",
            "Session cookies are deleted when you close your browser; persistent cookies remain until you delete them or they expire.",
            "You can control cookie settings through your browser preferences. Disabling cookies may affect some platform features.",
            "We may use third-party analytics tools (e.g., Google Analytics) that place cookies on your device to help us analyze usage patterns.",
          ]} />
        </Section>

        <Divider />

        {/* Section 5 */}
        <Section title="5. Data Storage & Security">
          <DotList items={[
            "Your data is stored on secure servers located within India, in compliance with applicable data protection laws.",
            "We implement industry-standard security measures including SSL encryption, firewalls, and access controls.",
            "Payment data is encrypted and processed through PCI-DSS compliant payment gateways — we do not store full card details.",
            "While we take all reasonable precautions, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
            "In the event of a data breach that affects your personal information, we will notify you as required by applicable law.",
          ]} />
        </Section>

        <Divider />

        {/* Section 6 */}
        <Section title="6. Data Retention">
          <DotList items={[
            "We retain your personal data for as long as your account is active or as needed to provide you services.",
            "After account deletion, we may retain certain data for up to 3 years to comply with legal obligations and resolve disputes.",
            "Transaction and booking records are retained for 5 years as required under Indian tax and financial regulations.",
            "You may request early deletion of your data by contacting us, subject to legal retention requirements.",
          ]} />
        </Section>

        <Divider />

        {/* Section 7 */}
        <Section title="7. Your Rights & Choices">
          <SubTitle>As a user of ARUS LUMINA, you have the right to:</SubTitle>
          <DotList items={[
            <><strong>Access:</strong> Request a copy of the personal data we hold about you.</>,
            <><strong>Correction:</strong> Update or correct any inaccurate or incomplete information in your account.</>,
            <><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</>,
            <><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time via the unsubscribe link or by contacting us.</>,
            <><strong>Data Portability:</strong> Request your data in a structured, machine-readable format.</>,
            <><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis, without affecting prior processing.</>,
          ]} />
          <p style={{ fontSize: 14, color: "#444", marginTop: 12, lineHeight: 1.7 }}>
            To exercise any of these rights, contact us at <strong>info@aruslumina.com</strong> or call <strong>7360050505</strong>. We will respond within 30 days.
          </p>
        </Section>

        <Divider />

        {/* Section 8 */}
        <Section title="8. Third-Party Links & Services">
          <DotList items={[
            "Our platform may contain links to third-party websites or integrate third-party services (e.g., payment gateways, maps).",
            "We are not responsible for the privacy practices of third-party websites. We encourage you to read their privacy policies.",
            "Third-party service providers engaged by ARUS LUMINA are contractually required to protect your data and use it only for specified purposes.",
          ]} />
        </Section>

        <Divider />

        {/* Section 9 */}
        <Section title="9. Children's Privacy">
          <DotList items={[
            "Our platform is not directed to individuals under the age of 18. We do not knowingly collect personal data from minors.",
            "If we become aware that a minor has provided us personal information without parental consent, we will delete such data promptly.",
            "Parents or guardians who believe their child has submitted personal data to us should contact us immediately at info@aruslumina.com.",
          ]} />
        </Section>

        <Divider />

        {/* Section 10 */}
        <Section title="10. Changes to This Privacy Policy">
          <DotList items={[
            "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements.",
            "When we make material changes, we will notify you via email, SMS, or a prominent notice on our platform before the changes take effect.",
            "The 'Last Updated' date at the bottom of this page will always reflect the most recent revision.",
            "Your continued use of the platform after any changes constitutes your acceptance of the updated Privacy Policy.",
          ]} />
        </Section>

        <Divider />

        {/* Section 11 */}
        <Section title="11. Contact Us">
          <p style={{ fontSize: 14, color: "#444", marginBottom: 12, lineHeight: 1.7 }}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <DotList items={[
            <><strong>Company:</strong> ARUS LUMINA Pvt. Ltd.</>,
            <><strong>Address:</strong> Patna, Bihar (Services available across all districts of Bihar)</>,
            <><strong>Email:</strong> info@aruslumina.com</>,
            <><strong>Phone:</strong> 7360050505</>,
            <><strong>Website:</strong> www.aruslumina.com</>,
          ]} />
        </Section>

        {/* Last Updated */}
        <p style={{ fontSize: 13, color: "#888", marginTop: 8, marginBottom: 0 }}>
          <strong>Last Updated:</strong> June 2026
        </p>



      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h3 style={{
        fontFamily: "'Merriweather', 'Georgia', serif",
        fontSize: 16,
        fontWeight: 700,
        color: "#1a1a2e",
        marginBottom: 10,
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function SubTitle({ children }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 700, color: "#333", margin: "14px 0 8px" }}>
      {children}
    </p>
  );
}

function DotList({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#444", marginBottom: 8, lineHeight: 1.65 }}>
          <span style={{
            flexShrink: 0,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#e91e8c",
            marginTop: 4,
            opacity: 0.85,
            display: "inline-block",
          }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #ececec", margin: "28px 0" }} />;
}