import type { SeedImageKey } from "./types";

export interface SeedDestination {
  name: string;
  slug: string;
  region: string;
  shortDescription: string;
  description: string;
  hero: SeedImageKey;
  gallery: SeedImageKey[];
  thingsToDo: { title: string; description: string }[];
  bestTimeToVisit: string;
  howToGetThere: string;
  travelTips: string[];
  tours: string[];
  featured: boolean;
  order: number;
}

export const DESTINATIONS: SeedDestination[] = [
  {
    name: "Tbilisi",
    slug: "tbilisi",
    region: "Capital",
    shortDescription: "Georgia's capital: sulfur baths, carved balconies, a lively food and wine scene and a history shaped by the Silk Road.",
    description: `Tbilisi sits in a narrow valley along the Mtkvari river, and its name comes from the Georgian word for "warm" — a reference to the sulfur springs that still feed its bathhouses. Founded in the 5th century, the city has been ruled or raided by Persians, Arabs, Byzantines, Mongols and Russians, and each left a trace.

Today it is one of the most rewarding cities in the region for travelers: compact enough to explore on foot, with an excellent restaurant and wine bar scene, galleries, flea markets and a creative energy that is hard to miss. It is also the natural base for day trips to Mtskheta, Kazbegi and Kakheti.

## Neighbourhoods to know

**Old Tbilisi** (Kala and Abanotubani) is the historic core with the baths and fortress. **Sololaki** has grand 19th-century houses with painted entrance halls. **Vera** and **Vake** are leafy residential districts with cafés, and the **Fabrika** area in Chugureti is a lively hub in a former Soviet sewing factory.`,
    hero: "tbilisi",
    gallery: ["tbilisi", "fortress", "food"],
    thingsToDo: [
      { title: "Bathe in the sulfur baths", description: "Book a private room in one of Abanotubani's historic bathhouses for an hour of warm mineral water — ideal after a long flight." },
      { title: "Ride up to Narikala", description: "Take the cable car from Rike Park to the fortress and walk down through the botanical garden." },
      { title: "Browse the Dry Bridge market", description: "Soviet memorabilia, paintings, old cameras and silver jewellery, best on weekends." },
      { title: "Visit the Georgian National Museum", description: "The treasury holds remarkable gold jewellery from ancient Colchis." },
      { title: "Taste natural wine", description: "Tbilisi has some of the best wine bars in the region, many focused on small qvevri producers." },
    ],
    bestTimeToVisit: "Spring (April–June) and autumn (September–November) are the most comfortable. Summer can reach the mid-30s °C; winter is mild but grey, with few crowds.",
    howToGetThere: "Tbilisi International Airport (TBS) is about 20 minutes from the centre by car. We recommend booking a private transfer, especially for late-night arrivals.",
    travelTips: [
      "Many streets in the Old Town are steep and cobbled — bring comfortable shoes.",
      "Bolt is the most widely used ride-hailing app in the city.",
      "Tap water is generally drinkable, but most visitors prefer bottled or filtered water.",
      "Cards are widely accepted; keep some lari in cash for markets and small cafés.",
    ],
    tours: ["tbilisi-old-town-walking-tour", "georgia-food-and-culture-tour", "georgia-highlights-7-days"],
    featured: true,
    order: 1,
  },
  {
    name: "Kazbegi",
    slug: "kazbegi",
    region: "Mtskheta-Mtianeti",
    shortDescription: "The high Caucasus at its most iconic: Gergeti Trinity Church, the glaciers of Mount Kazbek and some of Georgia's best day hikes.",
    description: `Kazbegi is the name most travelers use for the area around the village of **Stepantsminda**, about three hours north of Tbilisi on the Georgian Military Highway. Above the village rises **Mount Kazbek** (5,054 m), a dormant volcano wrapped in Georgian and Greek legend — it is said to be where Prometheus was chained.

The view of the 14th-century **Gergeti Trinity Church** against Kazbek's glacier is one of the defining images of Georgia. But the area has much more: the mineral springs and abandoned villages of the **Truso Valley**, the alpine meadows of **Juta** beneath the Chaukhi massif, and the gorge of **Dariali** close to the Russian border.

Kazbegi works as a long day trip from Tbilisi, but staying a night lets you see the mountains at sunrise and walk the valleys without rushing.`,
    hero: "kazbegi",
    gallery: ["kazbegi", "highlands", "road"],
    thingsToDo: [
      { title: "Gergeti Trinity Church", description: "Hike up in about 1.5 hours or ride a 4×4, and try to arrive early for the clearest views." },
      { title: "Truso Valley", description: "An easy, mostly flat walk past travertine springs and abandoned towers." },
      { title: "Juta and the Chaukhi massif", description: "A beautiful half-day hike to alpine meadows and, for fitter walkers, the Fifth Season hut and beyond." },
      { title: "Dariali Monastery and Gveleti waterfall", description: "A short walk to a waterfall near the border, combined with a visit to the modern monastery." },
    ],
    bestTimeToVisit: "June to September for hiking. Winter brings snow and a magical atmosphere, but the Jvari Pass can close temporarily after storms.",
    howToGetThere: "Around 3 hours by car from Tbilisi via the Georgian Military Highway. A private driver lets you stop at Ananuri and the Friendship Monument on the way.",
    travelTips: [
      "Bring a warm layer and rain jacket in every season.",
      "Clouds often build around Kazbek after midday — mornings are usually clearer.",
      "Women need a head covering and skirt to enter Gergeti church; wraps are provided.",
    ],
    tours: ["mtskheta-and-kazbegi-day-trip", "georgia-highlights-7-days"],
    featured: true,
    order: 2,
  },
  {
    name: "Kakheti",
    slug: "kakheti",
    region: "Eastern Georgia",
    shortDescription: "Georgia's wine country: family qvevri cellars, the hilltop town of Sighnaghi and vineyards beneath the Greater Caucasus.",
    description: `Kakheti, in Georgia's far east, produces most of the country's wine. The **Alazani Valley** stretches for over 100 kilometres with vineyards on the valley floor and the snowy wall of the Greater Caucasus behind them.

Winemaking here goes back thousands of years, and the traditional method — fermenting grapes with their skins, stems and seeds in buried clay **qvevri** — gives Kakheti's amber wines their colour and depth. Saperavi, a dark-skinned grape with red flesh, is the region's signature red.

The two bases are **Telavi**, the regional capital with its old plane tree and royal fortress, and **Sighnaghi**, a restored hilltop town with 18th-century walls. Between them lie monasteries such as **Alaverdi** and **Nekresi**, and dozens of family wineries.`,
    hero: "kakheti",
    gallery: ["kakheti", "food", "fortress"],
    thingsToDo: [
      { title: "Taste qvevri wine", description: "Visit small family cellars as well as established estates to compare styles." },
      { title: "Walk Sighnaghi's walls", description: "Climb the towers for views over the Alazani Valley." },
      { title: "Visit Alaverdi Monastery", description: "An 11th-century cathedral where monks still make wine." },
      { title: "Bake bread in a tone oven", description: "Many guesthouses offer shotis puri and churchkhela workshops." },
    ],
    bestTimeToVisit: "September and October for the Rtveli harvest; May and June for green vineyards and mild temperatures.",
    howToGetThere: "Sighnaghi and Telavi are about 1.5–2 hours from Tbilisi by car.",
    travelTips: [
      "Plan a driver — tastings and driving don't mix, and Georgia has a strict drink-driving limit.",
      "Many small wineries need advance notice; we arrange visits for you.",
      "Ask about shipping if you plan to buy more than a few bottles.",
    ],
    tours: ["kakheti-wine-region-tour", "georgia-highlights-7-days"],
    featured: true,
    order: 3,
  },
  {
    name: "Svaneti",
    slug: "svaneti",
    region: "Samegrelo-Zemo Svaneti",
    shortDescription: "Remote high valleys with medieval stone towers, glaciers and Ushguli — a UNESCO-listed landscape beneath Georgia's highest peaks.",
    description: `Upper Svaneti lies high in the north-west of Georgia, enclosed by peaks of more than 4,000 metres. Its isolation preserved a distinct language, customs and, above all, the **koshki** — defensive stone towers built from the 9th to the 13th centuries that still stand beside family homes.

**Mestia** is the main town and a comfortable base with hotels, restaurants and a superb museum of icons and manuscripts. **Ushguli**, a group of four villages at around 2,100 metres, sits beneath **Shkhara** (5,193 m), Georgia's highest mountain, and is part of the Upper Svaneti UNESCO World Heritage site.

Svaneti is also Georgia's premier trekking region: the multi-day hike from Mestia to Ushguli is one of the best-known routes in the Caucasus.`,
    hero: "svaneti",
    gallery: ["svaneti", "highlands"],
    thingsToDo: [
      { title: "Mestia to Ushguli trek", description: "A four-day hike between villages with guesthouse stays." },
      { title: "Koruldi Lakes", description: "High lakes with reflections of Mount Ushba." },
      { title: "Chalaadi Glacier", description: "An easy walk through forest to the glacier's edge." },
      { title: "Svaneti Museum", description: "Remarkable medieval icons, crosses and manuscripts." },
    ],
    bestTimeToVisit: "Mid-June to early October for hiking. December to March for skiing in Mestia.",
    howToGetThere: "Roughly 8–9 hours by car from Tbilisi or 4–5 hours from Kutaisi. Small planes fly between Tbilisi (Natakhtari) and Mestia, weather permitting.",
    travelTips: [
      "Break the drive from Tbilisi with a night in Kutaisi or Zugdidi.",
      "Carry cash — ATMs exist in Mestia but not in the villages.",
      "Weather changes quickly; pack layers even in August.",
    ],
    tours: ["svaneti-mountain-adventure"],
    featured: true,
    order: 4,
  },
  {
    name: "Mtskheta",
    slug: "mtskheta",
    region: "Mtskheta-Mtianeti",
    shortDescription: "Georgia's ancient capital and spiritual heart, with the UNESCO-listed Jvari Monastery and Svetitskhoveli Cathedral.",
    description: `Just 20 kilometres from Tbilisi, **Mtskheta** was the capital of the eastern Georgian kingdom of Iberia and the place where Christianity became the state religion in the 4th century.

Its historic monuments are listed together by UNESCO. **Jvari Monastery** stands on a hill above the confluence of the Aragvi and Mtkvari rivers, where according to tradition Saint Nino raised a cross. **Svetitskhoveli Cathedral**, rebuilt in the 11th century, is believed to hold the robe of Christ and has been the site of royal coronations and burials.

Mtskheta is small and walkable, with cafés and craft shops along its old streets. It is usually visited on the way to Kazbegi or as a half-day trip from Tbilisi.`,
    hero: "mtskheta",
    gallery: ["mtskheta", "fortress"],
    thingsToDo: [
      { title: "Jvari Monastery", description: "Visit at golden hour for the best light over the rivers." },
      { title: "Svetitskhoveli Cathedral", description: "Look for the frescoes and the stone pillar associated with Saint Nino." },
      { title: "Samtavro Monastery", description: "A working convent with the small church where Saint Nino is said to have lived." },
    ],
    bestTimeToVisit: "All year. Weekends and religious holidays can be busy.",
    howToGetThere: "About 30 minutes by car from Tbilisi.",
    travelTips: ["Dress modestly for the churches: shoulders covered, and head scarves and skirts for women."],
    tours: ["mtskheta-and-kazbegi-day-trip", "georgia-highlights-7-days"],
    featured: false,
    order: 5,
  },
  {
    name: "Kutaisi",
    slug: "kutaisi",
    region: "Imereti",
    shortDescription: "Western Georgia's historic capital, gateway to Gelati Monastery, dramatic canyons and underground caves.",
    description: `**Kutaisi** is one of the oldest continuously inhabited cities in the world and was once the capital of the kingdom of Colchis — the land of the Golden Fleece in Greek myth. Today it is a relaxed, green city and a practical gateway to western Georgia, with an international airport served by many European low-cost routes.

The city's great monument is **Gelati Monastery**, founded in 1106 by King David the Builder, with outstanding mosaics and frescoes. Around Kutaisi, nature puts on a show: the **Prometheus Cave** with its underground river, the **Martvili** and **Okatse** canyons, and the **Sataplia** reserve with dinosaur footprints.`,
    hero: "kutaisi",
    gallery: ["kutaisi", "borjomi"],
    thingsToDo: [
      { title: "Gelati Monastery", description: "A UNESCO World Heritage site with a famous 12th-century mosaic of the Virgin." },
      { title: "Prometheus Cave", description: "A guided walk through illuminated halls, with an optional boat ride." },
      { title: "Martvili Canyon", description: "Turquoise water and a short boat trip between the canyon walls." },
      { title: "Kutaisi Green Bazaar", description: "One of the country's most atmospheric food markets." },
    ],
    bestTimeToVisit: "April to October. Canyons are most dramatic after spring rains.",
    howToGetThere: "About 3.5 hours by car from Tbilisi, or fly directly into Kutaisi International Airport (KUT).",
    travelTips: ["Kutaisi airport is 20–30 minutes from the city — book a transfer for early flights."],
    tours: ["georgia-highlights-7-days", "svaneti-mountain-adventure"],
    featured: true,
    order: 6,
  },
  {
    name: "Borjomi",
    slug: "borjomi",
    region: "Samtskhe-Javakheti",
    shortDescription: "A forested spa town famous for its mineral water, and the gateway to Borjomi–Kharagauli National Park and the cave city of Vardzia.",
    description: `**Borjomi** sits in a wooded gorge of the Mtkvari river, and its naturally carbonated mineral water has been bottled and exported since the 19th century. The town grew into a fashionable resort under the Russian Empire, and its pastel villas, park and old railway still carry that atmosphere.

Just outside town begins **Borjomi–Kharagauli National Park**, with marked trails through ancient forests and alpine meadows. Further south, the road leads to the fortresses of **Rabati** and **Khertvisi** and the extraordinary cave monastery of **Vardzia**.`,
    hero: "borjomi",
    gallery: ["borjomi", "kutaisi", "fortress"],
    thingsToDo: [
      { title: "Borjomi Central Park", description: "Taste the water at the spring and ride the cable car to the plateau." },
      { title: "National park trails", description: "Choose from short nature walks to multi-day hikes with ranger shelters." },
      { title: "Vardzia cave monastery", description: "A 12th-century city carved into a cliff under Queen Tamar." },
    ],
    bestTimeToVisit: "May to October for hiking; winter for the nearby ski resort of Bakuriani.",
    howToGetThere: "About 2.5 hours by car from Tbilisi; Vardzia is another 2 hours south.",
    travelTips: ["The mineral water is an acquired taste — it's salty and warm at the source."],
    tours: ["borjomi-and-vardzia-tour"],
    featured: false,
    order: 7,
  },
  {
    name: "Batumi",
    slug: "batumi",
    region: "Adjara",
    shortDescription: "Georgia's Black Sea city — subtropical gardens, a long seaside boulevard and green mountains just inland.",
    description: `**Batumi**, capital of the Adjara region, combines a seaside resort with a lively modern city. Its boulevard runs for kilometres along a pebble beach, lined with gardens, cafés and contemporary buildings.

The **Batumi Botanical Garden** at Green Cape is one of the largest in the former Soviet Union. Inland, the Adjarian mountains hide waterfalls, arched stone bridges and villages where the famous boat-shaped **Adjarian khachapuri** comes from.`,
    hero: "batumi",
    gallery: ["batumi", "borjomi"],
    thingsToDo: [
      { title: "Batumi Boulevard", description: "Walk or cycle along the seafront at sunset." },
      { title: "Botanical Garden", description: "Plants from across the world above the Black Sea." },
      { title: "Makhuntseti waterfall", description: "An easy half-day trip into the highlands." },
      { title: "Gonio fortress", description: "Roman-era fortress walls south of the city." },
    ],
    bestTimeToVisit: "June to September for swimming; May and October for mild weather and fewer people.",
    howToGetThere: "Batumi International Airport (BUS) is 10 minutes from the centre. By road, about 6 hours from Tbilisi; trains also connect the two cities.",
    travelTips: ["Summer humidity is high — pack light clothing and an umbrella."],
    tours: ["batumi-coastal-experience"],
    featured: true,
    order: 8,
  },
];

