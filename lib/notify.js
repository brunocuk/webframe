// Best-effort WhatsApp ping to Bruno via CallMeBot. Never throws.
export async function notifyWhatsApp(text) {
  const phone = process.env.CALLMEBOT_PHONE
  const apikey = process.env.CALLMEBOT_APIKEY
  if (!phone || !apikey) return
  try {
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
        `&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(text)}`
    )
  } catch (err) {
    console.error('WhatsApp notify failed:', err)
  }
}
