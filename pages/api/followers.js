const cheerio = require('cheerio') // 1

export default async (req, res) => {
  // 2
  if (req.method === 'POST') {
    // 3
    const username = req.body.TWuser

    try {
      // 4
      const response = await fetch(`https://mobile.twitter.com/${username}`)
      const htmlString = await response.text()
      const $ = cheerio.load(htmlString)
      const searchContext = `a[href='/${username}/followers']`
      const followerCountString = $(searchContext)
        .text()
        .match(/[0-9]/gi)
        .join('')

      res.statusCode = 200
      return res.json({
        user: username,
        followerCount: Number(followerCountString),
      })
    } catch (e) {
      // 5
      res.statusCode = 404
      return res.json({
        user: username,
        error: `${username} not found. Tip: Double check the spelling.`,
        followerCount: -1,
      })
    }
  }
}