export interface SeedService {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  cta: { label: string; href: string };
  order: number;
  image: SeedImageKey;
}

export const SERVICES: SeedService[] = [
  {
    title: "Airport Transfer",
    slug: "airport-transfer",
    shortDescription: "A driver waiting with your name at Tbilisi, Kutaisi or Batumi airport — whatever time your flight lands.",
    description: `Many international flights reach Georgia in the early hours of the morning. A private transfer means no negotiating with taxi drivers and no searching for an app signal — just a friendly driver holding a sign with your name.

## How it works

Send us your flight details and we monitor the arrival. Your driver waits in the arrivals hall, helps with luggage and takes you directly to your accommodation. Child seats are available free of charge on request.

## Where we operate

We cover all three international airports: **Tbilisi (TBS)**, **Kutaisi (KUT)** and **Batumi (BUS)**, and can arrange transfers between cities, or directly from Kutaisi airport to Tbilisi, Svaneti or Batumi.`,
    benefits: ["Flight monitoring and free waiting time for delays", "Meet-and-greet in the arrivals hall", "Child seats on request", "Fixed price agreed in advance", "Vehicles for 1–15 travelers"],
    cta: { label: "Request an airport transfer", href: "/plan-your-trip?service=airport-transfer" },
    order: 1,
    image: "road",
  },
  {
    title: "Private Driver",
    slug: "private-driver",
    shortDescription: "Travel at your own pace with a professional driver who knows Georgia's roads — for a day or your whole trip.",
    description: `Georgia's most beautiful places are outside the cities, and road conditions, signage and local driving habits can be challenging for visitors. A private driver lets you enjoy the scenery and stop wherever you like.

All our drivers are experienced, licensed and speak English at a conversational level. Vehicles are modern, air-conditioned and fully insured, with 4×4 options for mountain routes.

## Driver or driver-guide?

A **driver** gets you safely from place to place and shares local knowledge along the way. A **driver-guide** also leads visits at museums, churches and wineries. For deeper explanations at major sites, pair a driver with a **private guide**.`,
    benefits: ["Experienced, English-speaking drivers", "Sedans, minivans and 4×4s", "Flexible stops and daily schedules", "Fuel, parking and tolls included", "Available for single days or full trips"],
    cta: { label: "Book a private driver", href: "/plan-your-trip?service=private-driver" },
    order: 2,
    image: "service",
  },
  {
    title: "Private Guide",
    slug: "private-guide",
    shortDescription: "Licensed local guides who bring Georgia's history, faith, food and wine to life — in English and other languages.",
    description: `A good guide changes how you see a country. Ours are chosen for their knowledge, warmth and ability to tailor a day to your interests — whether that is Byzantine architecture, Soviet history, wine, photography or simply where to find the best khachapuri.

## Languages

Most guides work in English. We can also arrange German, French, Spanish, Italian and other languages on request.

## Specialist guides

Ask us about wine specialists, mountain guides for trekking, and art historians for monastery and museum visits.`,
    benefits: ["Hand-picked, experienced local guides", "Multiple languages available", "Specialists in wine, history and trekking", "Full-day and half-day options"],
    cta: { label: "Request a private guide", href: "/plan-your-trip?service=private-guide" },
    order: 3,
    image: "tbilisi",
  },
  {
    title: "Hotel Assistance",
    slug: "hotel-assistance",
    shortDescription: "We shortlist and book characterful hotels and guesthouses that match your style and budget — across Georgia.",
    description: `Georgia's accommodation ranges from international luxury hotels to family guesthouses where breakfast arrives straight from the garden. We know which properties deliver what they promise.

Tell us your budget and preferences — design hotels, wine estates, mountain lodges, family-friendly apartments — and we will send a shortlist with honest notes. Once you choose, we handle bookings and special requests such as early check-in or connecting rooms.`,
    benefits: ["Personal shortlists with honest notes", "Boutique, luxury and guesthouse options", "Special requests handled for you", "Coordinated with your transfers and tours"],
    cta: { label: "Ask for hotel suggestions", href: "/plan-your-trip?service=hotel-assistance" },
    order: 4,
    image: "kakheti",
  },
  {
    title: "Custom Trips",
    slug: "custom-trips",
    shortDescription: "A complete, tailor-made journey through Georgia — planned around your dates, interests and travel style.",
    description: `Every traveler is different. Some want to hike for days in Svaneti; others want to spend a week tasting wine and eating well. Our custom trips start with a conversation, not a template.

## How we plan

1. **Tell us about your trip** — dates, group size, interests and the kind of accommodation you like.
2. **Receive a proposal** — a day-by-day itinerary with hotels, experiences and a clear price, usually within two working days.
3. **Refine it together** — change as much as you like until it feels right.
4. **Travel with support** — a local contact is available throughout your trip.

We plan honeymoons, family holidays, photography journeys, wine trips, multi-generational travel and small corporate groups.`,
    benefits: ["Itineraries built from scratch around you", "Clear, all-inclusive pricing", "Local support during your trip", "Ideal for families, couples and small groups"],
    cta: { label: "Plan a custom trip", href: "/plan-your-trip" },
    order: 5,
    image: "heroHome",
  },
];

