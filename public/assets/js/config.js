/* =========================================================
   SITE SETTINGS — edit this file to update links and settings.
   Everything marked TODO still needs a real value.
   ========================================================= */
window.SITE = {
  // TODO: paste the Udemy course URL once the course is published
  udemyUrl: "https://www.udemy.com/",

  // TODO: put the guide PDF in assets/files/ with this exact name
  guidePdf: "assets/files/digital-transformation-guide.pdf",

  // YouTube video that plays from the hero image (the ID from the video URL)
  heroVideo: "XrN1vurP4qI",

  // Cal.com booking (from your embed code)
  calLink: "hardani3mr/30min",

  // TODO: confirm your public email (suggested once you own the domain)
  email: "hello@omarhardani.com",

  socials: {
    linkedin: "https://www.linkedin.com/in/hardani3mr",
    youtube: "https://www.youtube.com/@omarhardanii",
    instagram: "https://www.instagram.com/hardani3mr",
    facebook: "https://www.facebook.com/hardani3mr"
  },

  youtube: {
    channelId: "UCh87dV4YBUw2ojWsOXBKpTA",
    // Paste your YouTube Data API key here to make videos update automatically
    // (long videos and Shorts are separated for you). Restrict the key to your
    // domain in Google Cloud. Without a key, the site shows the list in data/videos.js.
    apiKey: "AIzaSyB-ZudMwgcgeMG3k8ypCZ078igxnXmcm58"
  },

  // Guide and blog signups are sent to Kit (kit.com) through a small Netlify function
  // (netlify/functions/subscribe.mjs). The Kit key is stored in Netlify, not here.
  formEndpoint: "/api/subscribe",

  // Logos of ventures you've founded or contributed to (shown on the home page).
  // Add files to assets/img/logos/ and list them here. Empty list = section hidden.
  ventures: [
    "assets/img/logos/placeholder-1.svg",
    "assets/img/logos/placeholder-2.svg",
    "assets/img/logos/placeholder-3.svg",
    "assets/img/logos/placeholder-4.svg",
    "assets/img/logos/placeholder-5.svg",
    "assets/img/logos/placeholder-6.svg"
  ]
};
