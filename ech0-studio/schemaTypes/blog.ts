import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug' }),
    defineField({ name: 'smallThumbnailUrl', type: 'string', title: 'Small Thumbnail URL' }),
    defineField({ name: 'coverImageUrl', type: 'string', title: 'Cover Image URL' }),
    defineField({ name: 'mainContent', type: 'text', title: 'Main Content (HTML)' }),
    defineField({ name: 'metaDescription', type: 'text', title: 'Meta Description' }),
  ]
})
