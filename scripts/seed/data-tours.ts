import type { SeedImageKey } from "./types";

export interface SeedTour {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  durationDays: number;
  duration: string;
  groupSize: string;
  difficulty: "easy" | "moderate" | "challenging";
  meetingPoint: string;
  experiences: string[];
  destinations: string[]; // destination slugs
  hero: SeedImageKey;
  gallery: SeedImageKey[];
  highlights: string[];
  itinerary: { title: string; description: string; meals?: string; overnight?: string }[];
  included: string[];
  excluded: string[];
  faq: { question: string; answer: string }[];
  related: string[]; // tour slugs
  featured: boolean;
  seo: { title: string; description: string };
}

const privateBasics = ["Private English-speaking driver-guide", "Comfortable air-conditioned vehicle", "Hotel pick-up and drop-off in Tbilisi", "Bottled water"];

export const TOURS: SeedTour[] = [
  {
    title: "Tbilisi Old Town Walking Tour",
    slug: "tbilisi-old-town-walking-tour",
    category: "City",
    shortDescription: "A slow, story-filled walk through Tbilisi's layered Old Town — sulfur baths, balconied lanes, a cable car ride to Narikala and the best tastes of the capital.",
    description: `Tbilisi rewards those who walk it slowly. In a single morning you pass a mosque, a synagogue, Armenian and Georgian churches, Persian-style bathhouses and carved wooden balconies that lean over the street as if eavesdropping.

This private walking tour is designed as your first day in Georgia. Your guide helps you find your bearings, explains how a crossroads city of the Silk Road became today's creative capital, and hands you the practical knowledge that makes the rest of your trip easier — from reading a Georgian menu to knowing which bakery sells the best *shotis puri* at 8 a.m.

## How the day flows

We start at Freedom Square and wander down through the lanes of Kala, the oldest part of the city. After visiting Sioni Cathedral and the Anchiskhati Basilica — the oldest surviving church in Tbilisi — we cross to the Abanotubani bath district, where domed brick roofs release warm, sulfurous steam. A short walk up the Leghvtakhevi gorge brings you to a small waterfall hidden in the middle of the city.

From there we take the cable car to Narikala Fortress for the view that explains Tbilisi: the Mtkvari river, the Metekhi church on its cliff, the glassy Peace Bridge and the hills that frame the whole valley. We finish in a family-run restaurant for a relaxed lunch of khinkali, fresh bread, seasonal salads and — if you like — a glass of Georgian wine.

## Who it suits

The pace is gentle, with stops for coffee and photographs. Some streets are steep and cobbled, so comfortable shoes are a must. Families with children, first-time visitors and photographers all enjoy this tour. It can be shortened to three hours or extended into the evening with a wine bar visit.`,
    priceFrom: 65,
    durationDays: 1,
    duration: "4–5 hours",
    groupSize: "Private, 1–10 travelers",
    difficulty: "easy",
    meetingPoint: "Your hotel lobby in central Tbilisi, or Freedom Square",
    experiences: ["Culture", "History", "Food", "Photography"],
    destinations: ["tbilisi"],
    hero: "tbilisi",
    gallery: ["tbilisi", "fortress", "food"],
    highlights: [
      "See the domed sulfur baths of Abanotubani and the hidden Leghvtakhevi waterfall",
      "Ride the cable car to Narikala Fortress for the city's best panorama",
      "Visit Anchiskhati, Tbilisi's oldest surviving church",
      "Learn to order khinkali like a local over a relaxed lunch",
      "Get practical tips for the rest of your trip from a local guide",
    ],
    itinerary: [
      { title: "Freedom Square and Old Tbilisi lanes", description: "Meet your guide and walk into the historic district, with stops at the clock tower of the puppet theatre, Anchiskhati Basilica and Sioni Cathedral." },
      { title: "Abanotubani and the waterfall", description: "Walk among the brick domes of the sulfur bath district and follow the small gorge to the waterfall. Optional: book a private bath room for later in the day." },
      { title: "Narikala Fortress by cable car", description: "Ride up from Rike Park and walk along the walls of the fortress, with views over the whole city and the Mother of Georgia statue." },
      { title: "Lunch in a family restaurant", description: "Sit down for khinkali, bread from a clay oven and seasonal dishes. Your guide explains what you are eating and how Georgians eat it.", meals: "Lunch" },
    ],
    included: ["Private English-speaking guide", "Cable car ticket", "Lunch with one drink", "Bottled water"],
    excluded: ["Sulfur bath entry", "Additional drinks", "Gratuities"],
    faq: [
      { question: "Is the walking tour suitable for children?", answer: "Yes. The route is flexible and your guide can add breaks, ice cream and shorter walking sections for younger travelers." },
      { question: "Can we visit the sulfur baths during the tour?", answer: "We can reserve a private bath room for after the tour. Entry is paid separately and prices depend on the room and time of day." },
    ],
    related: ["georgia-food-and-culture-tour", "mtskheta-and-kazbegi-day-trip"],
    featured: true,
    seo: { title: "Tbilisi Old Town Private Walking Tour", description: "Explore Tbilisi's Old Town with a private local guide: sulfur baths, Narikala Fortress by cable car, historic churches and a traditional lunch." },
  },
  {
    title: "Mtskheta and Kazbegi Day Trip",
    slug: "mtskheta-and-kazbegi-day-trip",
    category: "Mountains",
    shortDescription: "Drive the Georgian Military Highway from the ancient capital Mtskheta to Gergeti Trinity Church beneath Mount Kazbek — Georgia's most iconic mountain day.",
    description: `If you have time for only one day in the mountains, make it this one. The Georgian Military Highway has carried traders, armies and poets north toward the Caucasus for centuries, and the landscape changes by the hour — from river valleys to high pasture to glaciated peaks above 5,000 metres.

## The route

We begin in **Mtskheta**, Georgia's ancient capital and one of its most sacred places. Jvari Monastery stands on a hill above the meeting point of two rivers, and Svetitskhoveli Cathedral in the town below is where Georgian Christianity has its heart.

Continuing north, we stop at the **Ananuri** fortress complex on the turquoise Zhinvali reservoir, then climb through the ski resort of Gudauri to the **Russia–Georgia Friendship Monument**, a vast mosaic balcony hanging over the Devil's Valley.

After crossing the Jvari Pass (2,379 m) we descend to **Stepantsminda**, the village at the foot of Mount Kazbek. A 4×4 takes us up to **Gergeti Trinity Church**, the 14th-century church whose silhouette you may already know from photographs. On a clear day the glacier-covered summit of Kazbek fills the sky behind it.

## Good to know

This is a full day with around six hours of driving in total, broken up by frequent stops. The Jvari Pass can close briefly after heavy snow in winter; we monitor conditions closely and will propose an alternative route if needed. Bring a warm layer at any time of year — it is often 10 °C colder at Gergeti than in Tbilisi.`,
    priceFrom: 140,
    durationDays: 1,
    duration: "10–11 hours",
    groupSize: "Private, 1–7 travelers",
    difficulty: "easy",
    meetingPoint: "Hotel pick-up in Tbilisi",
    experiences: ["Mountains", "History", "Culture", "Photography"],
    destinations: ["mtskheta", "kazbegi"],
    hero: "kazbegi",
    gallery: ["kazbegi", "mtskheta", "road", "highlands"],
    highlights: [
      "Stand at Jvari Monastery above the confluence of the Aragvi and Mtkvari rivers",
      "Visit Svetitskhoveli Cathedral, a UNESCO World Heritage site",
      "Photograph Ananuri fortress on the Zhinvali reservoir",
      "Cross the 2,379 m Jvari Pass on the Georgian Military Highway",
      "Ride a 4×4 to Gergeti Trinity Church beneath Mount Kazbek",
    ],
    itinerary: [
      { title: "Mtskheta: Jvari and Svetitskhoveli", description: "Visit the 6th-century Jvari Monastery and the cathedral in the old capital, about 30 minutes from Tbilisi." },
      { title: "Ananuri fortress", description: "A 17th-century fortress with two churches overlooking the reservoir." },
      { title: "Gudauri and the Friendship Monument", description: "A panoramic stop above the Devil's Valley before crossing the Jvari Pass." },
      { title: "Stepantsminda and Gergeti Trinity Church", description: "Lunch in the village, then a 4×4 ride to the church for views of Mount Kazbek.", meals: "Lunch" },
      { title: "Return to Tbilisi", description: "Drive back with optional stops at mineral springs and roadside churchkhela stalls." },
    ],
    included: [...privateBasics, "4×4 transfer to Gergeti Trinity Church", "Lunch in Stepantsminda"],
    excluded: ["Drinks with lunch", "Gratuities"],
    faq: [
      { question: "Can we hike to Gergeti instead of taking the 4×4?", answer: "Yes. The hike takes about 1.5 hours up for most people. Tell us in advance and we will allow time for it." },
      { question: "What if the road is closed?", answer: "In the rare case the Jvari Pass is closed, we will offer an alternative mountain route or a full refund of the unused portion." },
      { question: "Do women need to cover their heads in churches?", answer: "Women are asked to cover their heads and wear skirts in Georgian Orthodox churches. Wraps are usually available at the entrance, but bringing a scarf is easier." },
    ],
    related: ["georgia-highlights-7-days", "tbilisi-old-town-walking-tour"],
    featured: true,
    seo: { title: "Kazbegi Day Trip from Tbilisi with Mtskheta", description: "Private day trip from Tbilisi to Mtskheta, Ananuri and Gergeti Trinity Church beneath Mount Kazbek along the Georgian Military Highway." },
  },
  {
    title: "Kakheti Wine Region Tour",
    slug: "kakheti-wine-region-tour",
    category: "Wine & Food",
    shortDescription: "A private day in Georgia's wine heartland — qvevri cellars, family winemakers, the hilltop town of Sighnaghi and a long lunch in the Alazani Valley.",
    description: `Georgia has one of the oldest continuous winemaking traditions in the world, and Kakheti is its heart. Here, many families still ferment grapes with their skins in *qvevri* — large clay vessels buried in the ground — a method recognised by UNESCO as intangible cultural heritage.

## What makes this tour different

We work with small producers as well as well-known estates, so your tasting is about people and places rather than a sales pitch. Depending on the day, you may taste amber wines made from Rkatsiteli and Mtsvane, deep Saperavi reds and a glass of chacha, the grape spirit that ends many Georgian meals.

## The day

We leave Tbilisi via the Gombori Pass, a forested road with views across the Alazani Valley to the Greater Caucasus. Our first stop is a family cellar where you can see qvevri being cleaned and filled, and learn how the process differs from European winemaking.

Lunch is a proper Kakhetian feast — grilled meats or vegetables, herbed cheeses, bread baked on the walls of a *tone* oven — paired with the host's wines.

In the afternoon we visit **Bodbe Monastery**, burial place of Saint Nino, and wander the walls and lanes of **Sighnaghi**, a restored 18th-century town perched above the valley. A final tasting at a second winery lets you compare styles before the drive home.

## Tailoring

The tour can include a bread-baking or churchkhela-making workshop, or be extended into an overnight stay at a winery guesthouse. Drivers never drink, and we make sure you have plenty of water between tastings.`,
    priceFrom: 150,
    durationDays: 1,
    duration: "10 hours",
    groupSize: "Private, 1–7 travelers",
    difficulty: "easy",
    meetingPoint: "Hotel pick-up in Tbilisi",
    experiences: ["Wine", "Food", "Culture"],
    destinations: ["kakheti"],
    hero: "kakheti",
    gallery: ["kakheti", "food", "fortress"],
    highlights: [
      "Taste amber and red wines made in traditional qvevri clay vessels",
      "Meet a winemaking family and see their cellar",
      "Enjoy a long Kakhetian lunch paired with local wine",
      "Walk the walls of hilltop Sighnaghi",
      "Visit Bodbe Monastery, resting place of Saint Nino",
    ],
    itinerary: [
      { title: "Gombori Pass", description: "Scenic drive over forested hills into the Alazani Valley." },
      { title: "Family qvevri cellar", description: "Guided tasting of four to five wines with explanations of qvevri winemaking." },
      { title: "Kakhetian lunch", description: "A generous lunch with homemade dishes and wine.", meals: "Lunch" },
      { title: "Bodbe Monastery and Sighnaghi", description: "Visit the monastery gardens, then explore the old town and its defensive walls." },
      { title: "Second tasting and return", description: "Compare styles at a second winery before returning to Tbilisi in the evening." },
    ],
    included: [...privateBasics, "Two wine tastings", "Lunch with wine"],
    excluded: ["Wine purchases and shipping", "Gratuities"],
    faq: [
      { question: "Can non-drinkers join?", answer: "Of course. Hosts offer fresh juices, homemade lemonades and tea, and the cellar visits are interesting without tasting." },
      { question: "Can we bring wine home?", answer: "Yes. Most wineries sell bottles, and your guide can advise on packing and your home country's customs allowances." },
      { question: "When is the grape harvest?", answer: "The Georgian harvest, called Rtveli, usually runs from mid-September to mid-October. Ask us about joining a family harvest." },
    ],
    related: ["georgia-food-and-culture-tour", "georgia-highlights-7-days"],
    featured: true,
    seo: { title: "Kakheti Wine Tour from Tbilisi — Private Day Trip", description: "Private Kakheti wine tour with qvevri tastings at family cellars, a Kakhetian lunch, Sighnaghi and Bodbe Monastery." },
  },
  {
    title: "Svaneti Mountain Adventure",
    slug: "svaneti-mountain-adventure",
    category: "Mountains",
    shortDescription: "Four days among medieval stone towers, glaciers and high pastures in Upper Svaneti — including Ushguli, one of Europe's highest inhabited villages.",
    description: `Upper Svaneti feels like another century. Hundreds of medieval defensive towers still stand in its villages, the churches hold frescoes and icons that survived because the region was so hard to reach, and the peaks of the main Caucasus ridge — Ushba, Tetnuldi, Shkhara — rise directly above the valleys.

This four-day journey is designed for travelers who want real mountain scenery without technical climbing. Walks are on established trails, and every night is spent in a comfortable guesthouse or boutique hotel.

## Getting there

Mestia, the regional centre, is a long drive from Tbilisi. We usually break the journey in Zugdidi or Kutaisi, or you can fly between Tbilisi (Natakhtari) and Mestia on small scheduled flights when weather allows. We'll help you choose the option that suits your schedule.

## Walks and highlights

- **Chalaadi Glacier** — an easy forest trail to the foot of a glacier, ideal on arrival.
- **Koruldi Lakes** — a high-altitude plateau with mirror-like lakes reflecting Mount Ushba. We drive part of the way by 4×4 and walk the rest.
- **Ushguli** — a cluster of villages at around 2,100 m, under Shkhara, Georgia's highest peak. Towers, a small ethnographic museum and the Lamaria church await.

## Comfort and pace

Expect three to five hours of walking on the active days, with altitude gains kept moderate. Svan cuisine is hearty — try *kubdari* (meat-filled bread) and *tashmijabi* (cheesy mashed potato). The season for this itinerary is mid-June to early October.`,
    priceFrom: 890,
    durationDays: 4,
    duration: "4 days / 3 nights",
    groupSize: "Private, 2–7 travelers",
    difficulty: "moderate",
    meetingPoint: "Kutaisi or Tbilisi hotel",
    experiences: ["Mountains", "Adventure", "Culture", "Photography"],
    destinations: ["svaneti", "kutaisi"],
    hero: "svaneti",
    gallery: ["svaneti", "highlands", "road"],
    highlights: [
      "Explore Mestia's medieval towers and the Svaneti Museum",
      "Walk to the Chalaadi Glacier",
      "See Mount Ushba reflected in the Koruldi Lakes",
      "Spend a day in Ushguli beneath Shkhara, Georgia's highest peak",
      "Taste Svan specialities in family guesthouses",
    ],
    itinerary: [
      { title: "Day 1 — Into the mountains", description: "Scenic drive via the Enguri Dam to Mestia. Evening walk among the towers.", overnight: "Mestia", meals: "Dinner" },
      { title: "Day 2 — Chalaadi Glacier and Mestia", description: "Morning forest walk to the glacier; afternoon at the Svaneti Museum and a tower visit.", overnight: "Mestia", meals: "Breakfast, dinner" },
      { title: "Day 3 — Ushguli", description: "4×4 journey to Ushguli, walks among the villages and a picnic facing Shkhara.", overnight: "Mestia", meals: "Breakfast, lunch" },
      { title: "Day 4 — Koruldi Lakes and departure", description: "4×4 and walk to the lakes, then return drive to Kutaisi or Tbilisi.", meals: "Breakfast" },
    ],
    included: ["Private driver and English-speaking mountain guide", "4×4 transfers to Ushguli and Koruldi", "3 nights' accommodation", "Meals as listed", "Museum entries"],
    excluded: ["Domestic flights (optional)", "Lunches not listed", "Travel insurance", "Gratuities"],
    faq: [
      { question: "How fit do I need to be?", answer: "You should be comfortable walking three to five hours on uneven trails with some uphill sections. We can shorten any walk." },
      { question: "Is there mobile coverage in Svaneti?", answer: "Mestia has good coverage and Wi-Fi. Ushguli and the trails have patchy signal." },
      { question: "Can we visit in winter?", answer: "Yes, Mestia has ski slopes at Hatsvali and Tetnuldi, but Ushguli and the lakes may be inaccessible. We offer a winter version on request." },
    ],
    related: ["borjomi-and-vardzia-tour", "georgia-highlights-7-days"],
    featured: true,
    seo: { title: "Svaneti Tour: Mestia, Ushguli & Koruldi Lakes (4 Days)", description: "Four-day private Svaneti tour with Mestia's towers, Chalaadi Glacier, Ushguli and Koruldi Lakes, with comfortable guesthouse stays." },
  },
  {
    title: "Georgia Food and Culture Tour",
    slug: "georgia-food-and-culture-tour",
    category: "Wine & Food",
    shortDescription: "Cook, taste and toast your way through Georgia — market visits, a hands-on khinkali and khachapuri class, and a traditional supra with a tamada.",
    description: `Georgian hospitality is famous, and most of it happens around a table. This tour takes you behind the dishes: where the ingredients come from, how families cook them, and why a Georgian feast — the *supra* — is as much about toasts and song as it is about food.

## Morning: the market

We start at the Dezerter Bazaar, Tbilisi's busiest market, where you will taste fresh cheeses, pickles, spices from Samegrelo and the walnut-and-grape-juice sweet called *churchkhela*. Your guide helps you pick up a few spices to take home.

## Midday: a cooking class

In a family kitchen just outside the city, your host teaches you to pleat **khinkali** (the aim is at least 19 folds) and shape **Adjarian khachapuri**, the boat-shaped bread with an egg and butter in the centre. You will also prepare a *pkhali* — vegetables blended with walnuts and herbs.

## Evening: the supra

Dinner is a proper supra, led by a *tamada* (toastmaster) who explains the order and meaning of each toast. Expect polyphonic singing if the mood is right. Vegetarian and vegan guests eat extremely well in Georgia — many traditional dishes are plant-based, especially during church fasting periods.

## Who it suits

Food lovers, families and anyone who wants to understand Georgia through its hospitality. The day can be combined with the Tbilisi Old Town walk to make a complete introduction to the country.`,
    priceFrom: 120,
    durationDays: 1,
    duration: "8 hours",
    groupSize: "Private, 2–12 travelers",
    difficulty: "easy",
    meetingPoint: "Hotel pick-up in Tbilisi",
    experiences: ["Food", "Culture", "Wine"],
    destinations: ["tbilisi"],
    hero: "food",
    gallery: ["food", "tbilisi", "kakheti"],
    highlights: [
      "Taste your way around Tbilisi's Dezerter Bazaar",
      "Learn to fold khinkali and bake Adjarian khachapuri",
      "Join a supra led by a traditional tamada",
      "Hear Georgian polyphonic singing at the table",
      "Take home recipes and spices",
    ],
    itinerary: [
      { title: "Dezerter Bazaar tasting walk", description: "Cheeses, spices, pickles and churchkhela with your guide." },
      { title: "Cooking class in a family home", description: "Hands-on khinkali, khachapuri and pkhali, followed by lunch of what you made.", meals: "Lunch" },
      { title: "Free time", description: "Rest at your hotel or add a visit to the sulfur baths." },
      { title: "Supra dinner", description: "A traditional feast with wine, toasts and music.", meals: "Dinner" },
    ],
    included: ["Private guide", "Transfers", "Market tastings", "Cooking class and lunch", "Supra dinner with wine"],
    excluded: ["Spice purchases", "Gratuities"],
    faq: [
      { question: "Can you cater for dietary requirements?", answer: "Yes — vegetarian, vegan, gluten-free and halal needs can all be arranged with notice." },
      { question: "Is the class suitable for children?", answer: "Children love folding khinkali. We recommend the class for ages six and up." },
    ],
    related: ["kakheti-wine-region-tour", "tbilisi-old-town-walking-tour"],
    featured: false,
    seo: { title: "Georgian Food Tour & Cooking Class in Tbilisi", description: "Private Georgian food tour: Tbilisi market tasting, khinkali and khachapuri cooking class and a traditional supra with a tamada." },
  },
  {
    title: "Borjomi and Vardzia Tour",
    slug: "borjomi-and-vardzia-tour",
    category: "Culture & History",
    shortDescription: "Two days from the forested spa town of Borjomi to the 12th-century cave monastery of Vardzia, with Rabati fortress and a night in the mountains.",
    description: `This two-day route combines southern Georgia's most dramatic historical site with the green calm of the Borjomi valley.

## Day one: Borjomi

Borjomi has been famous for its naturally carbonated mineral water since the 19th century, when it became a retreat for the Russian imperial family. Walk through the Central Park to taste the water straight from the spring, then take the short cable car up to the plateau for forest views. Borjomi–Kharagauli National Park, one of the largest protected areas in the Caucasus, begins just outside town — we can include a short nature trail.

In the afternoon we continue to **Akhaltsikhe**, stopping at the Rabati fortress, and spend the night near the Mtkvari gorge.

## Day two: Vardzia

**Vardzia** was carved into the cliffs of Erusheti Mountain in the 12th century under Queen Tamar. At its height the complex had hundreds of rooms across many levels: churches, living quarters, wine cellars and tunnels. An earthquake in 1283 exposed its hidden interior, and today you can walk through galleries and tunnels to the Church of the Dormition, where frescoes include a portrait of Tamar herself.

On the way back we stop at **Khertvisi fortress**, one of the oldest in Georgia, at the meeting of two rivers.

## Practical notes

Vardzia involves stairs, tunnels and uneven paths — allow two hours and wear good shoes. The tour can finish in Tbilisi or Kutaisi, making it an easy link in a longer journey.`,
    priceFrom: 380,
    durationDays: 2,
    duration: "2 days / 1 night",
    groupSize: "Private, 1–7 travelers",
    difficulty: "moderate",
    meetingPoint: "Hotel pick-up in Tbilisi or Kutaisi",
    experiences: ["History", "Culture", "Relaxation", "Photography"],
    destinations: ["borjomi"],
    hero: "kutaisi",
    gallery: ["kutaisi", "borjomi", "fortress"],
    highlights: [
      "Taste Borjomi mineral water from its natural spring",
      "Explore the cave city of Vardzia, carved under Queen Tamar",
      "See the 12th-century frescoes in the Church of the Dormition",
      "Visit Rabati and Khertvisi fortresses",
      "Unwind in the forests of the Borjomi valley",
    ],
    itinerary: [
      { title: "Day 1 — Borjomi and Akhaltsikhe", description: "Borjomi Central Park, cable car and forest walk, then Rabati fortress.", overnight: "Akhaltsikhe or Vardzia area", meals: "Dinner" },
      { title: "Day 2 — Vardzia and Khertvisi", description: "Guided visit of Vardzia, lunch by the river, Khertvisi fortress and return.", meals: "Breakfast, lunch" },
    ],
    included: [...privateBasics, "1 night hotel accommodation", "Meals as listed", "Entrance fees"],
    excluded: ["Optional thermal baths", "Gratuities"],
    faq: [
      { question: "Is Vardzia suitable for people who dislike tight spaces?", answer: "Some tunnels are narrow and low. You can skip them and still see most of the complex from the outer galleries." },
      { question: "Can we add thermal baths?", answer: "Yes, there are sulfur pools near Borjomi and hot springs near Vardzia that can be added." },
    ],
    related: ["svaneti-mountain-adventure", "georgia-highlights-7-days"],
    featured: true,
    seo: { title: "Borjomi and Vardzia 2-Day Tour", description: "Two-day private tour to Borjomi's mineral springs and the Vardzia cave monastery, with Rabati and Khertvisi fortresses." },
  },
  {
    title: "Batumi Coastal Experience",
    slug: "batumi-coastal-experience",
    category: "Coast",
    shortDescription: "Two relaxed days on Georgia's Black Sea coast — Batumi's boulevard and botanical garden, the Makhuntseti waterfall and a lush Adjarian mountain lunch.",
    description: `Batumi is Georgia's subtropical side: palm-lined promenades, a pebbled beach, contemporary architecture and green hills that climb straight from the sea.

## Day one: the city by the sea

Your guide shows you the **Batumi Boulevard**, the old town's squares and the moving sculpture of Ali and Nino. In the afternoon we visit the **Batumi Botanical Garden**, spread over the cliffs at Green Cape with plants from across the world and wide sea views. Sunset is best enjoyed from the seafront or from the Argo cable car.

## Day two: Adjara's mountains

A short drive inland takes you into the Adjarian highlands. We stop at the arched **Queen Tamar bridge** and the **Makhuntseti waterfall**, then continue to a family guesthouse for lunch — this is the home of Adjarian khachapuri, and it tastes better here than anywhere else. Optional additions include a winery with local Tsolikouri and Chkhaveri or a walk in Mtirala National Park.

## Good to know

The sea is warm enough for swimming from June to September. Batumi has direct flights to many European cities in summer, so this tour works well as the beginning or end of a trip.`,
    priceFrom: 260,
    durationDays: 2,
    duration: "2 days",
    groupSize: "Private, 1–7 travelers",
    difficulty: "easy",
    meetingPoint: "Your hotel in Batumi or Batumi airport",
    experiences: ["Beach", "Relaxation", "Food", "Culture"],
    destinations: ["batumi"],
    hero: "batumi",
    gallery: ["batumi", "borjomi", "food"],
    highlights: [
      "Walk the Batumi Boulevard and old town",
      "Explore the Botanical Garden above the Black Sea",
      "See the Makhuntseti waterfall and Queen Tamar bridge",
      "Taste Adjarian khachapuri in its home region",
    ],
    itinerary: [
      { title: "Day 1 — Batumi", description: "Old town, boulevard and botanical garden with your guide." },
      { title: "Day 2 — Adjarian highlands", description: "Waterfall, historic bridge and a family lunch in the mountains.", meals: "Lunch" },
    ],
    included: ["Private guide and driver", "Botanical garden entry", "Lunch on day 2"],
    excluded: ["Accommodation (we can book it for you)", "Dinners", "Gratuities"],
    faq: [
      { question: "Is Batumi a good base for families?", answer: "Yes — the boulevard, dolphinarium and beach make it easy with children." },
      { question: "Can this be combined with a mountain tour?", answer: "It fits well with Svaneti or with Kutaisi and western Georgia. Ask us for a combined plan." },
    ],
    related: ["georgia-highlights-7-days", "borjomi-and-vardzia-tour"],
    featured: false,
    seo: { title: "Batumi Tour: Black Sea Coast and Adjarian Mountains", description: "Two-day private Batumi experience with the boulevard, botanical garden, Makhuntseti waterfall and an Adjarian mountain lunch." },
  },
  {
    title: "Georgia Highlights — 7 Days",
    slug: "georgia-highlights-7-days",
    category: "Multi-day",
    shortDescription: "The essential week in Georgia: Tbilisi, Mtskheta, Kazbegi, the Kakheti wine country, Kutaisi's cave cities and the monasteries of Imereti — privately guided.",
    description: `This is our most-requested journey: a week that balances culture, mountains, wine and time to relax, with a private driver-guide throughout and hand-picked hotels.

## The shape of the week

You begin with two nights in **Tbilisi**, getting to know the capital on foot. Then the road takes you north through **Mtskheta** to the high Caucasus at **Kazbegi**, where you spend a night with the mountains outside your window.

Back south, two days in **Kakheti** bring vineyards, qvevri cellars and the hilltop town of **Sighnaghi**. The final stretch heads west to **Kutaisi**, with Gelati Monastery, the Prometheus Cave and the Martvili canyon, before you return to Tbilisi or fly home from Kutaisi.

## Designed for comfort

- Daily drives are kept under four hours wherever possible.
- Hotels are boutique, characterful and centrally located.
- Every day has free time built in.

## Make it yours

Every element can be changed. Swap Kakheti for Svaneti, add a cooking class, extend the week to Batumi, or upgrade to luxury hotels. Tell us how you like to travel and we will adapt the plan — the price shown is a starting point for two travelers sharing.`,
    priceFrom: 1690,
    durationDays: 7,
    duration: "7 days / 6 nights",
    groupSize: "Private, 2–7 travelers",
    difficulty: "easy",
    meetingPoint: "Tbilisi International Airport",
    experiences: ["Culture", "Mountains", "Wine", "Food", "History"],
    destinations: ["tbilisi", "mtskheta", "kazbegi", "kakheti", "kutaisi"],
    hero: "heroHome",
    gallery: ["heroHome", "tbilisi", "kazbegi", "kakheti", "kutaisi"],
    highlights: [
      "Private driver-guide and airport transfers throughout",
      "A night in the high Caucasus at Kazbegi",
      "Two days of wine, food and hospitality in Kakheti",
      "UNESCO-listed Gelati Monastery and the Martvili canyon",
      "Boutique hotels chosen for character and location",
    ],
    itinerary: [
      { title: "Day 1 — Arrival in Tbilisi", description: "Meet-and-greet at the airport and transfer to your hotel. Welcome dinner.", overnight: "Tbilisi", meals: "Dinner" },
      { title: "Day 2 — Tbilisi Old Town", description: "Guided walk, sulfur baths district and Narikala Fortress. Afternoon at leisure.", overnight: "Tbilisi", meals: "Breakfast, lunch" },
      { title: "Day 3 — Mtskheta and Kazbegi", description: "Jvari and Svetitskhoveli, Ananuri, the Military Highway and Gergeti Trinity Church.", overnight: "Stepantsminda", meals: "Breakfast, lunch" },
      { title: "Day 4 — Mountains to wine country", description: "Morning walk in the Truso or Juta valley, then drive to Kakheti.", overnight: "Sighnaghi or Telavi", meals: "Breakfast, dinner" },
      { title: "Day 5 — Kakheti", description: "Qvevri cellars, a cooking experience, Bodbe Monastery and Sighnaghi.", overnight: "Sighnaghi or Telavi", meals: "Breakfast, lunch" },
      { title: "Day 6 — Kutaisi and Imereti", description: "Drive west to Gelati Monastery, Prometheus Cave and Martvili canyon.", overnight: "Kutaisi", meals: "Breakfast" },
      { title: "Day 7 — Departure", description: "Transfer to Kutaisi airport or back to Tbilisi, with a stop at Uplistsqaro cave town on the way.", meals: "Breakfast" },
    ],
    included: ["Private driver-guide for 7 days", "6 nights in boutique hotels with breakfast", "Airport transfers", "Meals as listed", "All entrance fees and tastings", "4×4 at Gergeti"],
    excluded: ["International flights", "Travel insurance", "Lunches and dinners not listed", "Gratuities"],
    faq: [
      { question: "Is this a group tour?", answer: "No. Every departure is private for your party and can start on any date." },
      { question: "Can we change the hotels?", answer: "Yes. We can offer standard, boutique or luxury options, and will send you our suggestions with your quote." },
      { question: "What is the best time for this itinerary?", answer: "May to October is ideal. From November to April we adapt the Kazbegi day to weather conditions." },
    ],
    related: ["svaneti-mountain-adventure", "kakheti-wine-region-tour", "batumi-coastal-experience"],
    featured: true,
    seo: { title: "Georgia Highlights Tour — 7-Day Private Itinerary", description: "Seven days in Georgia with a private guide: Tbilisi, Kazbegi, Kakheti wine country and Kutaisi, with boutique hotels and flexible dates." },
  },
];
