'use client'

import { useParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  findCategory,
  updateCategory,
  IUpdateCategory,
  ICategory,
  deleteCategory,
} from '@/api/providers/category.provider'
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

const updateCategoryFormSchema = z.object({
  name: z.string(),
})
type updateCategoryFormSchemaType = z.infer<typeof updateCategoryFormSchema>

const CategoryProfile = () => {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [data, setData] = useState<ICategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const updateCategoryForm = useForm<updateCategoryFormSchemaType>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: data || {} || undefined,
    mode: 'onChange',
  })

  const { register, setValue } = updateCategoryForm

  async function onSubmitUpdate(values: updateCategoryFormSchemaType) {
    const updatedCategory: IUpdateCategory = {
      name: values.name || undefined,
    }

    try {
      const response = await updateCategory(id, updatedCategory)

      if (!response || ('errorMessage' in response && 'status' in response)) {
        /*toast({
          title: 'Erro na edição',
          description: 'Erro ao editar categoria',
        })*/
        console.log('error')
      }

      if (response && !('errorMessage' in response && 'status' in response)) {
        /*toast({
          title: 'Sucesso',
          description: 'Categoria editada com sucesso!',
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
      await deleteCategory(id)

      /* toast({
        title: 'Categoria excluída',
        description: 'Categoria excluída com sucesso!',
        duration: 3000,
      })*/
    } catch (error) {
      /*toast({
        title: 'Erro na exclusão',
        description: 'Erro ao excluir peça',
      })*/
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await findCategory(id)
        if ('errorMessage' in category) {
          setError(category.errorMessage)
        } else {
          setData(category)

          Object.keys(category).forEach((key) => {
            if (updateCategoryFormSchema.shape.hasOwnProperty(key)) {
              setValue(
                key as keyof updateCategoryFormSchemaType,
                category[key as keyof updateCategoryFormSchemaType] || '',
              )
            }
          })
        }
      } catch (error) {
        setError('Falha ao pesquisar categoria: ' + (error as Error).message)
      }
    }

    fetchData()
  }, [id, setValue])

  return (
    <div>
      <div className="rounded-2xl bg-white m-4 h-full">
        <div className="flex flex-row items-start p-2 ">
          <h1 className="font-bold text-xl ml-3 mt-3">
            Categoria - {data?.name}{' '}
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
                Tem certeza de que deseja excluir esta categoria? Esta ação não
                pode ser desfeita.
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
        <Form {...updateCategoryForm}>
          <form onSubmit={updateCategoryForm.handleSubmit(onSubmitUpdate)}>
            <Separator orientation="horizontal" />

            <div className="px-3 flex flex-wrap justify-start gap-2 lg:gap-5 lg:flex lg:flex-wrap lg:justify-start pt-8">
              <FormField
                control={updateCategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-[1500px]">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode}
                        onChange={field.onChange}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                      key as keyof updateCategoryFormSchemaType,
                      data![key as keyof updateCategoryFormSchemaType],
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
    </div>
  )
}

export default CategoryProfile
