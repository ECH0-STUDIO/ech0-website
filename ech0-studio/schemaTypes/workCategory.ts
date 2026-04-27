import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workCategory',
  title: 'Work Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Category Name' }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug' }),
  ]
})
