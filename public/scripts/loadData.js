async function fetchGoogleSheetData(sheetUrl) {
  const response = await fetch(sheetUrl);
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });

  return parsed.data.filter(row => Object.values(row).some(cell => cell !== ""));
}

async function loadData() {
  const sheets = ['productos', 'resenias', 'negocio'];
  const baseId = '1oSXRJkVeD3napDd9bltITSA4snw4uqOgXzLtfav05yo'; // ID de tu Google Sheet
  const gidMap = {
    productos: '1636054267',
    resenias: '1073461284',
    negocio: '1526476747'
  };

  const data = {};

  for (const sheet of sheets) {
    const gid = gidMap[sheet];
    const url = `https://docs.google.com/spreadsheets/d/${baseId}/export?format=csv&id=${baseId}&gid=${gid}`;
    const content = await fetchGoogleSheetData(url);
    
    if (sheet === 'negocio') {
      data[sheet] = Object.fromEntries(content.map(row => [row.clave, row.valor]));
    } else {
      data[sheet] = content;
    }
  }

  return data;
}
