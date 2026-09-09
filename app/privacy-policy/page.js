import Link from 'next/link'
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import { BUSINESS, SITE_URL, waLink } from '@/lib/business'

const EFFECTIVE_DATE = 'June 3, 2026'
const CONTACT_URL = `${SITE_URL}/contact`

export const metadata = {
  title: 'Privacy Policy | Urban Dry Clean',
  description:
    'Urban Dry Clean Privacy Policy — the information we collect, how we use and protect it, your rights, and how to request data deletion (including data obtained via Meta/Facebook/Instagram APIs).',
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | Urban Dry Clean',
    description:
      'How Urban Dry Clean collects, uses and protects your information, and how to request data deletion.',
    url: `${SITE_URL}/privacy-policy`,
    siteName: 'Urban Dry Clean',
    locale: 'en_IN',
    type: 'article',
  },
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl md:text-2xl font-bold text-[#13233A]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <SiteHeader />

      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#0759AD]">Legal</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-[#13233A]">Privacy Policy</h1>
          <p className="mt-3 text-slate-600">
            Effective date: <span className="font-medium text-slate-800">{EFFECTIVE_DATE}</span>
          </p>
          <p className="mt-4 text-[15px] text-slate-700 leading-relaxed">
            This Privacy Policy describes how <strong>{BUSINESS.name}</strong> (“<strong>Urban Dry Clean</strong>”,
            “we”, “us”, “our”) collects, uses, discloses and protects information when you use our website{' '}
            <a href={SITE_URL} className="text-[#0759AD] font-medium hover:underline">{SITE_URL}</a>{' '}
            and our related services (the “Services”), including any features that integrate with{' '}
            Meta Platforms products such as Facebook, Instagram and WhatsApp APIs.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Table of contents */}
        <nav aria-label="On this page" className="mb-10 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="text-sm font-semibold text-[#13233A]">On this page</div>
          <ol className="mt-2 grid gap-x-6 gap-y-1 md:grid-cols-2 list-decimal list-inside text-[13.5px] text-slate-700">
            <li><a href="#who-we-are" className="hover:text-[#0759AD]">Who we are</a></li>
            <li><a href="#information-we-collect" className="hover:text-[#0759AD]">Information we collect</a></li>
            <li><a href="#how-we-use" className="hover:text-[#0759AD]">How we use information</a></li>
            <li><a href="#meta-data" className="hover:text-[#0759AD]">Meta / Facebook / Instagram data</a></li>
            <li><a href="#data-sharing" className="hover:text-[#0759AD]">Data sharing</a></li>
            <li><a href="#data-security" className="hover:text-[#0759AD]">Data security</a></li>
            <li><a href="#data-retention" className="hover:text-[#0759AD]">Data retention</a></li>
            <li><a href="#your-rights" className="hover:text-[#0759AD]">Your rights</a></li>
            <li><a href="#data-deletion" className="hover:text-[#0759AD]"><strong>Data deletion requests</strong></a></li>
            <li><a href="#cookies" className="hover:text-[#0759AD]">Cookies and similar technologies</a></li>
            <li><a href="#third-parties" className="hover:text-[#0759AD]">Third-party services</a></li>
            <li><a href="#children" className="hover:text-[#0759AD]">Children’s privacy</a></li>
            <li><a href="#changes" className="hover:text-[#0759AD]">Changes to this policy</a></li>
            <li><a href="#contact" className="hover:text-[#0759AD]">Contact us</a></li>
          </ol>
        </nav>

        <div className="space-y-10">
          <Section id="who-we-are" title="1. Who we are">
            <p>
              Urban Dry Clean is a professional dry cleaning, laundry and garment care business
              serving {BUSINESS.serviceArea} and nearby areas. This Privacy Policy governs the website{' '}
              <a href={SITE_URL} className="text-[#0759AD] hover:underline">{SITE_URL}</a>{' '}
              and any related pickup booking, communication or account services offered by Urban Dry Clean.
            </p>
            <p><strong>Registered address:</strong> {BUSINESS.address.full}.</p>
          </Section>

          <Section id="information-we-collect" title="2. Information we collect">
            <p>We collect the following categories of information — and only what is necessary to provide our Services:</p>
            <p><strong>a. Information you provide directly</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Mobile / phone number</li>
              <li>Pickup or delivery address</li>
              <li>Preferred pickup date and time</li>
              <li>Order and service details (e.g., items, garment type, special instructions)</li>
              <li>Messages you send to us via our contact form, WhatsApp, phone or email</li>
              <li>Marketing attribution parameters (e.g., <code className="rounded bg-slate-100 px-1">utm_source</code>, <code className="rounded bg-slate-100 px-1">utm_medium</code>, <code className="rounded bg-slate-100 px-1">utm_campaign</code>) present in the referring URL when you land on our site</li>
            </ul>
            <p>
              We do <strong>not</strong> currently collect email addresses or passwords from customers, since bookings
              are made without a customer account. If we introduce customer accounts or optional email
              subscriptions in the future, this policy will be updated accordingly.
            </p>
            <p><strong>b. Information collected automatically</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address of the device used to submit a pickup request or contact us</li>
              <li>Basic device and browser information (user agent, viewport, referring URL) provided by your browser</li>
              <li>Website usage information (pages viewed, time on page, buttons tapped, aggregate analytics events)</li>
              <li>Cookies and similar technologies described in the “Cookies” section below</li>
            </ul>
            <p><strong>c. Information from Meta / Facebook / Instagram APIs</strong> — described separately in Section 4.</p>
            <p className="text-slate-600 text-[14px]">
              We do not knowingly collect any information not listed above. We do not collect government-issued IDs,
              precise real-time location, biometric data, or payment card details on this website — payments for
              services are handled offline at pickup or delivery.
            </p>
          </Section>

          <Section id="how-we-use" title="3. How we use information">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide our dry cleaning, laundry and garment care services</li>
              <li>To schedule, confirm and complete pickups and deliveries</li>
              <li>To communicate with you about your orders, pricing, availability and support requests, primarily via phone and WhatsApp</li>
              <li>To respond to enquiries submitted through our website contact form</li>
              <li>To operate, maintain, secure and improve our website and Services</li>
              <li>To detect, prevent and address technical issues, fraud and abuse</li>
              <li>To measure the effectiveness of our marketing (including tracking which advertising campaign referred a lead, using UTM parameters) and to report anonymous, aggregated performance to advertising platforms</li>
              <li>To comply with applicable legal obligations, respond to lawful requests, and enforce our terms</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal information. We do not use your information for
              automated decision-making that produces legal or similarly significant effects on you.
            </p>
          </Section>

          <Section id="meta-data" title="4. Meta / Facebook / Instagram data">
            <p>
              Urban Dry Clean may integrate with services offered by Meta Platforms, Inc. (including Facebook,
              Instagram and WhatsApp Business messaging). This section explains what Meta-provided data we may
              access, why we access it, and how we handle it. We only enable and use permissions that are strictly
              necessary for the feature you interact with, and we only use Meta-provided data for the purposes
              disclosed in this policy and permitted by applicable Meta policies (including the{' '}
              <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer"
                className="text-[#0759AD] hover:underline">Meta Platform Terms</a>{' '}and{' '}
              <a href="https://developers.facebook.com/devpolicy/" target="_blank" rel="noopener noreferrer"
                className="text-[#0759AD] hover:underline">Developer Policies</a>).
            </p>
            <p><strong>4.1 WhatsApp Business messaging.</strong> Our primary customer channel is WhatsApp. When you tap a “Book Pickup on WhatsApp”, “Message on WhatsApp” or similar link, or when you send us a WhatsApp message, the following information may be processed:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your WhatsApp phone number and profile display name (as visible in the chat)</li>
              <li>The content of messages you send to us, and any media you attach</li>
              <li>Delivery / read status of messages we send you</li>
            </ul>
            <p>This information is used solely to confirm and manage your pickup, answer your questions and provide customer support. Delivery of these messages is subject to WhatsApp’s own privacy policies.</p>
            <p><strong>4.2 Facebook / Instagram login (if enabled).</strong> If we introduce social login on our website, and you choose to sign in with Facebook or Instagram, we may access limited profile information you explicitly authorise, such as your name, profile picture and email address. We do not access your friends list, private posts, or messages, and we do not post on your behalf.</p>
            <p><strong>4.3 Instagram / Facebook Page content (if enabled).</strong> If we display our own Instagram or Facebook Page content on the website (for example a portfolio of before/after photos), we access only our own Business Page or Instagram Business Account content — we do not access personal account content of visitors.</p>
            <p><strong>4.4 Meta Pixel / Conversions API (if enabled).</strong> If enabled for advertising measurement, we may share hashed or coarse event data with Meta (such as page view, contact click, lead submission) to measure the performance of our ads and to reach similar audiences. Where required, we ask for your consent before enabling these tools. You can opt out at any time using the mechanisms described in Section 10 (Cookies).</p>
            <p><strong>4.5 Data handling commitments.</strong> With respect to any data obtained from Meta APIs:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We use it <strong>only</strong> for the purposes described in this policy and permitted by applicable Meta policies.</li>
              <li>We <strong>do not sell</strong> or rent it to any third party.</li>
              <li>We <strong>do not transfer</strong> it to data brokers, advertising networks or any party for their own independent use.</li>
              <li>We store it only for as long as reasonably necessary for the disclosed purposes (see Section 7 — Data retention).</li>
              <li>We provide a clear method to request deletion of such data (see Section 9 — Data deletion requests).</li>
            </ul>
          </Section>

          <Section id="data-sharing" title="5. Data sharing">
            <p>We share your information only in the limited circumstances below:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Service providers</strong> that help us operate our website and business, such as hosting providers (e.g., our cloud hosting vendor), database providers, transactional messaging providers (e.g., WhatsApp Business), and analytics providers. These providers may only process information on our behalf and under confidentiality obligations.</li>
              <li><strong>Delivery / pickup partners</strong> where we engage a third-party rider or partner to collect or deliver your garments — in which case only the minimum information needed (name, phone, address, pickup time) is shared.</li>
              <li><strong>Legal and safety</strong> — where we in good faith believe disclosure is required to comply with a legal obligation, court order or lawful government request, or to protect the rights, property or safety of Urban Dry Clean, our customers or the public.</li>
              <li><strong>Business transfers</strong> — if Urban Dry Clean is involved in a merger, acquisition or sale of all or a portion of its assets, personal information may be transferred as part of that transaction. We will notify you of any change in ownership or use of your personal information.</li>
            </ul>
            <p>We do not sell your personal information, and we do not share Meta-provided data with third parties for their own independent use.</p>
          </Section>

          <Section id="data-security" title="6. Data security">
            <p>
              We implement reasonable technical and organisational safeguards designed to protect personal
              information against unauthorised access, alteration, disclosure or destruction. These include HTTPS
              in transit, access-controlled databases, hashed administrator passwords, and role-restricted admin
              interfaces. No method of transmission or storage is 100% secure; while we work to protect your
              information, we cannot guarantee absolute security.
            </p>
          </Section>

          <Section id="data-retention" title="7. Data retention">
            <p>We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide the Services you requested (e.g., completing your pickup and delivery)</li>
              <li>To keep records required for accounting, tax, warranty or dispute-resolution purposes under applicable law</li>
              <li>To maintain reasonable business and security logs</li>
            </ul>
            <p>Pickup requests and contact-form submissions are typically retained for up to 24 months after your last interaction, unless a longer period is required by law or a shorter deletion is requested by you (see Section 9). Meta-provided data is deleted or anonymised when it is no longer needed for the purpose for which it was obtained, or upon a valid deletion request.</p>
          </Section>

          <Section id="your-rights" title="8. Your rights">
            <p>Subject to applicable law, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your information (see Section 9)</li>
              <li>Withdraw consent where we rely on consent to process your information (this does not affect processing already carried out)</li>
              <li>Object to or restrict certain processing</li>
              <li>Lodge a complaint with the appropriate data-protection authority in your jurisdiction</li>
            </ul>
            <p>To exercise any of these rights, please contact us using the details in Section 14. We may need to verify your identity before acting on a request.</p>
          </Section>

          <Section id="data-deletion" title="9. Data deletion requests (Meta / API data)">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:p-5">
              <p className="text-[15px] text-emerald-900">
                <strong>How to request deletion of your data</strong>, including any information we may have received
                through Meta / Facebook / Instagram / WhatsApp APIs:
              </p>
              <p className="mt-2 text-[15px] text-emerald-900">
                Send us a deletion request using any one of the working contact channels below. Include the phone
                number and/or WhatsApp number you used with us, and clearly mention <em>“Data deletion request”</em>.
                We will confirm receipt within a reasonable time and complete the deletion of your personal
                information within <strong>30 days</strong>, except where we are legally required to retain certain
                records.
              </p>

              <ul className="mt-4 space-y-2 text-[15px] text-emerald-900">
                <li className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 mt-1 shrink-0" />
                  <span>
                    <strong>WhatsApp:</strong>{' '}
                    <a href={waLink('Hello Urban Dry Clean, I would like to submit a data deletion request. Please delete all information you hold about me.')}
                      target="_blank" rel="noopener noreferrer" className="underline">
                      {BUSINESS.phone}
                    </a>{' '}
                    (recommended — fastest)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 shrink-0" />
                  <span>
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${BUSINESS.phoneRaw}`} className="underline">{BUSINESS.phone}</a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 shrink-0" />
                  <span>
                    <strong>Website contact form:</strong>{' '}
                    <a href={CONTACT_URL} className="underline">{CONTACT_URL}</a> — select any service and mention “Data deletion request” in the message field.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 shrink-0" />
                  <span>
                    <strong>Postal:</strong> Urban Dry Clean, {BUSINESS.address.full}
                  </span>
                </li>
              </ul>

              <p className="mt-4 text-[13.5px] text-emerald-900/90">
                Once we complete a deletion request, we will remove your personal information from our production
                database and retain only the minimum records required by law (for example, invoices required for
                accounting). Backups are rotated regularly and residual data in backups will be overwritten in the
                normal course of operations.
              </p>
            </div>
          </Section>

          <Section id="cookies" title="10. Cookies and similar technologies">
            <p>Our website uses a small number of cookies and similar technologies:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential cookies</strong> — required for basic site operation and for our administrator area (session cookies).</li>
              <li><strong>Preference storage</strong> — the browser’s <code className="rounded bg-slate-100 px-1">sessionStorage</code> may be used to remember marketing attribution (UTM parameters) during your visit so we can attribute a lead you submit.</li>
              <li><strong>Analytics</strong> — if enabled, standard analytics tools (such as Google Analytics or Meta Pixel) may set cookies to measure aggregate usage of our website. We do not use these to build cross-site advertising profiles of individual users beyond what is disclosed in this policy.</li>
            </ul>
            <p>You can control cookies at the browser level (block, delete, or receive alerts when cookies are set). Disabling essential cookies may affect the functionality of parts of the site.</p>
          </Section>

          <Section id="third-parties" title="11. Third-party services">
            <p>Our website relies on the following categories of third-party providers. Their use of information they process on our behalf is governed by their own privacy policies:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cloud infrastructure and database hosting provider (used to serve the website and store bookings)</li>
              <li>Domain and DNS provider</li>
              <li>WhatsApp Business (Meta) — for customer conversations initiated via WhatsApp links</li>
              <li>Optional advertising and analytics platforms (e.g., Google Ads, Google Analytics, Meta Pixel) — enabled where applicable and disclosed in this policy</li>
              <li>Map providers (for showing our business location on the Contact page)</li>
            </ul>
            <p>We do not include social sharing widgets or third-party trackers beyond what is described above.</p>
          </Section>

          <Section id="children" title="12. Children’s privacy">
            <p>
              Our Services are intended for adults (18 years and above) and for parents or guardians booking on
              behalf of their household. We do not knowingly collect personal information from children under 13.
              If you believe a child under 13 has provided personal information to us, please contact us and we
              will promptly delete such information.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to this Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
              legal requirements or for other operational reasons. When we make material changes, we will update
              the “Effective date” at the top of this page. We encourage you to review this page periodically.
            </p>
          </Section>

          <Section id="contact" title="14. Contact us">
            <p>If you have any questions about this Privacy Policy or our privacy practices, or wish to exercise any of your rights, please contact us:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Business:</strong> {BUSINESS.name}</li>
              <li><strong>WhatsApp:</strong>{' '}
                <a href={waLink('Hello Urban Dry Clean, I have a privacy question.')} target="_blank" rel="noopener noreferrer" className="text-[#0759AD] hover:underline">
                  {BUSINESS.phone}
                </a>
              </li>
              <li><strong>Phone:</strong>{' '}
                <a href={`tel:${BUSINESS.phoneRaw}`} className="text-[#0759AD] hover:underline">{BUSINESS.phone}</a>
              </li>
              <li><strong>Website contact form:</strong>{' '}
                <a href={CONTACT_URL} className="text-[#0759AD] hover:underline">{CONTACT_URL}</a>
              </li>
              <li><strong>Postal address:</strong> {BUSINESS.address.full}</li>
            </ul>
          </Section>
        </div>

        <p className="mt-12 text-[13px] text-slate-500 text-center">
          This Privacy Policy is provided for informational purposes and does not constitute legal advice. For
          jurisdiction-specific questions, please consult a qualified legal professional.
        </p>
      </div>

      <SiteFooter />
    </main>
  )
}
