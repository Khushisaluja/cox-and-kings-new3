/* ============================================================================
   Cox & Kings — Terms & Conditions content model  (rendered by /pages/Terms.jsx)

   The live page (coxandkings.com/info/terms-condition) is one long wall of 32
   headings with no way to skim, search, or tell where you are. This file keeps
   the SAME legal text, but structures it so the page can:

     - group the 32 sections into 7 themed clusters for a skimmable left rail,
     - build a scroll-spy table of contents from the ids,
     - run an instant client-side search over the plain text of every block.

   Nothing here is prose the site invented — it is the published policy,
   transcribed. Blocks are typed so the renderer never has to parse strings:

     { k:'p',  v:'…' }                     paragraph
     { k:'h',  v:'…' }                     sub-heading inside a section
     { k:'ul', v:['…','…'] }               bulleted list
     { k:'ol', v:['…','…'] }               numbered list (1., 2., 3. …)
     { k:'table', head:[…], rows:[[…]] }   a rate / schedule table
     { k:'note', title:'…', v:'…', items:[…] }   a highlighted advisory box

   `group` on each section maps it to one entry in GROUP_ORDER, which drives the
   order and headings of the left-rail navigation.
   ========================================================================== */

export const TERMS_META = {
  effective: 'July 31, 2026',
  updated: 'July 31, 2026',
  entity: 'Wilson & Hughes India Private Limited',
  brand: 'Cox & Kings',
};

export const TERMS_INTRO =
  'This website is offered to you on the condition that you accept, without ' +
  'modification, all the terms, conditions, and notices contained herein. By ' +
  'using this website, you agree to be bound by these terms, which may be ' +
  'amended from time to time without prior notice. You further agree to review ' +
  'and comply with all applicable Terms of Use, policies, and guidelines as ' +
  'posted on this website.';

/* The seven clusters the 32 sections fall into, in reading order. Each `id`
   here is a section id below; the label is what the left rail shows above them. */
export const GROUP_ORDER = [
  { key: 'website', label: 'Using this website' },
  { key: 'booking', label: 'Booking & payments' },
  { key: 'tax', label: 'Taxes (TCS)' },
  { key: 'changes', label: 'Changes, cancellations & refunds' },
  { key: 'tour', label: 'On your tour' },
  { key: 'group', label: 'Group departures' },
  { key: 'legal', label: 'Legal & privacy' },
];

