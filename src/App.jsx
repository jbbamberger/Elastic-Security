import { useState, useEffect, useCallback, useRef } from 'react'
import { Analytics } from "@vercel/analytics/react"
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
// import HeroScene from './scenes/HeroScene'
// import AgendaScene from './scenes/AgendaScene'
// import AboutElasticScene from './scenes/AboutElasticScene'
// import DataExplosionScene from './scenes/DataExplosionScene'
// import ChallengesScene from './scenes/ChallengesScene'
// import PlatformScene from './scenes/PlatformScene'
// import BusinessValueScene from './scenes/BusinessValueScene'
// import UnifiedStrategyScene from './scenes/UnifiedStrategyScene'
// import CrossClusterScene from './scenes/CrossClusterScene'
import SecurityScene from './scenes/SecurityScene'
import WholeOfStateScene from './scenes/WholeOfStateScene'
// import LicensingScene from './scenes/LicensingScene'
// import SchemaScene from './scenes/SchemaScene'
// import AccessControlScene from './scenes/AccessControlSceneDev'
// import ESQLScene from './scenes/ESQLScene'
// import ConsolidationScene from './scenes/ConsolidationScene'
// import DataTieringScene from './scenes/DataTieringScene'
// import ServicesScene from './scenes/ServicesScene'
// import DataMeshScene from './scenes/DataMeshScene'
import TeamScene from './scenes/TeamScene'
import PanelScene from './scenes/PanelScene'
// import NextStepsScene from './scenes/NextStepsScene'
import Navigation from './components/Navigation'
import ProgressBar from './components/ProgressBar'
import SceneSettings, { useEnabledScenes } from './components/SceneSettings'

// Scene configuration - reorder these to change presentation flow
// The agenda will automatically reflect the order defined here
// Colors cycle through a palette based on position (Blue, Teal, Pink, Poppy, Yellow)
const scenes = [
  // { id: 'hero', component: HeroScene, title: 'Introduction', hideFromAgenda: true },
  // { id: 'agenda', component: AgendaScene, title: 'Agenda', hideFromAgenda: true },
  { id: 'team', component: TeamScene, title: 'Meet the Elastic Team', description: 'Who is at Billington Cybersecurity', duration: '2 min' },
  { id: 'panel', component: PanelScene, title: 'Featured Panel', description: 'Infrastructure & Governing Security', duration: '1 min' },
  // { id: 'about-elastic', component: AboutElasticScene, title: 'About Elastic', description: 'Who we are and what we do', duration: '5 min' },
  // { id: 'business-value', component: BusinessValueScene, title: 'Desired Outcomes', description: 'What success looks like', duration: '10 min' },
  // { id: 'challenges', component: ChallengesScene, title: 'Problem Patterns', description: 'Common challenges we solve', duration: '10 min' },
  // { id: 'data-explosion', component: DataExplosionScene, title: 'The Data Challenge', description: 'Understanding the landscape', duration: '3 min' },
  // { id: 'unified-strategy', component: UnifiedStrategyScene, title: 'Unified Strategy', description: 'Bringing it all together', duration: '5 min' },
  // { id: 'platform', component: PlatformScene, title: 'Capabilities', description: 'Our solutions and capabilities', duration: '5 min' },
  // { id: 'cross-cluster', component: CrossClusterScene, title: 'Cross-Cluster Search', description: 'Distributed search at global scale', duration: '3 min', hideFromAgenda: true },
  { id: 'security', component: SecurityScene, title: 'Elastic Security', description: 'Attack Discovery & AI-driven response', duration: '5 min', hideFromAgenda: true },
  { id: 'whole-of-state', component: WholeOfStateScene, title: 'Whole-of-State', description: 'Unified cyber defense for SLED', duration: '5 min', hideFromAgenda: true },
  // { id: 'data-mesh', component: DataMeshScene, title: 'Data Mesh', description: 'Distributed data architecture', duration: '5 min', hideFromAgenda: true },
  // { id: 'schema', component: SchemaScene, title: 'Elastic Common Schema', description: 'Schema on write advantage', duration: '5 min', hideFromAgenda: true },
  // { id: 'access-control', component: AccessControlScene, title: 'Access Controls', description: 'Live data masking demo', duration: '3 min', hideFromAgenda: true },
  // { id: 'esql', component: ESQLScene, title: 'ES|QL', description: 'Piped query language', duration: '3 min', hideFromAgenda: true },
  // { id: 'data-tiering', component: DataTieringScene, title: 'Data Tiering', description: 'Optimize spend with ILM', duration: '3 min', hideFromAgenda: true },
  // { id: 'licensing', component: LicensingScene, title: 'Licensing', description: 'One license, full power', duration: '3 min', hideFromAgenda: true },
  // { id: 'consolidation', component: ConsolidationScene, title: 'Consolidation', description: 'Reduce tool sprawl', duration: '3 min', hideFromAgenda: true },
  // { id: 'services', component: ServicesScene, title: 'Services & Support', description: 'Expert guidance at every stage', duration: '5 min', hideFromAgenda: true },
  // { id: 'next-steps', component: NextStepsScene, title: 'Next Steps', description: 'Your path forward'}, //, duration: '2 min' },
]

// All scenes for configuration
const allScenes = scenes

