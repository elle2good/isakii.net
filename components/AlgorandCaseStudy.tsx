"use client"

import "@/app/algorand-case-study.css"

import Image from "next/image"
import CaseStudyContactActions from "./CaseStudyContactActions"
import Link from "next/link"
import { createContext, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Transition } from "motion/react"
import HomeHeader from "./HomeHeader"
import HomeFooter from "./HomeFooter"
import MenuContactActions from "./MenuContactActions"
import SmoothScroll from "./SmoothScroll"
import { clips } from "./algorand-motion"
import { assets } from "./algorand-assets"

const nav = [{ id: "context", label: "Context" }, { id: "execution", label: "Campaign execution" }, { id: "results", label: "Results" }]
const metrics = [
  ["1.5%", "token price premium in the target market on the campaign’s final day"],
  ["8", "influencer partnerships across paid and relationship-based collaborations"],
  ["21%", "21% community growth measured 12 days after campaign close"],
]
const SceneVisible = createContext(false)
function Scene({children, className = ""}: {children: ReactNode; className?: string}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, amount: .12, margin: "0px 0px -40px 0px" })
  return <div ref={ref} className={className}><SceneVisible.Provider value={visible}>{children}</SceneVisible.Provider></div>
}
function Animated({id, children, className = "", delay = 0, onComplete}: {id: string; children: ReactNode; className?: string; delay?: number; onComplete?: () => void}) {
  const visible = useContext(SceneVisible)
  const reduced = useReducedMotion()
  const clip = clips[id]
  const final = Object.fromEntries(Object.entries(clip.animate).map(([k,v]) => [k, Array.isArray(v) ? v[v.length - 1] : v]))
  const transition = Object.fromEntries(Object.entries(clip.transition).map(([k,v]) => [k, v && typeof v === "object" && !Array.isArray(v) ? {...v, delay} : v])) as Transition
  return <motion.div data-figma-node={id} className={className} onAnimationComplete={() => { if (visible) onComplete?.() }} initial={reduced ? false : clip.initial} animate={reduced ? final : visible ? clip.animate : clip.initial} transition={reduced ? {duration:0} : transition}>{children}</motion.div>
}
function Artboard({children, height, width = 523, className = ""}: {children: ReactNode; height: number; width?: number; className?: string}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(()=> {const e=ref.current;if(!e)return; const update=()=>setScale(e.clientWidth/width); const observer=new ResizeObserver(update);observer.observe(e);update();return()=>observer.disconnect()},[width])
  return <div ref={ref} className={`algo-artboard ${className}`} style={{aspectRatio:`${width}/${height}`}}><div style={{width,height,transform:`scale(${scale})`,transformOrigin:"top left"}}>{children}</div></div>
}
function Art({asset,alt}: {asset: keyof typeof assets; alt:string}) {return <Image src={assets[asset]} alt={alt} fill sizes="(max-width: 700px) 90vw, 600px" />}
function Heading({id,number,children}: {id:string;number:string;children:ReactNode}) {return <Scene><Animated id={id} className="algo-step-heading"><span>{number}</span><h3>{children}</h3></Animated></Scene>}

function TutorialVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const started = useRef(false)
  const visible = useContext(SceneVisible)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!reduced || !visible || started.current || !video.current) return
    started.current = true
    void video.current.play().catch(() => { started.current = false })
  }, [reduced, visible])
  const playAfterEntrance = () => {
    if (started.current || !video.current) return
    started.current = true
    // Muted inline playback permits autoplay without a prior user gesture.
    void video.current.play().catch(() => { started.current = false })
  }
  return <Animated id="415:307" className="algo-tutorial" onComplete={playAfterEntrance}>
    <video ref={video} data-media-pk="82bb19e0-847a-420b-a6ff-841af9c0281b" src="https://res.cloudinary.com/dwto97ayq/video/upload/f_mp4,q_auto/v1791813448/_talkv_wxouR59LkP_xN8zQM2WDPsHKYkrcjckz1_talkv_high.MP4_lhbewt.mp4" muted controls playsInline preload="metadata" aria-label="Tutorial Video"/>
  </Animated>
}

