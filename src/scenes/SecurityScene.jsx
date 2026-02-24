import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved, faBell, faTriangleExclamation, faBolt,
  faPlay, faPause, faChevronRight, faChevronLeft, faRotateRight,
  faCheck, faRobot, faBook,
  faCircleCheck, faCircleXmark, faLock,
  faWandMagicSparkles, faMagnifyingGlass,
  faArrowRight, faUser, faServer, faGear
} from '@fortawesome/free-solid-svg-icons'

// ─── Stage Configuration ─────────────────────────────────────────────
const stages = [
  { id: 'attack-discovery', label: 'Attack Discovery' },
  { id: 'threat-hunting', label: 'AI Assistant' },
  { id: 'automated-workflows', label: 'Automated Response' },
]

// ─── Severity Colors ─────────────────────────────────────────────────
const severityColors = {
  critical: '#F04E98',
  high: '#FF957D',
  medium: '#FEC514',
  low: '#48EFCF',
}

// ─── Alert Data ──────────────────────────────────────────────────────
const securityAlerts = [
  { id: 1, severity: 'critical', label: 'Brute Force Login', source: '10.0.1.45', tactic: 'Credential Access' },
  { id: 2, severity: 'high', label: 'Malware Detected', source: 'WS-PC-0142', tactic: 'Execution' },
  { id: 3, severity: 'critical', label: 'Lateral Movement', source: '10.0.3.22', tactic: 'Lateral Movement' },
  { id: 4, severity: 'medium', label: 'Suspicious DNS', source: 'SRV-DB-01', tactic: 'Command & Control' },
  { id: 5, severity: 'high', label: 'Privilege Escalation', source: '10.0.2.18', tactic: 'Privilege Escalation' },
  { id: 6, severity: 'critical', label: 'Data Exfiltration', source: 'SRV-FILE-03', tactic: 'Exfiltration' },
  { id: 7, severity: 'medium', label: 'C2 Beacon', source: '10.0.1.87', tactic: 'Command & Control' },
  { id: 8, severity: 'high', label: 'Credential Dump', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 9, severity: 'low', label: 'Port Scan', source: '10.0.4.12', tactic: 'Discovery' },
  { id: 10, severity: 'medium', label: 'Phishing Email', source: 'user@corp.com', tactic: 'Initial Access' },
  { id: 11, severity: 'high', label: 'Ransomware IOC', source: 'WS-PC-0089', tactic: 'Impact' },
  { id: 12, severity: 'critical', label: 'Admin Logon', source: 'DC-PROD-02', tactic: 'Persistence' },
  { id: 13, severity: 'medium', label: 'Suspicious Process', source: '10.0.1.33', tactic: 'Execution' },
  { id: 14, severity: 'high', label: 'Registry Modification', source: 'WS-PC-0201', tactic: 'Defense Evasion' },
  { id: 15, severity: 'low', label: 'Failed Login', source: '10.0.5.9', tactic: 'Credential Access' },
  { id: 16, severity: 'medium', label: 'Anomalous Traffic', source: 'FW-EDGE-01', tactic: 'Command & Control' },
  { id: 17, severity: 'high', label: 'DLL Injection', source: 'WS-PC-0142', tactic: 'Defense Evasion' },
  { id: 18, severity: 'critical', label: 'Golden Ticket', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 19, severity: 'medium', label: 'Webshell Upload', source: 'SRV-WEB-02', tactic: 'Persistence' },
  { id: 20, severity: 'high', label: 'Kerberoasting', source: '10.0.2.45', tactic: 'Credential Access' },
  { id: 21, severity: 'medium', label: 'DNS Tunneling', source: '10.0.3.55', tactic: 'Exfiltration' },
  { id: 22, severity: 'high', label: 'Pass the Hash', source: 'WS-PC-0310', tactic: 'Lateral Movement' },
  { id: 23, severity: 'critical', label: 'Mimikatz Detected', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 24, severity: 'low', label: 'Policy Violation', source: 'user2@corp.com', tactic: 'Compliance' },
  { id: 25, severity: 'high', label: 'RDP Brute Force', source: '10.0.6.14', tactic: 'Credential Access' },
  { id: 26, severity: 'medium', label: 'Tor Exit Node', source: 'FW-EDGE-02', tactic: 'Command & Control' },
  { id: 27, severity: 'critical', label: 'DCSync Attack', source: 'DC-PROD-02', tactic: 'Credential Access' },
  { id: 28, severity: 'high', label: 'Scheduled Task', source: 'WS-PC-0089', tactic: 'Persistence' },
  { id: 29, severity: 'medium', label: 'LDAP Enumeration', source: '10.0.2.33', tactic: 'Discovery' },
  { id: 30, severity: 'low', label: 'Login Anomaly', source: '10.0.7.21', tactic: 'Initial Access' },
  { id: 31, severity: 'high', label: 'SMB Exploit', source: '10.0.3.22', tactic: 'Lateral Movement' },
  { id: 32, severity: 'critical', label: 'Rootkit Detected', source: 'SRV-APP-04', tactic: 'Defense Evasion' },
  { id: 33, severity: 'medium', label: 'ARP Spoofing', source: '10.0.1.99', tactic: 'Collection' },
  { id: 34, severity: 'high', label: 'PowerShell Empire', source: 'WS-PC-0142', tactic: 'Execution' },
  { id: 35, severity: 'low', label: 'SSH Brute Force', source: '10.0.8.5', tactic: 'Credential Access' },
  { id: 36, severity: 'medium', label: 'Beacon Callback', source: '10.0.1.87', tactic: 'Command & Control' },
  { id: 37, severity: 'high', label: 'Token Impersonation', source: 'SRV-DB-01', tactic: 'Privilege Escalation' },
  { id: 38, severity: 'critical', label: 'SAM Database', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 39, severity: 'medium', label: 'Outbound IRC', source: 'WS-PC-0201', tactic: 'Command & Control' },
  { id: 40, severity: 'high', label: 'WMI Execution', source: '10.0.3.41', tactic: 'Execution' },
  { id: 41, severity: 'low', label: 'Geo Anomaly', source: 'user3@corp.com', tactic: 'Initial Access' },
  { id: 42, severity: 'critical', label: 'NTDS.dit Access', source: 'DC-PROD-02', tactic: 'Credential Access' },
  { id: 43, severity: 'high', label: 'Service Install', source: 'SRV-FILE-03', tactic: 'Persistence' },
  { id: 44, severity: 'medium', label: 'Encoded Command', source: 'WS-PC-0310', tactic: 'Defense Evasion' },
  { id: 45, severity: 'high', label: 'BITS Transfer', source: '10.0.2.18', tactic: 'Exfiltration' },
  { id: 46, severity: 'low', label: 'MFA Bypass Attempt', source: '10.0.5.9', tactic: 'Credential Access' },
  { id: 47, severity: 'medium', label: 'Process Hollowing', source: 'WS-PC-0089', tactic: 'Defense Evasion' },
  { id: 48, severity: 'high', label: 'Reverse Shell', source: 'SRV-WEB-02', tactic: 'Execution' },
  { id: 49, severity: 'critical', label: 'Domain Replication', source: 'DC-PROD-01', tactic: 'Lateral Movement' },
  { id: 50, severity: 'medium', label: 'Crypto Mining', source: 'SRV-APP-04', tactic: 'Impact' },
  { id: 51, severity: 'high', label: 'AMSI Bypass', source: 'WS-PC-0310', tactic: 'Defense Evasion' },
  { id: 52, severity: 'critical', label: 'Shadow Credentials', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 53, severity: 'medium', label: 'Network Sniffing', source: '10.0.4.55', tactic: 'Collection' },
  { id: 54, severity: 'high', label: 'CMSTP Execution', source: 'WS-PC-0089', tactic: 'Defense Evasion' },
  { id: 55, severity: 'low', label: 'Account Lockout', source: '10.0.1.12', tactic: 'Credential Access' },
  { id: 56, severity: 'critical', label: 'DPAPI Abuse', source: 'DC-PROD-02', tactic: 'Credential Access' },
  { id: 57, severity: 'medium', label: 'RPC Lateral Move', source: '10.0.3.77', tactic: 'Lateral Movement' },
  { id: 58, severity: 'high', label: 'Certify Exploit', source: 'SRV-CA-01', tactic: 'Privilege Escalation' },
  { id: 59, severity: 'low', label: 'USB Device Insert', source: 'WS-PC-0201', tactic: 'Initial Access' },
  { id: 60, severity: 'medium', label: 'NTLM Relay', source: '10.0.2.88', tactic: 'Credential Access' },
  { id: 61, severity: 'high', label: 'AD Enumeration', source: 'WS-PC-0142', tactic: 'Discovery' },
  { id: 62, severity: 'critical', label: 'Skeleton Key', source: 'DC-PROD-01', tactic: 'Persistence' },
  { id: 63, severity: 'medium', label: 'DNS Rebinding', source: 'FW-EDGE-01', tactic: 'Command & Control' },
  { id: 64, severity: 'high', label: 'Named Pipe Impersonation', source: 'SRV-DB-01', tactic: 'Privilege Escalation' },
  { id: 65, severity: 'low', label: 'Failed MFA', source: 'user4@corp.com', tactic: 'Credential Access' },
  { id: 66, severity: 'critical', label: 'PrintNightmare', source: 'SRV-PRINT-01', tactic: 'Execution' },
  { id: 67, severity: 'medium', label: 'Hidden File Access', source: 'WS-PC-0310', tactic: 'Defense Evasion' },
  { id: 68, severity: 'high', label: 'COM Hijack', source: 'WS-PC-0089', tactic: 'Persistence' },
  { id: 69, severity: 'medium', label: 'SOCKS Proxy', source: '10.0.1.87', tactic: 'Command & Control' },
  { id: 70, severity: 'critical', label: 'ZeroLogon Attempt', source: 'DC-PROD-02', tactic: 'Privilege Escalation' },
  { id: 71, severity: 'high', label: 'Macro Execution', source: 'WS-PC-0201', tactic: 'Execution' },
  { id: 72, severity: 'low', label: 'Suspicious Login Time', source: '10.0.5.33', tactic: 'Initial Access' },
  { id: 73, severity: 'medium', label: 'PsExec Remote', source: '10.0.3.22', tactic: 'Lateral Movement' },
  { id: 74, severity: 'high', label: 'Covenant C2', source: 'SRV-WEB-02', tactic: 'Command & Control' },
  { id: 75, severity: 'critical', label: 'LSASS Memory Dump', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 76, severity: 'medium', label: 'Timestomping', source: 'WS-PC-0142', tactic: 'Defense Evasion' },
  { id: 77, severity: 'high', label: 'BloodHound Scan', source: '10.0.2.45', tactic: 'Discovery' },
  { id: 78, severity: 'low', label: 'Disabled Firewall', source: 'WS-PC-0310', tactic: 'Defense Evasion' },
  { id: 79, severity: 'critical', label: 'Ticket Granting', source: 'DC-PROD-01', tactic: 'Credential Access' },
  { id: 80, severity: 'high', label: 'Cobalt Strike Beacon', source: '10.0.1.87', tactic: 'Command & Control' },
]

