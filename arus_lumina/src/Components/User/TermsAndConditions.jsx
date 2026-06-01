export default function TermsAndConditions() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif", background: "#f9f9f9", minHeight: "100vh", fontSize: 15, color: "#222", lineHeight: 1.7 }}>

      {/* TOP BANNER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", paddingBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 0" }}>
          <h1 style={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: 30, fontWeight: 900, color: "#1a1a2e", textAlign: "center", letterSpacing: -0.5, margin: 0 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 6, paddingBottom: 14 }}>
            <span style={{ color: "#888" }}>Home</span>
            <span style={{ margin: "0 6px", color: "#bbb" }}>›</span>
            <span>Terms &amp; Conditions</span>
          </p>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Main Heading */}
        <h2 style={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: 22, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>
          Terms &amp; condition
        </h2>

        {/* Intro */}
        <p style={{ fontSize: 14, color: "#444", marginBottom: 32, lineHeight: 1.75, borderBottom: "1px solid #ececec", paddingBottom: 24 }}>
          Welcome to <strong style={{ color: "#e91e8c" }}>ARUS LUMINA Pvt. Ltd.</strong> These Terms and Conditions outline the rules and regulations for using our platform, which provides home, shop, office, construction, event, education, and employment services across Bihar. By accessing or using our platform, you agree to comply with these Terms and Conditions. Please read them carefully.
        </p>

        {/* Section 1 */}
        <Section title="1. Definitions">
          <DotList items={[
            <><strong>User:</strong> Any individual or entity accessing or using the platform, including service seekers and service providers.</>,
            <><strong>Services:</strong> All services listed, requested, or delivered through the platform — Skilled Technical, Property &amp; Construction, Event &amp; Personal, Printing &amp; Vehicle, Education &amp; Training, and Booking &amp; Event Management.</>,
            <><strong>Platform:</strong> The ARUS LUMINA Pvt. Ltd. website, mobile application, and all digital or physical touchpoints operated by us.</>,
          ]} />
        </Section>

        <Divider />

        {/* Section 2 */}
        <Section title="2. User Eligibility">
          <SubTitle>To use our platform:</SubTitle>
          <DotList items={[
            "You must be at least 18 years of age or have valid guardian consent to use our services.",
            "You agree to provide accurate and complete information during registration and service requests.",
            "You must comply with all applicable local, state, and national laws and regulations while using our platform.",
            "ARUS LUMINA reserves the right to refuse service to anyone who does not meet eligibility requirements.",
          ]} />
        </Section>

        <Divider />

        {/* Section 3 */}
        <Section title="3. Account Responsibilities">
          <DotList items={[
            "Users are responsible for maintaining the confidentiality of their login credentials and account information.",
            "Any activities conducted under your account are your responsibility, whether authorized by you or not.",
            "Notify us immediately at info@aruslumina.com if you suspect unauthorized access or activity on your account.",
            "ARUS LUMINA will not be liable for any loss arising from unauthorized use of your account due to your negligence.",
          ]} />
        </Section>

        <Divider />

        {/* Section 4 */}
        <Section title="4. Services and Listings">
          <SubTitle>a. Service Providers' Responsibilities:</SubTitle>
          <DotList items={[
            "Ensure the accuracy and completeness of service descriptions, availability, and pricing on the platform.",
            "Comply with all legal and regulatory requirements related to the services you offer.",
            "Avoid posting prohibited, illegal, offensive, or fraudulent services on the platform.",
            "Maintain professional standards and deliver services as agreed with the customer.",
          ]} />
          <SubTitle>b. Service Seekers' Responsibilities:</SubTitle>
          <DotList items={[
            "Conduct appropriate due diligence before booking or purchasing any services.",
            "Ensure timely payment for agreed-upon services as per the terms set by the provider.",
            "Refrain from requesting services that violate laws, regulations, or platform policies.",
            "Treat all service professionals with respect and courtesy at all times.",
          ]} />
        </Section>

        <Divider />

        {/* Section 5 */}
        <Section title="5. Payments & Pricing">
          <DotList items={[
            "All prices displayed are indicative and may vary based on location, service complexity, and provider rates.",
            "Payments must be completed through approved payment methods as specified at the time of booking.",
            "ARUS LUMINA charges a platform service fee which will be clearly communicated before final booking.",
            "Refunds are subject to our Cancellation & Refund Policy and the specific terms agreed upon at booking.",
          ]} />
        </Section>

        <Divider />

        {/* Section 6 */}
        <Section title="6. Cancellation & Refund Policy">
          <DotList items={[
            "Cancellations made 24 hours or more before the scheduled service time are eligible for a full refund.",
            "Cancellations within 24 hours of service may incur a cancellation fee as determined by the service provider.",
            "Refunds for unsatisfactory services will be evaluated on a case-by-case basis by our customer support team.",
            "ARUS LUMINA reserves the right to cancel any booking in case of unavoidable circumstances, with a full refund to the user.",
          ]} />
        </Section>

        <Divider />

        {/* Section 7 */}
        <Section title="7. Intellectual Property">
          <DotList items={[
            "All content on the ARUS LUMINA platform, including logos, text, graphics, and software, is the exclusive property of ARUS LUMINA Pvt. Ltd.",
            "You may not reproduce, distribute, or create derivative works from any content without prior written permission.",
            "User-generated content shared on the platform grants ARUS LUMINA a non-exclusive license to use it for promotional purposes.",
          ]} />
        </Section>

        <Divider />

        {/* Section 8 */}
        <Section title="8. Limitation of Liability">
          <DotList items={[
            "ARUS LUMINA acts as an intermediary platform and is not directly responsible for the quality or outcome of services rendered by third-party providers.",
            "We are not liable for any indirect, incidental, or consequential damages arising from the use of our platform or services.",
            "Our maximum liability in any circumstance shall not exceed the amount paid by the user for that specific service.",
          ]} />
        </Section>

        <Divider />

        {/* Section 9 */}
        <Section title="9. Privacy Policy">
          <DotList items={[
            "We collect and process your personal data in accordance with our Privacy Policy, which forms an integral part of these Terms & Conditions.",
            "Your data is used solely for service delivery, platform improvement, and communication purposes.",
            "We do not sell or share your personal information with third parties except as required by law or for service fulfillment.",
            "You may request deletion or modification of your personal data by contacting us at info@aruslumina.com.",
          ]} />
        </Section>

        <Divider />

        {/* Section 10 */}
        <Section title="10. Governing Law & Dispute Resolution">
          <DotList items={[
            "These Terms & Conditions are governed by the laws of India, with jurisdiction in the courts of Patna, Bihar.",
            "Any disputes arising from the use of our platform will first be attempted to be resolved through mutual negotiation.",
            "If mutual resolution fails, disputes will be referred to arbitration as per the Arbitration and Conciliation Act, 1996.",
            "ARUS LUMINA reserves the right to modify these Terms & Conditions at any time with prior notice to users.",
          ]} />
        </Section>
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