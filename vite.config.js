import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

function getEnvValue(keyName) {
  if (process.env[keyName]) return process.env[keyName].trim()
  try {
    const envFile = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8')
      const match = content.match(new RegExp(`^${keyName}\\s*=\\s*(.*)$`, 'm'))
      if (match) {
        return match[1].trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {}
  return ''
}

function generateBuiltinHealthAdvice(healthData) {
  const { profile = {}, meals = [], exercises = [], waterMl = 0, sleepHours = 0 } = healthData || {}
  const username = profile.username || 'Friend'
  const goal = profile.goal || 'maintain'
  const targetCalories = Number(profile.targetCalories) || 2000
  const targetProtein = Number(profile.targetProtein) || 125
  const targetWater = Number(profile.waterTarget) || 2000
  const targetSleep = Number(profile.sleepTarget) || 8

  const totalCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0)
  const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0)
  const totalExerciseMins = exercises.reduce((sum, e) => sum + (Number(e.durationMins) || (e.sets ? e.sets * 1.5 : 0)), 0)

  const calDiff = targetCalories - totalCalories
  const waterDiff = targetWater - waterMl
  const sleepDiff = targetSleep - sleepHours

  if (meals.length === 0 && totalExerciseMins === 0 && waterMl === 0) {
    return `👋 **Hey ${username}! Let's kickstart your healthy day!**\n\n` +
      `• 🥗 **First Meal:** Logging your meals helps monitor your metabolism and keeps your energy steady throughout the day.\n` +
      `• 💧 **Hydration Goal:** Start with a warm glass of water (250–500ml) to awaken digestion.\n` +
      `• 🎯 **Today's Budget:** You have **${targetCalories} kcal** and **${targetProtein}g of protein** ready in your daily targets.\n` +
      `• 👟 **Move a little:** Even a brisk 15-minute walk today will boost circulation and mental focus!\n\n` +
      `*Log your meals and habits above, then click here again for updated, personalized coaching analysis!*`
  }

  let calStatus = ''
  if (calDiff > 300) {
    calStatus = `You have **${calDiff} kcal remaining** today. ${goal === 'lose' ? 'Great calorie deficit pacing for fat loss!' : 'Consider a wholesome snack like nuts, fruit, or boiled eggs to hit your target.'}`
  } else if (calDiff >= -100 && calDiff <= 300) {
    calStatus = `**Spot on!** You are right on track with **${totalCalories} / ${targetCalories} kcal** consumed (${Math.abs(calDiff)} kcal difference). Outstanding portion control!`
  } else {
    calStatus = `You are **${Math.abs(calDiff)} kcal over** your daily target (${totalCalories} / ${targetCalories} kcal). ${goal === 'lose' ? 'No worries! A light evening walk or having high-fiber greens with your next meal will balance it out nicely.' : 'Good caloric surplus for muscle recovery!'}`
  }

  let proteinStatus = ''
  const proteinPercent = Math.round((totalProtein / targetProtein) * 100)
  if (proteinPercent >= 90) {
    proteinStatus = `**Excellent protein intake!** You logged **${totalProtein}g** (${proteinPercent}% of your ${targetProtein}g goal). Your muscles have plenty of amino acids for repair.`
  } else {
    const proteinLeft = targetProtein - totalProtein
    proteinStatus = `You've reached **${totalProtein}g / ${targetProtein}g protein** (${proteinLeft}g remaining). Try adding paneer, dal, Greek yogurt, tofu, or eggs to your next meal.`
  }

  let hydrationStatus = ''
  if (waterMl >= targetWater) {
    hydrationStatus = `**Hydration champion!** You've completed **${waterMl}ml** (Goal: ${targetWater}ml). Hydration promotes optimal digestion and nutrient absorption.`
  } else {
    hydrationStatus = `Hydration is at **${waterMl}ml / ${targetWater}ml** (${waterDiff}ml left). Remember to sip 1–2 more cups of water before the day ends.`
  }

  let exerciseStatus = ''
  if (totalExerciseMins > 0) {
    exerciseStatus = `**Great workout effort!** You logged **${totalExerciseMins} mins** of physical activity across ${exercises.length} exercise(s). Regular physical activity accelerates cardiovascular health and metabolic rate.`
  } else {
    exerciseStatus = `No workouts logged yet today. Aim for at least 20–30 minutes of walking, yoga poses (Surya Namaskar), or stretching to keep your joints agile.`
  }

  let sleepStatus = ''
  if (sleepHours >= 7) {
    sleepStatus = `**Restorative sleep!** You logged **${sleepHours} hours** of rest (Target: ${targetSleep}h). Quality sleep optimizes cortisol and appetite regulation hormones.`
  } else if (sleepHours > 0) {
    sleepStatus = `You logged **${sleepHours} hours** of sleep (Target: ${targetSleep}h). You have a slight sleep deficit of ${sleepDiff > 0 ? sleepDiff : 1}h. Aim for an earlier bedtime tonight to let muscle tissue recharge.`
  } else {
    sleepStatus = `Remember to log your bedtime & wake-up times in the Sleep Tracker to monitor your recovery cycle.`
  }

  return `🌟 **Daily Health Coach Summary for ${username}**\n\n` +
    `• 🔥 **Calorie Balance:** ${calStatus}\n` +
    `• 🥩 **Macronutrients:** ${proteinStatus}\n` +
    `• 💧 **Hydration:** ${hydrationStatus}\n` +
    `• 🏋️ **Active Movement:** ${exerciseStatus}\n` +
    `• 🌙 **Sleep & Recovery:** ${sleepStatus}\n\n` +
    `💡 **Coach's Top Tip for Today:** Prioritize mindful eating, chew slowly, and stay hydrated between meals. You're making consistent progress toward your **${goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Muscle Gain' : 'Healthy Maintenance'}** goal! 🚀`
}

