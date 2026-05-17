import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '../access/isAdmin.ts'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'PC', value: 'PC' },
        { label: 'PS5', value: 'PS5' },
        { label: 'Xbox', value: 'Xbox' },
        { label: 'Switch', value: 'Switch' },
        { label: 'Mobile', value: 'Mobile' },
        { label: 'Multi-platform', value: 'Multi' },
      ],
    },
    {
      name: 'releaseYear',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
