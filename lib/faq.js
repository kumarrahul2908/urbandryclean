import { BUSINESS } from './business'

export const FAQS = [
  {
    q: 'Do you offer pickup and delivery?',
    a: `Yes, Urban Dry Clean offers doorstep pickup and delivery within our service area. Availability depends on your location and operational availability — please confirm on WhatsApp when booking.`,
  },
  {
    q: 'How can I book a pickup?',
    a: `You can book a pickup by sending a WhatsApp message to ${BUSINESS.phone} or by calling the same number. Our team will confirm the pickup time and other details.`,
  },
  {
    q: 'How can I check the price?',
    a: `Visit our Price List page for current rates. For item-specific queries, message us on WhatsApp and we will share the confirmed price.`,
  },
  {
    q: 'Do you clean blankets and quilts?',
    a: `Yes, we clean single and double blankets, quilts and rajais. Current rates are listed under the Household section of the Price List.`,
  },
  {
    q: 'Do you clean suits and blazers?',
    a: `Yes, we dry clean suits (2-piece and 3-piece), blazers and coats with careful handling and neat finishing.`,
  },
  {
    q: 'Do you clean sarees?',
    a: `Yes, we clean sarees including plain, embroidered and silk sarees. Prices vary by fabric and work.`,
  },
  {
    q: 'How can I contact Urban Dry Clean?',
    a: `Phone / WhatsApp: ${BUSINESS.phone}. Address: ${BUSINESS.address.full}`,
  },
  {
    q: 'Where is Urban Dry Clean located?',
    a: BUSINESS.address.full,
  },
  {
    q: 'Which areas do you serve?',
    a: `We primarily serve ${BUSINESS.serviceArea} and nearby areas. Please share your location on WhatsApp to confirm service availability.`,
  },
  {
    q: 'How can I get the latest price list?',
    a: `You can view the latest price list on our Price List page, or request the current rates on WhatsApp.`,
  },
]