const aiCoachApi = {
  name: 'ai-coach-api',
  configureServer(server) {
    server.middlewares.use('/api/ai-coach', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end('Method not allowed')
        return
      }

      let body = ''
      for await (const chunk of req) body += chunk
      let healthData = {}
      try {
        healthData = JSON.parse(body)
      } catch {}

      const serverApiKey = getEnvValue('GEMINI_API_KEY') || getEnvValue('GOOGLE_API_KEY') || getEnvValue('VITE_GEMINI_API_KEY')
      
      // If server API key is provided by the application developer, call Gemini API
      if (serverApiKey) {
        try {
          const systemPrompt = 'You are an encouraging and supportive health-tracking coach. Give concise, actionable general wellness guidance based only on the supplied daily logs (calories, macros, hydration, workout, and sleep). Use clean bullet points and friendly emojis. Do not diagnose, prescribe, or replace a clinician. Clearly mention when medical advice is appropriate.'
          const userPrompt = `Here are my daily health habits and logs for today:\n${JSON.stringify(healthData, null, 2)}\n\nPlease provide personalized feedback and quick actionable tips for today.`

          let response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${serverApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: userPrompt }] }],
              }),
            }
          )

          if (!response.ok) {
            // Fallback to gemini-1.5-flash
            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${serverApiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  system_instruction: { parts: [{ text: systemPrompt }] },
                  contents: [{ parts: [{ text: userPrompt }] }],
                }),
              }
            )
          }

          if (response.ok) {
            const data = await response.json()
            const adviceText = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n')
            if (adviceText) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ advice: adviceText, source: 'gemini' }))
              return
            }
          }
        } catch (geminiError) {
          console.warn('[AI Coach] Gemini API error, seamlessly using smart coach fallback:', geminiError)
        }
      }

      // Built-in intelligent health analytics coach (provided by us)
      const advice = generateBuiltinHealthAdvice(healthData)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ advice, source: 'builtin' }))
    })
  },
}

