'use client'

import { useEffect, useState } from 'react'
import {
  getSLA,
  findTicketsByStatus,
  getAllStatuses,
  ITicket,
  IStatus,
} from '@/api/providers/ticket.provider'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'

export default function Home() {
  const [slaMetric, setSlaMetric] = useState<number | null>(null)
  const [newTickets, setNewTickets] = useState<ITicket[]>([])
  const [pendingTickets, setPendingTickets] = useState<ITicket[]>([])
  const [resolvedTickets, setResolvedTickets] = useState<ITicket[]>([])
  const [statuses, setStatuses] = useState<IStatus[]>([])

  useEffect(() => {
    getSLA()
      .then((response) => setSlaMetric(response.sla_percentage))
      .catch((error) => console.error('Error fetching SLA metric:', error))

    getAllStatuses()
      .then((statusesResponse) => {
        if (!('errorMessage' in statusesResponse)) {
          setStatuses(statusesResponse)
          const statusesIds = statusesResponse
            .map((status) => status.id)
            .filter((id): id is string => id !== undefined)

          Promise.all(statusesIds.map((id) => findTicketsByStatus(id)))
            .then((ticketsResponses) => {
              if (!('errorMessage' in ticketsResponses[0]))
                setNewTickets(ticketsResponses[0])
              if (!('errorMessage' in ticketsResponses[1]))
                setPendingTickets(ticketsResponses[1])
              if (!('errorMessage' in ticketsResponses[2]))
                setResolvedTickets(ticketsResponses[2])
            })
            .catch((error) => console.error('Error fetching tickets:', error))
        }

        // Fetch tickets for each status
      })
      .catch((error) => console.error('Error fetching statuses:', error))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <Card className="mb-8 p-4 bg-zinc-900 text-white">
        <CardTitle>Métrica SLA</CardTitle>
        <CardContent className="p-2">
          {slaMetric !== null ? (
            <p className="text-lg">
              Porcentagem SLA: {slaMetric ? slaMetric : 0} %
            </p>
          ) : (
            <div className="flex justify-center items-center p-4">
              Carregando...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="mb-8 p-4 bg-zinc-900 text-white">
          <CardTitle>Novos Chamados</CardTitle>
          <CardContent className="p-2">
            {newTickets.length > 0 ? (
              <Table>
                <TableBody>
                  {newTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Sem novos chamados</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 p-4 bg-zinc-900 text-white">
          <CardTitle>Chamados Pendentes</CardTitle>
          <CardContent className="p-2">
            {pendingTickets.length > 0 ? (
              <Table>
                <TableBody>
                  {pendingTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Sem chamados pendentes</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 p-4 bg-zinc-900 text-white">
          <CardTitle>Chamados resolvidos</CardTitle>
          <CardContent className="p-2">
            {resolvedTickets.length > 0 ? (
              <Table>
                <TableBody>
                  {resolvedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Sem chamados resolvidos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
