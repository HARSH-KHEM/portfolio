'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiGreensock, SiThreedotjs, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiRedis, SiGit, SiDocker,
  SiPython, SiScikitlearn, SiPandas, SiNumpy,
  SiN8N, SiJupyter, SiGithub,
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
const TEXT_MUTED = '#7e5baa'

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
  { label: 'PORTFOLIO', heading: 'Harsh Khem', sub: 'Creative Developer & Motion Engineer', position: 'top-left' },
  { label: 'SKILLS', heading: 'Frontend · Motion', sub: 'React · Next.js · GSAP · Canvas · Three.js', position: 'top-right' },
  { label: 'WORK', heading: 'Selected Projects', sub: 'Building things that move — hover to explore ↗', position: 'bottom-left' },
  { label: 'CONTACT', heading: "Let's Build Together", sub: 'contact', position: 'bottom-right' },
]

const SOCIALS = [
  { href: 'https://github.com/HARSH-KHEM', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/harshkhem08', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://x.com/harshkh0805', label: 'X', icon: 'x' },
  { href: 'https://leetcode.com/u/harshkh08/', label: 'LeetCode', icon: 'leetcode' },
]

interface Project {
  number: string
  name: string
  description: string
  tags: string[]
  liveLink: string | null
  githubLink: string | null
  badge?: string
}

const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'DDoS Attack Classifier',
    description: 'Authenticates and classifies network traffic as legitimate or DDoS attack in real time using machine learning.',
    tags: ['Python', 'Machine Learning', 'Scikit-learn', 'Network Security'],
    liveLink: 'https://hackarsh08-ddos-detection.hf.space/',
    githubLink: 'https://github.com/HARSH-KHEM/ddos-detection',
  },
  {
    number: '02',
    name: 'Coming Soon',
    description: 'Next project in progress.',
    tags: ['TBD'],
    liveLink: null,
    githubLink: null,
    badge: 'In Progress',
  },
  {
    number: '03',
    name: 'Coming Soon',
    description: 'Next project in progress.',
    tags: ['TBD'],
    liveLink: null,
    githubLink: null,
    badge: 'In Progress',
  },
]

interface SkillItem { icon: IconType; name: string }

