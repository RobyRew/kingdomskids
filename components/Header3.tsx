'use client';

import { useState as State, useRef as Ref, useEffect as Effect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Burger, Search } from '@/components/icons';

const SEARCH = {
    selected: 'selected',
    unselected: 'unselected',
} as const;

type Search = typeof SEARCH[keyof typeof SEARCH];

const BURGER = {
    selected: 'selected',
    unselected: 'unselected',
} as const;

type Burger = typeof BURGER[keyof typeof BURGER];

const DROPDOWN = {
    collapsed: 'collapsed',
    collapsing: 'collapsing',
    expanded: 'expanded',
    expanding: 'expanding',
} as const;

type Dropdown = typeof DROPDOWN[keyof typeof DROPDOWN];

export default function Header({ className }: { className?: string }) {
  const [dropdown, $dropdown] = State<Dropdown>(DROPDOWN.collapsed);
  const [burger, $burger] = State<Burger>(BURGER.unselected);
  const [search, $search] = State<Search>(SEARCH.unselected);

  return (
    <header className={cn("w-full", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-4 py-5">

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex-shrink-0">
              <Button
                variant="burger"
                size="burger"
                onFocus={() => $burger(BURGER.selected)}
                onClick={() => $burger(BURGER.selected)}
                onBlur={() => $burger(BURGER.unselected)}
              >
                <Burger />
              </Button>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="logo"
                size="logo"
                asChild
              >
                <a href="/">Kingdom&apos;s Kids</a>
              </Button>
            </div>
          </div>

          <div className={cn(
            "flex items-center flex-1",
            (search === SEARCH.selected || burger === BURGER.selected) ? "gap-0" : "gap-4"
          )}>
            <motion.nav
              className="flex items-center gap-4 overflow-hidden"
              initial={{ width: 'auto', opacity: 1 }}
              animate={{
                width: (search === SEARCH.selected || burger === BURGER.selected) ? 0 : 'auto',
                opacity: (search === SEARCH.selected || burger === BURGER.selected) ? 0 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="tertiary"
                size="tertiary"
                asChild
              >
                <a href="/testimonies">Testimonies</a>
              </Button>
              <Button
                variant="tertiary"
                size="tertiary"
                asChild
              >
                <a href="/gallery">Gallery</a>
              </Button>
            </motion.nav>

            <div className="relative flex-1 group">
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
                onFocus={() => $search(SEARCH.selected)}
                onClick={() => $search(SEARCH.selected)}
                onBlur={() => $search(SEARCH.unselected)}
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
                rel="noopener noreferrer"
              >
                Donate
              </a>
            </Button>
            <Button
              variant="secondary"
              size="secondary"
              asChild
            >
              <a href="/volunteer">Volunteer</a>
            </Button>
          </div>
          
        </div>
      </div>
    </header>
  );
}