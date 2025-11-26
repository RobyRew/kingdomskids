'use client';

import { useState as State, useRef as Ref, useEffect as Effect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Burger, Search } from '@/components/icons';

const search = {
    selected: 'selected',
    unselected: 'unselected',
} as const;

type Search = typeof search[keyof typeof search];

const burger = {
    selected: 'selected',
    unselected: 'unselected',
} as const;

type Burger = typeof burger[keyof typeof burger];

const dropdown = {
    collapsed: 'collapsed',
    collapsing: 'collapsing',
    expanded: 'expanded',
    expanding: 'expanding',
} as const;

type Dropdown = typeof dropdown[keyof typeof dropdown];

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn("w-full", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-4 py-5">

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex-shrink-0">
              <Button variant="burger" size="burger" asChild>
                <button aria-label="Toggle menu">
                  <Burger />
                </button>
              </Button>
            </div>

            <div className="flex-shrink-0">
              <Button variant="logo" size="logo" asChild>
                <a href="/">
                  Kingdom&apos;s Kids
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <nav className="flex items-center gap-4 flex-shrink-0">
              <Button variant="tertiary" size="tertiary" asChild>
                <a href="/testimonies">
                  Testimonies</a>
              </Button>
              <Button variant="tertiary" size="tertiary" asChild>
                <a href="/gallery">
                  Gallery</a>
              </Button>
            </nav>

            <div className="relative w-[375px] flex-shrink-0 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2
                                 w-5 h-5
                                 text-black group-hover:text-orange
                                 transition-colors duration-300
                                 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search"
                variant="primary"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Button
              variant="primary"
              size="primary"
              asChild
            >
              <a
                href="https://www.paypal.com/donate?token=LGQXzy0rkm5Lv11xVwj8b71nxnbIZg5UgIo15muoPzl-fXQe-BBOgLUOy7a7QPCIAKNKNNx6-3mmp9do"
                target="_blank"
                rel="noopener noreferrer">
                Donate
              </a>
            </Button>
            <Button
              variant="secondary"
              size="secondary"
              asChild
            >
              <a href="/volunteer">
                Volunteer
              </a>
            </Button>
          </div>
          
        </div>
      </div>
    </header>
  );
}