'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { createTicket, ITicket } from '@/api/providers/ticket.provider'
import { ICategory, getAllCategories } from '@/api/providers/category.provider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

const createTicketFormSchema = z.object({
  title: z.string().min(1, 'Um titulo é requerido'),
  description: z.string().min(1, 'Uma descrição é requerida'),
  category_id: z.string().min(1, 'Uma categoria é requerida'),
})

type createTicketFormSchemaType = z.infer<typeof createTicketFormSchema>

const CreateTicket: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [error, setError] = useState<string | null>(null)

  const createTicketForm = useForm<createTicketFormSchemaType>({
    resolver: zodResolver(createTicketFormSchema),
    mode: 'onChange',
  })

  const { handleSubmit, setValue, register } = createTicketForm

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getAllCategories()
        if (!('errorMessage' in categories)) {
          setCategories(categories)
        }
      } catch (error) {
        setError('Failed to load categories and statuses: ' + error)
      }
    }

    fetchData()
  }, [])

  const onSubmitCreate = async (values: createTicketFormSchemaType) => {
    const newTicket: ITicket = {
      title: values.title,
      description: values.description,
      category_id: values.category_id,
    }

    try {
      const response = await createTicket(newTicket)
      if (!response || ('errorMessage' in response && 'status' in response)) {
        toast({
          title: 'Erro na criação ',
          description: 'Erro ao  criar chamado no servidor',
        })
      } else {
        toast({
          title: 'Sucesso na criação ',
          description: 'Sucesso ao  criar chamado',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro na criação ',
        description: 'Erro ao  tentar criar chamado',
      })
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-900 m-4 h-full p-4">
      <h1>Criar novo chamado</h1>
      <Separator />
      <Form {...createTicketForm}>
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <FormItem>
            <FormLabel>Titulo</FormLabel>
            <FormControl>
              <Input placeholder="Digite um titulo..." {...register('title')} />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input
                className="h-24 w-full"
                placeholder="Digite uma descrição..."
                {...register('description')}
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => setValue('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
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

          <Button
            type="submit"
            className="bg-zinc-400 text-black hover:bg-slate-900 hover:text-white"
          >
            Criar Chamado
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateTicket
