import { createClient } from '@sanity/client';
export const sanityClient = createClient({
  projectId: '4a9cmbdi',
  dataset: 'production',
  apiVersion: '2024-04-23',
  useCdn: false
});