function ReportForm() {
  const [email,setEmail]=useState("")
  const [focused,setFocused]=useState(false)
  const [state,setState]=useState<"idle"|"submitting"|"success"|"error">("idle")
  const [message,setMessage]=useState("")
  const reduced=useReducedMotion()
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(state==="submitting"||state==="success")return
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {setState("error");setMessage("Please enter a valid email address.");return}
    setState("submitting");setMessage("")
    try {const response=await fetch("/api/algorand-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim()})});const data=await response.json();if(!response.ok||!data.registered)throw new Error(data.error||"Please try again.");setState("success")} catch(error){setState("error");setMessage(error instanceof Error?error.message:"Please try again.")}
  }
  return <motion.div className="algo-report-form-wrap" initial={reduced?false:{opacity:0}} whileInView={{opacity:1}} viewport={{once:true,amount:.5}} transition={{duration:.5}}>
    {state==="success"?<p role="status" className="algo-report-success">The full campaign report is on its way to your inbox. If you don’t see it, please check your <em>Promotions</em> folder. <span aria-hidden="true">✓</span></p>:<form noValidate onSubmit={submit} className={`algo-report-form ${focused?"is-focused":""} ${email?"has-email":""}`} data-state={email?"Enter":focused?"Start Form":"Default"}>
      <label htmlFor="algorand-report-email" className="sr-only">Share your email address to receive the full campaign report</label>
      <input id="algorand-report-email" type="email" autoComplete="email" value={email} onChange={e=>{setEmail(e.target.value);if(state==="error") {setState("idle");setMessage("")}}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder={focused?"":"Enter your email address to view the full campaign report"} disabled={state==="submitting"} aria-describedby="algorand-report-message" aria-invalid={state==="error"} required />
      <button type="submit" aria-label="Send the full campaign report" disabled={state==="submitting"}>{state==="submitting"?"…":"↵"}</button>
    </form>}
    <p id="algorand-report-message" role="status" className="algo-form-message">{message}</p>
  </motion.div>
}

export default function AlgorandCaseStudy() {
  const [menuOpen,setMenuOpen]=useState(false)
  const [active,setActive]=useState("context")
  const [headerOffset,setHeaderOffset]=useState(0)
  const root=useRef<HTMLElement>(null), hero=useRef<HTMLElement>(null), subnav=useRef<HTMLDivElement>(null)
  const reduced=useReducedMotion()
  const {scrollYProgress:progress}=useScroll({target:root,offset:["start start","end end"]})
  const {scrollYProgress:heroProgress}=useScroll({target:hero,offset:["start start","end end"]})
  // Same reversible reveal/parallax mapping as the Raydium case study.
  const heroY=useTransform(heroProgress,[0,1],[0,-46])
  const heroScale=useTransform(heroProgress,[0,1],[1,1.06])
  const summaryY=useTransform(heroProgress,[.16,.42],["100%","0%"])
  const titleOpacity=useTransform(()=>1-Math.min(1,Math.max(0,(heroProgress.get()-.16)/.18)))
  const titleY=useTransform(heroProgress,[.16,.34],[0,-120])
  useEffect(()=>{const update=()=>{const y=subnav.current?.getBoundingClientRect().top??80;setHeaderOffset(Math.min(80,Math.max(0,80-y)));let current="context";for(const item of nav){if((document.getElementById(item.id)?.getBoundingClientRect().top??Infinity)<innerHeight*.35+78)current=item.id}setActive(current)};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)}},[])
  useEffect(()=>{if(!menuOpen)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenuOpen(false)};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[menuOpen])
  return <main ref={root} className="algo-case-study">
    <SmoothScroll intensity={9} anchors />
    <div className="abelian-site-header algo-site-header" style={{transform:`translateY(-${headerOffset}px)`,pointerEvents:headerOffset>=80?"none":undefined}}><HomeHeader menuOpen={menuOpen} onToggleMenu={()=>setMenuOpen(!menuOpen)} /></div>
    {menuOpen&&<div className="abelian-menu-layer"><button className="home-menu-scrim" aria-label="Close menu" onClick={()=>setMenuOpen(false)}/><div className="home-menu-overlay is-open" role="dialog" aria-modal="true" aria-label="Site menu"><button className="algo-menu-close" onClick={()=>setMenuOpen(false)} aria-label="Close menu">×</button><nav className="home-menu-links">{["about","catalogue","home"].map(label=><Link key={label} className="home-menu-link" href={label==="catalogue"?"/#projects":label==="home"?"/":"/about"}>{label}</Link>)}</nav><MenuContactActions/></div></div>}
    <section ref={hero} className="algo-hero-sequence" aria-labelledby="algo-title"><div className="algo-hero-sticky">
      <motion.div className="algo-hero-art" style={reduced?undefined:{y:heroY,scale:heroScale}}><Image src={assets["algoDesign-imgUntitledDesign11"]} alt="Algorand campaign artwork" fill priority sizes="100vw"/></motion.div><div className="algo-hero-gradient"/>
      <motion.div className="algo-hero-copy" style={reduced?undefined:{opacity:titleOpacity,y:titleY}}><motion.span initial={reduced?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.58,delay:.12,ease:"easeOut"}}>Campaign report</motion.span><motion.h1 id="algo-title" initial={reduced?false:{opacity:0,y:42}} animate={{opacity:1,y:0}} transition={{duration:.77,delay:.28,ease:"easeOut"}}>Marketing Campaign<br/>Built on Momentum</motion.h1></motion.div>
      <motion.dl className="algo-hero-meta" style={reduced?undefined:{opacity:titleOpacity,y:titleY}}><div><dt>Role</dt><dd>APAC Ambassador Lead</dd></div><div><dt>Company</dt><dd>Algorand Foundation</dd></div><div><dt>Project date</dt><dd>2025.03.09 – 2025.04.02</dd></div></motion.dl>
      <motion.a className="algo-hero-down" href="#context" aria-label="Explore the campaign" style={reduced?undefined:{opacity:titleOpacity}}><Image src={assets["algoDesign-imgDown"]} alt="" width={34} height={77}/></motion.a>
      <motion.div className="algo-summary" style={reduced?undefined:{y:summaryY}}><div className="algo-summary-inner"><h2 className="algo-label">Summary</h2><div className="algo-summary-copy"><p>A full-funnel marketing campaign in South Korea was delivered to promote Algorand’s new staking rewards and nodes operator programs, with two core objectives:</p><ul><li>Build interest in $ALGO among Korean traders and investors.</li><li>Encourage $ALGO staking and grow participation in running Algorand nodes.</li></ul></div><div className="algo-metrics">{metrics.map(([value,label])=><div key={value}><strong>{value}</strong><p>{label}</p></div>)}</div></div></motion.div>
    </div></section>
    <div ref={subnav} className="abelian-subnav algo-subnav has-contact-actions"><span className="abelian-subnav-label">On this page:</span><nav aria-label="Case study sections">{nav.map(item=><a key={item.id} href={`#${item.id}`} className={active===item.id?"is-active":""} aria-current={active===item.id?"location":undefined}>{item.label}</a>)}</nav><CaseStudyContactActions activeSection={active} /><motion.div className="abelian-progress" style={{scaleX:progress}}/></div>
    <section id="context" className="algo-context algo-container"><h2 className="algo-label">Context</h2><Scene><Animated id="412:201" className="algo-context-copy">New entrants in Korea’s crypto ecosystem signaled growing user interest and increased competition for Algorand’s market share.</Animated><div className="algo-context-stats"><div><Animated id="412:216"><strong>12%</strong></Animated><Animated id="412:221"><p>of $ALGO circulating supply traded in the Korean market</p></Animated></div><div><Animated id="412:230"><strong>6K</strong></Animated><Animated id="412:235"><p>Algorand community members in Korea</p></Animated></div></div></Scene></section>
    <section id="execution" className="algo-execution"><div className="algo-container"><h2 className="algo-label">Execution</h2>
      <article className="algo-step"><Heading id="434:1318" number="01">Event and content planning</Heading><Scene className="algo-step-body"><Artboard height={552} className="algo-planning"><Animated id="434:938" className="algo-plan-back"><Art asset="412:240-imgPage" alt="Campaign plan"/><div/></Animated><Animated id="412:288" className="algo-calendar"><Art asset="412:240-imgContentCalendar" alt="Month-long content calendar"/></Animated></Artboard><Animated id="432:186" className="algo-prose"><p>Planned a month-long content calendar around a giveaway campaign and three smaller online community events designed to turn campaign interest into continued engagement and first-time conversions.</p><p>The calendar coordinated:</p><ul><li>Content for the client’s official channels</li><li>Paid partner content schedules</li><li>Community event launch and closing dates</li></ul></Animated></Scene></article>
      <article className="algo-step"><Heading id="434:1319" number="02">Graphics and Media Preparation</Heading><Scene className="algo-step-body"><Artboard height={480}><TutorialVideo/><Animated id="415:299" className="algo-graphic pera"><Art asset="412:240-imgPeraGraphicDesign" alt="Pera Wallet event graphic"/></Animated><Animated id="415:301" className="algo-graphic giveaway"><Art asset="412:240-imgGiveawayGraphicDesign" alt="Algorand giveaway graphic"/></Animated><Animated id="432:195" className="algo-graphic alpha"><Art asset="412:240-imgAlphaGraphicDesign" alt="Alpha Arcade event graphic"/></Animated><Animated id="432:196" className="algo-graphic wide"><Art asset="412:240-imgGraphicDesign" alt="Community campaign graphic"/></Animated><Animated id="432:199" className="algo-graphic square"><Art asset="412:240-imgSquareGraphicDesign" alt="Livestream promotional graphic"/></Animated></Artboard><Animated id="432:193" className="algo-prose"><p>Created seven promotional graphics for a giveaway campaign, two dApp community events, and a livestream, plus a video tutorial to simplify onboarding for an innovative dApp.</p></Animated></Scene></article>
      <article className="algo-step"><Heading id="434:1320" number="03">Campaign Performance Monitoring</Heading><Scene className="algo-step-body"><Artboard height={416}><Animated id="433:307" className="algo-monitor"><div className="algo-partner-content"><Art asset="412:240-imgPartnerContent" alt="Partner content performance tracking"/></div><div className="algo-growth-charts">{(["412:240-imgGrowthGraph","412:240-imgGrowthGraph1","412:240-imgGrowthGraph2"] as const).map((asset,i)=><div key={asset}><Art asset={asset} alt={`Channel growth chart ${i+1}`}/></div>)}</div></Animated></Artboard><Animated id="432:200" className="algo-prose"><p>Analyzed content performance across three paid channels and five relationship-based partner channels to assess audience interest and inform future campaigns. Tracked day-over-day growth by channel alongside content releases and events to evaluate each activity’s impact.</p></Animated></Scene></article>
    </div></section>
    <section id="results" className="algo-results"><div className="algo-container"><h2 className="algo-label">Results</h2><Heading id="434:1321" number="04">Campaign Results Reporting</Heading><Scene className="algo-step-body algo-report-body"><Artboard height={546} className="algo-report-artboard"><Animated id="432:211" className="algo-report-pages"><div className="report-page first"><Art asset="433:244-imgPage" alt="Campaign report overview"/><i/></div><div className="report-page second"><Art asset="433:244-imgScreenshot20261011At2002511" alt="Campaign report analysis"/><i/></div><div className="report-page third"><Art asset="433:244-imgScreenshot20261012At1435141" alt="Campaign report results"/></div></Animated></Artboard><div className="algo-prose"><Animated id="432:215"><p>Delivered a mid-campaign report outlining adjustments and their rationale, followed by a 10-page final report 12 days after campaign close.</p></Animated><Animated id="432:217"><p><strong>Campaign results:</strong></p><ul>{["21.3% community growth","88% estimated retention after 12 days","239 combined dApp event participations, including 115 wallet installations; not deduplicated","38.3% wallet installation conversion from impressions","405 AMA listeners across live and replay"].map((line,i)=><motion.li key={line} initial={reduced?false:{y:-40}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:.063052,delay:i*.062421,ease:[.42,0,1,1]}}>{line}</motion.li>)}</ul></Animated></div></Scene></div></section>
    <div className="algo-staking-banner"><Image src={assets["433:223-imgStakingRewardsBlogBanner21"]} alt="Algorand staking rewards" fill sizes="100vw"/></div>
    <section id="report-request" aria-label="Request the full campaign report"><ReportForm/></section>
    <section className="algo-results-summary" aria-label="Campaign results summary"><Scene className="algo-metrics">{metrics.map(([value,label],i)=><Animated key={value} id={["433:293","433:296","433:299"][i]} delay={i*.2}><strong>{value}</strong><p>{label}</p></Animated>)}</Scene></section>
    <motion.button
      type="button"
      className="abelian-scroll-top"
      aria-label="Scroll back to the hero"
      aria-hidden={headerOffset < 80}
      initial={false}
      animate={{ opacity: headerOffset >= 80 ? 1 : 0, x: headerOffset >= 80 ? 0 : 18 }}
      transition={{ duration: reduced ? 0 : .35, ease: [.22, 1, .36, 1] }}
      tabIndex={headerOffset >= 80 ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
    >
      <span className="abelian-scroll-top-triangle" aria-hidden="true" />
    </motion.button>
    <HomeFooter/>
  </main>
}