// ─── Attack Stories ──────────────────────────────────────────────────
const attackStories = [
  {
    id: 1,
    title: 'Credential Compromise Campaign',
    summary: 'Brute force attempts on DC-PROD-01 succeeded, followed by credential dumping and Golden Ticket creation targeting domain admin accounts.',
    mitre: ['T1110 Brute Force', 'T1003 Credential Dumping', 'T1558 Golden Ticket'],
    entities: ['DC-PROD-01', 'DC-PROD-02', '10.0.1.45'],
    severity: 'critical',
    alertCount: 6,
    color: '#F04E98',
  },
  {
    id: 2,
    title: 'Malware Lateral Spread',
    summary: 'Malware detected on WS-PC-0142 with DLL injection, spreading laterally to 10.0.3.22 via SMB. Ransomware IOCs found on WS-PC-0089.',
    mitre: ['T1059 Execution', 'T1055 Process Injection', 'T1021 Lateral Movement'],
    entities: ['WS-PC-0142', '10.0.3.22', 'WS-PC-0089'],
    severity: 'critical',
    alertCount: 5,
    color: '#FF957D',
  },
  {
    id: 3,
    title: 'Data Exfiltration via C2 Channel',
    summary: 'C2 beacon from 10.0.1.87 communicating with external IP. Data exfiltration from SRV-FILE-03 detected through anomalous traffic patterns.',
    mitre: ['T1071 Application Layer Protocol', 'T1041 Exfiltration Over C2'],
    entities: ['10.0.1.87', 'SRV-FILE-03', 'FW-EDGE-01'],
    severity: 'high',
    alertCount: 4,
    color: '#0B64DD',
  },
  {
    id: 4,
    title: 'Web Server Persistence',
    summary: 'Webshell uploaded to SRV-WEB-02 with suspicious process execution and registry modifications to establish persistence.',
    mitre: ['T1505 Server Software Component', 'T1112 Modify Registry'],
    entities: ['SRV-WEB-02', 'WS-PC-0201'],
    severity: 'high',
    alertCount: 3,
    color: '#48EFCF',
  },
]