function App() {
  const { theme, toggleTheme } = useTheme()
  const [currentScene, setCurrentScene] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // Scene filtering and ordering
  const { 
    enabledSceneIds, 
    enabledScenes, 
    orderedScenes,
    customDurations,
    toggleScene, 
    updateOrder,
    updateDuration,
    resetToDefault 
  } = useEnabledScenes(allScenes)
  const activeScenes = enabledScenes

  // Ensure component is mounted before rendering animations
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Reset current scene if it's now out of bounds
  useEffect(() => {
    if (currentScene >= activeScenes.length) {
      setCurrentScene(Math.max(0, activeScenes.length - 1))
    }
  }, [activeScenes.length, currentScene])

  const navigateToScene = useCallback((index) => {
    if (index >= 0 && index < activeScenes.length) {
      setCurrentScene(index)
    }
  }, [activeScenes.length])

  const nextScene = useCallback(() => {
    if (currentScene < activeScenes.length - 1) {
      setCurrentScene(prev => prev + 1)
    }
  }, [currentScene, activeScenes.length])

  const prevScene = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1)
    }
  }, [currentScene])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keyboard navigation when typing in input fields
      const activeElement = document.activeElement
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      )
      
      if (isTyping) {
        // Only allow Escape to blur the input
        if (e.key === 'Escape') {
          activeElement.blur()
        }
        return // Don't handle navigation keys while typing
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        nextSceneWithPause()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        prevSceneWithPause()
      } else if (e.key >= '1' && e.key <= '9') {
        navigateToSceneWithPause(parseInt(e.key) - 1)
      } else if (e.key === '0') {
        navigateToSceneWithPause(9) // Scene 10
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSceneWithPause, prevSceneWithPause, navigateToSceneWithPause])

  // Auto-rotate between Team (0) and Panel (1) every 15 seconds
  const AUTO_ROTATE_INTERVAL = 15000
  const autoRotateTimer = useRef(null)
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true)

  useEffect(() => {
    // Only auto-rotate when on scene 0 or 1 and auto-rotate is enabled
    if (!autoRotateEnabled || currentScene > 1) {
      if (autoRotateTimer.current) {
        clearInterval(autoRotateTimer.current)
        autoRotateTimer.current = null
      }
      return
    }

    autoRotateTimer.current = setInterval(() => {
      setCurrentScene(prev => prev === 0 ? 1 : 0)
    }, AUTO_ROTATE_INTERVAL)

    return () => {
      if (autoRotateTimer.current) {
        clearInterval(autoRotateTimer.current)
      }
    }
  }, [currentScene, autoRotateEnabled])

  // Pause auto-rotate on any user interaction, resume after 30s of inactivity
  const pauseTimer = useRef(null)
  const handleUserInteraction = useCallback(() => {
    if (pauseTimer.current) clearTimeout(pauseTimer.current)
    setAutoRotateEnabled(false)
    pauseTimer.current = setTimeout(() => {
      setAutoRotateEnabled(true)
    }, 30000) // Resume after 30s of no interaction
  }, [])

  useEffect(() => {
    return () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current)
    }
  }, [])

  // Wrap navigation functions to pause auto-rotate on manual nav
  const navigateToSceneWithPause = useCallback((index) => {
    handleUserInteraction()
    navigateToScene(index)
  }, [navigateToScene, handleUserInteraction])

  const nextSceneWithPause = useCallback(() => {
    handleUserInteraction()
    nextScene()
  }, [nextScene, handleUserInteraction])

  const prevSceneWithPause = useCallback(() => {
    handleUserInteraction()
    prevScene()
  }, [prevScene, handleUserInteraction])

  const CurrentSceneComponent = activeScenes[currentScene]?.component || activeScenes[0]?.component

  return (
    <div className={`relative w-full h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-elastic-dev-blue' : 'bg-elastic-light-grey'
    }`}>
      {/* Background gradient orbs - Bold Minimalism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          animate={{
            backgroundColor: theme === 'dark' ? 'rgba(72, 239, 207, 0.08)' : 'rgba(11, 100, 221, 0.12)'
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          animate={{
            backgroundColor: theme === 'dark' ? 'rgba(240, 78, 152, 0.08)' : 'rgba(240, 78, 152, 0.1)'
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]"
          animate={{
            backgroundColor: theme === 'dark' ? 'rgba(11, 100, 221, 0.05)' : 'rgba(72, 239, 207, 0.08)'
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className={`fixed inset-0 grid-bg pointer-events-none ${theme === 'dark' ? 'opacity-50' : 'opacity-30'}`} />

      {/* Progress bar */}
      <ProgressBar current={currentScene} total={activeScenes.length} />

      {/* Navigation */}
      <Navigation
        scenes={activeScenes}
        currentScene={currentScene}
        onNavigate={navigateToSceneWithPause}
        onNext={nextSceneWithPause}
        onPrev={prevSceneWithPause}
      />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-4 left-4 z-40 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${
          theme === 'dark' 
            ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white' 
            : 'bg-elastic-dev-blue/10 hover:bg-elastic-dev-blue/20 text-elastic-dev-blue/70 hover:text-elastic-dev-blue'
        }`}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-sm" />
      </button>

      {/* Scene Settings */}
      <SceneSettings 
        scenes={allScenes}
        enabledSceneIds={enabledSceneIds}
        orderedScenes={orderedScenes}
        customDurations={customDurations}
        onToggle={toggleScene}
        onUpdateOrder={updateOrder}
        onUpdateDuration={updateDuration}
        onReset={resetToDefault}
      />

      {/* Scene content */}
      {isReady && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ErrorBoundary key={`error-${currentScene}`} onRetry={() => setCurrentScene(currentScene)}>
              <CurrentSceneComponent onNext={nextSceneWithPause} scenes={activeScenes} allScenes={orderedScenes} onNavigate={navigateToSceneWithPause} />
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      )}
      <Analytics />
    </div>
  )
}

export default App

