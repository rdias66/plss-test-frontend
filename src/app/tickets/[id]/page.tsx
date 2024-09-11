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
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const updateTicketFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  status_id: z.string().optional(),
})
type updateTicketFormSchemaType = z.infer<typeof updateTicketFormSchema>

const TicketProfile: React.FC = () => {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [data, setData] = useState<ITicket>()
  const [statuses, setStatuses] = useState<IStatus[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)

  const updateTicketForm = useForm<updateTicketFormSchemaType>({
    resolver: zodResolver(updateTicketFormSchema),
    mode: 'onChange',
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = updateTicketForm

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
        console.log('error')
      }

      if (response && !('errorMessage' in response && 'status' in response)) {
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
      console.log('Ticket deleted successfully')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticket, statuses, categories] = await Promise.all([
          findTicket(id),
          getAllStatuses(),
          getAllCategories(),
        ])
        if (!('errorMessage' in ticket && 'status' in ticket)) {
          setData(ticket)
        }
        if (Array.isArray(statuses)) setStatuses(statuses)
        if (Array.isArray(categories)) setCategories(categories)
        if (ticket && !('errorMessage' in ticket)) {
          setValue('title', ticket.title)
          setValue('description', ticket.description)
          setValue('status_id', ticket.status_id || '')
          setValue('category_id', ticket.category_id)
        }
      } catch (error) {
        setError('Failed to fetch data: ' + error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, setValue])

  return (
    <div className="rounded-2xl bg-white m-4 h-full">
      <div className="flex flex-row items-start p-2 ">
        <h1 className="font-bold text-xl ml-3 mt-3">
          Chamado - {data?.title}{' '}
        </h1>
        <Button
          variant="outline"
          className="mt-1 mx-2"
          onClick={() => {
            setEditMode(!editMode)
          }}
        >
          <i className="fa-solid fa-pen-to-square "></i>
        </Button>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-1 mx-2 bg-red-300 hover:bg-red-600"
              onClick={() => setIsDialogOpen(true)}
            >
              <i className="fa-solid fa-trash"></i>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este chamado? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
            <div className="flex gap-4 justify-end">
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDelete()
                  setIsDialogOpen(false)
                }}
              >
                Confirmar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Form {...updateTicketForm}>
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          <FormItem>
            <FormLabel>Titulo</FormLabel>
            <FormControl>
              <Input
                {...register('title')}
                readOnly={!editMode}
                className="mb-4"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input
                {...register('description')}
                readOnly={!editMode}
                className="mb-4"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Select
                disabled={!editMode}
                onValueChange={(value) => setValue('category_id', value)}
                defaultValue={data?.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select
                disabled={!editMode}
                onValueChange={(value) => setValue('status_id', value)}
                defaultValue={data?.status_id || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={String(status.id)}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>

          <Separator className="my-6" />

          <div className="flex items-center justify-end m-4 pb-4">
            <Button type="submit" className="mr-2" disabled={!editMode}>
              Salvar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false)
                Object.keys(data || {}).forEach((key) => {
                  setValue(
                    key as keyof updateTicketFormSchemaType,
                    data![key as keyof updateTicketFormSchemaType],
                  )
                })
              }}
              disabled={!editMode}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default TicketProfile
