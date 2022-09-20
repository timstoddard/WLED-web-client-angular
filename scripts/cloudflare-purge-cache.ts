import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// TODO convert to a bash function in deploy-website.sh (maybe)
// (when/if you do, remove type=module from package.json and esModuleInterop=true from tsconfig.json)
;(async () => {
  const email = process.env['CLOUDFLARE_EMAIL']!
  const apiKey = process.env['CLOUDFLARE_API_KEY']!
  const zoneId = process.env['CLOUDFLARE_ZONE_ID']!
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`
  const options = {
    headers: {
      'X-Auth-Email': email,
      'X-Auth-Key': apiKey,
    },
    data: {
      purge_everything: true,
    },
  }

  try {
    const response = await axios.delete(url, options)
    if (!response.data.success) {
      throw '[CloudFlare] Cache purge failed!'
    } else {
      console.log(`[CloudFlare] Cache purge status: ${response.status} ${response.statusText}`)
    }
  }
  catch (e) {
    console.error(e)
  }
})()
