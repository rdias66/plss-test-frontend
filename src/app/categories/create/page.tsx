'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createCategory, ICategory } from '@/api/providers/category.provider'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

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
        console.log('Failed to create Category')
      } else {
        console.log('Category created successfully')
      }
    } catch (error) {
      console.error('Error creating Category:', error)
    }
  }

  return (
    <div>
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
          <Button type="submit">Criar Categoria</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateCategory
