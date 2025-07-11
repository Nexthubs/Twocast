'use client'

import { useRef } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import { useTranslation } from '@/i18n/client'
import { LocaleTypes } from '@/i18n/settings'
import { useParams } from 'next/navigation'
import { useOuterClick } from '../utils/useOuterClick'
import { ArrowRightIcon } from './icon'
import useSidebarStore from './store'
import { Toc } from 'pliny/mdx-plugins'

interface SidetocProps {
  toc: Toc
}

const Sidetoc = ({ toc }: SidetocProps) => {
  const locale = useParams()?.locale as LocaleTypes
  const { t } = useTranslation(locale, 'common')
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarStore()
  const menubarRef = useRef<HTMLDivElement>(null)
  useOuterClick(menubarRef, closeSidebar)

  return (
    <div ref={menubarRef} className="fixed left-0 top-0 z-50 hidden h-screen md:flex">
      <div
        className={`transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-gray-100 px-2 py-4 dark:bg-gray-800`}
      >
        <div className="mt-20">
          <div className="text-xl font-bold text-heading-400">{t('sidetoc')}</div>
          <div className="my-auto mt-5 overflow-y-auto text-black dark:text-white">
            <TOCInline toc={toc} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 left-6 z-50">
        <button
          onClick={toggleSidebar}
          className="rounded-full bg-gray-200 p-2 text-gray-500 opacity-100 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <ArrowRightIcon
            className={`h-5 w-5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </div>
  )
}

export default Sidetoc
