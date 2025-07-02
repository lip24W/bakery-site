const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const RESEND_API_KEY = 're_LgsYCDKF_QEQD2bQ8ACyi7GhK1z1UtnZS'
const FROM_EMAIL = 'noreply@resend.dev' // Можно заменить на свой email-отправителя

// POST /send-code { email: '...', code: '123456' }
app.post('/send-code', async (req, res) => {
  const { email, code } = req.body
  if (!email || !code) {
    return res.status(400).json({ error: 'Email и код обязательны' })
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Код подтверждения для регистрации',
        html: `<h2>Ваш код подтверждения: <b>${code}</b></h2><p>Введите этот код на сайте для завершения регистрации.</p>`
      })
    })
    const data = await response.json()
    if (response.ok) {
      res.json({ success: true })
    } else {
      res.status(500).json({ error: data.error?.message || 'Ошибка отправки письма' })
    }
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Mail сервер запущен на http://localhost:${PORT}`)
}) 