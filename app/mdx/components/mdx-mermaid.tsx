'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  children: React.ReactNode
  id?: string
}

// Helper function to extract text from React nodes
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('\n')
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as any).props.children)
  }

  // Handle text nodes that might be wrapped
  if (
    children &&
    typeof children === 'object' &&
    'type' in children &&
    (children as any).type === 'text'
  ) {
    return (children as any).props?.children || ''
  }

  return String(children || '')
}

export function MDXMermaid({ children, id }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [children])

  useEffect(() => {
    if (!isMounted) return

    let isCancelled = false

    const renderMermaid = async () => {
      // Extract text content from React nodes
      let diagramCode = extractTextFromChildren(children)

      // Normalize line endings and trim
      diagramCode = diagramCode
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\r/g, '\n') // Handle old Mac line endings
        .trim() // Remove leading/trailing whitespace

      if (
        !diagramCode ||
        typeof diagramCode !== 'string' ||
        diagramCode.trim().length === 0
      ) {
        setError('No diagram content provided')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // Dynamic import to ensure client-side loading
        const mermaid = (await import('mermaid')).default

        // Configure mermaid with theme support
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          themeVariables: {
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: '14px',
            ...(resolvedTheme === 'dark'
              ? {
                  // Dark mode colors
                  primaryColor: '#3b82f6',
                  primaryTextColor: '#ffffff',
                  primaryBorderColor: '#3b82f6',
                  lineColor: '#6b7280',
                  sectionBkgColor: 'transparent',
                  altSectionBkgColor: 'transparent',
                  gridColor: '#374151',
                  secondaryColor: '#1f2937',
                  tertiaryColor: '#111827',
                  background: 'transparent',
                  mainBkg: 'transparent',
                  secondBkg: 'transparent',
                  tertiaryBkg: 'transparent',
                }
              : {
                  // Light mode colors
                  primaryColor: '#3b82f6',
                  primaryTextColor: '#1f2937',
                  primaryBorderColor: '#3b82f6',
                  lineColor: '#6b7280',
                  sectionBkgColor: 'transparent',
                  altSectionBkgColor: 'transparent',
                  gridColor: '#e5e7eb',
                  secondaryColor: '#f9fafb',
                  tertiaryColor: '#ffffff',
                  background: 'transparent',
                  mainBkg: 'transparent',
                  secondBkg: 'transparent',
                  tertiaryBkg: 'transparent',
                }),
          },
        })

        // Generate unique ID if not provided
        const diagramId =
          id || `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Parse and render the diagram
        const { svg: renderedSvg } = await mermaid.render(
          diagramId,
          diagramCode,
        )

        if (!isCancelled) {
          setSvg(renderedSvg)
          setIsLoading(false)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram',
          )
          setIsLoading(false)
        }
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(renderMermaid, 100)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [children, resolvedTheme, id, isMounted])

  // Handle wheel events globally to prevent page scroll when hovering over diagram
  useEffect(() => {
    if (!isMounted) return

    const handleWheel = (e: WheelEvent) => {
      if (isHovering && elementRef.current) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta))
        setZoomLevel(newZoom)
        if (newZoom === 1) {
          setPanPosition({ x: 0, y: 0 })
        }
      }
    }

    const handleTouchStart = () => {
      // Reset hover state on any touch to prevent mobile scroll issues
      if (isHovering) {
        setIsHovering(false)
      }
    }

    if (isHovering) {
      document.addEventListener('wheel', handleWheel, {
        passive: false,
        capture: true,
      })
    }

    // Add touch listener to reset hover state on mobile
    document.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      document.removeEventListener('wheel', handleWheel, {
        capture: true,
      } as any)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [isHovering, zoomLevel, isMounted])

  // Don't render anything on server-side
  if (!isMounted) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          backgroundColor: 'var(--lightest-gray)',
          borderRadius: 'var(--radius)',
          color: 'var(--gray)',
          fontSize: '14px',
          margin: 'var(--gap) 0',
        }}
      >
        Preparing diagram...
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className="mermaid-loading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          backgroundColor: 'var(--lightest-gray)',
          borderRadius: 'var(--radius)',
          color: 'var(--gray)',
          fontSize: '14px',
          margin: 'var(--gap) 0',
        }}
      >
        Loading diagram...
      </div>
    )
  }

  if (error) {
    // Get the processed diagram code for display
    const diagramCode = extractTextFromChildren(children)

    return (
      <div
        className="mermaid-error"
        style={{
          padding: 'var(--gap)',
          backgroundColor: 'var(--red)',
          color: 'white',
          borderRadius: 'var(--radius)',
          margin: 'var(--gap) 0',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <strong>Mermaid Error:</strong> {error}
        <details style={{ marginTop: '8px' }}>
          <summary style={{ cursor: 'pointer' }}>Show diagram code</summary>
          <pre
            style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
            }}
          >
            {diagramCode || 'No valid text content found'}
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div className="mermaid-container" style={{ margin: 'var(--gap) 0' }}>
      {/* Zoom Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          opacity: svg ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--gray)',
            fontStyle: 'italic',
          }}
        >
          💡 Scroll over diagram to zoom • Drag to pan when zoomed or in
          fullscreen
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => {
              const newZoom = Math.max(0.5, zoomLevel - 0.25)
              setZoomLevel(newZoom)
              if (newZoom === 1) {
                setPanPosition({ x: 0, y: 0 })
              }
            }}
            disabled={zoomLevel <= 0.5}
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--lightest-gray)',
              border: '1px solid var(--light-gray)',
              borderRadius: '6px',
              color: 'var(--fg)',
              cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: zoomLevel <= 0.5 ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (zoomLevel > 0.5) {
                e.currentTarget.style.backgroundColor = 'var(--light-gray)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lightest-gray)'
            }}
          >
            −
          </button>

          <span
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              color: 'var(--gray)',
              minWidth: '50px',
              textAlign: 'center',
              fontWeight: '500',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--light-gray)',
              borderRadius: '4px',
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={() => {
              const newZoom = Math.min(3, zoomLevel + 0.25)
              setZoomLevel(newZoom)
            }}
            disabled={zoomLevel >= 3}
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--lightest-gray)',
              border: '1px solid var(--light-gray)',
              borderRadius: '6px',
              color: 'var(--fg)',
              cursor: zoomLevel >= 3 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: zoomLevel >= 3 ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (zoomLevel < 3) {
                e.currentTarget.style.backgroundColor = 'var(--light-gray)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lightest-gray)'
            }}
          >
            +
          </button>

          <button
            onClick={() => {
              setZoomLevel(1)
              setPanPosition({ x: 0, y: 0 })
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--lightest-gray)',
              border: '1px solid var(--light-gray)',
              borderRadius: '6px',
              color: 'var(--fg)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--light-gray)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lightest-gray)'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="mermaid-diagram-container"
        style={{
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : 'auto',
          zIndex: isFullscreen ? 9999 : 1,
          backgroundColor: isFullscreen ? 'var(--bg)' : 'transparent',
          padding: isFullscreen ? 'var(--gap)' : '0',
        }}
      >
        <div
          ref={elementRef}
          className="mermaid-diagram"
          style={{
            width: '100%',
            minHeight: isFullscreen ? 'calc(100vh - 2 * var(--gap))' : '400px',
            padding: 'var(--gap)',
            backgroundColor: 'var(--lightest-gray)',
            borderRadius: 'var(--radius)',
            border: '2px solid var(--light-gray)',
            overflow: 'hidden',
            cursor:
              zoomLevel > 1 || isFullscreen
                ? isDragging
                  ? 'grabbing'
                  : 'grab'
                : 'default',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            setIsDragging(false)
          }}
          onTouchStart={() => {
            // On mobile, disable hover state immediately on touch
            setIsHovering(false)
          }}
          onMouseDown={(e) => {
            if (zoomLevel <= 1 && !isFullscreen) return
            setIsDragging(true)
            setDragStart({
              x: e.clientX - panPosition.x,
              y: e.clientY - panPosition.y,
            })
          }}
          onMouseMove={(e) => {
            if (!isDragging || (zoomLevel <= 1 && !isFullscreen)) return
            setPanPosition({
              x: e.clientX - dragStart.x,
              y: e.clientY - dragStart.y,
            })
          }}
          onMouseUp={() => setIsDragging(false)}
        >
          {/* Fullscreen button - small, in top right corner like slideshow */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--light-gray)',
              borderRadius: '6px',
              color: 'var(--fg)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.backgroundColor = 'var(--light-gray)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.8'
              e.currentTarget.style.backgroundColor = 'var(--bg)'
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>

          {/* Main diagram content */}
          <div
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dangerouslySetInnerHTML={{
              __html: svg.replace(
                /<style>/g,
                `<style>
                  .node rect, .node circle, .node ellipse, .node polygon, .node path {
                    fill: var(--lightest-gray) !important;
                    stroke: var(--fg) !important;
                    stroke-width: 2px !important;
                    stroke-opacity: 0.9 !important;
                    transition: all 0.2s ease !important;
                  }
                  .node:hover rect, .node:hover circle, .node:hover ellipse, .node:hover polygon, .node:hover path {
                    stroke-width: 3px !important;
                    stroke-opacity: 1 !important;
                    filter: brightness(1.1) !important;
                  }
                  .edgePath path {
                    stroke: var(--fg) !important;
                    stroke-width: 2px !important;
                    stroke-opacity: 0.8 !important;
                    transition: all 0.2s ease !important;
                  }
                  .edgePath:hover path {
                    stroke-width: 3px !important;
                    stroke-opacity: 1 !important;
                  }
                  .edgeLabel {
                    background-color: var(--bg) !important;
                    color: var(--fg) !important;
                    border: 1px solid var(--fg) !important;
                    border-radius: 6px !important;
                    padding: 4px 8px !important;
                    font-size: 12px !important;
                    font-weight: 500 !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                  }
                  text {
                    fill: var(--fg) !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
                  }
                  .cluster rect {
                    fill: transparent !important;
                    stroke: var(--fg) !important;
                    stroke-width: 2px !important;
                    stroke-dasharray: 10,5 !important;
                    stroke-opacity: 0.7 !important;
                    rx: 8 !important;
                    ry: 8 !important;
                  }
                  .cluster text {
                    font-weight: 700 !important;
                    font-size: 16px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                  }
                  .flowchart-link {
                    stroke-width: 2px !important;
                    stroke-opacity: 0.8 !important;
                  }
                  .arrowheadPath {
                    fill: var(--fg) !important;
                    stroke: var(--fg) !important;
                    stroke-width: 1px !important;
                  }
                  .marker {
                    fill: var(--fg) !important;
                    stroke: var(--fg) !important;
                  }
                  .node {
                    animation: fadeIn 0.5s ease-out !important;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `,
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}
