import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Project Title' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug' }),
    defineField({ name: 'thumbnailUrl', type: 'string', title: 'Project Thumbnail URL' }),
    defineField({ name: 'shortDescription', type: 'text', title: 'Short Description' }),
    defineField({ name: 'galleryUrls', type: 'array', of: [{type: 'string'}], title: 'Gallery URLs' }),
    defineField({ name: 'categories', type: 'array', of: [{type: 'reference', to: [{type: 'workCategory'}]}], title: 'Categories' }),
    defineField({ name: 'projectDetails', type: 'text', title: 'Project Details (HTML)' }),
  ]
})
