import { ApiError, backendApi } from '../backendApi'

export interface ITicket {
  id?: string
  title: string
  description: string
  category_id: string
  status_id?: string
}

export interface IUpdateTicket {
  title?: string
  description?: string
  category_id?: string
  status_id?: string
}

export async function createTicket(ticket: ITicket): Promise<void | ApiError> {
  try {
    const response = await backendApi.post<void>('/tickets', ticket)

    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao cadastrar chamado ' + error,
      status: 500,
    } as ApiError
  }
}

export async function getAllTickets(): Promise<ITicket[] | ApiError> {
  try {
    const response = await backendApi.get<ITicket[]>('/tickets')

    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao buscar chamados: ' + error,
      status: 500,
    } as ApiError
  }
}

export async function findTicket(id: string): Promise<ITicket | ApiError> {
  try {
    const response = await backendApi.get<ITicket>(`/tickets/${id}`)
    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao buscar chamado: ' + (error as Error).message,
      status: 500,
    } as ApiError
  }
}

export async function findTicketByStatus(
  status_id: string,
): Promise<ITicket[] | ApiError> {
  try {
    const response = await backendApi.get<ITicket[]>(`/tickets/${status_id}`)
    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao buscar chamados: ' + (error as Error).message,
      status: 500,
    } as ApiError
  }
}

export async function updateTicket(
  id: string,
  ticket: IUpdateTicket,
): Promise<void | ApiError> {
  try {
    const response = await backendApi.patch(`/tickets/${id}`, ticket)
    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao atualizar chamado' + error,
      status: 500,
    } as ApiError
  }
}

export async function deleteTicket(id: string): Promise<void> {
  try {
    await backendApi.delete(`/tickets/${id}`)
    return
  } catch (error) {
    console.error(`Erro ao deletar ticket`, error)
    throw error
  }
}
