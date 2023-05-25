const headers = [
  'Vita brevis ars longa',
  'Ultra posse nemo obligatur',
  'A capite ad calcem',
  'A potiori fit denominatio',
  'A probis probari, ab improbis improbari aequa laus est',
  'Pictoribus atque poetis',
  'Porta itineri longissima',
  'Quid est veritas?',
  'Invia virtuti nulla est via',
  'Aquĭla non captat muscas',
  'Cetĕrum censeo Carthagĭnem esse delendam',
  'Cujusvis homĭnis est errāre; nullīus, sine insipientis, in irrōre perseverāre',
  'Homo sum: humāni nihil a me aliēnum puto',
  'Parturiunt montes, nascētur ridicŭlus mus',
  'Repetitio est mater studiōrum',
  'Virtūtem primam esse puta compescĕre linguam',
  'Vivĕre est militāre',
  'Trahit sua quemque voluptas',
  'Semper homo bonus tiro est',
  'Tertium non datur'
]

export default function header() {
  return headers[Math.floor(Math.random() * headers.length)]
}
