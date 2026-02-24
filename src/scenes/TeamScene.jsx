import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useTeamConfig } from '../context/TeamContext'

function TeamScene() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [hoveredMember, setHoveredMember] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  // Use shared team config hook (syncs with Settings panel)
  const { teamConfig, isLoading } = useTeamConfig()

  // Reset image errors when team config changes (new photos uploaded)
  useEffect(() => {
    setImageErrors({})
  }, [teamConfig])

  const handleImageError = (memberId) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }))
  }

  const handleCopyEmail = async (email, id) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(id)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      console.error('Failed to copy email')
    }
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="scene flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}
        >
          Loading team...
        </motion.div>
      </div>
    )
  }

  // Determine grid columns based on member count
  const memberCount = teamConfig.members.length
  const gridCols = memberCount > 8 ? 'md:grid-cols-3 lg:grid-cols-4' : memberCount > 4 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
  const isCompact = memberCount > 6

  return (
    <div className="scene">
      <div className={`${isCompact ? 'max-w-7xl' : 'max-w-5xl'} mx-auto w-full`}>
        {/* Header */}
        <motion.div
          className={`text-center ${isCompact ? 'mb-8' : 'mb-16'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={`text-eyebrow text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            Your Support
          </span>
          <h2 className={`text-headline ${isCompact ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-extrabold mt-4 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            {teamConfig.title.includes('Elastic') ? (
              <>
                {teamConfig.title.split('Elastic')[0]}
                <span className="gradient-text">Elastic{teamConfig.title.split('Elastic')[1]}</span>
              </>
            ) : (
              teamConfig.title
            )}
          </h2>
          <p className={`text-paragraph ${isCompact ? 'text-lg' : 'text-xl'} mt-4 max-w-2xl mx-auto ${isDark ? 'text-elastic-light-grey/80' : 'text-elastic-ink'}`}>
            {teamConfig.subtitle}
          </p>
        </motion.div>

        {/* Team grid */}
        <div className={`grid ${gridCols} gap-4`}>
          {teamConfig.members.map((member, index) => (
            <motion.div
              key={member.id}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.06 }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <motion.div
                className={`relative ${isCompact ? 'p-4' : 'p-6'} rounded-2xl border overflow-hidden ${
                  isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-elastic-dev-blue/10'
                }`}
                whileHover={{ scale: 1.03, borderColor: isDark ? member.color : '#0B64DD' }}
                transition={{ duration: 0.2 }}
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: isDark
                      ? `radial-gradient(circle at 50% 30%, ${member.color}15, transparent 60%)`
                      : `radial-gradient(circle at 50% 30%, rgba(11, 100, 221, 0.1), transparent 60%)`,
                  }}
                />

                <div className={`relative flex ${isCompact ? 'flex-col items-center text-center gap-3' : 'items-start gap-5'}`}>
                  {/* Avatar */}
                  <motion.div
                    className="relative flex-shrink-0"
                    animate={{
                      scale: hoveredMember === member.id ? 1.05 : 1,
                    }}
                  >
                    {member.photo && !imageErrors[member.id] ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className={`${isCompact ? 'w-16 h-16' : 'w-20 h-20'} rounded-2xl object-cover`}
                        style={{ border: `2px solid ${isDark ? member.color : '#0B64DD'}` }}
                        onError={() => handleImageError(member.id)}
                      />
                    ) : (
                      <div
                        className={`${isCompact ? 'w-16 h-16 text-xl' : 'w-20 h-20 text-2xl'} rounded-2xl flex items-center justify-center font-bold`}
                        style={{
                          backgroundColor: isDark ? `${member.color}20` : 'rgba(11, 100, 221, 0.1)',
                          color: isDark ? member.color : '#0B64DD',
                        }}
                      >
                        {member.initials}
                      </div>
                    )}

                    {/* Online indicator */}
                    <motion.div
                      className={`absolute -bottom-1 -right-1 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'} rounded-full border-2 border-elastic-dev-blue`}
                      style={{ backgroundColor: isDark ? member.color : '#0B64DD' }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Info */}
                  <div className={`${isCompact ? '' : 'flex-1'} min-w-0`}>
                    <h3 className={`text-headline ${isCompact ? 'text-base' : 'text-xl'} font-bold mb-0.5 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-paragraph text-xs ${isCompact ? 'mb-2' : 'mb-3'} ${isDark ? 'text-elastic-light-grey/70' : 'text-elastic-ink'}`}>
                      {member.role}
                    </p>

                    {/* Contact - email only in compact mode */}
                    <button
                      onClick={() => handleCopyEmail(member.email, member.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${isCompact ? 'mx-auto' : ''} ${
                        isDark ? 'text-white/60 hover:text-white' : 'text-elastic-dev-blue/60 hover:text-elastic-dev-blue'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{copiedEmail === member.id ? 'Copied!' : member.email}</span>
                    </button>

                    {/* Phone - only in non-compact mode or if phone exists */}
                    {!isCompact && member.phone && (
                      <a
                        href={`tel:${member.phone?.replace(/\./g, '') || ''}`}
                        className={`flex items-center gap-1.5 text-xs mt-1.5 transition-colors ${
                          isDark ? 'text-white/60 hover:text-white' : 'text-elastic-dev-blue/60 hover:text-elastic-dev-blue'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Decorative corner */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-10"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, ${member.color}, transparent)`
                      : `linear-gradient(135deg, #0B64DD, transparent)`,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {teamConfig.members.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={`text-lg ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              No team members configured.
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Click the settings button to add team members.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TeamScene
