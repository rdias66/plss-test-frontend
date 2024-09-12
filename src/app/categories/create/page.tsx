'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createCategory, ICategory } from '@/api/providers/category.provider'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

const createCategoryFormSchema = z.object({
  name: z.string().min(1, 'Um nome é requerido'),
})

type createCategoryFormSchemaType = z.infer<typeof createCategoryFormSchema>

const CreateCategory: React.FC = () => {
  const createCategoryForm = useForm<createCategoryFormSchemaType>({
    resolver: zodResolver(createCategoryFormSchema),
    mode: 'onChange',
  })

  const { handleSubmit, register } = createCategoryForm

  const onSubmitCreate = async (values: createCategoryFormSchemaType) => {
    const newCategory: ICategory = {
      name: values.name,
    }

    try {
      const response = await createCategory(newCategory)
      if (!response || ('errorMessage' in response && 'status' in response)) {
        toast({
          title: 'Erro na criação ',
          description: 'Erro ao  criar categoria no servidor',
        })
      } else {
        toast({
          title: 'Sucesso na criaçãop',
          description: 'Sucesso ao  criar categoria',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro na criação ',
        description: 'Erro ao  tentar criar categoria',
      })
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-900 m-4 h-full p-4">
      <h1>Criar nova categoria</h1>
      <Separator />
      <Form {...createCategoryForm}>
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Digite um nome..." {...register('name')} />
            </FormControl>
          </FormItem>
          <Button
            type="submit"
            className="bg-zinc-400 text-black hover:bg-slate-900 hover:text-white"
          >
            Criar Categoria
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateCategory
