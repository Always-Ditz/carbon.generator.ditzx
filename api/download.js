// api/download.js
const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    // Set header agar didownload sebagai file
    res.setHeader('Content-Disposition', 'attachment; filename="carbon-code.png"');
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe stream ke response Vercel
    response.data.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Download failed');
  }
};
