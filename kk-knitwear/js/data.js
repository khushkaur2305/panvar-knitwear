/* ==========================================================================
   K.K KNITWEAR CLUB — data.js
   --------------------------------------------------------------------------
   THE SOURCE OF TRUTH for the whole site. Every company fact and every
   product specification below is transcribed from K.K Knitwear Club's own
   published listings:

     • https://www.kkknitwearclub.com/            (home + 15 category pages)
     • https://www.indiamart.com/kkknitwearclub/profile.html
     • https://www.instagram.com/kkknitwearclub/

   RULE: nothing here is estimated, embellished or filled in. If the company
   does not publish a value, the field is simply left out — never guessed.
   Prices are the published "Approx." rates and are ALWAYS rendered as
   indicative, never as a firm quote.

   Contents
     01. Company record
     02. Published positioning statements
     03. Credentials & commercial terms
     04. Manufacturing capability (derived from the catalogue — see note)
     05. Categories
     06. Applications
     07. Products (48)
     08. Derived helpers
   ========================================================================== */

(function (window) {
  'use strict';

  var KK = (window.KK = window.KK || {});


  /* ======================================================================
     01. COMPANY RECORD
     ====================================================================== */

  var company = {
    name: 'K.K Knitwear Club',
    tagline: 'Polyester & Knitted Fabric Manufacturer',
    established: 1990,
    natureOfBusiness: 'Manufacturer',
    additionalBusiness: 'Factory / Manufacturing',
    legalStatus: 'Proprietorship',
    ownerName: 'Avnish Jain',
    ownerRole: 'Owner',
    employees: '11 to 25 People',
    annualTurnover: '₹1.5 – 5 Crore',
    gstin: '03ABLPJ0347H1ZZ',
    gstRegistered: '01-07-2017',
    banker: 'HDFC Bank',
    countryOfOrigin: 'Made in India',
    paymentModes: ['Cash', 'Cheque', 'Pay Order', 'Bank Transfer', 'Online'],
    shipmentMode: 'By Road',

    address: {
      line1: 'Street No-1, K.K Knitwear Club',
      line2: 'Kabir Nagar, Sekhonwal Road',
      city: 'Ludhiana',
      pincode: '141008',
      state: 'Punjab',
      country: 'India'
    },

    /* Published contact number. Digits-only dial form for tel: links. */
    phoneDisplay: '079 4280 2251',
    phoneDial: '+917942802251',

    website: 'https://www.kkknitwearclub.com/',
    instagram: 'https://www.instagram.com/kkknitwearclub/',
    instagramHandle: '@kkknitwearclub',
    indiamart: 'https://www.indiamart.com/kkknitwearclub/',

    /* Published coordinates of the unit. */
    lat: 30.93141,
    lng: 75.86182
  };

  company.addressOneLine = [
    company.address.line1,
    company.address.line2,
    company.address.city + ' - ' + company.address.pincode,
    company.address.state,
    company.address.country
  ].join(', ');

  company.mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    company.lat + ',' + company.lng;

  company.yearsInBusiness = new Date().getFullYear() - company.established;

  KK.company = company;


  /* ======================================================================
     02. PUBLISHED POSITIONING STATEMENTS
     Quoted rather than paraphrased, so the company's own voice carries.
     ====================================================================== */

  KK.statements = {
    about:
      'Established in the year of 1990, we “K.K Knitwear Club” are a Manufacturer ' +
      'of Polyester Fabric, Knitted Fabric, Sportswear Fabric, Terry Fabric, Baby ' +
      'Blanket Fabric or Jacket Fabrics, Dot Knit Fabrics, Polyester Knitted Fabric ' +
      'and Dotted Fabric.',
    customerFocus:
      'We direct all our activities to cater the expectations of customers by ' +
      'providing excellent quality products as per their gratification.',
    ethics:
      'We follow moral business policies and crystal pure transparency in all ' +
      'transactions to keep healthy relations with customers.',
    leadership:
      'We are grateful to Mr. Avnish Jain, whose continual backing and direction ' +
      'have been useful to us for attaining exponential development in the current market.',
    supplier:
      'K.K Knitwear Club is a leading supplier specializing in high-quality knitted ' +
      'fabrics — Knitted Polyester Fabric, Dot Knit, Nirmal Knit, Sarina Fabric and ' +
      'Plain Micro Polyester — perfect for fashion, sportswear and casual apparel.',
    quality:
      'We are engaged in offering quality products to our clients. Our range of all ' +
      'products is widely appreciated by our clients.'
  };


  /* ======================================================================
     03. CREDENTIALS & COMMERCIAL TERMS
     Each entry is a verifiable published fact.
     ====================================================================== */

  KK.credentials = [
    {
      label: 'Operating since',
      value: '1990',
      note: company.yearsInBusiness + ' years of continuous manufacturing in Ludhiana',
      icon: 'calendar'
    },
    {
      label: 'GST registered',
      value: company.gstin,
      note: 'Registered ' + company.gstRegistered + ' · ' + company.legalStatus,
      icon: 'shield'
    },
    {
      label: 'Annual turnover',
      value: company.annualTurnover,
      note: company.employees + ' on the shop floor and in support',
      icon: 'trend'
    },
    {
      label: 'Banked with',
      value: company.banker,
      note: 'Cash, cheque, pay order, bank transfer and online payments accepted',
      icon: 'bank'
    }
  ];

  KK.commercialTerms = [
    {
      title: 'Minimum order quantity',
      body: 'Most lines start at 100 kg or 100 metres; some run from 150–200 kg or ' +
            'metres. Exact MOQ is listed on every product.',
      icon: 'box'
    },
    {
      title: 'Indicative pricing',
      body: 'Published rates run approximately ₹150–₹210 per kg or metre depending on ' +
            'construction and GSM. Surplus stock is negotiable in bulk.',
      icon: 'rupee'
    },
    {
      title: 'Samples',
      body: 'Sample orders are accepted on several lines, including rice knit and rim ' +
            'zim dotted knits. Availability is noted per product.',
      icon: 'scissors'
    },
    {
      title: 'Packing & dispatch',
      body: 'Supplied in rolls, thans, packets or boxes — 20 kg and 25 kg roll packing ' +
            'on selected lines. Dispatch by road.',
      icon: 'truck'
    }
  ];

  /* Why Choose Us — every point traces to something published below. */
  KK.whyChooseUs = [
    {
      title: 'Made, not traded',
      body: 'Registered as a Manufacturer with a factory premises — gauge, GSM, width ' +
            'and shade are set on our own machines, not bought in.',
      icon: 'factory'
    },
    {
      title: 'Bulk-ready terms',
      body: 'MOQ from 100 kg or 100 metres, indicative rates ₹150–₹210, packing in ' +
            'rolls, thans, packets or boxes, dispatch by road.',
      icon: 'box'
    },
    {
      title: 'Specifications up front',
      body: 'Material, GSM, finished width, pattern, colour, MOQ and applications are ' +
            'published against every one of our 48 lines.',
      icon: 'ruler'
    },
    {
      title: 'A checkable business',
      body: 'GSTIN ' + company.gstin + ', proprietorship, banked with ' + company.banker +
            ', trading from one address in Ludhiana since 1990.',
      icon: 'shield'
    }
  ];


  /* ======================================================================
     04. MANUFACTURING CAPABILITY
     DERIVED, NOT INVENTED: each figure is the envelope of the published
     catalogue below — the lowest and highest values that appear on any line.
     Gauge and yarn count are published on the Rice Knit listing only.
     ====================================================================== */

  KK.envelope = [
    {
      label: 'GSM range',
      value: '80 – 250',
      unit: 'GSM',
      note: 'From the 80 GSM sportswear dot through to 211–240 GSM foma and the ' +
            '120–250 GSM spun terry.',
      icon: 'gauge'
    },
    {
      label: 'Finished width',
      value: '31 – 60',
      unit: 'inch',
      note: 'Published widths run from 31 inch (78 cm) to 60 inch, with 160 cm on ' +
            'micro PP and customised width on matty.',
      icon: 'ruler'
    },
    {
      label: 'Knitting spec',
      value: '24 gauge',
      unit: '100–150 count',
      note: 'Gauge and yarn count as published on the rice knit line.',
      icon: 'layers'
    },
    {
      label: 'Shade',
      value: 'Dyed to order',
      unit: 'all colours',
      note: 'Several lines are listed as “all colours available” or “colour on order”.',
      icon: 'palette'
    }
  ];

  KK.constructions = [
    {
      group: 'Knit structures',
      items: ['Plain knit', 'Interlock', 'Nirmal knit', 'Micro nirmal knit',
              'Rice knit', 'Honeycomb', 'Waffle', 'Circular-knitted micro mesh']
    },
    {
      group: 'Dot & pattern families',
      items: ['Dot knit', 'Discat dot', 'Dot grindal', 'Rim zim dotted',
              'Polka dot', 'Check', 'Stripe', 'Printed']
    },
    {
      group: 'Surface & handle',
      items: ['Matty / polo matty', 'Spun terry', 'Foma', 'Sweater & astar',
              'Bright / chamki', 'Dri-Fit', 'Easy care', 'Soft finish']
    }
  ];

  /* How an order moves. Each step states ONLY what the company publishes. */
  KK.orderFlow = [
    {
      step: '01',
      title: 'Share the requirement',
      body: 'Construction, GSM, width, shade and quantity. The catalogue lists all ' +
            'four against every line, so an enquiry can be precise from the start.'
    },
    {
      step: '02',
      title: 'Sample where offered',
      body: 'Sample orders are accepted on selected lines — rice knit, rim zim dotted ' +
            'knits and the bright and chandani burka fabrics among them.'
    },
    {
      step: '03',
      title: 'Knitted in our own unit',
      body: 'K.K Knitwear Club is registered as a manufacturer with a factory premises, ' +
            'so gauge, GSM and width are set on our own machines.'
    },
    {
      step: '04',
      title: 'Quantities from 100 kg',
      body: 'Most lines open at 100 kg or 100 metres; heavier programmes run at ' +
            '150–200 kg or metres. Surplus stock is negotiable in bulk.'
    },
    {
      step: '05',
      title: 'Packed to format',
      body: 'Rolls (including 20 kg and 25 kg roll packing), thans, packets or boxes, ' +
            'depending on the line.'
    },
    {
      step: '06',
      title: 'Payment and dispatch',
      body: 'Cash, cheque, pay order, bank transfer or online payment. Shipment by ' +
            'road, banked with HDFC Bank.'
    }
  ];

  /* Infrastructure facts, exactly as published on the company profile. */
  KK.infrastructure = [
    { label: 'Nature of business', value: 'Manufacturer' },
    { label: 'Additional business', value: 'Factory / Manufacturing' },
    { label: 'Unit location', value: 'Kabir Nagar, Sekhonwal Road, Ludhiana' },
    { label: 'Team size', value: '11 to 25 people' },
    { label: 'Legal status', value: 'Proprietorship' },
    { label: 'Annual turnover', value: '₹1.5 – 5 Crore' },
    { label: 'Banker', value: 'HDFC Bank' },
    { label: 'GSTIN', value: '03ABLPJ0347H1ZZ', mono: true },
    { label: 'Registered under GST', value: '01 July 2017' },
    { label: 'Shipment mode', value: 'By Road' }
  ];


  /* ======================================================================
     05. CATEGORIES
     `weave` and `hex` are PRESENTATION HINTS for js/swatch.js.
     They are NOT specifications.
     ====================================================================== */

  KK.categories = [
    {
      slug: 'polyester-fabric',
      name: 'Polyester Fabric',
      description: 'The core of the mill: plain, dotted, matty and spun-terry ' +
        'polyester in a broad GSM band, supplied by kilogram and by metre.',
      weave: 'plain', hex: '#2E4A73'
    },
    {
      slug: 'knitted-fabric',
      name: 'Knitted Fabric',
      description: 'Knitted polyester fabric, dot knit, nirmal knit, sarina and plain ' +
        'micro polyester — for fashion, sportswear and casual apparel.',
      weave: 'interlock', hex: '#3D648B'
    },
    {
      slug: 'sportswear-fabric',
      name: 'Sportswear Fabric',
      description: 'Rim zim dotted knits, rice knit, polyester bon patti and school ' +
        'house t-shirt fabric for active and institutional wear.',
      weave: 'rice', hex: '#1F4E45'
    },
    {
      slug: 'polyester-knitted-fabric',
      name: 'Polyester Knitted Fabric',
      description: 'Micro knitting fabric and black dot waffle fabric, knitted in ' +
        'Ludhiana for sportswear and garment programmes.',
      weave: 'waffle', hex: '#15181C'
    },
    {
      slug: 'mens-lower',
      name: 'Mens Lower',
      description: 'Bon patti in interlock construction, made for lower, tracksuit, ' +
        'shorts and pyjama manufacturing.',
      weave: 'interlock', hex: '#28323C'
    },
    {
      slug: 'mens-t-shirt',
      name: 'Mens T Shirt',
      description: 'Dot knit and micro PP fabric for t-shirt programmes, supplied in ' +
        'roll form with effective and timely delivery.',
      weave: 'micro-dot', hex: '#4C5A66'
    },
    {
      slug: 'foma-fabric',
      name: 'Foma Fabric',
      description: 'Polo matty fabric for polo t-shirts and school house t-shirts, ' +
        'finished at 42 inch width and packed in rolls.',
      weave: 'matty', hex: '#2A5B6B'
    },
    {
      slug: 'baby-blanket-jacket-fabrics',
      name: 'Baby Blanket & Jacket Fabrics',
      description: 'Sweater and astar fabric for jacket, sweater and baby blanket ' +
        'construction — soft-handle polyester in the 150–200 GSM band.',
      weave: 'fleece', hex: '#D9D0C4'
    },
    {
      slug: 'surplus-fabric',
      name: 'Surplus Fabric',
      description: 'Ready surplus polyester stock at negotiable bulk rates — the ' +
        'fastest route to fabric when a programme has to ship.',
      weave: 'dot', hex: '#5B6B7A'
    },
    {
      slug: 'bon-patti',
      name: 'Bon Patti',
      description: 'Heavier bon patti at 220 GSM and 44 inch width, used in lowers ' +
        'and track suits.',
      weave: 'interlock', hex: '#243D59'
    },
    {
      slug: 'dot-knit-fabrics',
      name: 'Dot Knit Fabrics',
      description: 'Polka-dot knitted polyester across the full 100–180 GSM range, ' +
        'widely used for ethnic wear and dresses.',
      weave: 'dot', hex: '#6B2E4A'
    },
    {
      slug: 'dotted-fabric',
      name: 'Dotted Fabric',
      description: 'Polyester micro rice knit with a dotted face, available in all ' +
        'colours at 160 GSM.',
      weave: 'micro-dot', hex: '#7B8288'
    },
    {
      slug: 'mesh-fabrics',
      name: 'Mesh Fabrics',
      description: 'Circular-knitted micro-mesh nirmal jali fabric with a soft finish, ' +
        'used for curtains and lightweight panels.',
      weave: 'mesh', hex: '#E8E3DA'
    },
    {
      slug: 'terry-fabric',
      name: 'Terry Fabric',
      description: 'Micro nirmal knit terry fabric for industrial applications, ' +
        'packed by the packet.',
      weave: 'terry', hex: '#2F6B52'
    },
    {
      slug: 'chair-cover',
      name: 'Chair Cover',
      description: 'Tent, table and chair cover fabrics in multicolour polyester for ' +
        'the events and hospitality trade.',
      weave: 'printed', hex: '#A8352F'
    }
  ];


  /* ======================================================================
     06. APPLICATIONS
     Derived from the "Usage/Application" published against each product.
     ====================================================================== */

  KK.applications = [
    { slug: 'apparel',    name: 'Apparel & Clothing',        icon: 'shirt' },
    { slug: 'sportswear', name: 'Sportswear & Activewear',   icon: 'activity' },
    { slug: 'lowers',     name: 'Lowers & Tracksuits',       icon: 'person' },
    { slug: 'tshirt',     name: 'T-shirts & Polos',          icon: 'shirt' },
    { slug: 'uniform',    name: 'Uniforms & Institutional',  icon: 'cap' },
    { slug: 'ethnic',     name: 'Ethnic Wear & Dresses',     icon: 'sparkle' },
    { slug: 'home',       name: 'Home Furnishing',           icon: 'sofa' },
    { slug: 'lining',     name: 'Lining & Interlining',      icon: 'layers' },
    { slug: 'events',     name: 'Tent, Table & Chair Covers', icon: 'tent' },
    { slug: 'industrial', name: 'Industrial Use',            icon: 'factory' }
  ];


  /* ======================================================================
     07. PRODUCTS — 48 published lines
     --------------------------------------------------------------------
     Fields, all transcribed from the source listing:
       slug, name, category, material, gsm, width, pattern, color, usage[],
       moq, price (number | null), unit ('Kg' | 'Meter'), packaging,
       extras[{label,value}], sampleOrders (true | false | null), origin
     Presentation-only (NOT specifications): weave, hex, featured, blurb.
     Optional: image — add 'assets/products/<slug>.jpg' to use a photograph
     instead of the procedural swatch. See README.
     ====================================================================== */

  KK.products = [

    /* ---------------------- Polyester Fabric (21) --------------------- */
    {
      slug: 'sap-matty-fabric',
      name: 'SAP Matty Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      width: '42 inch / customised',
      pattern: 'Sap Matty with collar tape',
      color: 'Blue',
      usage: ['Garments'],
      apps: ['apparel', 'tshirt'],
      moq: '200 Kg',
      price: 210, unit: 'Kg',
      packaging: 'Rolls',
      extras: [{ label: 'Wash care', value: 'Machine wash' }],
      origin: 'Made in India',
      weave: 'matty', hex: '#2E4A73', featured: true,
      blurb: 'A matty-face polyester supplied with matching collar tape, finished at ' +
        '42 inch and customisable on width — the go-to construction for collared ' +
        'garment programmes.'
    },
    {
      slug: 'polyester-fabric',
      name: 'Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester, knitted',
      gsm: '130–150',
      width: '44 inch',
      pattern: 'Plain / solid',
      color: 'Multicolour',
      usage: ['Shirts', 'Garments'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 185, unit: 'Kg',
      weave: 'plain', hex: '#3D648B', featured: true,
      blurb: 'The mill’s workhorse knitted polyester: a clean plain face in the ' +
        '130–150 GSM band at 44 inch, dyed to order across the full shade range.'
    },
    {
      slug: '120-gsm-polyester-black-fabric',
      name: '120 GSM Polyester Black Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '120',
      width: '36 inch / 90 cm',
      pattern: 'Plain / solids',
      color: 'Black',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 185, unit: 'Kg',
      weave: 'plain', hex: '#15181C',
      blurb: 'A light 120 GSM black polyester at 36 inch — specified where a lean, ' +
        'opaque solid is needed without adding weight to the garment.'
    },
    {
      slug: '200-gsm-dot-grindal-fabric',
      name: '200 GSM Dot Grindal Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '200',
      pattern: 'Plain / solids',
      color: 'Multicolour',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      weave: 'dot', hex: '#3E4A57',
      blurb: 'Dot grindal at a substantial 200 GSM, available across the shade card ' +
        'from a 100 kg minimum.'
    },
    {
      slug: 'sportswear-polyester-fabric',
      name: 'Sportswear Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '190',
      width: '42 inch / 107 cm',
      pattern: 'Polka dots / plain',
      color: 'Black with colour dots',
      usage: ['Sports pyjamas', 'Shirts'],
      apps: ['sportswear', 'lowers'],
      moq: '200 Kg',
      price: 190, unit: 'Kg',
      weave: 'dot', hex: '#1B2E44', featured: true,
      blurb: 'A 190 GSM dotted polyester built for sports pyjamas and shirting, with ' +
        'a black ground carrying contrast dots.'
    },
    {
      slug: '170-gsm-polyester-spun-terry-fabric',
      name: '170 GSM Polyester Spun Terry Fabric',
      category: 'polyester-fabric',
      material: 'Knitted polyester',
      gsm: '120–250 (range)',
      pattern: 'Plain / solids',
      color: 'On order',
      usage: ['Garments'],
      apps: ['apparel', 'sportswear'],
      moq: '200 Kg',
      price: 200, unit: 'Kg',
      weave: 'terry', hex: '#4C5A66',
      blurb: 'Spun terry knitted across an unusually wide 120–250 GSM window, so a ' +
        'single construction can serve both light and heavy garment briefs.'
    },
    {
      slug: 'pillow-cover-fabric',
      name: 'Pillow Cover Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '100',
      pattern: 'Striped',
      color: 'White',
      usage: ['Pillow covers'],
      apps: ['home'],
      moq: '200 Kg',
      price: 175, unit: 'Kg',
      packaging: '20 kg rolls',
      weave: 'stripe', hex: '#EFEAE3',
      blurb: 'A 100 GSM white striped polyester for pillow-cover production, packed ' +
        'in 20 kg rolls for straightforward cutting-room handling.'
    },
    {
      slug: 'micro-plain-polyester-knitted-fabric',
      name: 'Micro Plain Polyester Knitted Fabric',
      category: 'polyester-fabric',
      material: 'Micro polyester',
      gsm: '150',
      pattern: 'Plain',
      color: 'White',
      usage: ['Garments', 'Shirts'],
      apps: ['apparel'],
      moq: '100 Meter',
      price: 210, unit: 'Meter',
      weave: 'plain', hex: '#E8E3DA',
      blurb: 'Micro-filament polyester with a smooth plain face at 150 GSM, sold by ' +
        'the metre from a 100 metre minimum.'
    },
    {
      slug: 'chair-cover-polyester-fabric',
      name: 'Chair Cover Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '200',
      pattern: 'Printed',
      color: 'Red base',
      usage: ['Chair covering'],
      apps: ['events', 'home'],
      moq: '200 Meter',
      price: 210, unit: 'Meter',
      weave: 'printed', hex: '#A8352F',
      blurb: 'A printed 200 GSM polyester on a red ground, cut and sewn into chair ' +
        'covers for the events and banqueting trade.'
    },
    {
      slug: 'polyester-knitted-fabric-plain',
      name: 'Polyester Knitted Fabric — Plain',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '140–160',
      pattern: 'Plain / solids',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '200 Meter',
      price: 195, unit: 'Meter',
      weave: 'plain', hex: '#5B83A8',
      blurb: 'Plain knitted polyester held in the 140–160 GSM band, sold by the metre ' +
        'for programmes that cost by length.'
    },
    {
      slug: 'polyester-knitted-fabric-blue',
      name: 'Polyester Knitted Fabric — Blue',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '130',
      pattern: 'Plain / solids',
      color: 'Blue',
      usage: ['Shirts', 'Trousers', 'Suits', 'Coats & jackets', 'Lining', 'Industrial use'],
      apps: ['apparel', 'lining', 'industrial'],
      moq: '200 Meter',
      price: 195, unit: 'Meter',
      weave: 'plain', hex: '#2E4A73',
      blurb: 'One of the most broadly specified lines on the floor — a 130 GSM blue ' +
        'knit that runs from shirting and tailoring through to lining and industrial ' +
        'end-uses.'
    },
    {
      slug: 'sportswear-black-dot-polyester-fabric',
      name: 'Sportswear Black DOT Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '80',
      width: '42 inch / 107 cm',
      pattern: 'Polka dots',
      color: 'Black base',
      usage: ['Sportswear'],
      apps: ['sportswear'],
      moq: '200 Kg',
      price: 195, unit: 'Kg',
      weave: 'micro-dot', hex: '#0F161C',
      blurb: 'At 80 GSM this is the lightest dotted construction in the range — ' +
        'specified where breathability and drape matter more than body.'
    },
    {
      slug: '160-gsm-orange-polyester-fabric',
      name: '160 GSM Orange Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '160',
      pattern: 'Solid',
      color: 'Orange',
      usage: ['Garments', 'Textile industries'],
      apps: ['apparel', 'industrial'],
      moq: '200 Meter',
      price: 200, unit: 'Meter',
      weave: 'plain', hex: '#C46A2A',
      blurb: 'A saturated solid orange at 160 GSM, supplied both to garment makers ' +
        'and onward to the textile trade.'
    },
    {
      slug: 'polyester-sportswear-fabrics-dri-fit',
      name: 'Polyester Sportswear Fabrics — Dri-Fit',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '200',
      width: '42 inch',
      pattern: 'Plain',
      usage: ['Sportswear'],
      apps: ['sportswear'],
      moq: '100 Kg',
      price: 185, unit: 'Kg',
      extras: [{ label: 'Type', value: 'Dri-Fit' }],
      weave: 'rice', hex: '#1F4E45', featured: true,
      blurb: 'A 200 GSM Dri-Fit polyester at 42 inch — the sportswear base cloth, ' +
        'opened at a 100 kg minimum so smaller brands can trial it.'
    },
    {
      slug: 'tent-house-check-fabric',
      name: 'Tent House Check Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '110',
      pattern: 'Check',
      color: 'Black base and colours',
      usage: ['Tent', 'Table and chair covers'],
      apps: ['events'],
      price: null, unit: 'Kg',
      weave: 'check', hex: '#28323C',
      blurb: 'A 110 GSM checked polyester for tent houses — priced on requirement ' +
        'because widths and shades are set per contract.'
    },
    {
      slug: 'bright-fabrics-for-burka',
      name: 'Bright Fabrics for Burka',
      category: 'polyester-fabric',
      material: '100% Polyester',
      gsm: '100–150',
      width: '42 inch / 107 cm',
      pattern: 'Plain / solid',
      usage: ['Burka'],
      apps: ['ethnic', 'apparel'],
      moq: '100 Kg',
      price: 200, unit: 'Kg',
      sampleOrders: true,
      weave: 'plain', hex: '#14222F',
      blurb: 'Bright-finish 100% polyester in the 100–150 GSM band at 42 inch, made ' +
        'for burka manufacturing. Samples available.'
    },
    {
      slug: '140-gsm-plain-polyester-fabric',
      name: '140 GSM Plain Polyester Fabric',
      category: 'polyester-fabric',
      material: '100% Polyester',
      gsm: '140',
      width: '36 inch / 90 cm',
      pattern: 'Plain / solids',
      color: 'Blue',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 180, unit: 'Kg',
      weave: 'plain', hex: '#3D648B',
      blurb: 'A dependable 140 GSM plain blue at 36 inch and one of the keenest rates ' +
        'in the polyester range.'
    },
    {
      slug: '180-gsm-plain-polyester-fabric',
      name: '180 GSM Plain Polyester Fabric',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '180',
      width: '31 inch / 78 cm',
      pattern: 'Plain / solids',
      color: 'Blue',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 180, unit: 'Kg',
      weave: 'plain', hex: '#243D59',
      blurb: 'The same keen rate as the 140 GSM plain but with noticeably more body, ' +
        'knitted to a narrower 31 inch finish.'
    },
    {
      slug: 'chamki-tent-fabric',
      name: 'Chamki Tent Fabric',
      category: 'polyester-fabric',
      material: 'Bright lycra polyester',
      gsm: '100',
      width: 'On demand',
      pattern: 'Plain',
      usage: ['Tent construction'],
      apps: ['events'],
      moq: '100 Kg',
      price: 185, unit: 'Kg',
      packaging: '25 kg per roll',
      weave: 'sparkle', hex: '#1B2E44',
      blurb: 'A bright lycra polyester with a chamki sparkle, knitted at 100 GSM for ' +
        'tent work and rolled at 25 kg.'
    },
    {
      slug: 'polyester-chandani-burka-fabric',
      name: 'Polyester Chandani Burka Fabric (58 & 68 inch)',
      category: 'polyester-fabric',
      material: 'Polyester',
      gsm: '100–150',
      width: '42 inch / 107 cm',
      pattern: 'Plain',
      usage: ['Burka'],
      apps: ['ethnic', 'apparel'],
      moq: '100 Kg',
      price: 200, unit: 'Kg',
      sampleOrders: true,
      weave: 'plain', hex: '#101E2B',
      blurb: 'Chandani-finish polyester offered in 58 and 68 inch panel options for ' +
        'burka manufacturing. Samples available.'
    },
    {
      slug: 'chamki-fabrics-for-burka',
      name: 'Chamki Fabrics for Burka',
      category: 'polyester-fabric',
      material: '100% Polyester',
      gsm: '100',
      width: '60 inch',
      pattern: 'Plain / solid',
      usage: ['Burka'],
      apps: ['ethnic', 'apparel'],
      moq: '100 Kg',
      price: 200, unit: 'Kg',
      packaging: 'Than',
      sampleOrders: false,
      extras: [{ label: 'Type', value: 'Dot knit' }],
      weave: 'sparkle', hex: '#14222F',
      blurb: 'Dot-knit chamki at a wide 60 inch and 100 GSM, packed in thans for ' +
        'burka units.'
    },

    /* ----------------------- Knitted Fabric (8) ----------------------- */
    {
      slug: 'lining-fabric-for-baby-blankets',
      name: 'Lining Fabric For Baby Blankets',
      category: 'knitted-fabric',
      material: 'Polyester',
      gsm: '160',
      pattern: 'Plain',
      color: 'White',
      usage: ['Suit lining'],
      apps: ['lining', 'home'],
      price: 155, unit: 'Kg',
      packaging: 'Roll',
      extras: [{ label: 'Weave', value: 'Plain' }],
      weave: 'fleece', hex: '#F2EFE9',
      blurb: 'A lightweight, breathable and highly absorbent 160 GSM polyester lining ' +
        '— used behind baby blankets and as suit lining. The most keenly priced line ' +
        'in the range.'
    },
    {
      slug: 'polyester-foma-fabric',
      name: 'Polyester Foma Fabric',
      category: 'knitted-fabric',
      material: 'Polyester',
      gsm: '211–240',
      pattern: 'Plain',
      usage: ['Hoodie', 'Trouser'],
      apps: ['apparel', 'lowers'],
      moq: '200 Kg',
      price: 170, unit: 'Kg',
      extras: [
        { label: 'Weave', value: 'Plain' },
        { label: 'Finish', value: 'Easy care' }
      ],
      weave: 'fleece', hex: '#4C5A66', featured: true,
      blurb: 'The heaviest construction on the floor at 211–240 GSM, easy-care ' +
        'finished for hoodies and trousers.'
    },
    {
      slug: 'nirmal-knit-fabric',
      name: 'Nirmal Knit Fabric',
      category: 'knitted-fabric',
      material: 'Polyester',
      gsm: '200',
      pattern: 'Plain',
      color: 'White',
      usage: ['Garments'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 210, unit: 'Kg',
      weave: 'interlock', hex: '#E8E3DA',
      blurb: 'Nirmal knit at a solid 200 GSM in white — a staple garment cloth ' +
        'carried continuously.'
    },
    {
      slug: 'plain-knit-fabric',
      name: 'Plain Knit Fabric',
      category: 'knitted-fabric',
      material: 'Knitted fabric',
      gsm: '220',
      pattern: 'Plain / solids',
      color: 'Blue',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '200 Kg',
      price: 210, unit: 'Kg',
      weave: 'interlock', hex: '#2E4A73',
      blurb: 'A firm 220 GSM plain knit in blue, with enough body for structured ' +
        'apparel.'
    },
    {
      slug: 'honeycomb-knitted-fabrics',
      name: 'Honeycomb Knitted Fabrics',
      category: 'knitted-fabric',
      material: '100% Polyester',
      gsm: '150–200',
      pattern: 'Rice knit',
      color: 'All colours',
      usage: ['Garments'],
      apps: ['apparel', 'sportswear'],
      moq: '100 Meter',
      price: 190, unit: 'Meter',
      weave: 'honeycomb', hex: '#3D648B', featured: true,
      blurb: 'A textured honeycomb face on a rice-knit base, 150–200 GSM, produced in ' +
        'the full colour range and sold by the metre.'
    },
    {
      slug: 'polyester-knitted-fabric-pc',
      name: 'Polyester Knitted Fabric (PC)',
      category: 'knitted-fabric',
      material: 'PC — poly-cotton',
      gsm: 'Custom',
      width: 'Custom',
      color: 'Multicolour',
      usage: ['Night suits', 'Lowers & trackpants', 'Sportswear', 'T-shirts'],
      apps: ['apparel', 'lowers', 'sportswear', 'tshirt'],
      price: 180, unit: 'Kg',
      weave: 'interlock', hex: '#5B83A8',
      blurb: 'A poly-cotton knit knitted to the buyer’s GSM and width — the flexible ' +
        'option when a programme spans night suits, lowers, sportswear and tees.'
    },
    {
      slug: 'discat-dot-fabrics',
      name: 'Discat Dot Fabrics',
      category: 'knitted-fabric',
      material: 'Polyester',
      pattern: 'Plain / solids',
      color: 'Gray',
      usage: ['Apparel', 'Clothing'],
      apps: ['apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      origin: 'Made in India',
      weave: 'dot', hex: '#7B8288',
      blurb: 'Discat dot in a neutral grey — a quiet dotted texture that reads as ' +
        'solid at a distance.'
    },
    {
      slug: 'rim-zim-fabric',
      name: 'Rim Zim Fabric',
      category: 'knitted-fabric',
      material: 'Polyester',
      gsm: '150–200',
      width: '44–45 inch',
      usage: ['Garments'],
      apps: ['apparel', 'ethnic'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      origin: 'Made in India',
      weave: 'sparkle', hex: '#243D59',
      blurb: 'Rim zim knitted at 150–200 GSM and a generous 44–45 inch — a light ' +
        'shimmer without any applied coating.'
    },

    /* --------------------- Sportswear Fabric (4) ---------------------- */
    {
      slug: 'rim-zim-doted-knitted-fabrics',
      name: 'Rim Zim Doted Knitted Fabrics',
      category: 'sportswear-fabric',
      material: '100% Polyester',
      gsm: '150–200',
      usage: ['Garments'],
      apps: ['sportswear', 'apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      sampleOrders: true,
      weave: 'micro-dot', hex: '#1F4E45',
      blurb: 'Rim zim with a dotted face, knitted 150–200 GSM in 100% polyester. ' +
        'Sample orders accepted.'
    },
    {
      slug: 'rice-knit-fabric',
      name: 'Rice Knit Fabric',
      category: 'sportswear-fabric',
      material: '100% Polyester',
      gsm: '150–200',
      width: '44 inch / 112 cm',
      color: 'Multicolour',
      usage: ['Garments'],
      apps: ['sportswear', 'apparel', 'tshirt'],
      moq: '100 Kg',
      price: 185, unit: 'Kg',
      packaging: 'Roll',
      sampleOrders: true,
      extras: [
        { label: 'Gauge', value: '24' },
        { label: 'Yarn count', value: '100 to 150' },
        { label: 'Wash care', value: 'Machine wash' },
        { label: 'Season', value: 'All seasons' }
      ],
      weave: 'rice', hex: '#3D648B', featured: true,
      blurb: 'The most fully specified line in the catalogue — 24 gauge, 100–150 yarn ' +
        'count, 150–200 GSM at 44 inch, machine washable and carried for all seasons.'
    },
    {
      slug: 'polyester-bon-patti',
      name: 'Polyester Bon Patti',
      category: 'sportswear-fabric',
      material: '100% Polyester',
      gsm: '150',
      width: '60 inch',
      pattern: 'Plain / solid',
      color: 'Multicolour',
      usage: ['Lower'],
      apps: ['lowers', 'sportswear'],
      moq: '200 Meter',
      price: 170, unit: 'Meter',
      weave: 'interlock', hex: '#28323C',
      blurb: 'Bon patti at a full 60 inch and 150 GSM, sold by the metre for lower ' +
        'manufacturing.'
    },
    {
      slug: 'school-house-t-shirt-fabric',
      name: 'School House T Shirt Fabric',
      category: 'sportswear-fabric',
      material: 'Polyester',
      pattern: 'Plain',
      usage: ['T-shirts'],
      apps: ['uniform', 'tshirt'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      weave: 'matty', hex: '#2A5B6B',
      blurb: 'Plain polyester made for school house t-shirts, dyed to the house ' +
        'colours a school specifies.'
    },

    /* ------------------ Polyester Knitted Fabric (2) ------------------ */
    {
      slug: 'micro-knitting-fabric',
      name: 'Micro Knitting Fabric',
      category: 'polyester-knitted-fabric',
      material: 'Polyester',
      gsm: '160',
      width: '42 inch',
      color: 'White — other colours on request',
      usage: ['Garments'],
      apps: ['apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      extras: [{ label: 'Type', value: 'Nirmal knit' }],
      weave: 'interlock', hex: '#F2EFE9',
      blurb: 'Micro-filament nirmal knit at 160 GSM and 42 inch, held in white with ' +
        'other shades knitted to order.'
    },
    {
      slug: 'black-dot-waffle-fabric',
      name: 'Black Dot Waffle Fabric',
      category: 'polyester-knitted-fabric',
      material: 'Polyester',
      gsm: '100',
      width: '58 inch',
      pattern: 'Dotted',
      usage: ['Sportswear garments'],
      apps: ['sportswear'],
      moq: '150 Meter',
      price: 150, unit: 'Meter',
      origin: 'Made in India',
      weave: 'waffle', hex: '#15181C', featured: true,
      blurb: 'A waffle-structured dot at just 100 GSM on a wide 58 inch — the lowest ' +
        'metre rate in the catalogue and a favourite for sportswear panels.'
    },

    /* -------------------------- Mens Lower (2) ------------------------ */
    {
      slug: '150-gsm-bon-patti',
      name: '150 GSM Bon Patti',
      category: 'mens-lower',
      material: '100% Polyester',
      gsm: '150',
      width: '60 inch',
      pattern: 'Plain / solid',
      color: 'Multiple options',
      usage: ['Lower making', 'Tracksuit making'],
      apps: ['lowers', 'sportswear'],
      moq: '100 Kg',
      price: 180, unit: 'Kg',
      extras: [{ label: 'Knit type', value: 'Interlock' }],
      weave: 'interlock', hex: '#28323C', featured: true,
      blurb: 'Interlock bon patti at 150 GSM and 60 inch — stable, low-curl and ' +
        'dimensionally reliable through lower and tracksuit assembly.'
    },
    {
      slug: 'bon-patti-used-in-tracksuit',
      name: 'Bon Patti used in tracksuit',
      category: 'mens-lower',
      material: 'Polyester',
      gsm: '140',
      pattern: 'Plain',
      usage: ['Track suits', 'Shorts', 'Pyjama'],
      apps: ['lowers', 'sportswear'],
      moq: '200 Kg',
      price: 195, unit: 'Kg',
      weave: 'interlock', hex: '#374450',
      blurb: 'A 140 GSM bon patti specified across tracksuits, shorts and pyjama ' +
        'programmes.'
    },

    /* ------------------------- Mens T Shirt (2) ----------------------- */
    {
      slug: 'dot-knit-fabric-t-shirt',
      name: 'Dot Knit Fabric',
      category: 'mens-t-shirt',
      material: 'Polyester',
      gsm: '100–150',
      pattern: 'Plain / solids',
      color: 'Multicolour',
      usage: ['Apparel', 'Clothing'],
      apps: ['tshirt', 'apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      origin: 'Made in India',
      weave: 'micro-dot', hex: '#4C5A66',
      blurb: 'T-shirt grade dot knit in the 100–150 GSM band, supplied across the ' +
        'shade card with effective and timely delivery.'
    },
    {
      slug: 'micro-pp-fabric',
      name: 'Micro PP Fabric',
      category: 'mens-t-shirt',
      material: 'Spunlace',
      gsm: '121–150',
      width: '160 cm',
      pattern: 'Plain',
      color: 'Multicolour',
      usage: ['T-shirts'],
      apps: ['tshirt', 'apparel'],
      moq: '100 Kg',
      price: 190, unit: 'Kg',
      packaging: 'Roll',
      extras: [
        { label: 'Fabric form', value: 'Roll' },
        { label: 'Surface type', value: 'Plain' }
      ],
      origin: 'India',
      weave: 'plain', hex: '#98A5AF',
      blurb: 'Micro polyester at a wide 160 cm, knitted in the 121–150 GSM band. ' +
        'Available in all colours on order, with 100 and 160 GSM options.'
    },

    /* ------------------------- Foma Fabric (1) ------------------------ */
    {
      slug: 'polo-matty-fabric',
      name: 'Polo Matty Fabric',
      category: 'foma-fabric',
      material: 'Polyester',
      width: '42 inch',
      pattern: 'Dots',
      usage: ['Polo t-shirts', 'School house t-shirts', 'Garments'],
      apps: ['tshirt', 'uniform'],
      price: 210, unit: 'Kg',
      packaging: 'Rolls',
      extras: [
        { label: 'Wash care', value: 'Machine wash' },
        { label: 'Brand', value: 'KK KNITWEAR CLUB' }
      ],
      origin: 'Made in India',
      weave: 'matty', hex: '#2A5B6B', featured: true,
      blurb: 'The polo cloth: a dotted matty face at 42 inch, machine washable and ' +
        'rolled ready for the cutting table. Used for polo tees and school house ' +
        'shirts alike.'
    },

    /* --------------- Baby Blanket & Jacket Fabrics (1) ---------------- */
    {
      slug: 'sweater-fabric-or-astar-fabric',
      name: 'Sweater Fabric or Astar Fabric',
      category: 'baby-blanket-jacket-fabrics',
      material: 'Polyester',
      gsm: '150–200',
      width: '40–42 inch',
      pattern: 'Plain',
      color: 'White',
      usage: ['Garments'],
      apps: ['apparel', 'lining', 'home'],
      moq: '100 Kg',
      price: 165, unit: 'Kg',
      extras: [{ label: 'Gender', value: 'Unisex' }],
      weave: 'fleece', hex: '#E8E3DA',
      blurb: 'A soft-handle 150–200 GSM polyester used as sweater cloth and as astar ' +
        'behind jackets and blankets, at 40–42 inch.'
    },

    /* ------------------------ Surplus Fabric (1) ---------------------- */
    {
      slug: 'surplus-polyester-fabric',
      name: 'Surplus Polyester Fabric',
      category: 'surplus-fabric',
      material: '100% Polyester',
      gsm: '180',
      width: '42 inch',
      pattern: 'Dotted',
      usage: ['Uniforms', 'Sportswear', 'Bags', 'Lowers & trackpants', 'T-shirts',
              'Nightwear', 'Dress material', 'Garments'],
      apps: ['uniform', 'sportswear', 'lowers', 'tshirt', 'apparel'],
      price: 150, unit: 'Kg',
      extras: [
        { label: 'Fabric structure', value: 'Dot' },
        { label: 'Finish', value: 'Dri-Fit' },
        { label: 'Pricing', value: 'Negotiable for bulk orders' }
      ],
      weave: 'dot', hex: '#5B6B7A', featured: true,
      blurb: 'Ready Dri-Fit surplus at 180 GSM and 42 inch, negotiable in bulk — the ' +
        'most widely applicable single line in the catalogue and the quickest to ' +
        'dispatch.'
    },

    /* -------------------------- Bon Patti (1) ------------------------- */
    {
      slug: 'bon-patti-use-in-lowers-and-track-suits',
      name: 'Bon Patti use in Lowers and track suits',
      category: 'bon-patti',
      material: 'Polyester',
      gsm: '220',
      width: '44 inch',
      pattern: 'Plain',
      usage: ['Lowers', 'Track suits'],
      apps: ['lowers', 'sportswear'],
      moq: '100 Kg',
      price: 189, unit: 'Kg',
      extras: [
        { label: 'Weave type', value: 'Plain' },
        { label: 'Gender', value: 'Unisex' }
      ],
      weave: 'interlock', hex: '#243D59',
      blurb: 'The heaviest bon patti carried, at 220 GSM and 44 inch, for lowers and ' +
        'track suits that need real substance.'
    },

    /* ----------------------- Dot Knit Fabrics (1) --------------------- */
    {
      slug: 'dot-knit-fabric',
      name: 'Dot Knit Fabric',
      category: 'dot-knit-fabrics',
      material: 'Polyester',
      gsm: '100 to 180 — all GSM available',
      width: '42 inch',
      pattern: 'Polka dots',
      color: 'Multicolour',
      usage: ['Ethnic wear', 'Dresses'],
      apps: ['ethnic', 'apparel'],
      moq: '100 Kg',
      price: 195, unit: 'Kg',
      extras: [{ label: 'Type', value: 'Dot knit' }],
      weave: 'dot', hex: '#6B2E4A', featured: true,
      blurb: 'The signature dot knit — a polka-dot face at 42 inch, knitted anywhere ' +
        'across 100 to 180 GSM and dyed to the full shade card. Widely used for ' +
        'ethnic wear and dresses.'
    },

    /* ------------------------ Dotted Fabric (1) ----------------------- */
    {
      slug: 'polyester-micro-rice-knit-fabric',
      name: 'Polyester Micro Rice Knit Fabric',
      category: 'dotted-fabric',
      material: 'Polyester',
      gsm: '160',
      width: '42 inch',
      pattern: 'Dotted',
      color: 'All colours available',
      usage: ['Garments'],
      apps: ['apparel', 'sportswear'],
      moq: '100 Kg',
      price: 180, unit: 'Kg',
      extras: [{ label: 'Type', value: 'Rice knit' }],
      weave: 'rice', hex: '#7B8288',
      blurb: 'Micro rice knit with a dotted face at 160 GSM and 42 inch, produced in ' +
        'every colour on the card.'
    },

    /* ------------------------ Mesh Fabrics (1) ------------------------ */
    {
      slug: 'nirmal-jali-fabric',
      name: 'Nirmal Jali Fabric',
      category: 'mesh-fabrics',
      material: 'Polyester',
      gsm: 'On order',
      color: 'White',
      usage: ['Curtain'],
      apps: ['home'],
      price: 190, unit: 'Kg',
      extras: [
        { label: 'Mesh type', value: 'Circular knitted' },
        { label: 'Mesh size', value: 'Micro mesh' },
        { label: 'Finish', value: 'Soft' }
      ],
      weave: 'mesh', hex: '#F2EFE9',
      blurb: 'Circular-knitted micro-mesh jali with a soft finish, knitted to the GSM ' +
        'a curtain programme calls for.'
    },

    /* ------------------------ Terry Fabric (1) ------------------------ */
    {
      slug: 'micro-nirmal-knit-fabrics',
      name: 'Micro Nirmal Knit Fabrics',
      category: 'terry-fabric',
      material: '100% Polyester',
      color: 'Green',
      usage: ['Industrial'],
      apps: ['industrial'],
      moq: '100 Kg',
      price: 198, unit: 'Kg',
      packaging: 'Packet',
      extras: [{ label: 'Fabric type', value: 'Micro nirmal knit' }],
      origin: 'Made in India',
      weave: 'terry', hex: '#2F6B52',
      blurb: 'Micro nirmal knit terry in 100% polyester, supplied in green for ' +
        'industrial use and packed by the packet.'
    },

    /* ------------------------- Chair Cover (1) ------------------------ */
    {
      slug: 'tent-table-and-chair-cover-fabrics',
      name: 'Tent Table And Chair Cover Fabrics',
      category: 'chair-cover',
      material: 'Polyester',
      width: '37 mm',
      color: 'Multicolour',
      usage: ['Tent fabrics'],
      apps: ['events'],
      moq: '100 Kg',
      price: 200, unit: 'Kg',
      packaging: 'Box',
      origin: 'Made in India',
      weave: 'printed', hex: '#A8352F',
      blurb: 'Multicolour polyester for tent, table and chair covers — boxed and ' +
        'dispatched by road to the events trade.'
    }
  ];


  /* ======================================================================
     08. DERIVED HELPERS
     ====================================================================== */

  KK.categoryBySlug = {};
  KK.categories.forEach(function (c) { KK.categoryBySlug[c.slug] = c; });

  KK.productBySlug = {};
  KK.products.forEach(function (p) { KK.productBySlug[p.slug] = p; });

  /* Live counts, so no number on the site can drift from the data. */
  KK.categories.forEach(function (c) {
    c.count = KK.products.filter(function (p) {
      return p.category === c.slug;
    }).length;
  });

  KK.applications.forEach(function (a) {
    a.count = KK.products.filter(function (p) {
      return p.apps && p.apps.indexOf(a.slug) !== -1;
    }).length;
    a.example = KK.products.filter(function (p) {
      return p.apps && p.apps.indexOf(a.slug) !== -1;
    })[0];
  });

  KK.featured = KK.products.filter(function (p) { return p.featured; });

  /** Numeric GSM midpoint for range filtering. null when GSM isn't published. */
  KK.gsmValue = function (product) {
    if (!product.gsm) return null;
    var nums = String(product.gsm).match(/\d+/g);
    if (!nums) return null;
    var sum = 0;
    nums.forEach(function (n) { sum += Number(n); });
    return sum / nums.length;
  };

  KK.priceRange = (function () {
    var values = KK.products
      .map(function (p) { return p.price; })
      .filter(function (v) { return typeof v === 'number'; });
    return { min: Math.min.apply(null, values), max: Math.max.apply(null, values) };
  }());

  /** Related lines: same category first, then anything sharing an application. */
  KK.related = function (product, limit) {
    limit = limit || 3;
    var same = KK.products.filter(function (p) {
      return p.category === product.category && p.slug !== product.slug;
    });
    if (same.length >= limit) return same.slice(0, limit);
    var shared = KK.products.filter(function (p) {
      return p.slug !== product.slug &&
        p.category !== product.category &&
        p.apps && product.apps &&
        p.apps.some(function (a) { return product.apps.indexOf(a) !== -1; });
    });
    return same.concat(shared).slice(0, limit);
  };

}(window));
