import sharp from 'sharp';
import { readFile } from 'fs/promises';

async function generateAppleIcon() {
    try {
        // Leer el logo original
        const logoBuffer = await readFile('./public/logotest.png');
        
        // Crear canvas de 512x512 con fondo azul
        const background = await sharp({
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: { r: 0, g: 78, b: 168, alpha: 1 } // #004EA8
            }
        }).png().toBuffer();
        
        // Redimensionar logo a 410x410 (80% de 512)
        const resizedLogo = await sharp(logoBuffer)
            .resize(410, 410, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer();
        
        // Componer: fondo + logo centrado
        const finalIcon = await sharp(background)
            .composite([{
                input: resizedLogo,
                top: 51, // (512 - 410) / 2
                left: 51
            }])
            .png()
            .toFile('./public/icon-apple.png');
        
        console.log('✅ Ícono Apple generado: public/icon-apple.png');
        console.log(`   Tamaño: ${finalIcon.width}x${finalIcon.height}`);
        
        // También generar versión de 180x180
        await sharp('./public/icon-apple.png')
            .resize(180, 180)
            .toFile('./public/icon-apple-180.png');
        
        console.log('✅ Ícono Apple 180x180 generado: public/icon-apple-180.png');
        
    } catch (error) {
        console.error('❌ Error generando ícono:', error);
    }
}

generateAppleIcon();
