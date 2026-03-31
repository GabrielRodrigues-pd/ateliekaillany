import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Para rodar: npm run optimize-images 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const BACKUP_DIR = path.join(__dirname, '..', 'src', 'assets-backup');

async function optimizeImages() {
  console.log('🚀 Iniciando compressão de imagens (Modo TinyPNG)...\n');

  // Criar pasta de backup se não existir
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Criada pasta de backup em: ${BACKUP_DIR}`);
  }

  const files = fs.readdirSync(ASSETS_DIR);
  let totalSavedBytes = 0;
  let optimizedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Ignorar non-images
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      continue;
    }

    const inputPath = path.join(ASSETS_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    
    // Ler os dados do arquivo atual
    const inputBuffer = fs.readFileSync(inputPath);
    const originalSize = inputBuffer.length;

    // Se já estiver muito pequena, pular (exemplo: menor que 10KB)
    if (originalSize < 10000) {
      console.log(`⏩ ${file} já é super pequena (${(originalSize/1024).toFixed(1)} KB) - Ignorando.`);
      continue;
    }

    try {
      // Fazer backup do original apenas se não existir ainda no backup
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }

      let optimizedBuffer;
      const pipeline = sharp(inputBuffer);

      // Aplicar otimizações de acordo com a extensão
      if (ext === '.png') {
        // Usa `palette: true` que comprime convertendo do 32-bit pro formato indexado 8-bit padrão TinyPNG
        optimizedBuffer = await pipeline
          .png({ palette: true, quality: 80, compressionLevel: 9 })
          .toBuffer();
      } else {
        // mozjpeg tira o máximo que a tecnologia JPEG permite
        optimizedBuffer = await pipeline
          .jpeg({ mozjpeg: true, quality: 80 })
          .toBuffer();
      }

      const newSize = optimizedBuffer.length;

      // Só vamos salvar se a versão otimizada for realmene menor do que a original.
      if (newSize < originalSize) {
        fs.writeFileSync(inputPath, optimizedBuffer);
        
        const savedBytes = originalSize - newSize;
        const percentSaved = ((savedBytes / originalSize) * 100).toFixed(1);
        
        totalSavedBytes += savedBytes;
        optimizedCount++;

        console.log(`✅ ${file} comprimida:`);
        console.log(`   De: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Para: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Economia: ${percentSaved}%\n`);
      } else {
        console.log(`🛡️ ${file} deixada intacta (Original já está no limite de compressão).\n`);
      }

    } catch (err) {
      console.error(`❌ Erro ao processar ${file}:`, err.message);
    }
  }

  console.log('🎉 Otimização Finalizada!');
  console.log(`📂 Foram comprimidas ${optimizedCount} imagens.`);
  console.log(`💾 Espaço economizado em disco: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB!`);
  console.log(`(Imagens antigas em caso de arrependimento ficarão isoladas na pasta src/assets-backup/)`);
}

optimizeImages();
