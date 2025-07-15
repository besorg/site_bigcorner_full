async function fetchGoogleSheetData(sheetUrl) {
  const response = await fetch(sheetUrl);
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });

  return parsed.data.filter(row => Object.values(row).some(cell => cell !== ""));
}

async function loadData() {
  const sheets = ['productos', 'reseñas', 'negocio'];
  const baseId = '1tZCdHo9AGa1ts-j30mdUb2lnwh1v5rLMjGj3xtuKPRg'; // ID de tu Google Sheet
  const gidMap = {
    productos: '0',
    reseñas: '1749471671',
    negocio: '1592764057'
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
