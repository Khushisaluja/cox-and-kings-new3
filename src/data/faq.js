/* ============================================================================
   FAQ content — taken verbatim from the live site (coxandkings.com/faq),
   45 questions across 7 topics. Only obvious typos fixed (missing spaces);
   the social-media answer is broken onto one line per platform so it can be
   rendered with `white-space: pre-line` instead of as a run-on sentence.

   `blurb` is the one line of new copy per topic — the group header of the
   /about-us2/team layout expects it.
   ========================================================================== */

export const FAQ_TOPICS = [
  {
    id: 'general',
    name: 'General',
    blurb: 'The company, its new ownership, and how to reach us.',
    items: [
      {
        q: 'What happened to Cox & Kings in the past?',
        a: 'Cox & Kings entered insolvency under its previous management in 2019. In 2024, the brand was acquired through a transparent, court-supervised NCLT process by Wilson & Hughes, a private equity firm with a strong operational legacy. Since resuming operations in 2025, Cox & Kings has been operating under new ownership and has already served over 10,000 travellers.',
      },
      {
        q: 'Who owns Cox & Kings now?',
        a: 'Cox & Kings is owned by Wilson & Hughes, a Singapore-based private equity firm with a strong legacy in manufacturing and operations. The brand was acquired in 2024 through a transparent, court-supervised NCLT process and now operates under new ownership and management, with no liabilities carried forward from the previous entity.',
      },
      {
        q: 'Is the current Cox & Kings the same company that went bankrupt?',
        a: 'No. The current Cox & Kings operates under an entirely new ownership and management. The brand was acquired in 2024 by Wilson & Hughes, a Singapore-based private equity firm, through a transparent, court-supervised NCLT process. It is a completely new operating entity with no liabilities carried forward from the previous management.',
      },
      {
        q: 'What is the background of Wilson & Hughes?',
        a: 'Wilson & Hughes is a private investment group with a strong legacy in manufacturing and operations. Its portfolio includes Alliance World, one of the world’s largest soap manufacturers with over 90 years of legacy, and Duraton Cement, which manufactures cement and construction materials for some of India’s largest infrastructure players. Cox & Kings is its first venture into the travel and experience sector.',
      },
      {
        q: 'Will the new Cox & Kings settle past refunds, payments, or dues?',
        a: 'No. The current Cox & Kings is a new entity and does not carry forward liabilities from the previous business. The brand was acquired from the liquidator through a formal insolvency process and operates independently, with no connection to the previous company’s management, operations, or financial obligations.',
      },
      {
        q: "Where is Cox & Kings' office located?",
        a: 'Our head office is located in Delhi, India. You can visit us or contact us through our website www.coxandkings.com for detailed address information.',
      },
      {
        q: 'Do you have offices elsewhere in India?',
        a: 'Our head office is located in Delhi, India. We also have a network of Cox & Kings retail offices across Faridabad, Gurugram, Dharamshala, Agra, Surat, Ahmedabad, Rajkot, Jamnagar, Kanpur, Nashik, Belgaum, Rajahmundry, and Bhopal (2 locations).',
      },
      {
        q: 'How can I contact Cox & Kings customer support?',
        a: 'You can reach our customer support team via phone, email, or through the contact form on our website. Our team is available to assist you with all your travel needs.',
      },
      {
        q: 'Where can I find Cox & Kings on social media?',
        a: 'You can find Cox & Kings on the following platforms:\nInstagram: @coxandkingsin\nFacebook: facebook.com/coxandkings\nPinterest: pinterest.com/coxandkingsin\nYouTube: @coxandkingsindia\nLinkedIn: linkedin.com/company/cox-&-kings',
      },
    ],
  },
  {
    id: 'flights-fares',
    name: 'Flights and Fares',
    blurb: 'What flying with a package includes, and what it protects you from.',
    items: [
      {
        q: 'Are flights included in tour packages?',
        a: 'Most of our tour packages include international and domestic flights. However, some packages offer land-only options. Please check individual tour details for specific inclusions.',
      },
      {
        q: 'Can I choose my preferred airline?',
        a: 'We work with reputable airlines to offer the best routes and timings. While we accommodate preferences where possible, final airline selection depends on availability and package terms.',
      },
      {
        q: 'What class of travel is included in the package?',
        a: 'Standard packages typically include economy class flights. Premium and luxury packages may include business or first class. Upgrades are available on request.',
      },
      {
        q: 'Can I use my frequent flyer miles?',
        a: 'As flights are part of group bookings, frequent flyer miles typically cannot be earned or redeemed. However, you can discuss options with our team for customized packages.',
      },
      {
        q: 'What if flight prices increase after booking?',
        a: 'Once your booking is confirmed and payment is made, you are protected from any fare increases. The price you pay at booking is guaranteed.',
      },
      {
        q: 'Are airport taxes included in the tour price?',
        a: 'Yes, all airport taxes, fuel surcharges, and applicable fees are included in the tour price unless specifically mentioned otherwise.',
      },
    ],
  },
  {
    id: 'booking-payment',
    name: 'Booking and Payment',
    blurb: 'How to book, how to pay, and how your money is protected.',
    items: [
      {
        q: 'How do I book a tour with Cox & Kings?',
        a: 'You can book online through our website, call our customer service team, or visit one of our offices. Our travel experts will guide you through the booking process.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit cards, debit cards, net banking, UPI, and bank transfers. Payment plans may be available for certain packages.',
      },
      {
        q: 'Is a deposit required to confirm my booking?',
        a: 'Yes, a deposit is required at the time of booking. The amount varies by tour and destination. The balance payment is typically due 45-60 days before departure.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes, we offer flexible payment plans for select tours. Contact our team to discuss installment options that suit your budget.',
      },
      {
        q: 'Will I receive a booking confirmation?',
        a: 'Yes, you will receive a detailed booking confirmation via email within 24-48 hours of making your deposit, including your itinerary and payment schedule.',
      },
      {
        q: 'Is my payment secure?',
        a: 'Absolutely. We use industry-standard encryption and secure payment gateways to protect your financial information.',
      },
    ],
  },
  {
    id: 'accommodation-meals',
    name: 'Accommodation and Meals',
    blurb: 'Where you stay, what you eat, and how to tailor both.',
    items: [
      {
        q: 'What type of accommodation is provided?',
        a: 'We carefully select hotels ranging from comfortable 3-star to luxury 5-star properties, depending on your package. All accommodations meet our quality standards.',
      },
      {
        q: 'Can I request a specific room type?',
        a: "Yes, you can request twin, double, or single rooms. Single room supplements apply. We'll do our best to accommodate your preferences subject to availability.",
      },
      {
        q: 'Are meals included in the tour package?',
        a: 'Most packages include daily breakfast. Some tours also include select lunches and dinners. Check your specific itinerary for meal inclusions.',
      },
      {
        q: 'Can you accommodate dietary restrictions?',
        a: 'Yes, we can accommodate vegetarian, vegan, gluten-free, and other dietary requirements. Please inform us at the time of booking.',
      },
      {
        q: "What if I don't like the hotel?",
        a: 'We select hotels based on location, comfort, and quality. If you have concerns, please speak with your tour manager who will assist you.',
      },
      {
        q: 'Can I extend my hotel stay?',
        a: 'Yes, pre and post-tour hotel extensions can be arranged. Contact us in advance to add extra nights at special rates.',
      },
    ],
  },
  {
    id: 'transport-visa',
    name: 'Transport, Visa and Insurance',
    blurb: 'Getting around, getting cleared to travel, and staying covered.',
    items: [
      {
        q: 'What transportation is included in tours?',
        a: 'Tours include comfortable, air-conditioned coaches for group transfers, sightseeing, and intercity travel. Private transfers may be included in premium packages.',
      },
      {
        q: 'Do you provide visa assistance?',
        a: 'Yes, we provide comprehensive visa support including documentation guidance, application assistance, and appointment scheduling for most destinations.',
      },
      {
        q: 'What documents do I need for visa application?',
        a: "Requirements vary by destination but typically include a valid passport, photographs, application forms, and supporting documents. We'll provide a detailed checklist.",
      },
      {
        q: 'Is travel insurance included?',
        a: 'Basic travel insurance is included in most packages. We also offer comprehensive insurance upgrades covering medical emergencies, trip cancellation, and lost baggage.',
      },
      {
        q: 'Should I purchase additional insurance?',
        a: 'We highly recommend comprehensive travel insurance for international trips, covering medical emergencies, trip interruption, and personal belongings.',
      },
      {
        q: 'What if my visa is rejected?',
        a: 'If your visa is rejected, cancellation terms apply. We recommend purchasing travel insurance that covers visa rejection for added protection.',
      },
    ],
  },
  {
    id: 'tailor-made',
    name: 'Tailor-Made Holidays',
    blurb: 'Journeys designed entirely around you, from scratch.',
    items: [
      {
        q: 'Can I customize a tour itinerary?',
        a: 'Absolutely! We specialize in creating tailor-made holidays designed around your preferences, interests, and budget. Contact our team to start planning.',
      },
      {
        q: 'How does the customization process work?',
        a: "Share your travel dreams with us, and our experts will craft a personalized itinerary. We'll refine it based on your feedback until it's perfect.",
      },
      {
        q: 'Is there a minimum group size for private tours?',
        a: 'No minimum! We create private tours for solo travelers, couples, families, and groups of any size.',
      },
      {
        q: 'Are tailor-made tours more expensive?',
        a: 'Tailor-made tours offer flexibility and personalization. While they may have different pricing than group tours, we work within your budget to create the best experience.',
      },
      {
        q: 'Can I combine multiple destinations?',
        a: 'Yes! We can create multi-country itineraries combining your desired destinations into one seamless journey.',
      },
      {
        q: 'How far in advance should I book a custom tour?',
        a: 'We recommend booking 3-6 months in advance for international trips to ensure availability and best rates, though we can accommodate shorter timelines.',
      },
    ],
  },
  {
    id: 'cancellation-refunds',
    name: 'Cancellation and Refunds',
    blurb: 'The rules if plans change — yours or ours.',
    items: [
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellation charges vary by tour and timing. Generally, cancellations made 60+ days before departure incur lower fees. Please refer to your booking terms for specific details.',
      },
      {
        q: 'Can I get a full refund if I cancel?',
        a: 'Full refunds are typically available only if you cancel within the cooling-off period (usually 24-48 hours of booking) and the departure is more than 60 days away.',
      },
      {
        q: 'What if I need to cancel due to medical emergency?',
        a: 'Medical emergencies are handled case-by-case. Travel insurance typically covers such situations. Contact us immediately with documentation for assistance.',
      },
      {
        q: 'Can I transfer my booking to someone else?',
        a: 'Yes, booking transfers are possible subject to airline and hotel policies. Transfer fees and any fare differences will apply.',
      },
      {
        q: 'How long does it take to process refunds?',
        a: 'Refunds are processed within 15-30 business days after cancellation, depending on your payment method and bank processing times.',
      },
      {
        q: 'What if Cox & Kings cancels my tour?',
        a: "If we cancel a tour, you'll receive a full refund or the option to transfer to another departure date or tour at no additional cost.",
      },
    ],
  },
];
