  'use client'

import Link from "next/link";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { SITE_CONFIG } from "@/lib/site-config";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { ImageIcon, Sparkles, Users, Zap } from "lucide-react";

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'visual') {
    return {
      shell: 'bg-[#F6F3EB] text-black',
      panel: 'border border-[#869B7E]/20 bg-[#C9CAAC]/30 shadow-[0_28px_80px_rgba(127,32,32,0.15)]',
      soft: 'border border-[#869B7E]/30 bg-[#F6F3EB]/50',
      muted: 'text-gray-700',
      title: 'text-black',
      badge: 'bg-[#7F2020] text-[#F6F3EB]',
      action: 'bg-[#7F2020] text-[#F6F3EB] hover:bg-[rgb(127,32,32,0.9)]',
    }
  }
  return {
    shell: 'bg-gradient-to-br from-[#F6F3EB] to-[#C9CAAC] text-black',
    panel: 'border border-[#869B7E]/20 bg-[#F6F3EB]/90 shadow-lg',
    soft: 'border border-[#869B7E]/30 bg-[#F6F3EB]/50',
    muted: 'text-gray-700',
    title: 'text-black',
    badge: 'bg-[#7F2020] text-[#F6F3EB]',
    action: 'bg-[#7F2020] text-[#F6F3EB] hover:bg-[rgb(127,32,32,0.9)]',
  }
}

const values = [
  { 
    icon: ImageIcon,
    title: "Visual First", 
    description: "We believe imagery leads the way. Every interaction is designed to put visual content front and center."
  },
  { 
    icon: Sparkles,
    title: "Creator Focused", 
    description: "Built for creators who want to share their visual stories without the noise of traditional platforms."
  },
  { 
    icon: Users,
    title: "Community Driven", 
    description: "A space where visual creators can connect, share, and discover amazing content together."
  },
  { 
    icon: Zap,
    title: "Lightning Fast", 
    description: "Optimized for speed and performance, ensuring your visual content loads instantly."
  },
];

export default function AboutPage() {
  const { recipe } = getFactoryState();
  const productKind = getProductKind(recipe);
  const tone = getTone(productKind);

  return (
    <div className={`min-h-screen ${tone.shell}`}>
      <NavbarShell />
      
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] ${tone.badge} mb-6`}>
            <Sparkles className="h-4 w-4" />
            About {SITE_CONFIG.name}
          </div>
          <h1 className={`text-5xl font-bold tracking-[-0.05em] mb-6 ${tone.title}`}>
            Where Visual Stories
            <br />
            Come to Life
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${tone.muted}`}>
            {SITE_CONFIG.name} is a modern platform designed for visual creators to share their stories, 
            connect with their audience, and build a community around their visual content.
          </p>
        </section>

        {/* Mission Section */}
        <section className={`mb-16 rounded-[3rem] p-8 lg:p-12 ${tone.panel}`}>
          <div className="max-w-4xl">
            <h2 className={`text-3xl font-semibold mb-6 ${tone.title}`}>Our Mission</h2>
            <p className={`text-lg leading-relaxed ${tone.muted} mb-6`}>
              We're on a mission to create the best platform for visual storytellers. In a world dominated by text-heavy content, 
              we believe that images should lead the conversation. Our platform is built from the ground up to prioritize 
              visual content, making it easier for creators to share their work and for audiences to discover amazing visuals.
            </p>
            <p className={`text-lg leading-relaxed ${tone.muted}`}>
              Whether you're a photographer, designer, artist, or visual storyteller, {SITE_CONFIG.name} provides the tools 
              and community you need to showcase your work and connect with people who appreciate visual creativity.
            </p>
          </div>
        </section>

        {/* Values Grid */}
        <section className="mb-16">
          <h2 className={`text-3xl font-semibold text-center mb-12 ${tone.title}`}>What We Stand For</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className={`rounded-2xl p-6 ${tone.soft} text-center group hover:scale-105 transition-transform duration-300`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${tone.badge} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${tone.title}`}>{value.title}</h3>
                  <p className={`text-sm leading-relaxed ${tone.muted}`}>{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className={`mb-16 rounded-[3rem] p-8 lg:p-12 ${tone.panel} text-center`}>
          <h2 className={`text-3xl font-semibold mb-6 ${tone.title}`}>Ready to Share Your Visual Story?</h2>
          <p className={`text-lg mb-8 ${tone.muted}`}>
            Join thousands of visual creators who are already sharing their work on {SITE_CONFIG.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className={`inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold ${tone.action}`}
            >
              Get Started
            </Link>
            <Link 
              href="/contact" 
              className={`inline-flex items-center justify-center rounded-full border border-current/20 px-8 py-4 text-lg font-semibold ${tone.muted} hover:bg-current/10`}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
