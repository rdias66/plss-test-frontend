'use client'

import { useParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  findTicket,
  updateTicket,
  IUpdateTicket,
  ITicket,
  IStatus,
  deleteTicket,
  getAllStatuses,
} from '@/api/providers/ticket.provider'
import { ICategory, getAllCategories } from '@/api/providers/category.provider'
import * as React from 'react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

const updateTicketFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  category_id: z.string(),
  status_id: z.string(),
})
type updateTicketFormSchemaType = z.infer<typeof updateTicketFormSchema>

const TicketProfile = () => {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [data, setData] = useState<ITicket | null>(null)
  const [statuses, setStatuses] = useState<IStatus[] | []>([])
  const [categories, setCategories] = useState<ICategory[] | []>([])
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const updateTicketForm = useForm<updateTicketFormSchemaType>({
    resolver: zodResolver(updateTicketFormSchema),
    defaultValues: data || {} || undefined,
    mode: 'onChange',
  })

  const { register, setValue } = updateTicketForm

  async function onSubmitUpdate(values: updateTicketFormSchemaType) {
    const updatedTicket: IUpdateTicket = {
      title: values.title || undefined,
      description: values.description || undefined,
      status_id: values.status_id || undefined,
      category_id: values.category_id || undefined,
    }

    try {
      const response = await updateTicket(id, updatedTicket)

      if (!response || ('errorMessage' in response && 'status' in response)) {
        /*toast({
          title: 'Erro na edição',
          description: 'Erro ao editar chamado',
        })*/
        console.log('error')
      }

      if (response && !('errorMessage' in response && 'status' in response)) {
        /*toast({
          title: 'Sucesso',
          description: 'Chamado editado com sucesso!',
          duration: 3000,
        })*/
        console.log('success')
        setEditMode(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTicket(id)

      /* toast({
        title: 'Chamado excluído',
        description: 'Chamado excluído com sucesso!',
        duration: 3000,
      })*/
    } catch (error) {
      /*toast({
        title: 'Erro na exclusão',
        description: 'Erro ao excluir chamado',
      })*/
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticket = await findTicket(id)
        if ('errorMessage' in ticket) {
          setError(ticket.errorMessage)
        } else {
          setData(ticket)

          Object.keys(ticket).forEach((key) => {
            if (updateTicketFormSchema.shape.hasOwnProperty(key)) {
              setValue(
                key as keyof updateTicketFormSchemaType,
                ticket[key as keyof updateTicketFormSchemaType] || '',
              )
            }
          })
        }
      } catch (error) {
        setError('Falha ao pesquisar chamado: ' + (error as Error).message)
      }
      try {
        const statuses = await getAllStatuses()
        if (Array.isArray(statuses)) {
          setStatuses(statuses)
        } else if ('errorMessage' in statuses) {
          setError(statuses.errorMessage)
        }
      } catch (error) {
        setError('Falha ao pesquisar os status: ' + error)
      }
      try {
        const categories = await getAllCategories()
        if (Array.isArray(categories)) {
          setCategories(categories)
        } else if ('errorMessage' in categories) {
          setError(categories.errorMessage)
        }
      } catch (error) {
        setError('Falha ao pesquisar categorias: ' + error)
      }
    }

    fetchData()
  }, [id, setValue])

  return <div>this is ticket profile</div>
}

export default TicketProfile
