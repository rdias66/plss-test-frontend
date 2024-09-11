import { getAllCategories, ICategory } from '@/api/providers/category.provider'
import { useEffect, useState } from 'react'

const Categories: React.FC = () => {
  const [data, setData] = useState<ICategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories()
        if (Array.isArray(categories)) {
          setData(categories)
        } else if ('errorMessage' in categories) {
          setError(categories.errorMessage)
        }
      } catch (error) {
        setError('Falha ao pesquisar categorias: ' + error)
      }
    }

    fetchCategories()
  })
  return (
    <div>
      <h1>this is category list</h1>
    </div>
  )
}

export default Categories