const otpApi = {
  name: 'otp-api',
  configureServer(server) {
    server.middlewares.use('/api/send-otp', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end('Method not allowed')
        return
      }
      let body = ''
      for await (const chunk of req) body += chunk
      try {
        const { phoneNumber, otp, channel, provider, settings } = JSON.parse(body)
        const cleanPhone = String(phoneNumber || '').replace(/\D/g, '')
        if (!cleanPhone || cleanPhone.length < 10) {
          throw new Error('Valid 10-digit mobile number required.')
        }

        const message = `Your FitLife Verification Code is: ${otp}. Valid for 5 minutes.`

        // 1. CallMeBot (100% Free WhatsApp API for Developers)
        if (provider === 'callmebot') {
          const apiKey = settings?.callmebotKey || process.env.CALLMEBOT_API_KEY
          if (!apiKey) {
            throw new Error('CallMeBot API Key is required. Follow the instructions in Settings to get your free key.')
          }
          const url = `https://api.callmebot.com/whatsapp.php?phone=+91${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`
          const r = await fetch(url)
          const respText = await r.text()
          if (!r.ok || respText.toLowerCase().includes('error')) {
            throw new Error(respText || 'CallMeBot WhatsApp delivery failed.')
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, message: `OTP sent via WhatsApp to +91 ${cleanPhone}` }))
          return
        }

        // 2. Twilio (WhatsApp & SMS)
        if (provider === 'twilio') {
          const sid = settings?.twilioSid || process.env.TWILIO_ACCOUNT_SID
          const token = settings?.twilioToken || process.env.TWILIO_AUTH_TOKEN
          let from = settings?.twilioFrom || process.env.TWILIO_FROM_NUMBER
          if (!sid || !token) {
            throw new Error('Twilio Account SID and Auth Token are required in Settings.')
          }

          let to = `+91${cleanPhone}`
          if (channel === 'whatsapp') {
            to = `whatsapp:+91${cleanPhone}`
            from = from ? (from.startsWith('whatsapp:') ? from : `whatsapp:${from}`) : 'whatsapp:+14155238886'
          }

          const params = new URLSearchParams()
          params.append('To', to)
          params.append('From', from)
          params.append('Body', message)

          const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          })

          const data = await r.json()
          if (!r.ok) {
            throw new Error(data.message || 'Twilio delivery failed. Check credentials and recipient number.')
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, message: `OTP sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} to +91 ${cleanPhone}` }))
          return
        }

        // 3. Fast2SMS (Indian SMS Gateway)
        if (provider === 'fast2sms') {
          let apiKey = settings?.fast2smsKey || process.env.FAST2SMS_API_KEY
          if (!apiKey) {
            throw new Error('Fast2SMS authorization key is required.')
          }
          // Clean key: strip leading 'api-' if accidentally copied
          apiKey = apiKey.replace(/^api-/, '').trim()

          // Try route=otp
          const otpUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`
          const r = await fetch(otpUrl, { method: 'GET' })
          const data = await r.json()

          if (data.return) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, message: `SMS OTP sent to +91 ${cleanPhone}` }))
            return
          }

          // If route=otp asks for website verification, attempt route=q (Quick SMS)
          const qUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=q&message=${encodeURIComponent(`Your FitLife Verification Code is: ${otp}. Valid for 5 minutes.`)}&language=english&flash=0&numbers=${cleanPhone}`
          const qResp = await fetch(qUrl, { method: 'GET' })
          const qData = await qResp.json()

          if (qData.return) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, message: `SMS OTP sent to +91 ${cleanPhone}` }))
            return
          }

          // If Fast2SMS blocks due to Indian telecom website verification or 100 INR requirement
          if (data.status_code === 996 || qData.status_code === 999 || String(data.message || qData.message).includes('website verification')) {
            throw new Error(`Fast2SMS blocked by Indian telecom laws: ${data.message || qData.message || 'Website verification required'}. Please use RapidAPI SMSAPI key to send real SMS.`)
          }

          throw new Error(data.message || qData.message || 'Fast2SMS delivery failed.')
        }

        // 4. RapidAPI (SMSAPI.com)
        if (provider === 'rapidapi' || settings?.rapidapiKey) {
          const rapidKey = settings?.rapidapiKey || process.env.RAPIDAPI_KEY
          if (!rapidKey) {
            throw new Error('RapidAPI Key (x-rapidapi-key) is required.')
          }

          const recipient = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`

          const queryParams = new URLSearchParams({
            to: recipient,
            message,
            format: 'json',
          })

          const rapidResp = await fetch(`https://smsapi-com3.p.rapidapi.com/sms.do?${queryParams.toString()}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-rapidapi-host': 'smsapi-com3.p.rapidapi.com',
              'x-rapidapi-key': String(rapidKey).trim(),
            },
            body: JSON.stringify({
              to: recipient,
              message,
              format: 'json',
            }),
          })

          const rapidData = await rapidResp.json().catch(() => ({}))
          if (!rapidResp.ok || (rapidData.error && rapidData.error !== 0)) {
            const errDetail = rapidData.message || rapidData.error_message || (rapidData.error ? `SMSAPI Error Code ${rapidData.error}` : null) || `RapidAPI error (HTTP ${rapidResp.status})`
            throw new Error(errDetail)
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, message: `SMS OTP sent via RapidAPI to +${recipient}` }))
          return
        }

        throw new Error(`Unsupported provider: ${provider}`)
      } catch (err) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, error: err.message || 'Failed to dispatch OTP.' }))
      }
    })
  },
}

const googleAuthApi = {
  name: 'google-auth-api',
  configureServer(server) {
    server.middlewares.use('/api/google-client-id', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      if (req.method === 'GET') {
        const clientId = getEnvValue('VITE_GOOGLE_CLIENT_ID') || getEnvValue('GOOGLE_CLIENT_ID')
        res.statusCode = 200
        res.end(JSON.stringify({ clientId }))
        return
      }
      if (req.method === 'POST') {
        let body = ''
        for await (const chunk of req) body += chunk
        try {
          const { clientId } = JSON.parse(body)
          const cleanId = String(clientId || '').trim()
          const envFile = path.resolve(process.cwd(), '.env')
          let envContent = ''
          if (fs.existsSync(envFile)) {
            envContent = fs.readFileSync(envFile, 'utf8')
          }
          if (/^VITE_GOOGLE_CLIENT_ID\s*=/m.test(envContent)) {
            envContent = envContent.replace(/^VITE_GOOGLE_CLIENT_ID\s*=.*$/m, `VITE_GOOGLE_CLIENT_ID=${cleanId}`)
          } else {
            envContent += `\nVITE_GOOGLE_CLIENT_ID=${cleanId}\n`
          }
          fs.writeFileSync(envFile, envContent, 'utf8')
          process.env.VITE_GOOGLE_CLIENT_ID = cleanId
          res.statusCode = 200
          res.end(JSON.stringify({ success: true, clientId: cleanId }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
        return
      }
      res.statusCode = 405
      res.end(JSON.stringify({ error: 'Method not allowed' }))
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: true,
    allowedHosts: true,
  },
  plugins: [react(), aiCoachApi, otpApi, googleAuthApi],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
})
