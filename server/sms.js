const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const SMSRU_API_KEY = 'ВСТАВЬ_СЮДА_СВОЙ_API_КЛЮЧ_SMSRU'

// POST /send-code { phone: "+7...", code: "123456" }
app.post('/send-code', async (req, res) => {
  const { phone, code } = req.body
  if (!phone || !code) {
    return res.status(400).json({ error: 'Номер и код обязательны' })
  }
  const url = `https://sms.ru/sms/send?api_id=${SMSRU_API_KEY}&to=${encodeURIComponent(phone)}&msg=Ваш+код:+${code}&json=1`
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.status === 'OK') {
      res.json({ success: true })
    } else {
      res.status(500).json({ error: data.status_text || 'Ошибка отправки SMS' })
    }
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`SMS сервер запущен на http://localhost:${PORT}`)
}) 