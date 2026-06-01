import { useState } from "react";

/**
 * FAQ Section — Arus Lumina Pvt. Ltd.
 * ─────────────────────────────────────
 * Template: matches the Truelysell-style FAQ (centered header + accordion rows)
 * Content:  based on Arus Lumina company details
 *
 * Prerequisites:
 *  1. Tailwind CSS configured in your project.
 *  2. Plus Jakarta Sans font in index.html:
 *     <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
 */

const faqs = [
  {
    question: "What is Arus Lumina Pvt. Ltd. and what does it do?",
    answer:
      "Arus Lumina Pvt. Ltd. is a modern Multi-Service Platform — 'Har Seva Ek Chhat Ke Neeche' (All Services Under One Roof). We connect customers with skilled professionals for home, shop, office, construction, events, education, and employment needs — all with one call, at affordable prices.",
  },
  {
    question: "What types of services does Arus Lumina offer?",
    answer:
      "We offer a wide range of services including: Skilled Technical Services (Electrician, Plumber, Carpenter, Painter, Electronic Repair), Property & Construction Services (Builder, Labour, Tiles/Marble), Event & Personal Services (Decoration, Catering, Photography, Cleaning, Pandit Ji, Barber, Tailor, Washerman), Printing & Vehicle Services, Education & Training, and Booking & Event Management.",
  },
  {
    question: "How do I book a service or contact Arus Lumina?",
    answer:
      "Simply call or WhatsApp us at 7360050505. You can also reach us at info@aruslumina.com or visit www.aruslumina.com. Our team is available 24×7 to assist you. One call is all it takes — 'Ek Call Karein, Sabhi Sevayein Paaein!'",
  },
  {
    question: "Where is Arus Lumina available?",
    answer:
      "We are based in Patna, Bihar and currently serve all districts across Bihar. Our goal is to expand pan-India so that every customer has access to trusted, affordable, and on-time services from verified professionals.",
  },
  {
    question: "Are the service providers verified and trustworthy?",
    answer:
      "Yes. All our service professionals are background-verified and experienced. We take pride in providing trusted services (Bharosemand Seva) with 100% customer satisfaction guarantee. Our experienced team ensures quality, punctuality, and safety on every job.",
  },
  {
    question: "What are the service charges? Are the prices affordable?",
    answer:
      "Arus Lumina offers competitive and affordable pricing (Kifayati Daren) for all services. Charges vary by service type and scope of work. We believe every customer — from home to office — deserves quality service at a fair price. Contact us for a free quote on any service.",
  },
  {
    question: "Does Arus Lumina offer education and skill development services?",
    answer:
      "Yes! We offer Home Tutor services for all subjects, Skill Development programs (Computer Courses, Tally, Digital Marketing, Communication Skills), and Arts & Music classes (Guitar, Dance, Painting, and more). Job-oriented training programs are also available to help you build a better future.",
  },
  {
    question: "Can Arus Lumina help with event planning and venue booking?",
    answer:
      "Absolutely! We provide complete event solutions including Decoration, Catering, Photography & Videography, and Cleaning Services. For venue booking, we assist with Banquet Hall Booking (weddings, parties, conferences) and Party Zone Booking (birthday parties, anniversary events, corporate events, and theme parties).",
  },
];

// Chevron icon
function ChevronUp({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="w-full bg-white py-16 sm:py-20 px-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          {/* Decorative dot — matches the pink circle in the template */}
          <span
            className="inline-block w-3 h-3 rounded-full mb-3 opacity-70"
            style={{ background: "linear-gradient(135deg, #e91e8c, #6c63ff)" }}
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            FAQ
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            Everything you need to know about Arus Lumina Pvt. Ltd. — your trusted
            multi-service platform.
          </p>
        </div>

        {/* ── Accordion ── */}
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="group">

                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left
                             hover:bg-pink-50 hover:px-3 transition-all duration-200 rounded-sm"
                >
                  <span
                    className={`text-sm sm:text-[15px] font-bold leading-snug transition-colors duration-200 ${
                      isOpen ? "text-pink-600" : "text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Animated icon */}
                  <span
                    className={`flex-shrink-0 w-[22px] h-[22px] rounded-full border flex items-center justify-center
                                transition-all duration-300 ${
                                  isOpen
                                    ? "border-transparent text-white"
                                    : "border-gray-200 text-gray-400"
                                }`}
                    style={
                      isOpen
                        ? { background: "linear-gradient(135deg, #e91e8c, #6c63ff)" }
                        : {}
                    }
                  >
                    <ChevronUp
                      className={`w-3 h-3 transition-transform duration-300 ${
                        isOpen ? "rotate-0" : "rotate-180"
                      }`}
                    />
                  </span>
                </button>

                {/* Answer panel — CSS max-height transition */}
                <div
                  className="overflow-hidden transition-all duration-350 ease-in-out"
                  style={{ maxHeight: isOpen ? "400px" : "0px" }}
                >
                  <div className="pb-5 px-1">
                    <p
                      className="text-sm text-gray-500 font-medium leading-relaxed pl-4"
                      style={{
                        borderLeft: "3px solid",
                        borderImage: "linear-gradient(180deg, #e91e8c, #6c63ff) 1",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── CTA strip (optional) ── */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Still have questions?{" "}
            <a
              href="tel:7360050505"
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, #e91e8c, #6c63ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Call us: 7360050505
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}