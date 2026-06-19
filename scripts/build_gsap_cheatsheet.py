#!/usr/bin/env python3
"""Generate a multi-page, two-column GSAP cheat sheet PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Preformatted,
    Table, TableStyle, Spacer, KeepTogether,
)

OUT = "public/downloads/gsap-cheatsheet.pdf"

INK = colors.HexColor("#2b2a33")
MUTED = colors.HexColor("#6b6976")
BLUE = colors.HexColor("#3d6fc0")
GREEN = colors.HexColor("#5fa30a")
CODE_BG = colors.HexColor("#f1f5fa")
LINE = colors.HexColor("#d6e4f0")

PAGE_W, PAGE_H = A4
MARGIN = 14 * mm
GAP = 7 * mm
COL_W = (PAGE_W - 2 * MARGIN - GAP) / 2

h_section = ParagraphStyle("sec", fontName="Helvetica-Bold", fontSize=10.5,
                           textColor=colors.white, spaceBefore=0, spaceAfter=0,
                           leading=13, leftIndent=4)
h_note = ParagraphStyle("note", fontName="Helvetica", fontSize=7.6,
                        textColor=MUTED, leading=10, spaceBefore=2, spaceAfter=1)
code_style = ParagraphStyle("code", fontName="Courier", fontSize=7.2,
                            textColor=INK, leading=9.3)


def section(title, accent=BLUE):
    bar = Table([[Paragraph(title, h_section)]], colWidths=[COL_W])
    bar.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), accent),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("ROUNDEDCORNERS", [3, 3, 0, 0]),
    ]))
    return bar


def code(snippet):
    box = Table([[Preformatted(snippet, code_style)]], colWidths=[COL_W])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return box


def note(text):
    return Paragraph(text, h_note)


def block(title, snippet, accent=BLUE, hint=None):
    parts = [section(title, accent), code(snippet)]
    if hint:
        parts.append(note(hint))
    parts.append(Spacer(1, 7))
    return KeepTogether(parts)


story = []

story.append(block("CORE — the four tweens", """gsap.to('.box', {x:300, rotation:360, duration:1})
gsap.from('.el', {y:60, opacity:0})   // animate IN
gsap.fromTo('.el', {scaleX:0},
                   {scaleX:1, transformOrigin:'left'})
gsap.set('.el', {autoAlpha:0})        // instant, no anim""", GREEN,
                   "autoAlpha = opacity + visibility. Prefer x/y/scale/rotation (GPU)."))

story.append(block("COMMON PROPERTIES", """x, y, scale, rotation, skew, opacity, autoAlpha
duration, delay, repeat, repeat:-1, yoyo:true
ease, stagger, transformOrigin
backgroundColor, color, '--myVar' (CSS vars)
onComplete, onUpdate, onStart  (callbacks)"""))

story.append(block("EASES — the secret sauce", """ease:'power2.out'   // fast start, soft end (UI)
ease:'power4.inOut' // strong both ends
ease:'back.out(1.7)'      // overshoots
ease:'elastic.out(1,0.3)' // springy
ease:'bounce.out'  'sine'  'expo'  'none'""", GREEN,
                   "power2.out is the safe default for buttons, cards, menus."))

story.append(block("STAGGER — many elements", """gsap.from('.item', {opacity:0, y:40,
  stagger:0.08})            // 0.08s apart

stagger:{each:0.05, from:'center', grid:'auto'}"""))

story.append(block("TIMELINE — sequencing", """const tl = gsap.timeline({
  defaults:{duration:0.5, ease:'power2.out'}})

tl.from('.logo', {y:-40, opacity:0})
  .from('.title',{x:-60, opacity:0}, '<')   // together
  .from('.text', {opacity:0}, '-=0.3')      // overlap
  .from('.cta',  {scale:0.8}, '+=0.2')      // gap
  .addLabel('mid')                          // label

// control: play() pause() reverse()
//          timeScale(2) seek('mid')""", BLUE,
                   "Position param: '<' with prev, '-=x' overlap, '+=x' gap, 'label'."))

