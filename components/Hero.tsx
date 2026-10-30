'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiGreensock, SiThreedotjs, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiGit, SiDocker,
  SiPython, SiScikitlearn, SiPandas, SiNumpy,
  SiJupyter,
  SiC, SiCplusplus, SiLinux,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

/* ------------------------------------------------------------------ */
/*  Color Theme                                                        */
/* ------------------------------------------------------------------ */
const ACCENT_PRIMARY = '#c084fc'
const ACCENT_SECONDARY = '#f472b6'
const ACCENT_DIM = '#7c3aed'
const TEXT_BRIGHT = '#faf5ff'
const TEXT_MID = '#d8b4fe'
const TEXT_MUTED = '#a78bfa'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const TOTAL_FRAMES = 96

interface MomentData {
  label: string
  heading: string
  sub: string
  position: string
  isEmail?: boolean
}

const MOMENTS: MomentData[] = [
  { label: 'PORTFOLIO', heading: 'Harsh Khem', sub: 'Systems · ML · Full-Stack Developer', position: 'top-left' },
  { label: 'WORK', heading: 'Selected Projects', sub: 'Building things that move — hover to explore ↗', position: 'bottom-left' },
  { label: 'CONTACT', heading: "Let's Build Together", sub: 'contact', position: 'bottom-right' },
]

