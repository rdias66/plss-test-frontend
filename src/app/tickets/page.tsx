import { getAllTickets, ITicket } from '@/api/providers/ticket.provider'
import { useEffect, useState } from 'react'

const Tickets: React.FC = () => {
  const [data, setData] = useState<ITicket[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = await getAllTickets()
        if (Array.isArray(tickets)) {
          setData(tickets)
        } else if ('errorMessage' in tickets) {
          setError(tickets.errorMessage)
        }
      } catch (error) {
        setError('Falha ao pesquisar tickets: ' + error)
      }
    }

    fetchTickets()
  })
  return (
    <div>
      <h1>this is ticket list</h1>
    </div>
  )
}

export default Tickets
