// Lean Body Academy funnel settings.
// Fill these in and every page picks them up. Leave a value empty to keep the placeholder showing.
window.FUNNEL_CONFIG = {
  // Josh's VSL on Wistia ("FINAL WEBSITE VIDEO"). Plays on watch.html once they've opted in.
  vslEmbedUrl: "https://fast.wistia.net/embed/iframe/cxxetluifb",

  // Josh's WhatsApp number in international format with no + or spaces, e.g. "447123456789"
  whatsappNumber: "",
  whatsappMessage: "Hi Josh, I've just booked my free call and wanted to confirm I'll be there.",

  // Opt ins go to the REPS dashboard and land in Lean Body Academy's Leads.
  dashboardFormsUrl: "https://dashboard.jolly-heart-2b8d.workers.dev/api/forms",
  dashboardClient: "lean-body-academy",

  // Opt ins also go to the Google Sheet "Lean Body Academy - Funnel Opt Ins".
  // Paste the Apps Script web app URL here (see integrations/google-sheet.gs).
  sheetWebhookUrl: "",

  // Optional: another webhook (Zapier, Make, GoHighLevel, etc.) that also receives the opt in as JSON { name, email, phone }
  leadWebhookUrl: ""
};