const SOCIALS = [
  { href: 'https://github.com/HARSH-KHEM', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/harsh-khem-76b76a345/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://x.com/harshkh0805', label: 'X', icon: 'x' },
  { href: 'https://leetcode.com/u/harshkh08/', label: 'LeetCode', icon: 'leetcode' },
]

interface ProjectItem {
  title: string
  description: string
  tags: string[]
  featured?: boolean
  demoUrl?: string
  sourceUrl?: string
}

const PROJECTS: ProjectItem[] = [
  {
    title: 'XeteX-OS',
    description: 'A from-scratch custom operating system in C, with kernel architecture and virtual memory manager work.',
    tags: ['C', 'OS Dev', 'VMM', 'Kernel'],
    featured: true,
    sourceUrl: 'https://github.com/HARSH-KHEM/XeteX-OS',
  },
  {
    title: 'AquaGuard AI',
    description: 'Predictive platform that estimates drinking-water contamination risk, built for the Google Cloud Gen AI Academy APAC Hackathon.',
    tags: ['Python', 'GenAI', 'Google Cloud', 'ML'],
    // TODO: add URL (demoUrl)
    // TODO: add URL (sourceUrl)
  },
  {
    title: 'ICD (Intelligent Candidate Discovery)',
    description: 'Candidate-ranking pipeline built for the India Runs Hackathon.',
    tags: ['Python', 'ML', 'Ranking'],
    sourceUrl: 'https://github.com/HARSH-KHEM/icd',
    // TODO: add URL (demoUrl)
  },
  {
    title: 'DDoS Attack Classifier',
    description: 'Classifies network traffic as legitimate or DDoS in real time using machine learning.',
    tags: ['Python', 'scikit-learn', 'Network Security'],
    demoUrl: 'https://hackarsh08-ddos-detection.hf.space/',
    sourceUrl: 'https://github.com/HARSH-KHEM/ddos-detection',
  },
]

interface SkillItem { icon: IconType; name: string }

interface SkillGroup {
  category: string
  skills: SkillItem[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'SYSTEMS',
    skills: [
      { icon: SiC, name: 'C' },
      { icon: SiCplusplus, name: 'C++' },
      { icon: SiLinux, name: 'Linux' },
      { icon: SiGit, name: 'Git' },
      { icon: SiDocker, name: 'Docker' },
    ],
  },
  {
    category: 'ML / AI',
    skills: [
      { icon: SiPython, name: 'Python' },
      { icon: SiScikitlearn, name: 'scikit-learn' },
      { icon: SiPandas, name: 'Pandas' },
      { icon: SiNumpy, name: 'NumPy' },
      { icon: SiJupyter, name: 'Jupyter' },
    ],
  },
  {
    category: 'FULL-STACK',
    skills: [
      { icon: SiReact, name: 'React' },
      { icon: SiNextdotjs, name: 'Next.js' },
      { icon: SiTypescript, name: 'TypeScript' },
      { icon: SiNodedotjs, name: 'Node.js' },
      { icon: SiExpress, name: 'Express' },
      { icon: SiMongodb, name: 'MongoDB' },
      { icon: SiPostgresql, name: 'PostgreSQL' },
      { icon: SiTailwindcss, name: 'Tailwind' },
    ],
  },
  {
    category: 'MOTION',
    skills: [
      { icon: SiGreensock, name: 'GSAP' },
      { icon: SiThreedotjs, name: 'Three.js' },
      { icon: SiFramer, name: 'Framer Motion' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Particle type                                                      */
/* ------------------------------------------------------------------ */
interface Particle {
  x: number; y: number
  size: number; opacity: number
  color: string
  vx: number; vy: number
}

/* ------------------------------------------------------------------ */
/*  LeetCode types & Configuration                                     */
/*  To update profile info or default fallback display stats, edit     */
/*  LEETCODE_CONFIG below. Live data from /api/leetcode updates these. */
/* ------------------------------------------------------------------ */
interface LeetCodeStats {
  totalSolved: number | string
  breakdown: string
  overallRank: string
  contestRank: string
  contestRating: number | string
  streak: number
  totalActiveDays: number
  calendarRaw: string
}

interface LeetCodeDisplayConfig {
  username: string
  profileUrl: string
  defaultStats: {
    totalSolved: number | string
    breakdown: string
    overallRank: string
    contestRank: string
    contestRating: number | string
    streak: number
    totalActiveDays: number
  }
}

const LEETCODE_CONFIG: LeetCodeDisplayConfig = {
  username: 'harshkh08',
  profileUrl: 'https://leetcode.com/u/harshkh08/',
  defaultStats: {
    totalSolved: '—',
    breakdown: '— / — / —',
    overallRank: '—',
    contestRank: '—',
    contestRating: '—',
    streak: 0,
    totalActiveDays: 0,
  },
}

/* ------------------------------------------------------------------ */
/*  Sweep-light CSS (injected once)                                    */
/* ------------------------------------------------------------------ */
const SKILL_CARD_CSS = `
.skill-card {
  position: relative;
  overflow: hidden;
}
.skill-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -75%;
  width: 50%;
  height: 200%;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(192,132,252,0.15) 50%,
    rgba(244,114,182,0.1) 55%,
    transparent 60%
  );
  transform: skewX(-20deg);
  transition: left 0.5s ease;
  pointer-events: none;
}
.skill-card:hover::before {
  left: 125%;
}
`

/* ------------------------------------------------------------------ */
/*  Hero Component                                                     */
/* ------------------------------------------------------------------ */
export default function Hero() {
  /* ---- Refs ---- */
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const currentRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const skillsRef = useRef<HTMLDivElement>(null)

  /* ---- State ---- */
  const [loaded, setLoaded] = useState(false)
  const [momentIndex, setMomentIndex] = useState(0)
  const [showMoment, setShowMoment] = useState(true)
  const [displayFrame, setDisplayFrame] = useState(1)
  const [scrolled, setScrolled] = useState(false)
  const [hideHeroUI, setHideHeroUI] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const [showLeetcode, setShowLeetcode] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [showBio, setShowBio] = useState(true)
  const [lcStats, setLcStats] = useState<LeetCodeStats | null>(null)

  /* ---- Responsive ---- */
  const [mounted, setMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1200)
  useEffect(() => {
    setMounted(true)
    setWindowWidth(window.innerWidth)
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const isMobile = mounted && windowWidth < 768
  const isTablet = mounted && windowWidth >= 768 && windowWidth < 1024

  /* ---- Build heatmap days from raw calendar string ---- */
  const buildHeatmapDays = (calendarRaw: string) => {
    let calendarMap: Record<string, number> = {}
    try {
      calendarMap = JSON.parse(calendarRaw)
    } catch {
      return Array(371).fill(0) as number[]
    }

    const days: number[] = []
    /* Full year 2026: Jan 1 → Dec 31 */
    const yearStart = new Date(Date.UTC(2026, 0, 1)) // Jan 1 2026
    /* Align to the Sunday on or before Jan 1 */
    const startDay = yearStart.getUTCDay() // 0=Sun..6=Sat
    const start = new Date(yearStart)
    start.setUTCDate(start.getUTCDate() - startDay)

    /* 53 columns × 7 rows = 371 squares, covering Jan–Dec 2025 */
    for (let i = 0; i < 371; i++) {
      const d = new Date(start)
      d.setUTCDate(start.getUTCDate() + i)

      const ts = Math.floor(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000
      ).toString()

      days.push(calendarMap[ts] ?? 0)
    }

    return days
  }

  const heatmapDays = useMemo(
    () => buildHeatmapDays(lcStats?.calendarRaw ?? '{}'),
    [lcStats]
  )

  /* ---- Heatmap month labels (aligned to 2026) ---- */
  const heatmapMonths = useMemo(() => {
    const yearStart = new Date(Date.UTC(2026, 0, 1))
    const startDay = yearStart.getUTCDay()
    const start = new Date(yearStart)
    start.setUTCDate(start.getUTCDate() - startDay)

    const labels: { col: number; label: string }[] = []
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let lastMonth = -1
    for (let col = 0; col < 53; col++) {
      const d = new Date(start)
      d.setUTCDate(start.getUTCDate() + col * 7)
      if (d.getUTCMonth() !== lastMonth) {
        lastMonth = d.getUTCMonth()
        labels.push({ col, label: monthNames[d.getUTCMonth()] })
      }
    }
    return labels
  }, [lcStats])

  /* ---- Scroll ---- */
  const { scrollYProgress } = useScroll({ target: containerRef })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  /* Single dark overlay — opacity driven by scroll position */
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.20, 0.23, 0.45, 0.48, 0.50, 0.53, 0.59, 0.62, 0.63, 0.73, 0.76, 0.85, 0.88, 1],
    [0, 0,    0.5,  0.5,  0,    0,    0.55, 0.55, 0,    0,    0,    0.55, 0.55, 0,    0],
  )

  /* ---- Draw frame (cover fit) ---- */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = framesRef.current[index]
    if (!img || !img.complete || !img.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }

  /* ---- Resize canvases ---- */
  const resizeCanvases = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    if (canvasRef.current) { canvasRef.current.width = w; canvasRef.current.height = h }
    if (particleCanvasRef.current) { particleCanvasRef.current.width = w; particleCanvasRef.current.height = h }
    drawFrame(Math.round(currentRef.current))
  }

  /* ---- Draw particles ---- */
  const drawParticles = () => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particlesRef.current) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      const alpha = Math.round(p.opacity * 255).toString(16).padStart(2, '0')
      ctx.fillStyle = p.color + alpha
      ctx.fill()
    }
  }

  /* ---- Preload frames + init particles ---- */
  useEffect(() => {
    /* Init particles */
    particlesRef.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random(),
      opacity: 0.2 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? ACCENT_PRIMARY : ACCENT_SECONDARY,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
    }))

    /* Load frames */
    const loadFrame = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`
        img.onload = () => { framesRef.current[i - 1] = img; resolve() }
        img.onerror = () => resolve()
      })

    const init = async () => {
      const first15 = Array.from({ length: 15 }, (_, i) => loadFrame(i + 1))
      await Promise.all(first15)
      resizeCanvases()
      setLoaded(true)
      for (let i = 16; i <= TOTAL_FRAMES; i++) loadFrame(i)
    }

    init()
    window.addEventListener('resize', resizeCanvases)
    return () => window.removeEventListener('resize', resizeCanvases)
  }, [])

  /* ---- rAF loop ---- */
  useEffect(() => {
    if (!loaded) return
    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.12
      const idx = Math.min(Math.round(currentRef.current), TOTAL_FRAMES - 1)
      drawFrame(idx)
      setDisplayFrame(idx + 1)
      drawParticles()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loaded])

  /* ---- Scroll subscription ---- */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      targetRef.current = Math.floor(v * (TOTAL_FRAMES - 1))

      /* Phase detection */
      if (v < 0.22) {
        setMomentIndex(0); setShowMoment(true) /* PORTFOLIO */
      } else if (v < 0.48) {
        setShowMoment(false) /* skills */
      } else if (v < 0.63) {
        setShowMoment(false) /* leetcode */
      } else if (v < 0.74) {
        setMomentIndex(1); setShowMoment(true) /* work */
      } else if (v < 0.88) {
        setShowMoment(false) /* projects */
      } else {
        setMomentIndex(2); setShowMoment(true) /* contact */
      }

      /* Overlay content visibility */
      setShowSkills(v >= 0.22 && v < 0.47)
      setShowLeetcode(v >= 0.48 && v < 0.63)
      setShowProjects(v >= 0.74 && v < 0.89)
      setShowBio(v < 0.12)

      /* Scroll hint + hero UI */
      if (v > 0.05) setScrolled(true)
      setHideHeroUI(v > 0.20)
    })
    return unsub
  }, [scrollYProgress])

  /* ---- Subtle GSAP stagger per group when skills section is shown ---- */
  useEffect(() => {
    if (!showSkills || !skillsRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skill-group-title',
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
      )
      SKILL_GROUPS.forEach((_, gIdx) => {
        gsap.fromTo(
          `.skill-group-${gIdx} .skill-badge-item`,
          { opacity: 0, y: 10, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.035,
            ease: 'power2.out',
            delay: 0.04 + gIdx * 0.05,
          }
        )
      })
    }, skillsRef)
    return () => ctx.revert()
  }, [showSkills])

  /* ---- Fetch LeetCode stats ---- */
  useEffect(() => {
    const fetchLeetCode = async () => {
      try {
        const res = await fetch('/api/leetcode')
        const json = await res.json()

        if (json.error) {
          console.error('LeetCode API error:', json.error)
          return
        }

        const user = json.data?.matchedUser
        const contest = json.data?.userContestRanking

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const allSolved = user?.submitStats?.acSubmissionNum?.find(
          (x: any) => x.difficulty === 'All'
        )?.count ?? '—'
        const easy = user?.submitStats?.acSubmissionNum?.find(
          (x: any) => x.difficulty === 'Easy'
        )?.count ?? '—'
        const medium = user?.submitStats?.acSubmissionNum?.find(
          (x: any) => x.difficulty === 'Medium'
        )?.count ?? '—'
        const hard = user?.submitStats?.acSubmissionNum?.find(
          (x: any) => x.difficulty === 'Hard'
        )?.count ?? '—'
        /* eslint-enable @typescript-eslint/no-explicit-any */

        const formatNum = (n: number) => n.toLocaleString('en-US')

        setLcStats({
          totalSolved: allSolved,
          breakdown: `${easy} / ${medium} / ${hard}`,
          overallRank: user?.profile?.ranking ? `#${formatNum(user.profile.ranking)}` : '—',
          contestRank: contest?.globalRanking ? `#${formatNum(contest.globalRanking)}` : '—',
          contestRating: contest?.rating ? Math.round(contest.rating) : '—',
          streak: user?.userCalendar?.streak ?? 0,
          totalActiveDays: user?.userCalendar?.totalActiveDays ?? 0,
          calendarRaw: user?.userCalendar?.submissionCalendar ?? '{}',
        })
      } catch (err) {
        console.error('Fetch failed:', err)
      }
    }
    fetchLeetCode()
  }, [])

  /* ---- Position map ---- */
  const posClass: Record<string, string> = isMobile
    ? {
        'top-left': 'top-20 left-4 right-4 text-left',
        'top-right': 'top-20 left-4 right-4 text-left',
        'bottom-left': 'top-20 left-4 right-4 text-left',
        'bottom-right': 'top-20 left-4 right-4 text-left',
      }
    : isTablet
    ? {
        'top-left': 'top-20 left-6',
        'top-right': 'top-20 right-6 text-right items-end',
        'bottom-left': 'bottom-20 left-6',
        'bottom-right': 'bottom-20 right-6 text-right items-end',
      }
    : {
        'top-left': 'top-16 left-12',
        'top-right': 'top-16 right-12 text-right items-end',
        'bottom-left': 'bottom-24 left-12',
        'bottom-right': 'bottom-24 right-12 text-right items-end',
      }

  const moment = MOMENTS[momentIndex]

  /* LeetCode card shared base styles */
  const lcCardBase = {
    background: isMobile ? 'rgba(15,10,30,0.85)' : 'rgba(10,10,10,0.6)',
    border: '0.5px solid rgba(192,132,252,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 4,
    padding: 32,
    boxShadow: isMobile
      ? '0 0 40px rgba(192,132,252,0.08), 0 0 80px rgba(192,132,252,0.04)'
      : '0 0 40px rgba(192,132,252,0.08), 0 0 80px rgba(192,132,252,0.04), inset 0 0 40px rgba(0,0,0,0.4)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    minHeight: 420,
  }

  /* Gradient stat value shared styles */
  const gradientStatStyle = {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 500,
    background: `linear-gradient(135deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div ref={containerRef} style={{ height: '1000vh' }}>
      {/* Inject sweep-light CSS */}
      <style dangerouslySetInnerHTML={{ __html: SKILL_CARD_CSS }} />

      <div className="sticky top-0 h-screen w-screen overflow-hidden bg-black">

        {/* ---- Frame canvas ---- */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />

        {/* ---- Particle canvas ---- */}
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 z-[1] pointer-events-none"
        />

        {/* ---- Dark overlay ---- */}
        <motion.div
          className="fixed inset-0 z-[15] pointer-events-none"
          style={{ backgroundColor: 'black', opacity: overlayOpacity }}
        />

        {/* ---- Loading ---- */}
        {!loaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: ACCENT_PRIMARY }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>
        )}

        {/* ---- Corner vignettes ---- */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((c) => (
          <div
            key={c}
            className={`absolute z-[2] w-48 h-48 pointer-events-none
              ${c.includes('top') ? 'top-0' : 'bottom-0'}
              ${c.includes('left') ? 'left-0' : 'right-0'}`}
            style={{
              background: `radial-gradient(circle at ${c.replace('-', ' ')}, rgba(0,0,0,0.7) 0%, transparent 70%)`,
            }}
          />
        ))}

        {/* ============================================================ */}
        {/*  TOP BAR — logo only                                          */}
        {/* ============================================================ */}
        <div
          className="fixed top-0 left-0 right-0 h-16 z-30 flex items-center"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '0.5px solid rgba(192,132,252,0.15)',
            padding: isMobile ? '0 16px' : isTablet ? '0 24px' : '0 48px',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono font-medium text-sm"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HK
            </span>
            {!isMobile && (
              <span className="text-[11px] tracking-[0.2em]" style={{ color: TEXT_MUTED }}>
                harshkhem
              </span>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  TEXT MOMENTS                                                 */}
        {/* ============================================================ */}
        <AnimatePresence mode="wait">
          {showMoment && (
            <motion.div
              key={momentIndex}
              className={`fixed z-[20] flex flex-col ${posClass[moment.position]}`}
              initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Label */}
              <motion.span
                className="uppercase mb-3"
                style={{
                  color: '#d8b4fe',
                  letterSpacing: '0.3em',
                  fontSize: isMobile ? 9 : 10,
                  textShadow: '0 1px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
                }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}
              >
                {moment.label}
              </motion.span>

              {/* Heading */}
              <motion.h1
                className="font-medium leading-tight"
                style={{
                  fontSize: isMobile ? 'clamp(28px, 8vw, 40px)' : isTablet ? 'clamp(28px, 4vw, 48px)' : 'clamp(32px, 5vw, 64px)',
                  ...(momentIndex === 0
                    ? {
                        background: `linear-gradient(135deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 32px rgba(192,132,252,0.3)',
                      }
                    : {
                        color: TEXT_BRIGHT,
                        textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9)',
                      }),
                }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              >
                {moment.heading}
              </motion.h1>

              {/* Sub */}
              <motion.div
                className="mt-2 leading-relaxed"
                style={{ color: TEXT_MID, fontSize: isMobile ? 12 : 14 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                {moment.sub === 'contact' ? (
                  <div
                    className="flex flex-col gap-3.5 mt-2.5 p-4 rounded-lg"
                    style={{
                      background: 'rgba(10,5,20,0.65)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '0.5px solid rgba(192,132,252,0.2)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a
                        href="mailto:hackarsh08@gmail.com"
                        className="text-sm font-medium no-underline transition-colors duration-300"
                        style={{ color: '#faf5ff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#faf5ff' }}
                      >
                        hackarsh08@gmail.com
                      </a>
                    </div>
                    {/* LinkedIn */}
                    <div className="flex items-center gap-3">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <a
                        href="https://www.linkedin.com/in/harsh-khem-76b76a345/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium no-underline transition-colors duration-300"
                        style={{ color: '#faf5ff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#faf5ff' }}
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                ) : (
                  <span style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>{moment.sub}</span>
                )}
              </motion.div>

              {/* Accent line */}
              <motion.div
                className="w-10 h-px mt-4"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
                  marginLeft: isMobile ? 0 : moment.position.includes('right') ? 'auto' : 0,
                }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/*  SOCIAL LINKS                                                 */}
        {/* ============================================================ */}
        <div
          className="fixed z-[35] flex flex-col gap-2"
          style={{
            opacity: hideHeroUI ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: hideHeroUI ? 'none' : 'auto',
            ...(isMobile
              ? { bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }
              : { bottom: isTablet ? 24 : 80, left: isTablet ? 16 : 48 }),
          }}
        >
          <div className="flex gap-2">
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm flex items-center justify-center transition-all duration-300"
                style={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  border: '1px solid rgba(192,132,252,0.2)',
                  background: 'rgba(10,10,10,0.6)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(192,132,252,0.5)'
                  e.currentTarget.style.background = 'rgba(192,132,252,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(192,132,252,0.2)'
                  e.currentTarget.style.background = 'rgba(10,10,10,0.6)'
                }}
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.8 + i * 0.1 }}
                title={s.label}
              >
                <SocialIcon name={s.icon} />
              </motion.a>
            ))}
          </div>
          {!isMobile && (
            <span className="text-[10px] tracking-widest font-mono" style={{ color: '#c4b5fd', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              @harshkhem
            </span>
          )}
        </div>

        {/* ============================================================ */}
        {/*  FREE-FLOATING INTRO (visible at scroll < 0.12)                */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showBio && loaded && (
            <motion.div
              className="fixed z-[30]"
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', width: isMobile ? '90vw' : isTablet ? '70vw' : undefined, padding: isMobile ? '0 16px' : undefined }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Line 1 — Status pill */}
              <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              >
                <div
                  className="inline-flex items-center gap-2"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 16px' }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span style={{ fontSize: isMobile ? 8 : 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Available for opportunities</span>
                </div>
              </motion.div>

              {/* Bio — word-by-word reveal */}
              <div className="flex flex-wrap justify-center mb-8 mx-auto" style={{ gap: '0 12px', maxWidth: 560, fontSize: isMobile ? 'clamp(14px, 4vw, 18px)' : isTablet ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(18px, 2.4vw, 24px)', lineHeight: 1.9 }}>
                {[
                  { text: 'B.Tech', h: false }, { text: 'SE', h: false }, { text: 'student', h: false },
                  { text: 'at', h: false }, { text: 'Delhi', h: false }, { text: 'Technological', h: false },
                  { text: 'University.', h: false }, { text: 'I', h: false }, { text: 'build', h: false },
                  { text: 'operating', h: false }, { text: 'systems,', h: false },
                  { text: 'ML', h: false }, { text: 'pipelines', h: false }, { text: 'and', h: false },
                  { text: 'full-stack', h: false }, { text: 'products,', h: false },
                  { text: 'and', h: false }, { text: 'obsess', h: false }, { text: 'over', h: false },
                  { text: 'motion', h: false }, { text: 'and', h: false }, { text: 'UI.', h: false },
                  { text: 'I', h: false }, { text: 'write', h: false }, { text: 'code', h: false },
                  { text: 'the', h: false }, { text: 'way', h: false }, { text: 'others', h: false },
                  { text: 'listen', h: false }, { text: 'to', h: false }, { text: 'music,', h: false },
                  { text: 'on', h: true }, { text: 'repeat', h: true }, { text: 'until', h: true },
                  { text: "it's", h: true }, { text: 'right.', h: true },
                ].map((w, i) => (
                  <motion.span
                    key={i}
                    style={{
                      color: w.h ? '#e879f9' : '#ffffff',
                      fontWeight: w.h ? 600 : 400,
                      textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)',
                    }}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeOut',
                      delay: 0.8 + i * 0.04,
                    }}
                  >
                    {w.text}
                  </motion.span>
                ))}
              </div>

              {/* Line 5 — Tags */}
              <motion.div
                className="flex flex-wrap justify-center mb-9"
                style={{ gap: isMobile ? 6 : 8, maxWidth: '100%' }}
                initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.85 }}
              >
                {['DTU', 'DELHI', 'OPEN TO WORK', 'SYSTEMS', 'ML', 'FULL STACK'].map((tag) => (
                  <span
                    key={tag}
                    className="tracking-widest uppercase inline-block whitespace-nowrap"
                    style={{
                      color: '#ffffff',
                      border: '0.5px solid rgba(255,255,255,0.3)',
                      borderRadius: 3,
                      padding: isMobile ? '3px 8px' : '4px 12px',
                      background: 'rgba(255,255,255,0.08)',
                      fontSize: isMobile ? 8 : 9,
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Line 6 — Scroll hint */}
              <motion.div
                initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))' }} />
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>scroll to explore</span>
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
                </div>
                <motion.div
                  className="text-center mt-2"
                  style={{ color: '#e879f9', fontSize: 12, textShadow: '0 0 8px rgba(232,121,249,0.5)' }}
                  animate={{ y: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ↓
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/*  SKILLS OVERLAY (40%–50%)                                     */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showSkills && (
            <motion.div
              ref={skillsRef}
              className="fixed inset-0 z-[25] flex items-center justify-center pointer-events-auto"
              style={{ padding: isMobile ? '0 16px' : '0 24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="flex flex-col items-center w-full max-w-4xl"
                style={{
                  maxHeight: '88vh',
                  overflowY: 'auto',
                }}
              >
                {/* Main section label */}
                <motion.span
                  className="uppercase mb-5 text-[10px]"
                  style={{
                    color: '#d8b4fe',
                    letterSpacing: '0.3em',
                    textShadow: '0 1px 8px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
                  }}
                  initial={{ opacity: 0, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5 }}
                >
                  SKILLS
                </motion.span>

                {/* Skill Groups */}
                <div
                  className="flex flex-col items-center w-full"
                  style={{ gap: isMobile ? 14 : isTablet ? 16 : 20 }}
                >
                  {SKILL_GROUPS.map((group, groupIdx) => (
                    <div
                      key={group.category}
                      className={`skill-group-${groupIdx} flex flex-col items-center w-full`}
                    >
                      {/* Sub-label */}
                      <span
                        className="skill-group-title text-[9px] tracking-[0.25em] font-mono uppercase mb-2 text-center"
                        style={{
                          color: '#c4b5fd',
                          textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                        }}
                      >
                        {group.category}
                      </span>

                      {/* Badges */}
                      <div
                        className="flex flex-wrap justify-center items-center"
                        style={{ gap: isMobile ? 8 : isTablet ? 10 : 14 }}
                      >
                        {group.skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="skill-badge-item flex flex-col items-center group"
                          >
                            <div
                              className="skill-card flex items-center justify-center cursor-default"
                              style={{
                                width: isMobile ? 40 : isTablet ? 46 : 50,
                                height: isMobile ? 40 : isTablet ? 46 : 50,
                                background: 'rgba(192,132,252,0.06)',
                                border: '0.5px solid rgba(192,132,252,0.2)',
                                borderRadius: 6,
                                transition: 'all 0.4s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(192,132,252,0.12)'
                                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.6)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow =
                                  '0 0 20px rgba(192,132,252,0.25), 0 0 40px rgba(192,132,252,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                                const svg = e.currentTarget.querySelector('svg')
                                if (svg) {
                                  svg.style.color = ACCENT_SECONDARY
                                  svg.style.filter = `drop-shadow(0 0 6px ${ACCENT_PRIMARY})`
                                }
                                const label = e.currentTarget.parentElement?.querySelector(
                                  '.skill-label'
                                ) as HTMLElement | null
                                if (label) {
                                  label.style.color = '#ffffff'
                                  label.style.textShadow = '0 0 8px rgba(192,132,252,0.8)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(192,132,252,0.06)'
                                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.2)'
                                e.currentTarget.style.transform = 'translateY(0px)'
                                e.currentTarget.style.boxShadow = 'none'
                                const svg = e.currentTarget.querySelector('svg')
                                if (svg) {
                                  svg.style.color = TEXT_MID
                                  svg.style.filter = 'none'
                                }
                                const label = e.currentTarget.parentElement?.querySelector(
                                  '.skill-label'
                                ) as HTMLElement | null
                                if (label) {
                                  label.style.color = '#c4b5fd'
                                  label.style.textShadow = '0 1px 4px rgba(0,0,0,0.85)'
                                }
                              }}
                            >
                              <skill.icon
                                size={isMobile ? 18 : 22}
                                style={{ color: TEXT_MID, transition: 'color 0.3s, filter 0.3s' }}
                              />
                            </div>
                            <span
                              className="skill-label tracking-widest uppercase text-center mt-1.5"
                              style={{
                                color: '#c4b5fd',
                                textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                                transition: 'color 0.3s, text-shadow 0.3s',
                                fontSize: 9,
                                ...(isMobile ? { padding: '2px 6px' } : {}),
                              }}
                            >
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/*  LEETCODE OVERLAY (50%–62%)                                   */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showLeetcode && (
            <motion.div
              className="fixed inset-0 z-[30]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  width: isMobile ? 'calc(100vw - 48px)' : 'min(600px, 85vw)',
                  zIndex: 30,
                  pointerEvents: 'auto',
                }}
              >
                {/* Card 1 — Stats (horizontal row) */}
                <motion.div
                  initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  style={{
                    ...lcCardBase,
                    width: '100%',
                    padding: '28px 32px',
                    minHeight: 'auto',
                  }}
                >
                  {/* Gradient top border */}
                  <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY}, transparent)`,
                  }} />

                  {/* Header row */}
                  <div className="flex items-baseline justify-between mb-5">
                    <p className="text-[10px] uppercase" style={{ color: '#d8b4fe', letterSpacing: '0.3em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      LEETCODE
                    </p>
                    <a
                      href={LEETCODE_CONFIG.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono no-underline transition-colors duration-300"
                      style={{ color: ACCENT_PRIMARY, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = ACCENT_PRIMARY }}
                    >
                      @{LEETCODE_CONFIG.username}
                    </a>
                  </div>

                  {/* Stats — horizontal grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: 0 }}>
                    {[
                      { label: 'Total Solved', value: lcStats?.totalSolved ?? LEETCODE_CONFIG.defaultStats.totalSolved },
                      ...(isMobile ? [] : [{ label: 'Easy/Med/Hard', value: lcStats?.breakdown ?? LEETCODE_CONFIG.defaultStats.breakdown }]),
                      ...(isMobile ? [] : [{ label: 'Overall Rank', value: lcStats?.overallRank ?? LEETCODE_CONFIG.defaultStats.overallRank }]),
                      { label: 'Contest Rating', value: lcStats?.contestRating ?? LEETCODE_CONFIG.defaultStats.contestRating },
                      { label: 'Day Streak', value: lcStats ? `${lcStats.streak} 🔥` : `${LEETCODE_CONFIG.defaultStats.streak} 🔥` },
                    ].map((stat, idx) => (
                      <div
                        key={stat.label}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0 12px',
                          borderRight: idx < (isMobile ? 2 : 4) ? '0.5px solid rgba(192,132,252,0.15)' : 'none',
                        }}
                      >
                        {stat.value !== undefined ? (
                          <span style={{ ...gradientStatStyle, fontSize: '1.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {stat.value}
                          </span>
                        ) : (
                          <div className="w-10 h-6 rounded bg-[#1a1a1a] animate-pulse" />
                        )}
                        <span
                          className="text-center mt-2"
                          style={{
                            fontSize: 9,
                            color: '#c4b5fd',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                          }}
                        >
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Card 2 — Activity heatmap */}
                <motion.div
                  initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                  style={{
                    ...lcCardBase,
                    width: '100%',
                    padding: isMobile ? 16 : '28px 32px',
                    minHeight: 'auto',
                    overflow: 'hidden',
                    minWidth: 0,
                  }}
                >
                  {/* Gradient top border */}
                  <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY}, transparent)`,
                  }} />

                  <p className="text-[10px] uppercase mb-4" style={{ color: '#d8b4fe', letterSpacing: '0.3em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    ACTIVITY
                  </p>

                  {/* Month labels row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 26 : 53}, 1fr)`, gap: isMobile ? 1 : 3, marginBottom: 4 }}>
                    {Array.from({ length: isMobile ? 26 : 53 }, (_, col) => {
                      const actualCol = isMobile ? col : col
                      const match = heatmapMonths.find(m => m.col === actualCol)
                      return (
                        <div key={col} style={{ fontSize: 7, color: '#c4b5fd', letterSpacing: '0.05em', lineHeight: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                          {match ? match.label : ''}
                        </div>
                      )
                    })}
                  </div>

                  {/* Heatmap grid: 53 cols × 7 rows */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    minHeight: '80px',
                  }}>
                    {Array.from({ length: 7 }, (_, row) => {
                      const getSquareColor = (value: number) => {
                        if (value === 0) return '#3b1f6e'
                        if (value <= 2) return '#7c3aed'
                        if (value <= 4) return '#a855f7'
                        return '#e879f9'
                      }
                      return (
                        <div
                          key={row}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '2px',
                          }}
                        >
                          {Array.from({ length: isMobile ? 26 : 53 }, (_, col) => {
                            const actualCol = isMobile ? col : col
                            const val = heatmapDays[actualCol * 7 + row] ?? 0
                            return (
                              <div
                                key={`${col}-${row}`}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '2px',
                                  backgroundColor: getSquareColor(val),
                                  flexShrink: 0,
                                  opacity: 1,
                                }}
                              />
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer */}
                  <p
                    className="text-center mt-3"
                    style={{
                      fontSize: 11,
                      color: '#d8b4fe',
                      fontWeight: 500,
                      letterSpacing: '0.15em',
                      textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                    }}
                  >
                    {lcStats
                      ? `${lcStats.totalActiveDays} active days · ${lcStats.streak} day streak`
                      : `${LEETCODE_CONFIG.defaultStats.totalActiveDays} active days · ${LEETCODE_CONFIG.defaultStats.streak} day streak`}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/*  PROJECTS OVERLAY (75%–88%)                                   */}
        {/* ============================================================ */}
        <AnimatePresence>
          {showProjects && (
            <motion.div
              className="fixed inset-0 z-[25] flex items-center justify-center pointer-events-auto"
              style={{ padding: isMobile ? '0 16px' : '0 24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="w-full max-w-4xl"
                style={{
                  maxHeight: isMobile ? '82vh' : '85vh',
                  overflowY: 'auto',
                  padding: '4px',
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5 w-full items-stretch">
                  {PROJECTS.map((project, index) => (
                    <motion.div
                      key={project.title}
                      className="relative flex flex-col justify-between h-full"
                      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                      style={{
                        background: project.featured ? 'rgba(20,10,32,0.7)' : 'rgba(10,10,10,0.6)',
                        border: project.featured
                          ? '1px solid rgba(192,132,252,0.45)'
                          : '1px solid rgba(192,132,252,0.16)',
                        boxShadow: project.featured
                          ? '0 0 25px rgba(192,132,252,0.12), inset 0 0 15px rgba(192,132,252,0.04)'
                          : 'none',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: 6,
                        padding: isMobile ? 18 : 24,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(192,132,252,0.5)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow =
                          '0 0 30px rgba(192,132,252,0.2), inset 0 0 20px rgba(192,132,252,0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = project.featured
                          ? 'rgba(192,132,252,0.45)'
                          : 'rgba(192,132,252,0.16)'
                        e.currentTarget.style.transform = 'translateY(0px)'
                        e.currentTarget.style.boxShadow = project.featured
                          ? '0 0 25px rgba(192,132,252,0.12), inset 0 0 15px rgba(192,132,252,0.04)'
                          : 'none'
                      }}
                    >
                      {/* Featured Badge */}
                      {project.featured && (
                        <span
                          className="absolute top-4 right-4 text-[9px] font-mono tracking-widest uppercase rounded-full px-2.5 py-0.5"
                          style={{
                            color: ACCENT_PRIMARY,
                            background: 'rgba(192,132,252,0.12)',
                            border: '1px solid rgba(192,132,252,0.3)',
                          }}
                        >
                          FEATURED
                        </span>
                      )}

                      <div>
                        {/* Number */}
                        <p
                          className="text-[10px] font-mono tracking-widest mb-3"
                          style={{ color: project.featured ? ACCENT_PRIMARY : '#c4b5fd', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                        >
                          PROJECT 0{index + 1}
                        </p>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-medium mb-2" style={{ color: TEXT_BRIGHT }}>
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-xs sm:text-sm leading-relaxed mb-4"
                          style={{
                            color: '#e2d4f8',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] rounded-sm px-2 py-0.5 tracking-widest uppercase cursor-default transition-all duration-300"
                              style={{
                                color: '#c4b5fd',
                                border: '1px solid rgba(192,132,252,0.2)',
                                background: 'rgba(192,132,252,0.04)',
                                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.5)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.2)'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      {(project.demoUrl || project.sourceUrl) ? (
                        <div
                          className="flex items-center gap-2 pt-2 border-t border-[rgba(192,132,252,0.08)] mt-auto"
                          style={{ minHeight: 32 }}
                        >
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase no-underline transition-colors duration-300"
                              style={{ color: ACCENT_PRIMARY, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = ACCENT_SECONDARY
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = ACCENT_PRIMARY
                              }}
                            >
                              <ExternalLinkSvg />
                              LIVE DEMO
                            </a>
                          )}
                          {project.demoUrl && project.sourceUrl && (
                            <div className="w-px h-3 mx-1.5" style={{ background: 'rgba(192,132,252,0.2)' }} />
                          )}
                          {project.sourceUrl && (
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase no-underline transition-colors duration-300"
                              style={{ color: '#c4b5fd', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = ACCENT_PRIMARY
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#c4b5fd'
                              }}
                            >
                              <GithubSvg />
                              SOURCE
                            </a>
                          )}
                        </div>
                      ) : (
                        <div style={{ minHeight: 32 }} className="mt-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/*  PROGRESS BAR — bottom edge                                   */}
        {/* ============================================================ */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] z-20"
          style={{
            width: progressWidth,
            background: `linear-gradient(90deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
          }}
        />

      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Social Icon                                                        */
/* ------------------------------------------------------------------ */
function SocialIcon({ name }: { name: string }) {
  const s = { width: 16, height: 16, stroke: TEXT_MUTED, fill: 'none', strokeWidth: 1.5 } as const
  if (name === 'github') return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (name === 'linkedin') return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
  if (name === 'x') return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M4 4l16 16M4 20L20 4" strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M16 18L8 12L16 6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18V6" strokeLinecap="round"/>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Link Icons                                                         */
/* ------------------------------------------------------------------ */
function ExternalLinkSvg() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

function GithubSvg() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  )
}