story.append(block("SCROLLTRIGGER — scroll magic", """gsap.registerPlugin(ScrollTrigger)

gsap.from('.section', {opacity:0, y:80,
  scrollTrigger:{
    trigger:'.section',
    start:'top 80%',   // el top hits 80% vh
    end:'bottom 20%',
    scrub:true,        // tie to scroll
    pin:true,          // fix while scrolling
    toggleActions:'play none none reverse',
    markers:true       // debug start/end
  }})""", BLUE,
                   "scrub:1 = smooth catch-up. end:'+=1000' = pin for 1000px."))

story.append(block("SPLITTEXT — animate text", """import {SplitText} from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

const s = new SplitText('.headline',
                        {type:'chars,words,lines'})
gsap.from(s.chars, {y:40, opacity:0,
  stagger:0.03, ease:'back.out(2)'})""", GREEN,
                   "Now free & 50% smaller. Revert with s.revert()."))

story.append(block("SVG PLUGINS", """// DrawSVG — draw a path
gsap.from('.path', {drawSVG:'0%', duration:2})

// MorphSVG — shape to shape
gsap.to('#start', {morphSVG:'#end'})

// MotionPath — move along a path
gsap.to('.rocket', {motionPath:{
  path:'#route', align:'#route', autoRotate:true}})"""))

story.append(block("FLIP — layout transitions", """import {Flip} from 'gsap/Flip'
gsap.registerPlugin(Flip)

const st = Flip.getState('.item') // 1. snapshot
container.appendChild(item)       // 2. move in DOM
Flip.from(st, {duration:0.6,      // 3. animate diff
  ease:'power2.inOut'})""", BLUE,
                   "Great for shared-element transitions & sortable lists."))

story.append(block("REACT — useGSAP", """import {useGSAP} from '@gsap/react'

useGSAP(() => {
  gsap.from('.title', {y:50, opacity:0})
}, {scope: containerRef})   // auto cleanup""", BLUE,
                   "scope limits selectors; cleanup runs on unmount (StrictMode-safe)."))

story.append(block("PERFORMANCE & A11Y", """// animate transform/opacity, not width/top
// responsive, auto-reverting:
gsap.matchMedia().add('(min-width:768px)', () => {
  gsap.to('.x', {x:200})
})
// honor reduced motion:
const r = matchMedia(
  '(prefers-reduced-motion:reduce)').matches
if (!r) gsap.from('.x', {y:40, opacity:0})""", GREEN,
                   "Clean up: useGSAP / tween.kill() / ScrollTrigger.kill()."))


# ---- document with header band + two columns ----
def on_page(canvas, doc):
    canvas.saveState()
    # header band
    canvas.setFillColor(colors.HexColor("#0e1a2b"))
    canvas.rect(0, PAGE_H - 17 * mm, PAGE_W, 17 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(MARGIN, PAGE_H - 12 * mm, "GSAP Cheat Sheet")
    canvas.setFillColor(colors.HexColor("#88CE02"))
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 9.5 * mm, "2026 — 100% free")
    canvas.setFillColor(colors.HexColor("#bcd6ee"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 13.5 * mm,
                           "waldemarpaustian.dev/blog")
    # footer
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(PAGE_W / 2, 8 * mm,
                             "GSAP (GreenSock) — gsap.com  ·  page %d" % doc.page)
    canvas.restoreState()


top = PAGE_H - 20 * mm
frame_h = top - 14 * mm
left = Frame(MARGIN, 12 * mm, COL_W, frame_h, leftPadding=0, rightPadding=0,
             topPadding=0, bottomPadding=0, id="left")
right = Frame(MARGIN + COL_W + GAP, 12 * mm, COL_W, frame_h, leftPadding=0,
              rightPadding=0, topPadding=0, bottomPadding=0, id="right")

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
                      topMargin=20 * mm, bottomMargin=12 * mm,
                      title="GSAP Cheat Sheet 2026", author="Waldemar Paustian")
doc.addPageTemplates([PageTemplate(id="two", frames=[left, right], onPage=on_page)])
doc.build(story)
print("wrote", OUT)
