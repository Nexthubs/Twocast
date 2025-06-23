'use client'
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";

export interface OptionItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  render?: (option: OptionItem) => React.ReactNode;
}

export function TcSelector({value, onChange, options, title}: {title?: string, value: string, onChange: (value: string) => void, options: OptionItem[]}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // 监听点击外部区域时关闭下拉菜单
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        // 只在下拉菜单打开时添加监听器
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // 清理函数
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Filter options based on search query
    const filteredOptions = options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative flex-shrink-0" ref={containerRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3 bg-gradient-to-r from-white/90 to-gray-50/80 dark:from-gray-700/90 dark:to-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl hover:scale-[1.02] transition-all duration-300 w-full sm:min-w-[120px] shadow-md relative overflow-hidden"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-lg sm:rounded-xl"></div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 relative z-10">{options.find(option => option.id === value)?.label}</span>
            <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-auto relative z-10" />
          </button>
          
          {isOpen && (
            <div 
              className="absolute top-full mt-1 left-0 right-0 sm:right-auto bg-gradient-to-br from-white/95 to-gray-50/90 dark:from-gray-700/95 dark:to-gray-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-lg z-50 min-w-full overflow-hidden sm:min-w-48"
              style={{
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-lg sm:rounded-xl"></div>
              
              {/* Title section */}
              {title && (
                <div className="px-3 sm:px-4 py-3 bg-gradient-to-r from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-700/90 border-b border-gray-200/50 dark:border-gray-600/50 text-center">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 tracking-wide">{title}</h3>
                </div>
              )}

              {/* Search input */}
              <div className="relative px-3 sm:px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-8 py-1.5 text-xs sm:text-sm bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-100/50 dark:border-gray-700/50"
                  />
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Options list with max height and scroll */}
              <div className="max-h-[300px] overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 relative z-10"
                    >
                      {option.render ? (
                        option.render(option)
                      ) : (
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 whitespace-normal">
                              {option.description}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    )
}