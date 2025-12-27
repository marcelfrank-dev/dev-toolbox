'use client'

import { useState, useEffect } from 'react'
import { tools } from '@/tools/registry'
import { Tool } from '@/tools/types'
import { getToolFromUrl, setToolInUrl, updateMetaTags } from '@/lib/urlState'
import { SplitLayout } from '@/components/Layout/SplitLayout'
import { ContentArea } from '@/components/Layout/ContentArea'
import { MobileMenuButton } from '@/components/Layout/MobileMenuButton'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { WelcomePage } from '@/components/Home/WelcomePage'
import { ToolView } from '@/components/Tool/ToolView'

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Handle URL-based tool opening
  useEffect(() => {
    const toolId = getToolFromUrl()
    if (toolId) {
      const tool = tools.find((t) => t.id === toolId)
      if (tool) {
        setActiveTool(tool)
        updateMetaTags(tool)
      }
    }

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      const toolId = getToolFromUrl()
      if (toolId) {
        const tool = tools.find((t) => t.id === toolId)
        setActiveTool(tool || null)
        updateMetaTags(tool || null)
      } else {
        setActiveTool(null)
        updateMetaTags(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openTool = (tool: Tool) => {
    setActiveTool(tool)
    setToolInUrl(tool.id)
    updateMetaTags(tool)
    setIsMobileSidebarOpen(false) // Close mobile sidebar when tool opens
  }

  const closeTool = () => {
    setActiveTool(null)
    setToolInUrl(null)
    updateMetaTags(null)
  }

  // Keyboard shortcut: Esc to close tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTool) {
        closeTool()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTool])

  return (
    <>
      {!isMobileSidebarOpen && (
        <MobileMenuButton onClick={() => setIsMobileSidebarOpen(true)} />
      )}
      <SplitLayout
        sidebar={
          <Sidebar
            tools={tools}
            activeToolId={activeTool?.id || null}
            onToolClick={openTool}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        }
        content={
          <ContentArea>
            {activeTool ? (
              <ToolView tool={activeTool} onClose={closeTool} />
            ) : (
              <WelcomePage tools={tools} onToolClick={openTool} />
            )}
          </ContentArea>
        }
      />
    </>
  )
}