export const FAQS: { question: string; answer: string; category: string; order: number }[] = [
  { category: "Planning", order: 1, question: "Do I need a visa to visit Georgia?", answer: "Citizens of the United States, the United Kingdom, EU countries and many others can visit Georgia visa-free for up to one year. Entry rules can change, so please check the official information from the Ministry of Foreign Affairs of Georgia before you travel." },
  { category: "Planning", order: 2, question: "When is the best time to visit Georgia?", answer: "May to June and September to October offer pleasant weather almost everywhere. July and August are ideal for the high mountains, and winter is great for skiing and city breaks. See our [seasonal guide](/blog/best-time-to-visit-georgia) for details." },
  { category: "Planning", order: 3, question: "How many days do I need?", answer: "A week covers the highlights — Tbilisi, Kazbegi, Kakheti and western Georgia. With 10–14 days you can add Svaneti, Batumi or more time in the mountains." },
  { category: "Planning", order: 4, question: "How far in advance should I book?", answer: "For summer and the harvest season, two to four months ahead is ideal. Shorter trips and day tours can often be arranged within a week." },
  { category: "Practical", order: 1, question: "Is Georgia safe for tourists?", answer: "Georgia is generally considered a welcoming and safe destination, with low levels of street crime. As anywhere, use common sense, and check your government's current travel advice before departure." },
  { category: "Practical", order: 2, question: "What currency is used, and can I use cards?", answer: "The currency is the Georgian lari (GEL). Cards are accepted in most hotels, restaurants and shops in cities; carry some cash for markets, villages and mountain areas." },
  { category: "Practical", order: 3, question: "Do people speak English?", answer: "English is widely spoken by younger people and in the tourism industry. Russian is also common among older generations. Our guides and drivers speak English." },
  { category: "Practical", order: 4, question: "Is tap water safe to drink?", answer: "Tap water is generally considered safe in Tbilisi and many towns, and mountain spring water is excellent. If you have a sensitive stomach, bottled water is inexpensive and available everywhere." },
  { category: "Tours", order: 1, question: "Are your tours private?", answer: "Yes. Every tour is private for your group, so the pace, stops and start time are flexible." },
  { category: "Tours", order: 2, question: "How do I pay?", answer: "After you approve your itinerary we send a booking confirmation with payment options. We never ask for payment on this website." },
  { category: "Tours", order: 3, question: "Can you accommodate dietary requirements?", answer: "Absolutely. Georgian cuisine has many vegetarian and vegan dishes, and we can plan for allergies, gluten-free and halal diets." },
  { category: "General", order: 1, question: "What happens after I send an inquiry?", answer: "A member of our team reads every request personally and replies, usually within one working day, with questions or a first proposal." },
  { category: "General", order: 2, question: "Do you arrange trips to Armenia or Azerbaijan?", answer: "Our focus is Georgia, but we can help plan combined trips with neighbouring countries through trusted partners." },
];

export const TESTIMONIALS = [
  { name: "Sarah M.", location: "Boston, USA", tripName: "Georgia Highlights — 7 Days", rating: 5, quote: "Every day felt personal. Our guide knew exactly when to talk and when to let the mountains speak for themselves.", order: 1 },
  { name: "Jonas K.", location: "Munich, Germany", tripName: "Kakheti Wine Region Tour", rating: 5, quote: "We tasted wines we would never have found on our own, and lunch with the winemaker's family was the highlight of our trip.", order: 2 },
  { name: "Claire & Tom", location: "London, UK", tripName: "Svaneti Mountain Adventure", rating: 5, quote: "Ushguli was unforgettable. Everything was organised perfectly, from the 4×4 to the cosy guesthouses.", order: 3 },
  { name: "Elena R.", location: "Madrid, Spain", tripName: "Tbilisi Old Town Walking Tour", rating: 5, quote: "The perfect first day in Georgia. We felt at home in Tbilisi by lunchtime.", order: 4 },
];
