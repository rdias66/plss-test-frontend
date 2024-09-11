'use client'
import { getAllCategories, ICategory } from '@/api/providers/category.provider'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

const Categories: React.FC = () => {
  const [data, setData] = useState<ICategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

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
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  })
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Categorias</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.created_at
                    ? new Date(category.created_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>

                <TableCell>
                  <Link href={`/categories/${category.id}`} passHref>
                    <i className="fa-solid fa-magnifying-glass "></i>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default Categories
