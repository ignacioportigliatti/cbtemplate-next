// Description: Template resolver for dynamic template loading
// Used to load templates based on WordPress theme options

import { getThemeOptions } from './wordpress'
import { cache } from 'react'

export const getActiveTemplate = cache(async () => {
  try {
    const themeOptions = await getThemeOptions()
    const templateId = themeOptions?.templates?.selected_template_details?.id
    
    // Validate template exists
    if (!templateId) {
      console.warn('No template selected, falling back to barbershop')
      return 'barbershop'
    }
    
    return templateId
  } catch (error) {
    console.error('Error getting active template:', error)
    return 'barbershop' // Fallback template
  }
})

export const loadTemplate = async (templateId: string) => {
  try {
    const template = await import(`../templates/${templateId}`)
    return template
  } catch (error) {
    console.warn(`Template ${templateId} not found, falling back to barbershop`)
    const defaultTemplate = await import(`../templates/barbershop`)
    return defaultTemplate
  }
}

// Helper for loading specific template pages
export const loadTemplatePage = async (templateId: string, pageName: string) => {
  const template = await loadTemplate(templateId)
  return template[pageName]
}

// Type for template structure
export interface TemplateModule {
  Layout: React.ComponentType<{ children: React.ReactNode }>
  HomePage: React.ComponentType<any>
  BlogPage: React.ComponentType<any>
  BlogPostPage: React.ComponentType<any>
  BlogAuthorsPage: React.ComponentType<any>
  BlogCategoriesPage: React.ComponentType<any>
  BlogTagsPage: React.ComponentType<any>
  ServicesPage: React.ComponentType<any>
  ServiceDetailPage: React.ComponentType<any>
  AboutPage: React.ComponentType<any>
  ContactPage: React.ComponentType<any>
} 