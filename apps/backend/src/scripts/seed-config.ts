import { db, siteConfig } from '@l-spa/database';
import { sql } from 'drizzle-orm';

async function seedSiteConfig() {
  console.log('🌱 Seeding site configuration...\n');

  const configs = [
    {
      id: 'footer',
      data: JSON.stringify({
        es: {
          description: 'L-SPA - Tu destino para el bienestar y relajación total',
          links: [
            { label: 'Inicio', href: '/' },
            { label: 'Servicios', href: '/servicios' },
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Contacto', href: '/contacto' }
          ],
          socialMedia: {
            instagram: 'https://instagram.com/lspa',
            facebook: 'https://facebook.com/lspa',
            whatsapp: 'https://wa.me/521234567890'
          },
          copyright: '© 2026 L-SPA. Todos los derechos reservados.'
        },
        en: {
          description: 'L-SPA - Your destination for total wellness and relaxation',
          links: [
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          socialMedia: {
            instagram: 'https://instagram.com/lspa',
            facebook: 'https://facebook.com/lspa',
            whatsapp: 'https://wa.me/521234567890'
          },
          copyright: '© 2026 L-SPA. All rights reserved.'
        }
      })
    },
    {
      id: 'header',
      data: JSON.stringify({
        es: {
          logo: 'L-SPA',
          tagline: 'Bienestar y Relajación',
          cta: 'Reservar Ahora'
        },
        en: {
          logo: 'L-SPA',
          tagline: 'Wellness & Relaxation',
          cta: 'Book Now'
        }
      })
    },
    {
      id: 'global',
      data: JSON.stringify({
        es: {
          siteName: 'L-SPA',
          siteDescription: 'Centro de bienestar y spa premium',
          contact: {
            email: 'contacto@l-spa.com',
            phone: '+52 123 456 7890',
            address: 'Av. Principal 123, Ciudad'
          }
        },
        en: {
          siteName: 'L-SPA',
          siteDescription: 'Premium wellness and spa center',
          contact: {
            email: 'contact@l-spa.com',
            phone: '+52 123 456 7890',
            address: '123 Main Street, City'
          }
        }
      })
    }
  ];

  for (const config of configs) {
    try {
      await db.insert(siteConfig)
        .values({
          id: config.id,
          data: config.data,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: [siteConfig.id],
          set: {
            data: config.data,
            updatedAt: new Date()
          }
        });
      console.log(`✅ Config '${config.id}' upserted successfully`);
    } catch (error) {
      console.error(`❌ Error inserting '${config.id}':`, error);
    }
  }

  console.log('\n✨ Seeding complete!');
}

seedSiteConfig()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
