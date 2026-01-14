// api/generate.js
const mql = require('@microlink/mql');

const CARBON_CONFIG = {
  bg: 'rgba(226,233,239,1)',
  t: 'dracula-pro',
  wt: 'none',
  l: 'auto',
  ds: 'false',
  dsyoff: '20px',
  dsblur: '68px',
  wc: 'true',
  wa: 'true',
  pv: '56px',
  ph: '56px',
  ln: 'true',
  fl: '1',
  fm: 'Fira Code',
  fs: '14px',
  lh: '152%',
  si: 'false',
  es: '2x',
  wm: 'false',
};

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  try {
    const params = new URLSearchParams(CARBON_CONFIG);
    params.append('code', code);
    const targetUrl = `https://carbon.now.sh/?${params.toString()}`;

    const { data } = await mql(targetUrl, {
      screenshot: {
        element: '.export-container',
        optimizeForSpeed: true
      },
      viewport: { width: 1024, height: 768 },
      waitFor: 3000,
      meta: false,
    });

    if (data.screenshot && data.screenshot.url) {
      res.status(200).json({ 
        success: true, 
        image: data.screenshot.url,
        font: CARBON_CONFIG.fm,
        theme: CARBON_CONFIG.t
      });
    } else {
      throw new Error('Screenshot failed');
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
    