// ─── Chat Script ─────────────────────────────────────────────────────
const chatScript = [
  {
    role: 'user',
    text: 'Investigate the credential compromise on DC-PROD-01. What happened?',
  },
  {
    role: 'agent',
    text: 'I analyzed 6 related alerts. Here\'s what I found:\n\n• Brute force from 10.0.1.45 at 02:14 UTC\n• Successful admin logon 3 minutes later\n• LSASS credential dump detected\n• Golden Ticket forged for domain admin\n\nThis matches attack patterns for APT29 TTPs.',
  },
  {
    role: 'user',
    text: 'What remediation steps should we take?',
  },
  {
    role: 'agent',
    text: 'Based on your internal runbook (KB-SEC-2024-017):\n\n1. Reset krbtgt account password (twice)\n2. Isolate DC-PROD-01 from network\n3. Force password reset for all admin accounts\n4. Review all Kerberos tickets issued in last 24h\n5. Enable enhanced monitoring on domain controllers',
    hasKB: true,
  },
]

// ─── Knowledge Bases ─────────────────────────────────────────────────
const knowledgeBases = [
  { name: 'Internal Runbooks', icon: faBook, items: 'KB-SEC-2024-*' },
  { name: 'Threat Intel Feeds', icon: faShieldHalved, items: 'MITRE ATT&CK' },
]

const remediationSteps = [
  'Reset krbtgt password (x2)',
  'Isolate DC-PROD-01',
  'Force admin password reset',
  'Review Kerberos tickets (24h)',
  'Enable DC monitoring',
]

// ─── Available Workflows ─────────────────────────────────────────────
const availableWorkflows = [
  { id: 'isolate-host', name: 'Isolate Host', type: 'Response', description: 'Quarantine compromised endpoints from network', icon: faLock, color: '#F04E98', active: true },
  { id: 'block-ip', name: 'Block IP at Firewall', type: 'Response', description: 'Add malicious IPs to network deny list', icon: faShieldHalved, color: '#F04E98' },
  { id: 'disable-user', name: 'Disable User Account', type: 'Response', description: 'Suspend compromised user credentials', icon: faUser, color: '#F04E98' },
  { id: 'enrich-intel', name: 'Enrich with Threat Intel', type: 'Enrichment', description: 'Cross-reference IOCs with threat feeds', icon: faMagnifyingGlass, color: '#0B64DD' },
  { id: 'yara-scan', name: 'Scan with YARA Rules', type: 'Investigation', description: 'Deep file analysis on target hosts', icon: faBolt, color: '#FEC514' },
  { id: 'search-siem', name: 'Search Across SIEM', type: 'ES|QL Query', description: 'Query all data sources for IOC matches', icon: faMagnifyingGlass, color: '#48EFCF' },
  { id: 'jira-ticket', name: 'Create Jira Ticket', type: 'Notification', description: 'Auto-generate incident tickets', icon: faBell, color: '#FF957D' },
  { id: 'alert-soc', name: 'Alert SOC Team', type: 'Notification', description: 'Send priority alerts to on-call analysts', icon: faBell, color: '#FF957D' },
]

