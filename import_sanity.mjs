import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { parse } from 'csv-parse/sync';

const projectId = '4a9cmbdi';
const dataset = 'production';
const apiVersion = '2024-04-23';

const token = process.env.SANITY_TOKEN;

if (!token) {
    console.error("Please provide SANITY_TOKEN environment variable. You can create a token in the Sanity control panel (https://sanity.io/manage).");
    process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false
});

const exportDir = 'f:\\\\Projects\\\\ECH0 STUDIO Website Export';
const cmsDir = path.join(exportDir, 'cms');

const categorySlugToId = {};

async function importCSV(filename, schemaType, mapping) {
    console.log(`Processing ${schemaType}...`);
    const filePath = path.join(cmsDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, { columns: true, skip_empty_lines: true });

    for (const row of records) {
        if (row['Archived'] === 'true') continue;

        const doc = {
            _type: schemaType,
            _id: row['Item ID'], // using webflow item ID as Sanity ID
            ...mapping(row)
        };

        if (schemaType === 'workCategory') {
            categorySlugToId[row['Slug']] = doc._id;
        }

        try {
            await client.createOrReplace(doc);
            console.log(`Imported ${schemaType}: ${doc.name || doc.title}`);
        } catch (e) {
            console.error(`Failed to import ${doc._id}: ${e.message}`);
        }
    }
}

async function main() {
    await importCSV('ECH0 STUDIO - Work Categories - 6804d29c168231fd0260a094.csv', 'workCategory', (row) => ({
        name: row['Category Name'],
        slug: { _type: 'slug', current: row['Slug'] }
    }));

    await importCSV('ECH0 STUDIO - Blogs - 685059b25eb06068da0d2365.csv', 'blog', (row) => ({
        title: row['Title'],
        slug: { _type: 'slug', current: row['Slug'] },
        smallThumbnailUrl: row['Small Thumbnail'],
        coverImageUrl: row['Cover Image'],
        mainContent: row['Main content'], // Keeping as HTML
        metaDescription: row['Meta Description']
    }));

    await importCSV('ECH0 STUDIO - Works - 6804d12858514b6a49f803ee.csv', 'work', (row) => {
        const categoriesSlugs = (row['Category'] || '').split(';').map(c => c.trim()).filter(c => c);
        const categories = categoriesSlugs.map(slug => {
            const id = categorySlugToId[slug];
            return id ? { _type: 'reference', _ref: id } : null;
        }).filter(c => c);

        return {
            title: row['Project Title'],
            slug: { _type: 'slug', current: row['Slug'] },
            thumbnailUrl: row['Project Thumbnail'],
            shortDescription: row['Short Description'],
            galleryUrls: (row['Gallery'] || '').split(';').map(s => s.trim()).filter(s => s),
            categories: categories,
            projectDetails: row['Project Details'] // Keeping as HTML
        };
    });

    console.log('Import finished successfully.');
}

main().catch(console.error);
