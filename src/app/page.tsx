import { type Metadata } from 'next'

import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { GridList, GridListItem } from '@/components/GridList'
import { FadeIn } from '@/components/FadeIn'
import { List, ListItem } from '@/components/List'
import { SectionIntro } from '@/components/SectionIntro'
import { StylizedImage } from '@/components/StylizedImage'
import { Button } from '@/components/Button'
import Image from 'next/image'
import imageLaptop from '@/images/laptop.jpg'
import imageHeartBook from '@/images/Heart and Book Harmony.png'

function ClassicsHighlight() {
  return (
    <>
      <SectionIntro
        eyebrow="Introducing Classics"
        title="A delightful EPUB reader for public‑domain books"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          Meet Classics, the tasteful way to read timeless literature on iPhone and iPad. Fast, offline‑first, and exquisitely designed so your reading feels calm, focused, and personal.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <div className="relative mx-auto flex items-center justify-center">
                <Image
                  src={imageHeartBook}
                  alt="Heart and Book Harmony"
                  className="h-28 w-28 object-contain"
                />
              </div>
              <StylizedImage
                src={imageLaptop}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="mt-10 justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem title="Offline‑first by design">
              Browse, download, and read without a connection. Your library, progress, highlights, and notes live on‑device.
            </ListItem>
            <ListItem title="Serious attention to typography">
              Carefully tuned fonts, spacing, and themes make long sessions easy on the eyes—because taste matters.
            </ListItem>
            <ListItem title="Highlighting you’ll actually use">
              Select, highlight, and jot notes with a flow that feels native to reading. Revisit everything with a focused annotation list.
            </ListItem>
            <ListItem title="Instant resume">
              We remember exactly where you left off, so you’re back in the story in a tap.
            </ListItem>
            <ListItem title="Fast and reliable">
              From cold start to opening a book, everything is tuned to feel immediate and smooth.
            </ListItem>
          </List>
        </div>
        <div className="mt-10 flex gap-4">
          <Button href="#">Get Classics on the App Store</Button>
          <Button href="/contact" invert>
            Contact us
          </Button>
        </div>
      </Container>
    </>
  )
}

export const metadata: Metadata = {
  description:
    'Thoughtful educational apps. Our first app, Classics, is a delightful, offline‑first EPUB reader for public‑domain books on iPhone and iPad.',
}

export default async function Home() {
  return (
    <>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            Thoughtful educational apps
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            We build small, focused apps for learning. Our first app is Classics—an exquisitely designed EPUB reader for public‑domain books.
          </p>
          <div className="mt-8 flex gap-4">
            <Button href="#">Get Classics on the App Store</Button>
            <Button href="/about" invert>
              Learn more
            </Button>
          </div>
        </FadeIn>
      </Container>

      <ClassicsHighlight />

      <SectionIntro
        eyebrow="Why readers love it"
        title="Fast, calm, and built with care"
        className="mt-24 sm:mt-32 lg:mt-40"
        smaller
      />
      <Container className="mt-10">
        <GridList>
          <GridListItem title="Offline‑first">
            Browse, download, and read without a connection. Everything stays on device by default.
          </GridListItem>
          <GridListItem title="Beautiful typography">
            Fonts, spacing, and themes tuned for long, comfortable reading sessions.
          </GridListItem>
          <GridListItem title="Highlights & notes">
            Select text naturally, add annotations, and revisit them with a focused list.
          </GridListItem>
          <GridListItem title="Instant resume">
            Open the app and you’re back in the story exactly where you left off.
          </GridListItem>
          <GridListItem title="Readium 3.3 engine">
            Standards‑based EPUB rendering for fidelity, performance, and stability.
          </GridListItem>
          <GridListItem title="Privacy‑first">
            No accounts, no tracking. Optional online features are opt‑in and reversible.
          </GridListItem>
        </GridList>
      </Container>

      <div className="mt-24 rounded-4xl bg-neutral-950 py-20 sm:mt-32 sm:py-32">
        <SectionIntro
          eyebrow="Privacy"
          title="Your reading stays yours"
          invert
          className=""
        >
          <p>
            Classics is offline by default and never requires an account. If we add online features later, they will be optional, clearly explained, and easy to turn off.
          </p>
        </SectionIntro>
        <Container className="mt-10">
          <GridList className="">
            <GridListItem title="Default offline" invert>
              Library, progress, highlights, and notes live on your device.
            </GridListItem>
            <GridListItem title="No tracking" invert>
              We don’t collect analytics about what you read or how you read it.
            </GridListItem>
            <GridListItem title="Your data, your control" invert>
              Export and deletion controls will ship alongside any optional cloud features.
            </GridListItem>
          </GridList>
        </Container>
      </div>

      <SectionIntro
        eyebrow="Roadmap (opt‑in, additive)"
        title="Thoughtful additions that respect your focus"
        className="mt-24 sm:mt-32 lg:mt-40"
        smaller
      >
        <p>
          Secure cloud backup for annotations, tasteful quote sharing, and light community reading for select titles—always optional and reversible.
        </p>
      </SectionIntro>
      <Container className="mt-6">
        <List>
          <ListItem title="Cloud backup (opt‑in)">
            Keep annotations safe across devices with end‑to‑end security.
          </ListItem>
          <ListItem title="Tasteful quote sharing">
            Share passages without breaking the calm aesthetic.
          </ListItem>
          <ListItem title="Community reading">
            Optional, time‑boxed reading windows for select titles with gentle discussion.
          </ListItem>
        </List>
      </Container>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="max-w-3xl">
          <h2 className="font-display text-4xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-5xl">
            Built for readers who love the classics
          </h2>
          <p className="mt-6 text-xl text-neutral-600">
            No distractions. No accounts. No ads. Just beautiful reading.
          </p>
          <div className="mt-8 flex gap-4">
            <Button href="#">Get Classics on the App Store</Button>
            <Button href="/contact" invert>
              Contact us
            </Button>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
