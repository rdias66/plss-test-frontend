import { ApiError, backendApi } from '../backendApi'

export interface ICategory {
  id?: string
  name: string
}

export interface IUpdateCategory {
  name?: string
}

export async function createCategory(
  category: ICategory,
): Promise<void | ApiError> {
  try {
    const response = await backendApi.post<void>('/categories', category)

    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao cadastrar categoria ' + error,
      status: 500,
    } as ApiError
  }
}

export async function getAllCategories(): Promise<ICategory[] | ApiError> {
  try {
    const response = await backendApi.get<ICategory[]>('/categories')

    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao buscar categoria: ' + error,
      status: 500,
    } as ApiError
  }
}

export async function findCategory(id: string): Promise<ICategory | ApiError> {
  try {
    const response = await backendApi.get<ICategory>(`/categories/${id}`)
    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao buscar categoria: ' + (error as Error).message,
      status: 500,
    } as ApiError
  }
}

export async function updateCategory(
  id: string,
  category: IUpdateCategory,
): Promise<void | ApiError> {
  try {
    const response = await backendApi.patch(`/categories/${id}`, category)
    return response.data
  } catch (error) {
    return {
      errorMessage: 'Erro ao atualizar categoria' + error,
      status: 500,
    } as ApiError
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await backendApi.delete(`/categories/${id}`)
    return
  } catch (error) {
    console.error(`Erro ao deletar categoria`, error)
    throw error
  }
}