export const TERMS = [
  /* ------------------------------------------------------------ website ---- */
  {
    id: 'terms-of-use',
    title: 'Terms of Use',
    group: 'website',
    blocks: [
      { k: 'p', v: 'This page outlines the Terms and Conditions governing the use of services provided under the Cox & Kings brand — a legacy with goodwill since 1758 — operated by Wilson & Hughes India Private Limited through the domain www.coxandkings.com, which provides access to and use of this website. By accessing or using this Website, you are deemed to have read, understood, and agreed to be legally bound by the terms set forth herein. These terms constitute a binding agreement between you and Wilson & Hughes India Private.' },
      { k: 'p', v: 'If you do not agree with any of these terms, you are advised not to use or access this Website.' },
      { k: 'p', v: 'For the purposes of this User Agreement, the terms “You” or “User” shall mean any natural or legal person who has agreed to become a registered user of the Website by providing the required registration data, accepting the electronic version of this User Agreement, and creating a unique identification account, including a user ID and password.' },
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility to Use',
    group: 'website',
    blocks: [
      { k: 'p', v: 'Access to and use of the Website is permitted only to persons who are competent to enter into a legally binding contract as per the provisions of the Indian Contract Act, 1872. Persons who are “incompetent to contract” under the Act, including minors, un-discharged insolvents, or persons of unsound mind, are not eligible to use the Website. Wilson and Hughes India Private Limited reserves the right to terminate your access if it becomes aware that you are not eligible to contract under the applicable law.' },
    ],
  },
  {
    id: 'license',
    title: 'License to Use',
    group: 'website',
    blocks: [
      { k: 'p', v: 'Wilson & Hughes India Private Limited grants you a limited, non-exclusive, non-transferable, and revocable license to use the Website strictly in accordance with the terms of this User Agreement. You may use this Website only for lawful purposes and for making genuine travel bookings or purchases. You agree not to use the Website for any speculative, false, or fraudulent bookings or any booking made in anticipation of demand. Reservations made under fictitious names or aliases are strictly prohibited. Nothing in this Agreement shall be construed as conferring any proprietary rights in the website or its contents to the user.' },
    ],
  },
  {
    id: 'prohibited-conduct',
    title: 'Prohibited Conduct',
    group: 'website',
    blocks: [
      { k: 'p', v: 'As a condition of using this website, you warrant to Wilson & Hughes India Private Limited that you will not use the site for any purpose that is unlawful or prohibited by these terms and conditions and you agree not to use any device, software, or process to interfere with the proper functioning of the Website or take any action that imposes an unreasonable or disproportionately large load on our infrastructure, as determined solely by Wilson & Hughes India Private.' },
      { k: 'p', v: 'You shall not upload, post, or transmit through the Website any material that:' },
      { k: 'ul', v: [
        'is unlawful, threatening, abusive, defamatory, obscene, vulgar, indecent, inflammatory, pornographic, or otherwise objectionable.',
        'could constitute or encourage conduct that would be considered a criminal offense or give rise to civil liability under any applicable laws.',
        'infringes any intellectual property rights or violates the rights of privacy or publicity of others.',
        'contains viruses, malware, worms, Trojan horses, or any other harmful or disruptive components.',
        'interferes with or compromises the security or functionality of any systems, data, or networks.',
        'may cause Wilson & Hughes India Private Limited to suffer any loss, liability, or impairment of service from its ISPs or other partners.',
      ] },
      { k: 'p', v: 'You are solely responsible for any loss or damage resulting from your unlawful use of the website or violation of any third-party rights, including but not limited to intellectual property rights.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited reserves the right to monitor, content and remove any material that it, in its sole discretion, deems to be in violation of these terms. You agree to indemnify and hold harmless Wilson & Hughes India Private Limited from any claims, losses, or damages arising from your use of the website in violation of these terms.' },
    ],
  },
  {
    id: 'age-responsibility',
    title: 'Age & Responsibility',
    group: 'website',
    blocks: [
      { k: 'p', v: 'By accessing and using this Website, you acknowledge and agree that you are solely responsible for maintaining the confidentiality of your account credentials, including your username and password. You agree to accept full responsibility for all activities that occur under your account or password.' },
      { k: 'p', v: 'By using this Website, you represent and warrant that you are of legal age as prescribed under applicable law to enter into a binding contract. You further affirm that you are capable, competent, and willing to assume legal responsibility for any obligations, liabilities, or commitments incurred as a result of the use of this Website. You are financially responsible for all transactions conducted through your account, whether performed by you or by any person accessing the Website using your credentials. You agree to notify Wilson & Hughes India Private Limited immediately of any unauthorized use of your account or any other breach of security. The Company shall not be liable for any loss or damage arising from your failure to comply with this obligation.' },
    ],
  },
  {
    id: 'accuracy',
    title: 'Accuracy of Information',
    group: 'website',
    blocks: [
      { k: 'p', v: 'Wilson & Hughes India Private Limited makes reasonable efforts to ensure the accuracy of the information provided on this Website. However, we do not warrant or guarantee the completeness, accuracy, or reliability of such information. Wilson & Hughes India Private Limited shall not be liable for any loss or damage, whether direct, indirect, incidental, special, or consequential, arising from or related to your reliance on any information made available on this Website.' },
      { k: 'p', v: 'All information provided on this Website is subject to change without prior notice. Wilson & Hughes India Private Limited reserves the right to make changes, improvements, or modifications to any products, services, or programs described herein at any time, without notice. The content is provided “as is” without warranties of any kind, either express or implied. You are advised to verify any information before relying on it for any personal or commercial decision making.' },
    ],
  },
  {
    id: 'copyright',
    title: 'Copyright Policy',
    group: 'website',
    blocks: [
      { k: 'p', v: 'The entire content of this Website, including but not limited to text, images, graphics, logos, audio and video clips, digital downloads, data compilations, and software, is the intellectual property of Wilson & Hughes India Private Limited or its content providers and is protected by applicable intellectual property laws, including copyright laws.' },
      { k: 'p', v: 'You may download, display, or print content from this Website solely for your personal and non-commercial use. Any other use — including but not limited to copying, reproducing, modifying, republishing, uploading, posting, transmitting, or distributing content from this Website — is strictly prohibited without the prior written consent of Wilson & Hughes India Private Limited and/or its third-party licensors.' },
      { k: 'p', v: 'You are prohibited from using any automated tools such as “robots,” “spiders,” or algorithms to access or extract data from the Website without express written authorization. You further agree not to transfer, transmit, or distribute any Website content for commercial gain or public display without permission.' },
      { k: 'p', v: 'Any unauthorized use of the Website or its content may constitute a violation of applicable copyright, trademark, or other intellectual property laws and may subject you to civil and/or criminal liability. All trademarks, service marks, and trade names are proprietary to Wilson & Hughes India Private Limited. Any unauthorized use of these may violate intellectual property laws.' },
    ],
  },
  {
    id: 'security-warnings',
    title: 'Security Warnings',
    group: 'website',
    blocks: [
      { k: 'p', v: 'It is your responsibility to implement adequate safeguards and ensure that any materials or links accessed through this Website are free of viruses, worms, Trojan horses, malicious code, or any other items of a destructive nature.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited shall not be liable for any loss or damage, including direct, indirect, incidental, special, or consequential damages, resulting from your use of this Website or any third-party websites linked to or interfaced with this Website. This includes any access to data residing on servers not owned or controlled by Wilson & Hughes India Private.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited does not warrant that the website or its servers are free of viruses or other harmful components or that the services will be uninterrupted or error free.' },
    ],
  },
  {
    id: 'third-party-links',
    title: 'Links to Third-Party Sites',
    group: 'website',
    blocks: [
      { k: 'p', v: 'This website may contain links to third-party websites. These links are provided solely for your convenience. Wilson & Hughes India Private Limited has no control over such websites and is not responsible for their content. The inclusion of any links does not imply endorsement or association with the operators of those sites. Any interactions or transactions with such third parties are solely between you and the respective party. Wilson & Hughes India Private Limited shall not be liable for any loss or damage arising from such interactions or from the presence of such links.' },
      { k: 'p', v: 'Our website may contain links to external sites. Wilson is not responsible for their privacy practices. Please review their policies before sharing any data.' },
      { k: 'p', v: 'You acknowledge and agree that any access or use of Third Party websites is entirely at your risk and Wilson & Hughes India Private Limited shall not be responsible for any loss or damage arising from such use.' },
    ],
  },
  {
    id: 'software',
    title: 'Software Available on this Website',
    group: 'website',
    blocks: [
      { k: 'p', v: 'Any software made available for download from this website (“Software”) is the copyrighted work of Wilson and/or its suppliers. Use of such Software is governed by the accompanying end-user license agreement (“License Agreement”). You may not install or use any Software unless you first accept the License Agreement.' },
      { k: 'p', v: 'If no such agreement is provided, Wilson & Hughes India Private Limited grants you a limited, non-transferable license to use the Software solely for accessing and using this website, provided all copyright and proprietary notices are retained. Reproduction or redistribution of the Software is strictly prohibited and may result in legal action. All Software and related content is protected under applicable copyright laws.' },
      { k: 'p', v: 'You acknowledge that the Software and its documentation are subject to applicable export control laws of India. You agree not to export or re-export the Software to any countries under Indian export restrictions.' },
      { k: 'p', v: 'You agree not to reverse engineer, decompile or disassemble any part of the software and acknowledge that unauthorized use may lead to legal action under applicable laws.' },
    ],
  },

  /* ------------------------------------------------------------ booking ---- */
  {
    id: 'conditions',
    title: 'Conditions',
    group: 'booking',
    blocks: [
      { k: 'p', v: 'These conditions shall apply to all the Customers of the Company who book a Brochure Tour, Special Tour, or any custom travel arrangement through the Company. In the event a Customer books a tour and/or travel arrangement involving third-party partners/operators such as Royal Caribbean, Norwegian Cruise Line, Carnival, Disney, Cosmos, Trafalgar, Europamundo, (etc.) or any other similar service providers, the terms and conditions, including but not limited to payment terms, cancellation policies, and refund rules, as specified by such operators shall apply in addition to the Terms and Conditions of the Wilson & Hughes Pvt. Ltd. In the event of any conflict, the terms of the respective operators shall prevail only to the extent of the services directly offered by them.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited acts solely as a booking agent in respect of services offered by Third Party partners/operators and shall not be liable for any deficiency in service, injury, illness, or even death, loss or damage, caused by such partners/operators.' },
      { k: 'p', v: 'The receipt issued by the Company shall be valid subject to the condition that the payment amount is irrevocably credited to and realised in the Company’s designated bank account.' },
      { k: 'p', v: 'In case of online or electronic payment made by the Customer towards the tour cost or any related service:' },
      { k: 'ol', v: [
        'The Customer irrevocably undertakes to ensure that the amount is duly credited and realised in the Company’s bank account and further agrees not to issue any instructions to their bank or any intermediary to reverse, debit, nullify, or otherwise recall the payment made to the Company.',
        'In the event that the payment is reversed, debited, nullified, or otherwise recovered from the Company’s bank account due to any reason whatsoever, including but not limited to technical snags, banking system errors, payment gateway issues, internet failures, or any other unforeseen circumstance, the Customer unconditionally agrees to make good such amount and immediately re-credit the same to the Company’s bank account, without any delay or requirement for formal demand or notice from the Company.',
        'The Customer further undertakes and confirms that they shall remain fully liable to pay the tour cost or any other amounts due to the Company, irrespective of any such reversal or non-realisation of funds.',
        'The Customer hereby indemnifies and agrees to keep the Company fully indemnified from and against all claims, losses, damages, liabilities, costs, expenses, or demands that may arise as a result of such reversal, debit, nullification, or recovery of monies from the Company’s bank account.',
      ] },
      { k: 'p', v: 'This indemnity shall remain binding and enforceable without objection, protest, or demur, and shall survive the completion, cancellation, or termination of the tour or the contract.' },
    ],
  },
  {
    id: 'promotions',
    title: 'Promotions / Offers / Schemes',
    group: 'booking',
    blocks: [
      { k: 'p', v: 'Special offers, promotions, and schemes introduced by Wilson & Hughes India Private Limited from time to time are subject to additional terms and conditions, apart from those stated herein. You are required to adhere to the payment schedules and all other applicable conditions under the respective offers, promotions, or schemes.' },
      { k: 'p', v: 'Failure to comply with such terms, including making payment by the due date, shall render you ineligible to receive any benefits under the said offer, promotion, or scheme. No claims shall be entertained for benefits forfeited due to non-compliance with the applicable terms.' },
    ],
  },
  {
    id: 'online-booking',
    title: 'Online Booking',
    group: 'booking',
    blocks: [
      { k: 'p', v: 'Wilson & Hughes India Private Limited provides online booking services for your convenience. Booking requests are subject to availability and confirmation by Wilson. A binding contract arises only after full payment and confirmation from Wilson, subject to applicable terms.' },
      { k: 'p', v: 'You must ensure that all details provided during booking — including your contact number, email address, and residential address — are accurate. Incorrect or incomplete information may result in booking cancellation at your risk and cost.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited reserves the right to restrict or deny access to the website and its services, including payments through certain credit cards.' },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    group: 'booking',
    blocks: [
      { k: 'p', v: 'All online payments made through the Website (www.coxandkings.com) are processed through secure and certified third-party payment gateways. Payment gateway charges are applicable as per the mode of payment selected which is over and above the tour cost and has to be borne by the customer. Wilson & Hughes India Private Limited does not store or retain any customer credit card details in any form — electronic, paper-based, or otherwise.' },
      { k: 'p', v: 'At the time of the transaction, users are redirected to the respective bank or payment gateway’s secure page. Therefore, Wilson & Hughes India Private Limited shall not be liable for any misuse or fraudulent activity involving your credit card or banking information.' },
      { k: 'h', v: 'Payment Terms' },
      { k: 'ol', v: [
        '35% advance to be paid at the time of booking for the land package.',
        'Airfare Terms: 100% of the airfare must be paid at the time of booking. Please note that the airfare is calculated at the time of proposal creation and is subject to change at the time of actual booking or ticket issuance.',
        'If air tickets are included as part of the travel package, the specific payment and cancellation terms will be shared at the time of ticket issuance. The airfare component will be billed separately from the land package.',
        'Any non-refundable services like Heritage Stays, Igloos, Cruises, Ice Breaker, Special Dining Arrangements, Specific Excursions, Attraction Tickets, (Etc.) if applicable, must be paid in full at the time of booking and is subject to 100% cancellation charges.',
        'For Domestic Packages: 100% payment to be made 21 days prior to departure date.',
        'For International Packages: 100% payment to be made 45 days prior to departure date.',
        'Rate of exchange (ROE) will be considered as on the final date of payment. The ROE will be calculated as per the Daily ROE declared by RBI + INR 2.00.',
      ] },
      { k: 'h', v: 'Payment schedule — land package (without airfare)' },
      { k: 'p', v: 'Domestic tours (Land Package without Airfare):' },
      { k: 'table', head: ['Timeline', 'Payment Terms'], rows: [
        ['At the time of booking', '30% advance payment (non-refundable)'],
        ['31 days prior to departure', '60% payment of the total tour cost'],
        ['21 days prior to departure', '100% payment of the total tour cost'],
      ] },
      { k: 'p', v: 'International tours (Land Package without Airfare):' },
      { k: 'table', head: ['Timeline', 'Payment Terms'], rows: [
        ['At the time of booking', '35% advance payment (non-refundable)'],
        ['60 days prior to departure', '75% payment of the total tour cost'],
        ['45 days prior to departure', '100% payment of the total tour cost'],
      ] },
      { k: 'ul', v: [
        'All payments must be made only through officially designated channels. Under no circumstances should payments be made in cash or to personal or third-party accounts. Any such unauthorized transactions are made entirely at your own risk. Wilson & Hughes India Private Limited expressly disclaims all liability for any loss, fraud, or other consequences resulting from non-compliance with this directive. Violations may also constitute a breach of contract and could result in legal action.',
        'Payments must be made only to designated Wilson & Hughes India Private Limited bank accounts which is displayed on the website prominently.',
      ] },
    ],
  },
  {
    id: 'foreign-exchange',
    title: 'Foreign Exchange Component',
    group: 'booking',
    blocks: [
      { k: 'ul', v: [
        'The foreign exchange portion of the tour cost is collected by the Wilson & Hughes Pvt. Ltd. and will be counted towards the travellers’ remittance quota under the LRS (Liberalised Remittance Scheme).',
        'Submission of PAN card for all passengers and Form A2 is mandatory.',
        'A declaration should be made that the customer falls under the 5% TCS bracket as per sub-section 1G of section 206 of the IT Act 2023.',
      ] },
    ],
  },

  /* ---------------------------------------------------------------- tax ---- */
  {
    id: 'tcs',
    title: 'Tax Collected at Source (TCS)',
    group: 'tax',
    blocks: [
      { k: 'p', v: 'On outbound / international tour packages. In accordance with Section 206C(1G)(b) of the Income Tax Act, 1961, Tax Collected at Source (TCS) shall be applicable in addition to the quoted price for all outbound/international tour packages booked through Wilson & Hughes India Limited (operating under the brand Cox & Kings) via www.coxandkings.com.' },
      { k: 'h', v: 'Applicable TCS rates' },
      { k: 'ul', v: [
        '5% TCS on total remittances up to INR 10 lakhs per individual per financial year',
        '20% TCS on total remittances exceeding INR 10 lakhs per individual per financial year',
      ] },
      { k: 'p', v: 'The TCS amount will be levied over and above the base tour cost and shall be collected in the name of the individual payer (i.e., the person making the payment and in whose name the receipt is issued).' },
      { k: 'p', v: 'The collected TCS will be deposited with the Government of India and reflected in the Form 26AS of the concerned individual, enabling them to claim appropriate tax credit while filing their Income Tax Return (ITR). Accordingly, the correct name and PAN of the payer must be provided and reconfirmed at the time of payment.' },
    ],
  },
  {
    id: 'tcs-cancellation',
    title: 'TCS on Booking Cancellations',
    group: 'tax',
    blocks: [
      { k: 'p', v: 'In the event of cancellation of the tour booking, the TCS amount collected shall not be refunded, even if the part principal amount of the tour is refunded. However, such TCS will continue to reflect in the Form 26AS of the individual payer, and may be claimed as credit at the time of filing the ITR, subject to prevailing tax laws.' },
    ],
  },
  {
    id: 'tcs-refunds',
    title: 'Claiming TCS Refunds via ITR',
    group: 'tax',
    blocks: [
      { k: 'p', v: 'If you have no income tax liability against your PAN in the relevant financial year, you may claim a refund of the TCS amount at the time of filing your Income Tax Return, as per the provisions of the Income Tax Act, 1961.' },
      { k: 'note', title: 'Payment security advisory', v: 'To ensure the security of your transactions, we request that all payments towards bookings be made only through the official and secure channels provided by Wilson & Hughes India Private Limited (Cox & Kings):', items: [
        'Secure Payment Link shared directly by us; or',
        'NEFT / RTGS / Cheque payable to: WILSON & HUGHES INDIA PRIVATE LIMITED',
      ] },
      { k: 'p', v: 'We do not solicit or accept payments via personal UPI IDs (e.g., GPay, Paytm) of any employee or company representative, WhatsApp QR code messages, or direct transfers to individual employees or agents. Any payment made to personal accounts of staff, agents, or representatives will not be recognized, and WILSON & HUGHES INDIA PRIVATE LIMITED (Cox & Kings) shall bear no responsibility or liability for such unauthorized transactions.' },
      { k: 'p', v: 'Additionally, please ensure that all official communications are received only from email addresses ending with @coxandkings.com. Communications from any other domains or unknown sources should be treated as unauthorized and potentially fraudulent.' },
    ],
  },

  /* ------------------------------------------------------------ changes ---- */
  {
    id: 'cancellation',
    title: 'Cancellation of Booking by Customer',
    group: 'changes',
    blocks: [
      { k: 'p', v: 'Should you wish to cancel your booking, you must notify us in writing. Such notification shall be deemed to have been given to us only on the date of the receipt of your notification, since we can act only on receipt.' },
      { k: 'p', v: 'The following cancellation charges shall apply irrespective of the reason for cancellation. You understand and acknowledge that these charges are a genuine pre-estimate of the damages that we will suffer on account of cancellation. You understand that these damages are called liquidated damages in legal language, which are payable without proof of actual damages. You agree not to dispute such deductions or to demand proof of actual damages.' },
      { k: 'h', v: 'Standard cancellation charges — Domestic tours (on total tour cost)' },
      { k: 'table', head: ['When you cancel', 'Cancellation charge'], rows: [
        ['More than 31 days before departure', '30% (70% refundable)'],
        ['22 to 30 days prior to departure', '50% (50% refundable)'],
        ['11 to 21 days prior to departure', '75%'],
        ['0 to 10 days prior to departure & No Show', '100%'],
        ['Airfare', 'As per airline policy'],
      ] },
      { k: 'h', v: 'Standard cancellation charges — International tours (on total tour cost)' },
      { k: 'table', head: ['When you cancel', 'Cancellation charge'], rows: [
        ['More than 60 days before departure', '30%'],
        ['45 to 59 days prior to departure', '50%'],
        ['36 to 44 days prior to departure', '75%'],
        ['0 to 35 days prior to departure & No Show', '100%'],
        ['Airfare', 'As per airline policy'],
      ] },
      { k: 'p', v: 'If you wish to cancel your tour, you must intimate the Company as follows, provided that such intimation should be given on a working day within working hours:' },
      { k: 'ul', v: [
        'By email to holidays@coxandkings.com followed by a written communication to our registered office listed below, OR',
        'In writing on working days within working hours at the registered office of the Company: Wilson & Hughes India Private Limited, Southern Park, Saket, New Delhi-110017, India',
      ] },
      { k: 'p', v: 'If the Booking Documents have been signed by one or more persons for themselves and for others mentioned in the Booking Form, then the communication signed by such signatory/s would be treated as a valid communication with full responsibility for cancellation for all such persons mentioned in the form.' },
      { k: 'p', v: 'Cancellation shall take effect only from the time the written request reached the Company at its office on working days within office time. However, in the following cases you shall be deemed to have cancelled the tour even if no cancellation notice is issued by you:' },
      { k: 'ol', v: [
        'In case of visa rejection, you would be deemed to have cancelled on the date of intimation of such rejection.',
        'If you fail to pay the tour costs in time or if you commit any other default in relation to your booking, we may treat such failure or default as a cancellation of the booking by you. In such case, the cancellation charges shall be computed with reference to the date on which we issue you a notice of cancellation.',
        'If on your failure of payment or other default, no notice of cancellation is issued by us but your payment or default remains outstanding on the date of departure, the booking shall be deemed to have been cancelled by you without any advance notice, inviting the highest cancellation charge.',
      ] },
    ],
  },
  {
    id: 'amendment',
    title: 'Amendment of Booking by You',
    group: 'changes',
    blocks: [
      { k: 'p', v: 'If you wish to amend or change your booking, you have to communicate your request to us in writing. Such request for amendment shall be subject to availability and may attract amendment charges. Amendments requested within 45 days of departure for international tours and 21 days for domestic tours may be treated as a cancellation and re-booking, attracting applicable cancellation charges.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited reserves the right to decline amendment requests where operationally not feasible. Any increase in cost due to amendment shall be borne by the customer.' },
    ],
  },
  {
    id: 'transfer',
    title: 'Transfer from One Tour to Another',
    group: 'changes',
    blocks: [
      { k: 'p', v: 'A request for transfer from one tour to another or from one departure date to another shall be treated as a cancellation of the original booking and a fresh booking for the new tour. Applicable cancellation charges on the original booking and new booking charges for the new tour will apply accordingly.' },
      { k: 'p', v: 'Transfer requests are subject to availability and must be made in writing. The Company reserves the right to refuse any transfer request at its sole discretion.' },
    ],
  },
  {
    id: 'refund-policy',
    title: 'Refund Policy',
    group: 'changes',
    blocks: [
      { k: 'p', v: 'Refunds, where applicable, shall be processed within 15–30 working days from the date of cancellation request after deducting applicable cancellation charges. Refunds will be credited to the original payment source only.' },
      { k: 'p', v: 'No refund will be made for any unused portion of the tour, whether due to late arrival, early departure, or any other personal reasons. Refund of TCS shall not be made by the Company; however, the TCS credit will reflect in Form 26AS and can be claimed while filing your ITR.' },
      { k: 'p', v: 'In the event of a dispute regarding refund amounts, the decision of Wilson & Hughes India Private Limited shall be final and binding.' },
    ],
  },
  {
    id: 'no-refund-unutilized',
    title: 'No Refund for Unutilized Services',
    group: 'changes',
    blocks: [
      { k: 'p', v: 'No refund, whether partial or full, shall be admissible in respect of any accommodation, transport, sightseeing, meals, or any other service that is included in the tour cost but not availed/utilized by the traveller due to any reason whatsoever, including but not limited to health reasons, personal choice, late arrival, early departure, or any other circumstances beyond the Company’s control.' },
      { k: 'p', v: 'This also applies to optional services booked and prepaid as part of the tour package. It is clarified that the tour cost is computed on a package basis and no individual service can be deducted for the purpose of claiming any refund.' },
    ],
  },

  /* --------------------------------------------------------------- tour ---- */
  {
    id: 'travel-documents',
    title: 'Travel Documents and Clearances',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'All travellers are required to possess valid travel documents including a valid passport, visa (as applicable), and other mandatory documents as prescribed by the destination country. It is the sole responsibility of the traveller to ensure that all their travel documents are in order before the date of departure.' },
      { k: 'p', v: 'For international tours, the passport must be valid for at least 6 months beyond the return date. The Company shall not be held responsible for any denial of boarding, deportation, or detention by immigration authorities arising from incomplete or invalid travel documents.' },
      { k: 'p', v: 'Travellers are also responsible for ensuring compliance with health and entry requirements of the destination country, including but not limited to vaccination certificates, health declarations, and any other mandatory clearances.' },
    ],
  },
  {
    id: 'visa',
    title: 'VISA Facilitation Services',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'Wilson & Hughes India Private Limited provides visa facilitation services as an ancillary service to its customers. The Company assists in the preparation and submission of visa applications to the respective consulates or embassies.' },
      { k: 'p', v: 'The grant or refusal of a visa is entirely at the discretion of the issuing authority. The Company does not guarantee the issuance of a visa or its timely processing. The Company shall not be liable for any visa rejection, delay, or additional documentation requirements.' },
      { k: 'p', v: 'In case of visa rejection, applicable cancellation charges as per the cancellation policy shall be levied. The traveller is advised to obtain travel insurance that covers visa rejection.' },
    ],
  },
  {
    id: 'accommodation',
    title: 'Accommodation',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'The Company arranges accommodation as per the category specified in the tour itinerary. The hotels mentioned are indicative, and the Company reserves the right to substitute with hotels of equivalent or higher category in the same locality, if required, without prior notice.' },
      { k: 'p', v: 'Standard hotel check-in and check-out timings shall apply unless otherwise mentioned. Early check-in or late check-out is subject to hotel availability and may attract additional charges. Single room supplements are applicable for solo travellers unless a same-gender co-sharing arrangement is confirmed.' },
      { k: 'p', v: 'The Company shall not be liable for any issues relating to the quality, hygiene, or services of the hotel beyond the normal standard for the category booked.' },
    ],
  },
  {
    id: 'meals',
    title: 'Meals & Special Requests',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'Meals are provided as specified in the tour itinerary (e.g., breakfast, half-board, or full-board). Any meals not included in the tour package shall be at the traveller’s own cost.' },
      { k: 'p', v: 'Special meal requests (vegetarian, vegan, gluten-free, religious dietary requirements, etc.) must be communicated at the time of booking. While the Company will make reasonable efforts to accommodate such requests, it cannot guarantee their fulfillment at all destinations or establishments, and shall not be liable for any failure to do so.' },
      { k: 'p', v: 'The Company shall not be responsible for any food-related health issues or allergic reactions arising during the tour.' },
    ],
  },
  {
    id: 'health-insurance',
    title: 'Health and Insurance',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'It is strongly recommended that all travellers obtain comprehensive travel insurance, including coverage for life, health, personal injury, loss of property, trip cancellation, and other unforeseen events. It is mandatory for travellers to purchase Overseas Mediclaim and other relevant insurance policies from the insurance provider designated by Wilson & Hughes India Private, at the prescribed rates.' },
      { k: 'p', v: 'You are solely responsible for verifying the accuracy and correctness of your policy documentation and must report any discrepancies directly to the concerned insurance company for rectification. Wilson & Hughes India Private Limited shall not be liable for any issues arising out of errors or omissions in the issued policy documents.' },
      { k: 'p', v: 'All insurance-related claims must be addressed by you directly to the insurance provider. Wilson & Hughes India Private Limited acts only as a facilitator and bears no responsibility for processing or resolving such claims. It is your responsibility to carry the physical copy of your insurance policy while on tour.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited acts solely as a facilitator and is not liable for issuance, servicing, or settlement of any insurance claims.' },
    ],
  },
  {
    id: 'add-waiver',
    title: 'Accidental Death & Dismemberment (AD&D) Waiver',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'Wilson & Hughes India Private Limited and its affiliates, directors, officers, employees, agents, and representatives shall not be held liable for any accidental death or dismemberment occurring during a tour, excursion, activity, or travel facilitated through the Company.' },
      { k: 'p', v: 'Travellers are strongly advised to procure comprehensive travel insurance that includes coverage for accidental death and dismemberment (AD&D), personal accident, and medical emergencies, prior to the commencement of the tour.' },
      { k: 'p', v: 'Participation in adventure activities, extreme sports, or any optional excursions is entirely at the traveller’s own risk. The Company shall not be liable for any injury, death, or loss arising from such participation.' },
    ],
  },
  {
    id: 'absconding',
    title: 'Absconding of Traveller — Limitation of Liability',
    group: 'tour',
    blocks: [
      { k: 'p', v: 'In the event that a traveller absconds (i.e., goes missing, leaves the group unauthorizedly, or fails to return to the group at the designated time and place) during any tour or excursion, Wilson & Hughes India Private Limited shall not be held liable for any consequences thereof, including but not limited to additional travel costs, legal issues, immigration complications, or any harm to the traveller.' },
      { k: 'p', v: 'The Company’s responsibility towards such a traveller shall cease from the time of absconding. All costs and consequences arising thereafter shall be borne solely by the traveller or their legal representative.' },
    ],
  },

  /* -------------------------------------------------------------- group ---- */
  {
    id: 'duniya-dekho',
    title: 'Duniya Dekho Group Departures',
    group: 'group',
    blocks: [
      { k: 'p', v: 'By making a booking for any “Duniya Dekho” group departure package, each traveller (“Guest”) acknowledges that they have read, understood, and agreed to be bound by these Terms and Conditions. These Terms constitute a legally binding contract between the Guest and Cox & Kings (“the Company”).' },

      { k: 'h', v: '1. Flight Prices and Availability' },
      { k: 'ol', v: [
        'All airfare quotes provided are indicative only. Unless expressly stated in writing, no flight seats are held or blocked by the Company.',
        'Guests agree to bear any increase arising from fare fluctuations, taxes, surcharges, or airline policy changes.',
        'The Company shall not be liable for any loss arising from airline amendments, rescheduling, or cancellations.',
      ] },

      { k: 'h', v: '2. Tour Dates, Group Size, and Operational Requirements' },
      { k: 'ol', v: [
        'The Company reserves the unconditional right to alter, revise, or reschedule tour dates, including after a confirmed booking, due to occupancy considerations, peak season constraints, or operational requirements.',
        'A minimum of 40 paying Guests (Adults) are required for operating a scheduled group tour.',
        'If minimum occupancy is not met, the Company may: (a) offer Guests an alternate operational departure date, or (b) operate the tour with fewer than 40 Guests on a customised or guided services basis, which may attract additional charges, or (c) offer a full or a partial refund as per the cancellation policies applicable.',
        'If tour dates are revised for operational reasons, the Company shall not be responsible for any consequent airline penalties, cancellation fees, or amendment charges. Guests are strongly advised to book refundable or flexible air tickets.',
        'We reserve the right to modify the itinerary due to operational or any other reason to make the travel feasible without affecting the overall experience.',
        'In case the Eiffel Tower’s 3rd level is not operational or due to overcrowding, we will try to arrange the 2nd level or arrange an alternate sightseeing.',
        'In case we miss any activity due to operational reasons, Cox and Kings will try to arrange an alternate sightseeing, but no refunds will be applicable for the original activity.',
      ] },

      { k: 'h', v: '3. Payment Schedule' },
      { k: 'ol', v: [
        'Full payment must be received no later than 45 days prior to the tour departure date.',
        'Bookings made within 45 days of departure require 100 percent payment at the time of booking.',
        'Non-payment as per schedule shall be treated as a cancellation by the Guest, and applicable cancellation charges shall apply.',
      ] },

      { k: 'h', v: '4. Pricing, Taxes, and Currency Fluctuations' },
      { k: 'ol', v: [
        'All prices are dynamic, may vary by departure hub, and are subject to change without notice.',
        'Prices may increase due to government taxes, statutory levies, foreign exchange variations, fuel surcharges, or inventory changes.',
        'The final price payable shall be the amount specified in the Booking Invoice at the time of final confirmation.',
      ] },

      { k: 'h', v: '5. Inclusions and Exclusions' },
      { k: 'ol', v: [
        'Package inclusions generally cover: (a) airfare, where explicitly mentioned, (b) accommodation, (c) meals as per the itinerary, (d) sightseeing and excursions, (e) visa fees applicable to Indian nationals (excluding gratis, on-arrival, or free visas), and (f) services of a Cox & Kings Tour Manager.',
        'Exclusions include, but are not limited to: (a) porterage, laundry, beverages, phone expenses, shopping, and other personal expenditure, (b) local travel to the tour start point (unless specified), (c) deviation, extension, or optional tour charges, (d) upgrades to transportation or services, and (e) expenses arising from force majeure, natural events, political disturbances, or government regulations.',
      ] },

      { k: 'h', v: '6. Travel Documentation and Visa' },
      { k: 'ol', v: [
        'Guests must possess valid government identification and all statutory travel documents.',
        'For international tours, passports must remain valid for a minimum of 180 days beyond the return date.',
        'Visa issuance is solely at the discretion of the concerned consulate or embassy. The Company acts only as a facilitator and does not guarantee approval, processing time, or successful issuance.',
        'Any visa refusal, delay, or additional documentation request shall not create any liability on the Company.',
      ] },

      { k: 'h', v: '7. Health, Fitness, and Medical Requirements' },
      { k: 'ol', v: [
        'Guests affirm that they are physically and mentally fit to undertake the tour.',
        'Individuals with medical conditions, minors, and elderly travellers are advised to obtain professional medical clearance prior to booking.',
        'All required vaccination certificates, medical tests, or health documents must be arranged by the Guest at their cost.',
        'Pregnant travellers (>6 months) are strongly discouraged due to the absence of specialised medical facilities during travel. They need to provide a fitness-to-travel certificate from a registered medical practitioner.',
      ] },

      { k: 'h', v: '8. Amendments, Cancellations, and Transfers' },
      { k: 'ol', v: [
        'Any request to transfer a booking to another tour or departure is treated as a cancellation and attracts applicable cancellation charges.',
        'All discounts, promotional offers, complimentary add-ons, and value coupons are discretionary, non-transferable, non-encashable, and valid only for specified departures and eligible travellers.',
        'Offers cannot be combined unless explicitly mentioned in writing.',
      ] },

      { k: 'h', v: '9. Conduct and Removal from Tour' },
      { k: 'ol', v: [
        'Guests are required to maintain discipline, decorum, and respect for group members, staff, and local communities.',
        'The Company reserves the right to terminate the participation of any Guest who behaves disruptively, poses a safety risk, or violates group norms. No refund or compensation shall be payable in such cases.',
      ] },

      { k: 'h', v: '10. Liability and Force Majeure' },
      { k: 'ol', v: [
        'The Company shall be liable only for services explicitly included in the itinerary and confirmed in writing.',
        'The Company shall not be liable for: (a) delays, cancellations, or interruptions caused by airlines, transport providers, or third-party vendors, (b) accidents, injuries, illness, loss of property, theft, or damage, (c) events arising from force majeure, including natural disasters, strikes, political unrest, or governmental actions.',
        'Guests are strongly advised to purchase comprehensive travel insurance covering medical, baggage, cancellation, and emergency expenses.',
      ] },

      { k: 'h', v: '11. Legal Jurisdiction' },
      { k: 'p', v: 'All disputes or claims relating to bookings, payments, or services shall be exclusively subject to the courts of New Delhi, India.' },

      { k: 'h', v: '12. Severability' },
      { k: 'p', v: 'If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions shall continue in full force and effect.' },

      { k: 'h', v: '13. Accuracy of Guest Information' },
      { k: 'p', v: 'Guests are responsible for providing accurate and complete personal and travel details at the time of booking and must notify the Company of any changes before departure. The Company shall not be liable for consequences arising from incorrect or incomplete information.' },

      { k: 'p', v: 'Booking any “Duniya Dekho” package constitutes full and unconditional acceptance of these Terms and Conditions by the Guest.' },
    ],
  },

  /* -------------------------------------------------------------- legal ---- */
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    group: 'legal',
    blocks: [
      { k: 'p', v: 'The information, services, and products on this website are provided “as is” without any express or implied warranty of any kind, including warranties of merchantability, non-infringement, or fitness for a particular purpose. Wilson & Hughes India Private Limited makes no representations or warranties as to the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website for any purpose.' },
      { k: 'p', v: 'In no event shall Wilson & Hughes India Private Limited be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services, loss of use, data, or profits; or business interruption) arising from the use or inability to use this website or its services, even if the Company has been advised of the possibility of such damages.' },
      { k: 'p', v: 'Wilson & Hughes India Private Limited reserves the right to make changes to the website and these terms at any time without prior notice.' },
    ],
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    group: 'legal',
    blocks: [
      { k: 'p', v: 'All personal information provided by you to Wilson & Hughes India Private Limited is treated as confidential and will be used solely for the purpose of processing your travel bookings and providing related services. The Company shall not disclose your personal information to any third party except as required for the provision of services (e.g., airlines, hotels, visa authorities) or as required by law.' },
      { k: 'p', v: 'By using this website and providing your personal information, you consent to the collection, processing, and use of your information as described in our Privacy Policy. Please review our Privacy Policy for further details on how we handle your personal data.' },
      { k: 'p', v: 'The Company shall implement appropriate technical and organisational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet can be guaranteed to be 100% secure.' },
    ],
  },
];

/* Flatten a section's blocks to searchable plain text (title + every string
   inside every block). Used by the page's search box. */
export function sectionText(section) {
  const parts = [section.title];
  for (const b of section.blocks) {
    if (b.v && typeof b.v === 'string') parts.push(b.v);
    if (b.title) parts.push(b.title);
    if (Array.isArray(b.v)) parts.push(...b.v);
    if (Array.isArray(b.items)) parts.push(...b.items);
    if (b.head) parts.push(...b.head);
    if (b.rows) for (const r of b.rows) parts.push(...r);
  }
  return parts.join(' ').toLowerCase();
}
