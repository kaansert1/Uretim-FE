// Notarization için boş dosya - Windows build için gerekli değil
module.exports = async function() {
  // Windows için notarization gerekli değil
  console.log('Notarization skipped for Windows build');
};
