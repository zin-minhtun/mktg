const Quote = require("../models/quoteModel");

const getRandomQuote = async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne().skip(randomIndex);
        res.json(randomQuote);
      } catch (error) {
        res.status(500).json({ error: "Error fetching quote" });
      }
};

module.exports = { getRandomQuote };