const SKILL_ROWS: SkillItem[][] = [
  [
    { icon: SiReact, name: 'React' },
    { icon: SiNextdotjs, name: 'Next.js' },
    { icon: SiTypescript, name: 'TypeScript' },
    { icon: SiTailwindcss, name: 'Tailwind' },
    { icon: SiGreensock, name: 'GSAP' },
    { icon: SiThreedotjs, name: 'Three.js' },
    { icon: SiFramer, name: 'Framer' },
  ],
  [
    { icon: SiNodedotjs, name: 'Node.js' },
    { icon: SiExpress, name: 'Express' },
    { icon: SiMongodb, name: 'MongoDB' },
    { icon: SiPostgresql, name: 'Postgres' },
    { icon: SiRedis, name: 'Redis' },
    { icon: SiGit, name: 'Git' },
    { icon: SiDocker, name: 'Docker' },
  ],
  [
    { icon: SiPython, name: 'Python' },
    { icon: SiScikitlearn, name: 'Scikit' },
    { icon: SiPandas, name: 'Pandas' },
    { icon: SiNumpy, name: 'NumPy' },
    { icon: SiN8N, name: 'n8n' },
    { icon: SiJupyter, name: 'Jupyter' },
    { icon: SiGithub, name: 'GitHub' },
  ],
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
/*  LeetCode types                                                     */
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
  const isMobile = mounted && windowWidth < 640
  const isTablet = mounted && windowWidth >= 640 && windowWidth < 1024

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
    [0, 0.38, 0.41, 0.47, 0.50, 0.51, 0.53, 0.59, 0.62, 0.63, 0.73, 0.76, 0.85, 0.88, 1],
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
      if (v < 0.25) {
        setMomentIndex(0); setShowMoment(true)
      } else if (v < 0.40) {
        setMomentIndex(1); setShowMoment(true)
      } else if (v < 0.50) {
        setShowMoment(false) /* skills */
      } else if (v < 0.62) {
        setShowMoment(false) /* leetcode */
      } else if (v < 0.75) {
        setMomentIndex(2); setShowMoment(true)
      } else if (v < 0.88) {
        setShowMoment(false) /* projects */
      } else {
        setMomentIndex(3); setShowMoment(true)
      }

      /* Overlay content visibility */
      setShowSkills(v >= 0.39 && v < 0.51)
      setShowLeetcode(v >= 0.49 && v < 0.63)
      setShowProjects(v >= 0.74 && v < 0.89)
      setShowBio(v < 0.12)

      /* Scroll hint + hero UI */
      if (v > 0.05) setScrolled(true)
      setHideHeroUI(v > 0.30)
    })
    return unsub
  }, [scrollYProgress])

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
        'top-left': 'bottom-20 left-4 right-4 text-center items-center',
        'top-right': 'bottom-20 left-4 right-4 text-center items-center',
        'bottom-left': 'bottom-20 left-4 right-4 text-center items-center',
        'bottom-right': 'bottom-20 left-4 right-4 text-center items-center',
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

  /* Flat skill index for stagger */
  let skillFlatIdx = 0

  /* LeetCode card shared base styles */
  const lcCardBase = {
    background: 'rgba(10,10,10,0.6)',
    border: '0.5px solid rgba(192,132,252,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 4,
    padding: 32,
    boxShadow: '0 0 40px rgba(192,132,252,0.08), 0 0 80px rgba(192,132,252,0.04), inset 0 0 40px rgba(0,0,0,0.4)',
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
                style={{ color: TEXT_MUTED, letterSpacing: '0.3em', fontSize: isMobile ? 9 : 10 }}
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
                    : { color: TEXT_BRIGHT }),
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
                  <div className="flex flex-col gap-3 mt-1">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7e5baa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a
                        href="mailto:hackarsh08@gmail.com"
                        className="text-sm no-underline transition-colors duration-300"
                        style={{ color: TEXT_MID }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MID }}
                      >
                        hackarsh08@gmail.com
                      </a>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7e5baa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a
                        href="tel:+919315839562"
                        className="text-sm no-underline transition-colors duration-300"
                        style={{ color: TEXT_MID }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MID }}
                      >
                        +91 93158 39562
                      </a>
                    </div>
                  </div>
                ) : moment.sub}
              </motion.div>

              {/* Accent line */}
              <motion.div
                className="w-10 h-px mt-4"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT_PRIMARY}, ${ACCENT_SECONDARY})`,
                  marginLeft: isMobile ? 'auto' : moment.position.includes('right') ? 'auto' : 0,
                  marginRight: isMobile ? 'auto' : undefined,
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
            <span className="text-[10px] tracking-widest font-mono" style={{ color: '#3a1d5c' }}>
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
                  <span style={{ fontSize: isMobile ? 8 : 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)' }}>Available for opportunities</span>
                </div>
              </motion.div>

              {/* Bio — word-by-word reveal */}
              <div className="flex flex-wrap justify-center mb-8 mx-auto" style={{ gap: '0 12px', maxWidth: 560, fontSize: isMobile ? 'clamp(14px, 4vw, 18px)' : isTablet ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(18px, 2.4vw, 24px)', lineHeight: 1.9 }}>
                {[
                  { text: 'B.Tech', h: false }, { text: 'SE', h: false }, { text: 'student', h: false },
                  { text: 'at', h: false }, { text: 'Delhi', h: false }, { text: 'Technological', h: false },
                  { text: 'University.', h: false }, { text: 'I', h: false }, { text: 'build', h: false },
                  { text: 'full', h: false }, { text: 'stack', h: false }, { text: 'products,', h: false },
                  { text: 'obsess', h: false }, { text: 'over', h: false },
                  { text: 'motion', h: false }, { text: 'and', h: false }, { text: 'UI,', h: false },
                  { text: 'and', h: false }, { text: 'write', h: false }, { text: 'code', h: false },
                  { text: 'the', h: false }, { text: 'way', h: false }, { text: 'others', h: false },
                  { text: 'listen', h: false }, { text: 'to', h: false }, { text: 'music', h: false },
                  { text: '—', h: false },
                  { text: 'on', h: true }, { text: 'repeat', h: true }, { text: 'until', h: true },
                  { text: "it's", h: true }, { text: 'right.', h: true },
                ].map((w, i) => (
                  <motion.span
                    key={i}
                    style={{
                      color: w.h ? '#e879f9' : '#ffffff',
                      fontWeight: w.h ? 600 : 400,
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
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
                style={{ gap: isMobile ? 4 : 8 }}
                initial={{ opacity: 0, y: 16, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.85 }}
              >
                {['DTU', 'Delhi', 'Open to Work', 'Full Stack', 'Motion Dev'].map((tag) => (
                  <span
                    key={tag}
                    className="tracking-widest uppercase"
                    style={{ color: '#ffffff', border: '0.5px solid rgba(255,255,255,0.25)', borderRadius: 3, padding: isMobile ? '3px 8px' : '4px 12px', background: 'rgba(255,255,255,0.04)', fontSize: isMobile ? 8 : 9 }}
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
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>scroll to explore</span>
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
                </div>
                <motion.div
                  className="text-center mt-2"
                  style={{ color: '#e879f9', fontSize: 12 }}
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
              className="fixed inset-0 z-[25] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                {/* Label */}
                <motion.span
                  className="uppercase mb-10 text-[10px]"
                  style={{ color: TEXT_MUTED, letterSpacing: '0.3em' }}
                  initial={{ opacity: 0, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6 }}
                >
                  SKILLS
                </motion.span>

                {/* Icon rows */}
                <div className="flex flex-col items-center" style={{ gap: isMobile ? 8 : isTablet ? 12 : 24 }}>
                  {SKILL_ROWS.map((row, rowIdx) => {
                    if (isMobile && rowIdx === 2) return null
                    return (
                    <div key={rowIdx} className="flex justify-center" style={{ gap: isMobile ? 8 : isTablet ? 12 : 24 }}>
                      {row.map((skill) => {
                        const flatI = skillFlatIdx++
                        return (
                          <motion.div
                            key={skill.name}
                            className="flex flex-col items-center group"
                            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.6, delay: 0.04 * flatI, ease: 'easeOut' }}
                          >
                            <div
                              className="skill-card flex items-center justify-center cursor-default"
                              style={{
                                width: isMobile ? 44 : isTablet ? 48 : 52,
                                height: isMobile ? 44 : isTablet ? 48 : 52,
                                background: 'rgba(192,132,252,0.06)',
                                border: '0.5px solid rgba(192,132,252,0.2)',
                                borderRadius: 6,
                                transition: 'all 0.4s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(192,132,252,0.12)'
                                e.currentTarget.style.borderColor = 'rgba(192,132,252,0.6)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(192,132,252,0.25), 0 0 40px rgba(192,132,252,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                                const svg = e.currentTarget.querySelector('svg')
                                if (svg) {
                                  svg.style.color = ACCENT_SECONDARY
                                  svg.style.filter = `drop-shadow(0 0 6px ${ACCENT_PRIMARY})`
                                }
                                /* Label color */
                                const label = e.currentTarget.parentElement?.querySelector('.skill-label') as HTMLElement | null
                                if (label) label.style.color = TEXT_MID
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
                                const label = e.currentTarget.parentElement?.querySelector('.skill-label') as HTMLElement | null
                                if (label) label.style.color = TEXT_MUTED
                              }}
                            >
                              <skill.icon size={isMobile ? 18 : 22} style={{ color: TEXT_MID, transition: 'color 0.3s, filter 0.3s' }} />
                            </div>
                            <span
                              className="skill-label tracking-widest uppercase text-center mt-2"
                              style={{ color: TEXT_MUTED, transition: 'color 0.3s', fontSize: isMobile ? 7 : 9 }}

                            >
                              {skill.name}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  )})
                  }
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
                  width: isMobile ? '90vw' : 'min(600px, 85vw)',
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
                    <p className="text-[10px] uppercase" style={{ color: TEXT_MUTED, letterSpacing: '0.3em' }}>
                      LEETCODE
                    </p>
                    <a
                      href="https://leetcode.com/u/harshkh08/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono no-underline transition-colors duration-300"
                      style={{ color: ACCENT_PRIMARY }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = ACCENT_PRIMARY }}
                    >
                      @harshkh08
                    </a>
                  </div>

                  {/* Stats — horizontal grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: 0 }}>
                    {[
                      { label: 'Total Solved', value: lcStats?.totalSolved },
                      ...(isMobile ? [] : [{ label: 'Easy/Med/Hard', value: lcStats?.breakdown }]),
                      ...(isMobile ? [] : [{ label: 'Overall Rank', value: lcStats?.overallRank }]),
                      { label: 'Contest Rating', value: lcStats?.contestRating },
                      { label: 'Day Streak', value: lcStats ? `${lcStats.streak} 🔥` : undefined },
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
                          style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: '0.15em', textTransform: 'uppercase' }}
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

                  <p className="text-[10px] uppercase mb-4" style={{ color: TEXT_MUTED, letterSpacing: '0.3em' }}>
                    ACTIVITY
                  </p>

                  {/* Month labels row */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 26 : 53}, 1fr)`, gap: isMobile ? 2 : 3, marginBottom: 4 }}>
                    {Array.from({ length: isMobile ? 26 : 53 }, (_, col) => {
                      const actualCol = isMobile ? col + 27 : col
                      const match = heatmapMonths.find(m => m.col === actualCol)
                      return (
                        <div key={col} style={{ fontSize: 7, color: '#3a1d5c', letterSpacing: '0.05em', lineHeight: '10px' }}>
                          {match ? match.label : ''}
                        </div>
                      )
                    })}
                  </div>

                  {/* Heatmap grid: 53 cols × 7 rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 26 : 53}, 1fr)`, gridAutoRows: 'auto', gap: isMobile ? 2 : 3, width: '100%' }}>
                    {/* CSS grid fills column-first, but we need col-major order:
                        col0row0, col1row0, ... col52row0, col0row1, ... */}
                    {Array.from({ length: 7 }, (_, row) =>
                      Array.from({ length: isMobile ? 26 : 53 }, (_, col) => {
                        const actualCol = isMobile ? col + 27 : col
                        const val = heatmapDays[actualCol * 7 + row] ?? 0
                        let bg = '#111111'
                        let border = '1px solid #1a1a1a'
                        let shadow = 'none'
                        if (val >= 1 && val <= 2) { bg = '#3b0764'; border = 'none' }
                        else if (val >= 3 && val <= 5) { bg = ACCENT_DIM; border = 'none'; shadow = '0 0 4px rgba(124,58,237,0.6)' }
                        else if (val >= 6 && val <= 9) { bg = ACCENT_PRIMARY; border = 'none'; shadow = '0 0 6px rgba(192,132,252,0.7)' }
                        else if (val >= 10) { bg = ACCENT_SECONDARY; border = 'none'; shadow = '0 0 8px rgba(244,114,182,0.8)' }
                        return (
                          <div
                            key={`${col}-${row}`}
                            style={{
                              aspectRatio: '1',
                              borderRadius: 2,
                              background: bg,
                              border: val === 0 ? border : 'none',
                              boxShadow: shadow,
                            }}
                          />
                        )
                      })
                    ).flat()}
                  </div>

                  {/* Footer */}
                  <p className="text-center mt-3" style={{ fontSize: 9, color: '#3a1d5c', letterSpacing: '0.15em' }}>
                    {lcStats
                      ? `${lcStats.totalActiveDays} active days · ${lcStats.streak} day streak`
                      : 'Loading activity...'}
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
              className="fixed inset-0 z-[25] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex" style={{ gap: isMobile ? 0 : isTablet ? 12 : 32, ...(isTablet ? { overflowX: 'auto', maxWidth: '95vw', scrollbarWidth: 'none' } : {}), justifyContent: 'center' }}>
                {PROJECTS.filter((_, idx) => isMobile ? idx === 0 : true).map((project, index) => (
                  <motion.div
                    key={project.number}
                    className="relative"
                    initial={{ opacity: 0, y: 32, filter: 'blur(16px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.15 }}
                    style={{
                      width: isMobile ? '85vw' : isTablet ? 260 : 340,
                      background: 'rgba(10,10,10,0.6)',
                      border: '0.5px solid rgba(192,132,252,0.12)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderRadius: 4,
                      padding: isMobile ? 20 : 32,
                      flexShrink: 0,
                    }}
                  >
                    {/* Badge */}
                    {project.badge && (
                      <span
                        className="absolute top-4 right-4 text-[9px] rounded-full px-3 py-1"
                        style={{
                          color: TEXT_MUTED,
                          border: '1px solid rgba(192,132,252,0.2)',
                        }}
                      >
                        {project.badge}
                      </span>
                    )}

                    {/* Number */}
                    <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
                      PROJECT {project.number}
                    </p>

                    {/* Name */}
                    <h3 className="text-lg font-medium mb-3" style={{ color: TEXT_BRIGHT }}>
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed mb-5"
                      style={{
                        color: TEXT_MUTED,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] rounded-sm px-2 py-1 tracking-widest uppercase cursor-default transition-all duration-300"
                          style={{
                            color: TEXT_MID,
                            border: '1px solid rgba(192,132,252,0.2)',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(192,132,252,0.5)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(192,132,252,0.2)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    {(project.liveLink || project.githubLink) && (
                      <div className="flex items-center gap-2">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] tracking-widest uppercase no-underline transition-colors duration-300"
                            style={{ color: ACCENT_PRIMARY }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_SECONDARY }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = ACCENT_PRIMARY }}
                          >
                            <ExternalLinkSvg />
                            LIVE DEMO
                          </a>
                        )}
                        {project.liveLink && project.githubLink && (
                          <div className="w-px h-3 mx-2" style={{ background: 'rgba(192,132,252,0.2)' }} />
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] tracking-widest uppercase no-underline transition-colors duration-300"
                            style={{ color: TEXT_MUTED }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT_PRIMARY }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MUTED }}
                          >
                            <GithubSvg />
                            SOURCE
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
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
