function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log('')
  console.log('========================================'.cyan);
  console.log('=            Blum Auto Bot             ='.cyan);
  console.log('=          Created by Ketex            ='.cyan);
  console.log('=       Anak Airdrop Indonesia         ='.cyan);
  console.log('========================================'.cyan);
  console.log();
}

module.exports = { displayHeader };
