'use client'

import { getAllCategories, ICategory } from '@/api/providers/category.provider'
import {
  getAllStatuses,
  getAllTickets,
  IStatus,
  ITicket,
} from '@/api/providers/ticket.provider'
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

const Tickets: React.FC = () => {
  const [data, setData] = useState<ITicket[]>([])
  const [statuses, setStatuses] = useState<IStatus[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tickets, statuses, categories] = await Promise.all([
          getAllTickets(),
          getAllStatuses(),
          getAllCategories(),
        ])
        if (Array.isArray(tickets)) setData(tickets)
        if (Array.isArray(statuses)) setStatuses(statuses)
        if (Array.isArray(categories)) setCategories(categories)
      } catch (error) {
        setError('Failed to fetch data: ' + error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusName = (statusId: string | undefined) => {
    const status = statuses.find((s) => s.id === statusId)
    return status ? status.name : 'Unknown'
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Chamados</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <Skeleton className="h-8 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>Resolução</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{getCategoryName(ticket.category_id)}</TableCell>
                <TableCell>{getStatusName(ticket.status_id)}</TableCell>
                <TableCell>
                  {ticket.created_at
                    ? new Date(ticket.created_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {ticket.solved_at
                    ? new Date(ticket.solved_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Link href={`/tickets/${ticket.id}`} passHref>
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

export default Tickets
