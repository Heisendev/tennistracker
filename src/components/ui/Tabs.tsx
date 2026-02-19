import { useState, createContext, useContext } from 'react'

const TabsContext = createContext<{ activeIndex: number; setActiveIndex: (index: number) => void } | undefined>(undefined)

export function Tabs({ children, defaultIndex = 0 }: { children: React.ReactNode; defaultIndex?: number }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center">{children}</div>
}

export function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')
  const { activeIndex, setActiveIndex } = context
  const isActive = index === activeIndex
  return (
    <button
      onClick={() => setActiveIndex(index)}
      className={`px-4 py-2 -mb-px rounded bg-white border-b-2 transition-colors ${
        isActive
          ? 'border-indigo-500 text-indigo-600 font-medium'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

export function TabPanels({ children }: { children: React.ReactNode[] }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabPanels must be used within Tabs')
  const { activeIndex } = context
  return <div className="p-4">{children[activeIndex]}</div>
}

export function TabPanel({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}