const workflowTypeBadgeColor = {
  'Response': { bg: 'bg-elastic-pink/15', text: 'text-elastic-pink' },
  'Enrichment': { bg: 'bg-elastic-blue/15', text: 'text-elastic-blue' },
  'Investigation': { bg: 'bg-elastic-yellow/15', text: 'text-elastic-yellow' },
  'ES|QL Query': { bg: 'bg-elastic-teal/15', text: 'text-elastic-teal' },
  'Notification': { bg: 'bg-elastic-poppy/15', text: 'text-elastic-poppy' },
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

function SecurityScene({ onNext }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const timeoutsRef = useRef([])
  const chatContainerRef = useRef(null)

  // ─── Stage state ───────────────────────────────────────────────────
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // ─── Phase 1: Attack Discovery ─────────────────────────────────────
  const [alertPhase, setAlertPhase] = useState('idle') // idle | flooding | analyzing | grouped
  const [selectedStory, setSelectedStory] = useState(null)

  // ─── Phase 2: Threat Hunting ───────────────────────────────────────
  const [visibleMessages, setVisibleMessages] = useState([])
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [huntingStarted, setHuntingStarted] = useState(false)
  const [kbHighlight, setKbHighlight] = useState([])
  const [visibleSteps, setVisibleSteps] = useState(0)

  // ─── Phase 3: Workflows ────────────────────────────────────────────
  const [workflowPhase, setWorkflowPhase] = useState('idle') // idle | triggered | pending | approved | denied | executing | done | notifying
  const [terminalLines, setTerminalLines] = useState([])
  const [visibleNotifications, setVisibleNotifications] = useState(0)

  // ─── Helpers ───────────────────────────────────────────────────────
  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }, [])

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay)
    timeoutsRef.current.push(id)
    return id
  }, [])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  // ─── Auto-scroll chat container ─────────────────────────────────────
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [visibleMessages, isAgentTyping])

  const resetPhaseStates = useCallback(() => {
    clearTimeouts()
    setAlertPhase('idle')
    setSelectedStory(null)
    setVisibleMessages([])
    setIsAgentTyping(false)
    setHuntingStarted(false)
    setKbHighlight([])
    setVisibleSteps(0)
    setWorkflowPhase('idle')
    setTerminalLines([])
    setVisibleNotifications(0)
  }, [clearTimeouts])

  const nextStage = useCallback(() => {
    if (stage < stages.length - 1) {
      resetPhaseStates()
      setStage(s => s + 1)
    }
  }, [stage, resetPhaseStates])

  const prevStage = useCallback(() => {
    if (stage > 0) {
      resetPhaseStates()
      setStage(s => s - 1)
    }
  }, [stage, resetPhaseStates])

  const resetDemo = useCallback(() => {
    resetPhaseStates()
    setStage(0)
  }, [resetPhaseStates])

  // ─── Phase 1: Alert flood → group animation ───────────────────────
  const runAttackDiscovery = useCallback(() => {
    setAlertPhase('flooding')
    addTimeout(() => setAlertPhase('analyzing'), 4500)
    addTimeout(() => setAlertPhase('grouped'), 6500)
  }, [addTimeout])

  // ─── Phase 2: Chat sequence ────────────────────────────────────────
  const runThreatHunting = useCallback(() => {
    setHuntingStarted(true)

    addTimeout(() => setVisibleMessages([chatScript[0]]), 300)
    addTimeout(() => setIsAgentTyping(true), 1200)
    addTimeout(() => {
      setIsAgentTyping(false)
      setVisibleMessages([chatScript[0], chatScript[1]])
      setKbHighlight([1])
    }, 3200)
    addTimeout(() => {
      setVisibleMessages([chatScript[0], chatScript[1], chatScript[2]])
    }, 4500)
    addTimeout(() => setIsAgentTyping(true), 5300)
    addTimeout(() => {
      setIsAgentTyping(false)
      setVisibleMessages(chatScript)
      setKbHighlight([0, 1])
    }, 7300)
    remediationSteps.forEach((_, i) => {
      addTimeout(() => setVisibleSteps(i + 1), 7800 + i * 400)
    })
  }, [addTimeout])

  // ─── Phase 3: Workflow animation (auto-approves for booth loop) ────
  const runWorkflow = useCallback(() => {
    setWorkflowPhase('triggered')
    addTimeout(() => setWorkflowPhase('pending'), 1200)
    // Auto-approve after showing the pending state briefly
    addTimeout(() => setWorkflowPhase('approved'), 2500)
    addTimeout(() => {
      setWorkflowPhase('executing')
      terminalCommands.forEach((_, i) => {
        addTimeout(() => setTerminalLines(prev => [...prev, terminalCommands[i]]), i * 350)
      })
    }, 3100)
    const afterTerminal = 3100 + terminalCommands.length * 350 + 400
    addTimeout(() => setWorkflowPhase('done'), afterTerminal)
    addTimeout(() => { setWorkflowPhase('notifying'); setVisibleNotifications(1) }, afterTerminal + 500)
    addTimeout(() => setVisibleNotifications(2), afterTerminal + 800)
    addTimeout(() => setVisibleNotifications(3), afterTerminal + 1100)
  }, [addTimeout])

  const terminalCommands = [
    '$ elastic-agent isolate --host WS-PC-0142 --force',
    '[INFO] Connecting to Elastic Security endpoint...',
    '[INFO] Host WS-PC-0142 found — Agent v8.15.1',
    '[EXEC] Blocking all network interfaces...',
    '[EXEC] Preserving forensic artifacts...',
    '[OK]   Host WS-PC-0142 isolated successfully',
  ]

  const approveWorkflow = useCallback(() => {
    setWorkflowPhase('approved')
    addTimeout(() => {
      setWorkflowPhase('executing')
      terminalCommands.forEach((_, i) => {
        addTimeout(() => setTerminalLines(prev => [...prev, terminalCommands[i]]), i * 350)
      })
    }, 600)
    const afterTerminal = 600 + terminalCommands.length * 350 + 400
    addTimeout(() => setWorkflowPhase('done'), afterTerminal)
    addTimeout(() => {
      setWorkflowPhase('notifying')
      setVisibleNotifications(1)
    }, afterTerminal + 500)
    addTimeout(() => setVisibleNotifications(2), afterTerminal + 800)
    addTimeout(() => setVisibleNotifications(3), afterTerminal + 1100)
  }, [addTimeout])

  const denyWorkflow = useCallback(() => {
    setWorkflowPhase('denied')
  }, [])

  // ─── Auto-loop controller (booth mode) ────────────────────────────
  // Stage durations: how long each stage plays before advancing
  // Stage 0: grouped at 6500ms + 3s dwell = 9500ms
  // Stage 1: last remediation at ~9400ms + 3s dwell = 12500ms
  // Stage 2: notifying complete at ~6700ms + 3s dwell = 9700ms
  const SECURITY_STAGE_DURATIONS = [9500, 12500, 9700]
  const SECURITY_DWELL = 3000

  useEffect(() => {
    if (!isPlaying) return

    // Reset previous stage state
    resetPhaseStates()

    // Start current stage animation after a short entry delay
    const startId = addTimeout(() => {
      if (stage === 0) runAttackDiscovery()
      else if (stage === 1) runThreatHunting()
      else if (stage === 2) runWorkflow()
    }, 400)

    // Schedule advance to next stage (or next scene if last stage)
    const advanceId = addTimeout(() => {
      if (stage === stages.length - 1 && onNext) {
        resetPhaseStates()
        onNext()
      } else {
        setStage(s => (s + 1) % stages.length)
      }
    }, SECURITY_STAGE_DURATIONS[stage] + SECURITY_DWELL)

    return () => {
      clearTimeout(startId)
      clearTimeout(advanceId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, stage])

  const togglePlayback = useCallback(() => {
    if (isPlaying) clearTimeouts()
    setIsPlaying(p => !p)
  }, [isPlaying, clearTimeouts])


  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div className="scene !py-2">
      <div className="max-w-[98%] mx-auto w-full h-full flex flex-col">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={`text-eyebrow text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            Elastic Security
          </span>
          <h2 className={`text-headline text-4xl md:text-5xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Modernizing Cyber Defense with <span className="gradient-text">AI-Driven Efficiency</span>
          </h2>
          <p className={`text-lg mt-2 max-w-3xl mx-auto ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/60'}`}>
            Prioritize attacks over alerts, make every analyst a power user, and automate response at scale.
          </p>
        </motion.div>

        {/* ── Stage Progress Indicator ────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                resetPhaseStates()
                setStage(i)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === stage
                  ? isDark
                    ? 'bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/40'
                    : 'bg-elastic-blue/10 text-elastic-blue border border-elastic-blue/30'
                  : i < stage
                    ? isDark ? 'bg-white/10 text-white/80' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/70'
                    : isDark ? 'bg-white/5 text-white/50' : 'bg-elastic-dev-blue/5 text-elastic-dev-blue/40'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i === stage
                  ? isDark ? 'bg-elastic-teal/30' : 'bg-elastic-blue/20'
                  : i < stage ? 'bg-elastic-teal/30' : ''
              }`}>
                {i < stage ? <FontAwesomeIcon icon={faCheck} /> : i + 1}
              </span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main Stage Content ──────────────────────────────────── */}
        <div className={`flex-1 relative overflow-hidden rounded-2xl border bg-gradient-to-br from-transparent to-white/[0.02] min-h-[560px] mx-auto w-full ${
          isDark ? 'border-white/10' : 'border-elastic-dev-blue/10'
        }`}>
          <AnimatePresence mode="popLayout">

            {/* ═══════════════════════════════════════════════════════ */}
            {/* STAGE 1: Attack Discovery                             */}
            {/* ═══════════════════════════════════════════════════════ */}
            {stage === 0 && (
              <motion.div
                key="attack-discovery"
                className="absolute inset-0 p-8 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Phase label */}
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faShieldHalved} className={`text-base ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                    Attack Discovery — Prioritize Attacks, Not Alerts
                  </span>
                  {alertPhase === 'grouped' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-sm ml-auto px-3 py-1 rounded-full font-medium ${isDark ? 'bg-elastic-teal/20 text-elastic-teal' : 'bg-elastic-blue/10 text-elastic-blue'}`}
                    >
                      80 alerts → 4 attack stories
                    </motion.span>
                  )}
                </div>

                {/* Alert flood area / Attack stories */}
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">

                    {/* Idle + Flooding: show alert grid */}
                    {(alertPhase === 'idle' || alertPhase === 'flooding') && (
                      <motion.div
                        key="alerts-grid"
                        className="absolute inset-0 flex flex-wrap content-start gap-2.5 p-3 overflow-hidden"
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                      >
                        {securityAlerts.map((alert, i) => (
                          <motion.div
                            key={alert.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                              isDark
                                ? 'bg-white/[0.03] border-white/10'
                                : 'bg-white/70 border-elastic-dev-blue/10'
                            }`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={alertPhase === 'flooding'
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0.3, scale: 0.95 }
                            }
                            transition={{ delay: alertPhase === 'flooding' ? i * 0.05 : 0, type: 'spring', stiffness: 400, damping: 25 }}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: severityColors[alert.severity] }}
                            />
                            <span className={isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}>{alert.label}</span>
                            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>{alert.source}</span>
                          </motion.div>
                        ))}

                        {/* Idle state hint */}
                        {alertPhase === 'idle' && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className={`text-center px-8 py-6 rounded-2xl ${isDark ? 'bg-elastic-dev-blue/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                              <FontAwesomeIcon icon={faBell} className={`text-3xl mb-3 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`} />
                              <p className={`text-base ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                                80 raw security alerts flood in — AI groups them into attack stories
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Analyzing: spinner */}
                    {alertPhase === 'analyzing' && (
                      <motion.div
                        key="analyzing"
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-20 h-20 rounded-full border-2 border-t-transparent flex items-center justify-center mb-5"
                          style={{ borderColor: isDark ? 'rgba(72,239,207,0.3)' : 'rgba(11,100,221,0.3)', borderTopColor: 'transparent' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <FontAwesomeIcon icon={faWandMagicSparkles} className={`text-2xl ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                        </motion.div>
                        <p className={`text-base font-medium ${isDark ? 'text-white/60' : 'text-elastic-dev-blue/60'}`}>
                          Attack Discovery triaging alerts...
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                          Correlating 80 alerts into prioritized attack stories via MITRE ATT&CK
                        </p>
                      </motion.div>
                    )}

                    {/* Grouped: attack story cards */}
                    {alertPhase === 'grouped' && (
                      <motion.div
                        key="stories"
                        className="absolute inset-0 p-2 flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          {attackStories.map((story, i) => (
                            <motion.div
                              key={story.id}
                              className={`rounded-xl border-l-4 px-4 py-3.5 cursor-pointer transition-all ${
                                isDark
                                  ? 'bg-white/[0.03] hover:bg-white/[0.06]'
                                  : 'bg-white/60 hover:bg-white/80'
                              } ${selectedStory === story.id ? (isDark ? 'ring-1 ring-white/20' : 'ring-1 ring-elastic-dev-blue/20') : ''}`}
                              style={{ borderLeftColor: story.color }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 * i, type: 'spring', stiffness: 300, damping: 25 }}
                              onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                            >
                              {/* Card header */}
                              <div className="flex items-start justify-between mb-1.5">
                                <div className="flex-1">
                                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                                    {story.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                      style={{ backgroundColor: `${story.color}20`, color: story.color }}>
                                      {story.severity.toUpperCase()}
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                                      {story.alertCount} alerts correlated
                                    </span>
                                  </div>
                                </div>
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-sm mt-0.5" style={{ color: story.color }} />
                              </div>

                              {/* Summary */}
                              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                                {story.summary}
                              </p>

                              {/* Expanded details */}
                              <AnimatePresence>
                                {selectedStory === story.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className={`pt-2 mt-2 border-t ${isDark ? 'border-white/10' : 'border-elastic-dev-blue/10'}`}>
                                      <div className="mb-2">
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                                          MITRE ATT&CK
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                          {story.mitre.map(t => (
                                            <span key={t} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/10 text-white/60' : 'bg-elastic-dev-blue/5 text-elastic-dev-blue/60'}`}>
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                                          Affected Entities
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                          {story.entities.map(e => (
                                            <span key={e} className={`text-xs px-2 py-0.5 rounded font-mono ${isDark ? 'bg-white/10 text-white/60' : 'bg-elastic-dev-blue/5 text-elastic-dev-blue/60'}`}>
                                              {e}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>

                        {/* Daily discoveries callout with Jira & ServiceNow logos */}
                        <motion.div
                          className={`flex items-center justify-center gap-5 py-3 mt-3 rounded-xl flex-shrink-0 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.03]'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <span className={`text-sm ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                            Attack stories triaged and routed to analysts via
                          </span>
                          <div className="flex items-center gap-3">
                            {/* Jira logo */}
                            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/[0.06]' : 'bg-white/70'}`}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M11.53 2c0 4.97 4.03 9 9 9h.47v.47c0 4.97-4.03 9-9 9v-.47c0-4.97-4.03-9-9-9H2.53v-.47c0-4.97 4.03-9 9-9V2z" fill="#2684FF"/>
                                <path d="M11.53 2v.53c0 4.97 4.03 9 9 9h.47" fill="url(#jira-a)" fillOpacity="0.4"/>
                                <path d="M2.53 11.53H3c4.97 0 9 4.03 9 9v.47" fill="url(#jira-b)" fillOpacity="0.4"/>
                                <defs>
                                  <linearGradient id="jira-a" x1="16" y1="2" x2="21" y2="11.53" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF" stopOpacity="0"/>
                                  </linearGradient>
                                  <linearGradient id="jira-b" x1="8" y1="11.53" x2="3" y2="21" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF" stopOpacity="0"/>
                                  </linearGradient>
                                </defs>
                              </svg>
                              <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-elastic-dark-ink/60'}`}>Jira</span>
                            </span>
                            {/* ServiceNow logo */}
                            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/[0.06]' : 'bg-white/70'}`}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16.5c-3.58 0-6.5-2.92-6.5-6.5S8.42 5.5 12 5.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" fill="#81B5A1"/>
                                <path d="M12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z" fill="#81B5A1"/>
                              </svg>
                              <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-elastic-dark-ink/60'}`}>ServiceNow</span>
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            )}


            {/* ═══════════════════════════════════════════════════════ */}
            {/* STAGE 2: AI Threat Hunting                            */}
            {/* ═══════════════════════════════════════════════════════ */}
            {stage === 1 && (
              <motion.div
                key="threat-hunting"
                className="absolute inset-0 p-8 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Phase label */}
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faRobot} className={`text-base ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                    AI Assistant — Make Every Analyst a Power User
                  </span>
                  <span className={`text-xs ml-auto px-3 py-1 rounded-full ${isDark ? 'bg-elastic-teal/10 text-elastic-teal/60' : 'bg-elastic-blue/10 text-elastic-blue/60'}`}>
                    Agent Builder
                  </span>
                </div>

                {/* Main layout: chat + KB panel */}
                <div className="flex-1 flex gap-5 overflow-hidden">

                  {/* Chat panel */}
                  <div className={`flex-[2] flex flex-col rounded-xl border overflow-hidden ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-white/40'}`}>
                    {/* Chat header */}
                    <div className={`px-5 py-3 border-b flex items-center gap-3 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/60'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-elastic-teal/20' : 'bg-elastic-blue/10'}`}>
                        <FontAwesomeIcon icon={faRobot} className={`text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                      </div>
                      <span className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
                        Elastic AI Assistant
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'}`}>
                        Online
                      </span>
                    </div>

                    {/* Chat messages */}
                    <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                      {!huntingStarted && (
                        <motion.div
                          className="flex-1 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-center">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={`text-3xl mb-3 ${isDark ? 'text-white/20' : 'text-elastic-dev-blue/20'}`} />
                            <p className={`text-sm ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                              AI-guided investigation starting...
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {visibleMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? isDark
                                ? 'bg-elastic-teal/20 text-white/80 rounded-br-sm'
                                : 'bg-elastic-blue/10 text-elastic-dark-ink/80 rounded-br-sm'
                              : isDark
                                ? 'bg-white/[0.05] text-white/70 rounded-bl-sm'
                                : 'bg-white/70 text-elastic-dark-ink/70 rounded-bl-sm border border-elastic-dev-blue/10'
                          }`}
                            style={{ whiteSpace: 'pre-line' }}
                          >
                            {msg.role === 'agent' && (
                              <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faRobot} className={`text-xs ${isDark ? 'text-elastic-teal/60' : 'text-elastic-blue/60'}`} />
                                <span className={`text-xs font-semibold ${isDark ? 'text-elastic-teal/60' : 'text-elastic-blue/60'}`}>AI Assistant</span>
                                {msg.hasKB && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-elastic-teal/10 text-elastic-teal/50' : 'bg-elastic-blue/10 text-elastic-blue/50'}`}>
                                    via KB-SEC-2024-017
                                  </span>
                                )}
                              </div>
                            )}
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {isAgentTyping && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`flex items-center gap-2 rounded-xl px-5 py-3.5 ${isDark ? 'bg-white/[0.05]' : 'bg-white/70 border border-elastic-dev-blue/10'}`}>
                            {[0, 1, 2].map(dot => (
                              <motion.span
                                key={dot}
                                className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-elastic-dev-blue/40'}`}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Knowledge Base / Agent panel */}
                  <motion.div
                    className={`flex-1 flex flex-col gap-4 rounded-xl border p-5 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-white/40'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Agent Builder header */}
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-elastic-teal/20' : 'bg-elastic-blue/10'}`}>
                        <FontAwesomeIcon icon={faGear} className={`text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>Agent Builder</div>
                        <div className={`text-xs ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>Agentic AI Configuration</div>
                      </div>
                    </div>

                    {/* Connected Knowledge Bases */}
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                        Connected Knowledge Bases
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        {knowledgeBases.map((kb, i) => (
                          <motion.div
                            key={kb.name}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                              kbHighlight.includes(i)
                                ? isDark
                                  ? 'bg-elastic-teal/20 border border-elastic-teal/30'
                                  : 'bg-elastic-blue/10 border border-elastic-blue/30'
                                : isDark
                                  ? 'bg-white/[0.03] border border-white/5'
                                  : 'bg-white/50 border border-elastic-dev-blue/5'
                            }`}
                            animate={kbHighlight.includes(i) ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <FontAwesomeIcon icon={kb.icon} className={`text-sm ${
                              kbHighlight.includes(i)
                                ? isDark ? 'text-elastic-teal' : 'text-elastic-blue'
                                : isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'
                            }`} />
                            <div className="flex-1">
                              <div className={kbHighlight.includes(i) ? (isDark ? 'text-white/80' : 'text-elastic-dark-ink/80') : (isDark ? 'text-white/50' : 'text-elastic-dev-blue/50')}>
                                {kb.name}
                              </div>
                              <div className={`text-xs ${isDark ? 'text-white/25' : 'text-elastic-dev-blue/25'}`}>{kb.items}</div>
                            </div>
                            {kbHighlight.includes(i) && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 rounded-full bg-green-400"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Remediation Steps */}
                    <div className="flex-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                        Remediation Steps
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        {remediationSteps.map((step, i) => (
                          <AnimatePresence key={step}>
                            {i < visibleSteps && (
                              <motion.div
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-white/[0.03] text-white/50' : 'bg-white/50 text-elastic-dev-blue/50'}`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <FontAwesomeIcon icon={faCheck} className={`text-xs ${isDark ? 'text-elastic-teal/60' : 'text-elastic-blue/60'}`} />
                                {step}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ))}
                        {visibleSteps === 0 && huntingStarted === false && (
                          <p className={`text-xs italic ${isDark ? 'text-white/20' : 'text-elastic-dev-blue/20'}`}>
                            Steps will appear during investigation...
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}


            {/* ═══════════════════════════════════════════════════════ */}
            {/* STAGE 3: Automated Workflows                          */}
            {/* ═══════════════════════════════════════════════════════ */}
            {stage === 2 && (
              <motion.div
                key="workflows"
                className="absolute inset-0 p-8 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Phase label */}
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faBolt} className={`text-base ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                    Automated Response Workflows
                  </span>
                </div>

                {/* Main layout: Host card + Workflow + Terminal */}
                <div className="flex-1 flex gap-4 overflow-hidden">

                  {/* Left column: Host details card */}
                  <div className={`w-[240px] flex-shrink-0 rounded-xl border p-4 flex flex-col ${
                    workflowPhase !== 'idle'
                      ? isDark ? 'border-elastic-pink/30 bg-elastic-pink/5' : 'border-elastic-pink/20 bg-elastic-pink/[0.03]'
                      : isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <FontAwesomeIcon icon={faServer} className={`text-base ${
                        workflowPhase !== 'idle' ? 'text-elastic-pink' : isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'
                      }`} />
                      <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                        Target Host
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      {[
                        { label: 'Hostname', value: 'WS-PC-0142' },
                        { label: 'IP Address', value: '10.0.3.22' },
                        { label: 'OS', value: 'Windows 11 Pro' },
                        { label: 'User', value: 'j.martinez' },
                        { label: 'Agent', value: 'v8.15.1' },
                      ].map(item => (
                        <div key={item.label}>
                          <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>{item.label}</div>
                          <div className={`text-sm font-mono ${isDark ? 'text-white/60' : 'text-elastic-dark-ink/60'}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Risk score gauge */}
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(16,28,63,0.1)' }}>
                      <div className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>Threat Score</div>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-elastic-dev-blue/10'}`}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #FEC514, #FF957D, #F04E98)' }}
                            initial={{ width: '0%' }}
                            animate={{ width: workflowPhase !== 'idle' ? '87%' : '0%' }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                          />
                        </div>
                        {workflowPhase !== 'idle' && (
                          <motion.span
                            className="text-sm font-bold text-elastic-pink"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            87
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center column: Workflow pipeline + Terminal */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Workflow steps */}
                    <div className="flex items-center gap-3">
                      {/* Step 1: Trigger */}
                      <motion.div
                        className={`flex-1 rounded-lg border px-3 py-2.5 flex items-center gap-2 transition-all ${
                          workflowPhase !== 'idle'
                            ? isDark ? 'border-elastic-pink/40 bg-elastic-pink/10' : 'border-elastic-pink/30 bg-elastic-pink/5'
                            : isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/50'
                        }`}
                        animate={workflowPhase === 'triggered' ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <FontAwesomeIcon icon={faTriangleExclamation} className={`text-sm ${
                          workflowPhase !== 'idle' ? 'text-elastic-pink' : isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'
                        }`} />
                        <div>
                          <div className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>Threat Detected</div>
                          <div className={`text-xs ${isDark ? 'text-white/35' : 'text-elastic-dev-blue/35'}`}>Isolate Host WS-PC-0142</div>
                        </div>
                      </motion.div>

                      {/* Arrow */}
                      <div className="relative w-8 flex items-center justify-center">
                        <div className={`h-px w-full ${isDark ? 'bg-white/20' : 'bg-elastic-dev-blue/20'}`} />
                        {workflowPhase === 'triggered' && (
                          <motion.div
                            className="absolute w-3 h-3 rounded-full bg-elastic-pink"
                            initial={{ left: 0 }}
                            animate={{ left: '100%' }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{ boxShadow: '0 0 10px rgba(240,78,152,0.6)' }}
                          />
                        )}
                      </div>

                      {/* Step 2: Approval */}
                      <motion.div
                        className={`flex-[1.2] rounded-lg border px-3 py-2.5 flex items-center gap-2 transition-all ${
                          workflowPhase === 'pending'
                            ? isDark ? 'border-elastic-yellow/40 bg-elastic-yellow/10' : 'border-elastic-yellow/30 bg-elastic-yellow/5'
                            : ['approved', 'executing', 'done', 'notifying'].includes(workflowPhase)
                              ? isDark ? 'border-elastic-teal/40 bg-elastic-teal/10' : 'border-elastic-teal/30 bg-elastic-teal/5'
                              : workflowPhase === 'denied'
                                ? isDark ? 'border-elastic-pink/40 bg-elastic-pink/10' : 'border-elastic-pink/30 bg-elastic-pink/5'
                                : isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/50'
                        }`}
                        animate={workflowPhase === 'pending' ? {
                          boxShadow: ['0 0 0px rgba(254,197,20,0)', '0 0 14px rgba(254,197,20,0.2)', '0 0 0px rgba(254,197,20,0)']
                        } : {}}
                        transition={{ duration: 2, repeat: workflowPhase === 'pending' ? Infinity : 0 }}
                      >
                        <FontAwesomeIcon icon={faUser} className={`text-sm ${
                          workflowPhase === 'pending' ? 'text-elastic-yellow'
                            : ['approved', 'executing', 'done', 'notifying'].includes(workflowPhase) ? 'text-elastic-teal'
                              : workflowPhase === 'denied' ? 'text-elastic-pink'
                                : isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'
                        }`} />
                        <div className="flex-1">
                          <div className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>Analyst Approval</div>
                          <div className={`text-xs ${isDark ? 'text-white/35' : 'text-elastic-dev-blue/35'}`}>SOC Analyst: J. Mitchell</div>
                        </div>
                        {/* Inline approve/deny */}
                        <AnimatePresence>
                          {workflowPhase === 'pending' && (
                            <motion.div
                              className="flex gap-1.5"
                              initial={{ opacity: 0, x: 5 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -5 }}
                            >
                              <motion.button
                                onClick={approveWorkflow}
                                className="px-3 py-1.5 rounded text-xs font-semibold bg-elastic-teal/20 text-elastic-teal hover:bg-elastic-teal/30 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />Approve
                              </motion.button>
                              <motion.button
                                onClick={denyWorkflow}
                                className="px-3 py-1.5 rounded text-xs font-semibold bg-elastic-pink/20 text-elastic-pink hover:bg-elastic-pink/30 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FontAwesomeIcon icon={faCircleXmark} className="mr-1" />Deny
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {['approved', 'executing', 'done', 'notifying'].includes(workflowPhase) && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-elastic-teal text-sm">
                            <FontAwesomeIcon icon={faCircleCheck} />
                          </motion.span>
                        )}
                        {workflowPhase === 'denied' && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-elastic-pink text-sm">
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </motion.span>
                        )}
                      </motion.div>

                      {/* Arrow */}
                      <div className="relative w-8 flex items-center justify-center">
                        <div className={`h-px w-full ${isDark ? 'bg-white/20' : 'bg-elastic-dev-blue/20'}`} />
                        {workflowPhase === 'approved' && (
                          <motion.div
                            className="absolute w-3 h-3 rounded-full bg-elastic-teal"
                            initial={{ left: 0 }}
                            animate={{ left: '100%' }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{ boxShadow: '0 0 10px rgba(72,239,207,0.6)' }}
                          />
                        )}
                      </div>

                      {/* Step 3: Execute */}
                      <motion.div
                        className={`flex-1 rounded-lg border px-3 py-2.5 flex items-center gap-2 transition-all ${
                          ['executing', 'done', 'notifying'].includes(workflowPhase)
                            ? isDark ? 'border-elastic-teal/40 bg-elastic-teal/10' : 'border-elastic-teal/30 bg-elastic-teal/5'
                            : workflowPhase === 'denied'
                              ? isDark ? 'border-elastic-pink/20 bg-elastic-pink/5' : 'border-elastic-pink/10 bg-elastic-pink/[0.02]'
                              : isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/50'
                        }`}
                      >
                        <FontAwesomeIcon icon={
                          ['done', 'notifying'].includes(workflowPhase) ? faCircleCheck
                            : workflowPhase === 'denied' ? faCircleXmark
                              : faLock
                        } className={`text-sm ${
                          ['done', 'notifying'].includes(workflowPhase) ? 'text-elastic-teal'
                            : workflowPhase === 'executing' ? 'text-elastic-teal'
                              : workflowPhase === 'denied' ? 'text-elastic-pink/50'
                                : isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'
                        }`} />
                        <div>
                          <div className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
                            {workflowPhase === 'denied' ? 'Blocked' : ['done', 'notifying'].includes(workflowPhase) ? 'Isolated' : 'Execute'}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-white/35' : 'text-elastic-dev-blue/35'}`}>
                            {workflowPhase === 'denied' ? 'Analyst override' : ['done', 'notifying'].includes(workflowPhase) ? 'WS-PC-0142 quarantined' : 'Response action'}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Terminal output */}
                    <div className={`flex-1 rounded-xl border overflow-hidden flex flex-col ${isDark ? 'border-white/10 bg-[#0d1117]' : 'border-elastic-dev-blue/15 bg-[#1a1b26]'}`}>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/5">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-red-500/60" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                          <span className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-xs text-white/30 font-mono">elastic-response-workflow</span>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed">
                        {terminalLines.length === 0 && workflowPhase === 'idle' && (
                          <span className="text-white/20">Waiting for workflow trigger...</span>
                        )}
                        {terminalLines.length === 0 && !['idle', 'executing', 'done', 'notifying'].includes(workflowPhase) && workflowPhase !== 'denied' && (
                          <span className="text-white/20">Awaiting approval to execute...</span>
                        )}
                        {workflowPhase === 'denied' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span className="text-elastic-pink">$ workflow halted — analyst denied action</span>
                            <br />
                            <span className="text-white/30">[INFO] Manual investigation required</span>
                          </motion.div>
                        )}
                        {terminalLines.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className={
                              line.startsWith('$') ? 'text-elastic-teal'
                                : line.startsWith('[OK]') ? 'text-green-400'
                                  : line.startsWith('[EXEC]') ? 'text-elastic-yellow'
                                    : 'text-white/50'
                            }
                          >
                            {line}
                          </motion.div>
                        ))}
                        {workflowPhase === 'executing' && (
                          <motion.span
                            className="inline-block w-2.5 h-4 bg-elastic-teal/60 ml-0.5"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Notification fan-out bar */}
                    <AnimatePresence>
                      {workflowPhase === 'notifying' && (
                        <motion.div
                          className={`flex items-center justify-between px-4 py-3 rounded-xl flex-shrink-0 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.03]'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                            Team notified automatically
                          </span>
                          <div className="flex items-center gap-3">
                            {/* Slack */}
                            {visibleNotifications >= 1 && (
                              <motion.span
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/[0.06] text-white/60' : 'bg-white/70 text-elastic-dark-ink/60'}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                                </svg>
                                Slack
                              </motion.span>
                            )}
                            {/* Email */}
                            {visibleNotifications >= 2 && (
                              <motion.span
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/[0.06] text-white/60' : 'bg-white/70 text-elastic-dark-ink/60'}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#48EFCF"/>
                                </svg>
                                Email
                              </motion.span>
                            )}
                            {/* SIEM Log */}
                            {visibleNotifications >= 3 && (
                              <motion.span
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/[0.06] text-white/60' : 'bg-white/70 text-elastic-dark-ink/60'}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <FontAwesomeIcon icon={faShieldHalved} className="text-xs text-elastic-blue" />
                                SIEM Logged
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Right Panel: Workflow Library ─────────────── */}
                  <div className={`w-[280px] flex-shrink-0 rounded-2xl border p-4 flex flex-col gap-2 overflow-y-auto ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-white/40'}`}>
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Workflow Library
                    </div>
                    {availableWorkflows.map((wf) => {
                      const isActive = wf.active
                      const isExecuting = isActive && workflowPhase === 'executing'
                      const isDone = isActive && ['done', 'notifying'].includes(workflowPhase)
                      const isDeniedActive = isActive && workflowPhase === 'denied'
                      const badge = workflowTypeBadgeColor[wf.type] || { bg: 'bg-white/10', text: 'text-white/50' }

                      return (
                        <motion.div
                          key={wf.id}
                          className={`relative rounded-xl border px-3 py-2.5 transition-all overflow-hidden ${
                            isDeniedActive
                              ? isDark ? 'border-elastic-pink/40 bg-elastic-pink/10' : 'border-elastic-pink/30 bg-elastic-pink/5'
                              : isDone
                                ? isDark ? 'border-elastic-teal/40 bg-elastic-teal/10' : 'border-elastic-teal/30 bg-elastic-teal/5'
                                : isExecuting
                                  ? isDark ? 'border-elastic-teal/30 bg-elastic-teal/5' : 'border-elastic-teal/20 bg-elastic-teal/[0.03]'
                                  : isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-elastic-dev-blue/[0.06] bg-white/30'
                          }`}
                          animate={isExecuting ? { boxShadow: ['0 0 0px rgba(72,239,207,0)', '0 0 12px rgba(72,239,207,0.3)', '0 0 0px rgba(72,239,207,0)'] } : {}}
                          transition={isExecuting ? { duration: 1.5, repeat: Infinity } : {}}
                        >
                          <div className="flex items-start gap-2.5">
                            <FontAwesomeIcon
                              icon={isDone ? faCircleCheck : isDeniedActive ? faCircleXmark : wf.icon}
                              className={`text-sm mt-0.5 ${
                                isDone ? 'text-elastic-teal' : isDeniedActive ? 'text-elastic-pink' : isExecuting ? 'text-elastic-teal' : isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'
                              }`}
                              style={!isDone && !isDeniedActive && !isExecuting ? { color: wf.color + '60' } : undefined}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold truncate ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                                  {wf.name}
                                </span>
                                {isDone && (
                                  <span className="text-[10px] font-semibold text-elastic-teal bg-elastic-teal/10 px-1.5 py-0.5 rounded">Done</span>
                                )}
                                {isDeniedActive && (
                                  <span className="text-[10px] font-semibold text-elastic-pink bg-elastic-pink/10 px-1.5 py-0.5 rounded">Blocked</span>
                                )}
                              </div>
                              <div className={`text-[10px] leading-snug mt-0.5 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                                {wf.description}
                              </div>
                              <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                                {wf.type}
                              </span>
                            </div>
                          </div>
                          {/* Progress bar for executing workflow */}
                          {isExecuting && (
                            <motion.div
                              className="absolute bottom-0 left-0 h-0.5 bg-elastic-teal/60"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2, ease: 'linear' }}
                            />
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                </div>

                {/* Idle state hint */}
                {workflowPhase === 'idle' && (
                  <motion.div
                    className={`text-center mt-3 text-sm ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Automated response workflow starting...
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Bottom Bar: Pause / Play ──────────────────────────────── */}
        <div className="flex items-center justify-center mt-3">
          <button
            onClick={togglePlayback}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white/80'
                : 'bg-elastic-dev-blue/[0.06] hover:bg-elastic-dev-blue/10 text-elastic-dev-blue/50 hover:text-elastic-dev-blue/80'
            }`}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-xs" />
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default SecurityScene
