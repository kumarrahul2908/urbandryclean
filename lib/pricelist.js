// Urban Dry Clean — Official Price List (exact values as supplied by owner).
// Columns:
//  dc  = Dry Clean (25% OFF) ₹
//  si  = Steam Iron Onwards ₹
//  mrp = Dry Clean MRP ₹  (only where MRP was supplied)
// Where a value has variants, values are separated by '/'.
// Use '—' (em dash) for values that were intentionally not supplied.

export const CATEGORIES = [
  {
    id: 'mens',
    title: "Men's Wear",
    hasMRP: true,
    items: [
      { name: 'Shirt / T-Shirt',                 dc: '105',      si: '49',       mrp: '140' },
      { name: 'Trouser / Pant',                  dc: '113',      si: '59',       mrp: '150' },
      { name: 'Pyjama / Dhoti',                  dc: '98',       si: '59',       mrp: '130' },
      { name: 'Jeans',                           dc: '113',      si: '69',       mrp: '150' },
      { name: 'Shorts',                          dc: '90',       si: '49',       mrp: '120' },
      { name: 'Kurta (Plain / Embroidered)',     dc: '120 / 299',si: '59 / 149', mrp: '160' },
      { name: 'Waistcoat',                       dc: '187',      si: '120',      mrp: '249' },
      { name: 'Sweater / Sweatshirt',            dc: '187',      si: '120',      mrp: '249' },
      { name: 'Coat / Blazer',                   dc: '299',      si: '169',      mrp: '399' },
      { name: 'Jacket (Non Leather / Leather)',  dc: '299 / 749',si: '149 / 499',mrp: '399 / 999' },
      { name: 'Suit (2 Piece / 3 Piece)',        dc: '374 / 524',si: '229 / 349',mrp: '499 / 699' },
      { name: 'Sherwani',                        dc: '749',      si: '399',      mrp: '999' },
      { name: 'Long Coat / Overcoat',            dc: '374',      si: '249',      mrp: '499' },
    ],
  },
  {
    id: 'womens',
    title: "Women's Wear",
    hasMRP: true,
    items: [
      { name: 'Top / Shirt / T-Shirt (Plain)',                dc: '105',        si: '49',           mrp: '140' },
      { name: 'Trouser / Palazzo',                            dc: '113',        si: '59',           mrp: '150' },
      { name: 'Salwar / Churidar / Pyjama (Plain)',           dc: '98',         si: '59',           mrp: '130' },
      { name: 'Jeans',                                        dc: '113',        si: '69',           mrp: '150' },
      { name: 'Kurta / Kurti (Plain / Embroidered)',          dc: '120 / 299',  si: '59 / 149',     mrp: '160 / 399' },
      { name: 'Skirt Plain (Short / Long)',                   dc: '120 / 199',  si: '79 / 125',     mrp: '160 / 265' },
      { name: 'Saree (Plain / Embroidered)',                  dc: '199 / 399',  si: '99 / 199',     mrp: '249 / 499' },
      { name: 'Saree Silk',                                   dc: '249',        si: '125',          mrp: '299' },
      { name: 'Coat / Blazer',                                dc: '299',        si: '169',          mrp: '399' },
      { name: 'Sweater / Sweatshirt',                         dc: '187',        si: '120',          mrp: '249' },
      { name: 'Ladies 2 pc Suit (Indianwear) (Plain / With Work)', dc: '217 / 299', si: '125',      mrp: '289 / 399' },
      { name: 'Jacket (Non Leather / Leather)',               dc: '299 / 749',  si: '149 / 499',    mrp: '399 / 999' },
      { name: 'Lehenga (Plain / Embroidered)',                dc: '499 / 749',  si: '249 / 399',    mrp: '665 / 999' },
      { name: 'Lehenga — Bridal',                             dc: '1499',       si: '799',          mrp: '1499' },
      { name: 'Shawl (Light / Medium / Heavy)',               dc: '249 / 349 / 449', si: '149 / 199 / 249', mrp: '315 / 465 / 599' },
      { name: 'Shawl Pashmina',                               dc: '1099',       si: '499',          mrp: '—' },
      { name: 'Choli (Plain / Medium / Heavy)',               dc: '149 / 249 / 399', si: '79 / 125 / 199',  mrp: '—' },
      { name: 'Blouse / Dupatta (Plain / Medium / Heavy)',    dc: '90 / 199 / 299',  si: '49 / 125 / 199',  mrp: '120 / 265 / 399' },
      { name: 'Long Coat / Overcoat',                         dc: '374',        si: '249',          mrp: '499' },
      { name: 'Polishing — Saree',                            dc: '200',        si: '—',            mrp: '—' },
    ],
  },
  {
    id: 'household',
    title: 'Household',
    hasMRP: false,
    items: [
      { name: 'Blinds Per Panel',                        dc: '149',       si: '79' },
      { name: 'Curtain Per Panel (Plain / Lining)',      dc: '199 / 299', si: '99 / 149' },
      { name: 'Bedsheet (Single / Double)',              dc: '199 / 249', si: '99 / 125' },
      { name: 'Dohar',                                   dc: '249',       si: '120' },
      { name: 'Blanket (Single / Double)',               dc: '299 / 374', si: '199 / 249', special: true },
      { name: 'Quilt (Single / Double)',                 dc: '337 / 412', si: '220 / 279', special: true },
      { name: 'Pillow / Cushion Cover',                  dc: '99',        si: '49' },
      { name: 'Pillow / Cushion',                        dc: '199',       si: '99' },
      { name: 'Table Cover / Cloth',                     dc: '149',       si: '75' },
      { name: 'Towel Hand',                              dc: '49',        si: '35' },
      { name: 'Towel Bath',                              dc: '99',        si: '49' },
      { name: 'Dhurrie / Rug',                           dc: '399',       si: '199' },
      { name: 'Carpet / sq. ft.',                        dc: '39',        si: '—' },
    ],
  },
]
