import { create } from 'zustand'

const useEventStore = create((set) => ({
    categories: [],
    isInitialized: false,
    fetchCategories: async () => {
        try {
            const response = await fetch(
                'https://calm-lime-armadillo.cyclic.app/api/categories'
            )
            if (!response.ok) {
                throw new Error('Error fetching categories')
            }
            let categories = await response.json()

            // sort categories by name
            categories.sort((a, b) => a.name.localeCompare(b.name))

            set({ categories, isInitialized: true })
        } catch (error) {
            console.error(error.message)
        }
    }
}))

export default useEventStore
