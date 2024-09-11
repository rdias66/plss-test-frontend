import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function DashBoard() {
  return (
    <nav
      aria-label="Sidebar dashboard"
      className="z-10 fixed left-0 bottom-0 w-full h-12 rounded-t-2xl lg:rounded-tl-none lg:rounded-r-2xl lg:left-0 lg:bottom-auto lg:w-60 lg:h-full lg:flex lg:flex-col bg-white text-zinc-900 shadow-soft-bottom shadow-zinc-600 border border-orange-300 "
    >
      <ul className="flex flex-row items-center justify-around mt-3 lg:flex-col lg:items-start lg:mx-auto lg:my-24 lg:space-y-5">
        <Link
          href="  
            /
            "
        >
          <li className="lg:hover:bg-zinc-300 hover:cursor-pointer rounded-lg lg:py-2 lg:px-4 hover:text-orange-600 font-bold lg:w-56 lg:h-14 lg:flex lg:items-center lg:justify-start">
            <span>
              <i className="fa-solid fa-home"></i>
            </span>
            <span className="hidden lg:inline p-1 pl-4">Home</span>
          </li>
        </Link>
        <Link
          href="  
            /tickets
            "
        >
          <li className="lg:hover:bg-zinc-300 hover:cursor-pointer rounded-lg lg:py-2 lg:px-4 hover:text-orange-600 font-bold lg:w-56 lg:h-14 lg:flex lg:items-center lg:justify-start ">
            <span>
              <i className="fa-solid fa-clipboard"></i>
            </span>
            <span className="hidden lg:inline  pl-4">Todos chamados</span>
          </li>
        </Link>

        <Link
          href="  
            /tickets/create
            "
        >
          <li className="lg:hover:bg-zinc-300 hover:cursor-pointer rounded-lg lg:py-2 lg:px-4 hover:text-orange-600 font-bold lg:w-56 lg:h-14 lg:flex lg:items-center lg:justify-start ">
            <span>
              <i className="fa-regular fa-clipboard"></i>
            </span>
            <span className="hidden lg:inline  pl-4">Criar chamados</span>
          </li>
        </Link>

        <Link
          href="  
            /categories
            "
        >
          <li className="lg:hover:bg-zinc-300 hover:cursor-pointer rounded-lg lg:py-2 lg:px-4 hover:text-orange-600 font-bold lg:w-56 lg:h-14 lg:flex lg:items-center lg:justify-start ">
            <span>
              <i className="fa-solid fa-folder"></i>
            </span>
            <span className="hidden lg:inline  pl-4">Todas categorias</span>
          </li>
        </Link>

        <Link
          href="  
            /categories/create
            "
        >
          <li className="lg:hover:bg-zinc-300 hover:cursor-pointer rounded-lg lg:py-2 lg:px-4 hover:text-orange-600 font-bold lg:w-56 lg:h-14 lg:flex lg:items-center lg:justify-start ">
            <span>
              <i className="fa-regular fa-folder"></i>
            </span>
            <span className="hidden lg:inline  pl-4">Criar categorias</span>
          </li>
        </Link>
      </ul>

      <Separator
        orientation="horizontal"
        className="hidden lg:inline lg:w-52 lg:mx-auto "
      />

      <div className="hidden lg:inline lg:mt-5 ">
        <ul className="flex flex-row lg:flex-col items-center justify-normal h-1/2 ">
          <li>
            <span>Rodrigo Dias de Almeida</span>
          </li>
          <li>
            <span>2024</span>
          </li>
        </ul>
      </div>
    </nav>
  )
}
