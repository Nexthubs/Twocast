'use client'

import { useState, useRef } from 'react'
import { usePathname, useParams, useRouter } from 'next/navigation'
import { useOuterClick } from '../utils/useOuterClick'
import { useTagStore } from 'src/components/utils/useTagStore'
import {LocaleTypes, locales, localeOptions} from '@/i18n/settings'
import { Menu, Transition, RadioGroup } from '@headlessui/react'
import { ChevronDownIcon } from './icon'

const LangSwitch = () => {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params.locale as string) || ''
  const router = useRouter()
  const setSelectedTag = useTagStore((state) => state.setSelectedTag)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menubarRef = useRef<HTMLDivElement>(null)
  useOuterClick(menubarRef, () => setIsMenuOpen(false))

  const handleLocaleChange = (newLocale: string): string => {
    // set cookie
    document.cookie = `i18n=${newLocale}; path=/`
    const segments = pathname!.split('/')
    const localeIndex = segments.findIndex((segment) => locales.includes(segment as LocaleTypes))
    if (localeIndex !== -1) {
      segments[localeIndex] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    // Remove trailing slash if it exists
    const newPath = segments.join('/').replace(/\/$/, '')
    return newPath
  }

  const handleLinkClick = (option) => {
    setSelectedTag('')
    const resolvedUrl = handleLocaleChange(option.lang)
    router.push(resolvedUrl)
    setIsMenuOpen(false)
  }

  return (
    <div ref={menubarRef} className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              className="inline-flex w-full justify-center rounded-md px-1 py-2 text-sm font-bold leading-5 text-gray-700 shadow-sm dark:text-white"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {localeOptions.find((option) => option.lang === locale)?.label}
              <ChevronDownIcon
                className={`ml-1 mt-1 transform transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
              />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition-all ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-[-10px]"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition-all ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-[10px]"
            >
              <Menu.Items
                className="absolute right-0 z-50 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
                aria-orientation="vertical"
                onBlur={() => setIsMenuOpen(false)}
              >
                <RadioGroup>
                  <div
                    className="py-1"
                    role="none"
                    style={{ listStyle: 'none', margin: 0, padding: 0 }}
                  >
                    {localeOptions.map((option) => (
                      <RadioGroup.Option key={option.lang} value={option.lang}>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleLinkClick(option)}
                              className={`${
                                active
                                  ? 'bg-gray-100 dark:bg-gray-600'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                              } rounded-md px-4 py-2 text-sm text-gray-700 hover:text-primary-500 dark:text-white dark:hover:text-primary-500`}
                              role="menuitem"
                              style={{ display: 'block', width: '100%', textDecoration: 'none' }}
                            >
                              {option.label}
                            </button>
                          )}
                        </Menu.Item>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

export default LangSwitch
