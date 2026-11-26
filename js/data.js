const MENU_ITEMS = [
  {
    id: 1,
    title: "Samarqand Zig‘ir Oshi",
    cat: "milliy",
    price: 42000,
    time: "15 daq",
    cal: 680,
    protein: 28,
    fat: 32,
    carbs: 65,
    veg: false,
    spicy: false,
    img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=700&q=80",
    desc: "Devzira guruch, sariq sabzi, no‘xat, mayiz va yumshoq mol go‘shtidan qozonda damlangan shohona palov."
  },
  {
    id: 2,
    title: "Qozon Kabob (Qo‘y go‘shti)",
    cat: "kabob",
    price: 58000,
    time: "22 daq",
    cal: 740,
    protein: 42,
    fat: 45,
    carbs: 34,
    veg: false,
    spicy: false,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
    desc: "Sopol qozonda qizartirib pishirilgan barra qo‘y qovurg‘alari va yosh kartoshka."
  },
  {
    id: 3,
    title: "Achichuk Yengil Salati",
    cat: "yengil",
    price: 16000,
    time: "5 daq",
    cal: 95,
    protein: 2,
    fat: 4,
    carbs: 12,
    veg: true,
    spicy: true,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    desc: "Yupqa to‘g‘ralgan pushti pomidor, shirin piyoz, rayhon va achchiq qalampir."
  },
  {
    id: 4,
    title: "Qovoqli va Go‘shtli Manti",
    cat: "milliy",
    price: 34000,
    time: "20 daq",
    cal: 460,
    protein: 22,
    fat: 18,
    carbs: 52,
    veg: false,
    spicy: false,
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80",
    desc: "Yupqa xamir ichida qo‘lda chopilgan go‘sht va piyoz, ustida suzma qaylasi bilan."
  },
  {
    id: 5,
    title: "Gril Sabzavotlari & Suzma",
    cat: "yengil",
    price: 24000,
    time: "12 daq",
    cal: 180,
    protein: 7,
    fat: 9,
    carbs: 19,
    veg: true,
    spicy: false,
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    desc: "Ko‘mirda pishgan baqlajon, bulg‘or qalampiri, qovoqcha va chakki suzma."
  },
  {
    id: 6,
    title: "Tandir Somsa (Ko‘za)",
    cat: "kabob",
    price: 14000,
    time: "10 daq",
    cal: 340,
    protein: 14,
    fat: 18,
    carbs: 31,
    veg: false,
    spicy: false,
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    desc: "Saksovul cho‘g‘ida qizargan qatlama xamirli sersuv tandir somsa."
  },
  {
    id: 7,
    title: "Qatiqli Salqin Chalop",
    cat: "yengil",
    price: 15000,
    time: "5 daq",
    cal: 120,
    protein: 6,
    fat: 5,
    carbs: 11,
    veg: true,
    spicy: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80",
    desc: "Tabiiy qatiq, bodring, rediska, shivit va rayhon bilan tayyorlangan yengil sho‘rva."
  },
  {
    id: 8,
    title: "Samarqand Novvotli Ko‘k Choy",
    cat: "choy",
    price: 15000,
    time: "5 daq",
    cal: 65,
    protein: 0,
    fat: 0,
    carbs: 16,
    veg: true,
    spicy: false,
    img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80",
    desc: "Chinni choynakda damlangan 95-navli ko‘k choy va uzum sharbatidan tayyorlangan novvot."
  }
];

const PROVERBS = [
  "«Choy — ko‘ngil ochqichi, suhbat — dil ravshani»",
  "«Mehmon otangdan ulug‘ — dasturxonimiz hamisha ochiq»",
  "«Bir piyola choy ustida yuz yillik do‘stlik boshlanar»",
  "«Oshning ta’mi — mehr va halollikdadir»"
];

const I18N = {
  uz: {
    nav_menu: "Menyu",
    nav_combo: "Kombo & Choy",
    nav_tapchan: "Tapchan & Banket",
    nav_hub: "Interaktiv",
    nav_gallery: "Galereya",
    hero_title: "Sharqona Me’morchilik va Haqiqiy Samarqand Ta’mi",
    hero_desc: "Zira va devzira guruchidan damlangan haqiqiy Samarqand oshi, ko‘mirda pishgan kaboblar va samovar choylaridan bahramand bo‘ling.",
    btn_order: "Buyurtma berish",
    btn_book: "Tapchan bron qilish"
  },
  ru: {
    nav_menu: "Меню",
    nav_combo: "Комбо и Чай",
    nav_tapchan: "Тапчан и Банкет",
    nav_hub: "Интерактив",
    nav_gallery: "Галерея",
    hero_title: "Восточное Гостеприимство и Настоящий Вкус Самарканда",
    hero_desc: "Настоящий самаркандский плов на зигирном масле, шашлыки на углях и ароматный самоварный чай.",
    btn_order: "Заказать еду",
    btn_book: "Забронировать тапчан"
  },
  en: {
    nav_menu: "Menu",
    nav_combo: "Combo & Tea",
    nav_tapchan: "Tapchan & Banquet",
    nav_hub: "Interactive",
    nav_gallery: "Gallery",
    hero_title: "Oriental Hospitality & Authentic Taste of Samarkand",
    hero_desc: "Enjoy traditional Samarkand plov, charcoal kebabs, light salads, and freshly brewed samovar tea.",
    btn_order: "Order Now",
    btn_book: "Book a Tapchan"
  }
};
