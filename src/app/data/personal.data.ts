import { PersonalSpace } from '../core/models/portfolio.models';

/**
 * Content for the `personal` perspective, kept out of the main bundle and
 * imported on demand by PortfolioService — it is only ever needed once a
 * visitor switches into the personal space.
 */
export const PERSONAL_SPACE: PersonalSpace = {
  eyebrow: "Personal space · off the clock",
  greeting: "Hi, I'm Aditya — here's the part of me that isn't a résumé.",
  intro:
    "By day I build enterprise systems. After hours I chase sound, light, and small strange ideas. This corner collects the things I make and notice when nobody is shipping a sprint — photographs, little films, half-finished experiments, and the occasional thought worth writing down.",
  mood: "Curious, caffeinated, and always mid-project.",
  nowUpdated: "Updated October 2026",

  now: [
    { label: "Building", value: "A generative audio toy in the browser" },
    { label: "Learning", value: "GLSL shaders & real-time graphics" },
    { label: "Reading", value: "The Creative Act — Rick Rubin" },
    { label: "Listening", value: "Nils Frahm, Bonobo, rain on loop" },
    { label: "Training", value: "Morning runs around Pune" },
    { label: "Base", value: "Pune, Maharashtra, India" }
  ],

  stories: [
    {
      id: "mood-machine",
      title: "How a genre classifier became a mood machine",
      excerpt:
        "It started as a machine-learning assignment — classify a song's genre from its waveforms. It ended as something that reads your face and picks the soundtrack.",
      body:
        "The brief was dry: train a model, report the accuracy, move on. But once the classifier worked I kept staring at the confusion matrix, thinking about how wrong genre labels feel as a description of what music does to a person. So I wired in a facial-emotion model and let your expression choose the playlist. It is over-engineered, slightly absurd, and the most fun I have had with a notebook. It is still the project I mention first when someone asks what I actually enjoy building.",
      date: "2024",
      tag: "Machine learning",
      accent: true
    },
    {
      id: "first-line",
      title: "The first line of code that ever worked",
      excerpt:
        "A tiny game, a broken loop, and the exact moment the screen did what I told it to. Everything since is a longer version of that feeling.",
      body:
        "I did not grow up with a plan to be an engineer. I grew up curious about how things on a screen moved. The first program I ever got running was small and ugly, and when it worked I felt the specific joy of having been understood by a machine — no ambiguity, no negotiation, just cause and effect. I have chased that feeling through .NET services, Angular migrations, and 2 a.m. debug sessions ever since. It never quite gets old.",
      date: "Earlier",
      tag: "Origin",
      accent: false
    },
    {
      id: "morning-light",
      title: "Pune, before the city wakes",
      excerpt:
        "Some of my best ideas arrive on a run, before the traffic and the notifications. A short note on why I protect the first hour.",
      body:
        "There is a version of the city at 6 a.m. that feels like it belongs to whoever is awake to see it — mist on the hills, empty roads, the smell of someone already frying something for breakfast. I run through it most mornings, and it is where most of my side-project ideas are born. Not because running is magic, but because it is the one hour where nothing is asking anything of me. I write the good ones down in my phone with sweaty thumbs and figure out later whether they are any good.",
      date: "2025",
      tag: "Routine",
      accent: false
    },
    {
      id: "small-things",
      title: "In defence of small things",
      excerpt:
        "I like building tiny tools that solve one annoyance completely. No roadmap, no scale — just a clean little solution.",
      body:
        "Not everything needs to be a platform. Some of the work I am proudest of is invisible: a script that renames a thousand files, a shader that made a loading screen feel alive, a keyboard shortcut that saved someone three clicks. Small things are honest — their whole job fits in your head at once. I keep a folder of them. Most never leave my machine, and that is exactly the point.",
      date: "Ongoing",
      tag: "Philosophy",
      accent: false
    }
  ],

  gallery: [
    { id: "g1", caption: "Morning mist over the hills", meta: "Pune · 6:12 am", src: null, hue: 28, span: "wide" },
    { id: "g2", caption: "Desk at 2 a.m.", meta: "One lamp, too many tabs", src: null, hue: 210, span: "normal" },
    { id: "g3", caption: "Monsoon on the window", meta: "July rain", src: null, hue: 190, span: "tall" },
    { id: "g4", caption: "The good chai place", meta: "Down the road", src: null, hue: 35, span: "normal" },
    { id: "g5", caption: "City lights, long exposure", meta: "Weekend wander", src: null, hue: 275, span: "wide" },
    { id: "g6", caption: "Light on the wall at golden hour", meta: "Just liked it", src: null, hue: 15, span: "normal" }
  ],

  videos: [
    {
      id: "v1",
      title: "Shader study 01 — ink in water",
      description:
        "A fragment-shader experiment: dye diffusing through a fluid field, rendered in real time. The first time a shader did something I did not fully predict.",
      duration: "0:24",
      tags: ["GLSL", "three.js", "study"],
      src: null,
      poster: null,
      hue: 265
    },
    {
      id: "v2",
      title: "Timelapse — building a tiny tool",
      description:
        "Thirty minutes of a Saturday compressed into twenty seconds. A small utility that does exactly one thing, from blank file to working.",
      duration: "0:19",
      tags: ["timelapse", "side project"],
      src: null,
      poster: null,
      hue: 35
    },
    {
      id: "v3",
      title: "Particles that learn to gather",
      description:
        "Getting a thousand points to find each other with nothing but simple local rules. Emergence as a hobby.",
      duration: "0:31",
      tags: ["simulation", "WebGL"],
      src: null,
      poster: null,
      hue: 200
    }
  ],

  sideProjects: [
    {
      id: "p1",
      title: "MoodTunes",
      description:
        "The ML mood-to-playlist experiment. Reads facial emotion and recommends music — absurd on purpose, genuinely fun to demo.",
      year: "2024",
      tags: ["Python", "ML", "OpenCV"],
      url: null,
      status: "shipped"
    },
    {
      id: "p2",
      title: "Shader Sketches",
      description:
        "A running collection of GLSL studies — noise fields, fluid dye, and light. The sketchbook I actually keep.",
      year: "2026",
      tags: ["GLSL", "three.js"],
      url: null,
      status: "building"
    },
    {
      id: "p3",
      title: "Morning Log",
      description:
        "A tiny private app that records one honest sentence a day about the first hour. No streaks, no guilt, no sharing.",
      year: "2025",
      tags: ["Angular", "Local-first"],
      url: null,
      status: "exploring"
    }
  ],

  reading: [
    { id: "r1", title: "The Creative Act", creator: "Rick Rubin", kind: "book", note: "Permission to make things badly, then make them better." },
    { id: "r2", title: "All Melody", creator: "Nils Frahm", kind: "album", note: "The sound of a room thinking." },
    { id: "r3", title: "The Book of Shaders", creator: "Patricio González Vivo", kind: "article", note: "How I finally stopped fearing the fragment shader." },
    { id: "r4", title: "Blade Runner 2049", creator: "Denis Villeneuve", kind: "film", note: "Every frame is a mood board." }
  ]
};
