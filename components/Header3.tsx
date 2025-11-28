'use client';

import { useState as State, useRef as Ref, useEffect as Effect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Burger, Search } from '@/components/icons';
import { Command, Input } from '@/components/ui/command';

export default function Header({ className }: { className?: string }) {
  const [burger, $burger] = State(false);
  const [search, $search] = State(false);
  const [dropdown, $dropdown] = State(false);
  Effect(() => {
    $dropdown(burger || search);
  }, [burger, search]);

  return (
    <header className={cn("w-full", className)}>
        <div className="mx-auto max-w-7xl p-5">
          <div className="flex items-center gap-4 p-5 hover:bg-gray transition-colors duration-300 rounded-lg">

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex-shrink-0">
                <Button
                  variant="burger"
                  size="burger"
                  onFocus={() => $burger(true)}
                  onClick={() => $burger(true)}
                  onBlur={() => $burger(false)}
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
              (search) ? "gap-0" : "gap-4"
            )}>
              <motion.nav
                className="flex items-center gap-4 overflow-hidden"
                initial={{ width: 'auto', opacity: 1 }}
                animate={{
                  width: (search) ? 0 : 'auto',
                  opacity: (search) ? 0 : 1
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
                <Command className="border-0 shadow-none">
                  <Input
                    placeholder="Search"
                    variant="primary"
                    className="pl-10"
                    onFocus={() => $search(true)}
                    onClick={() => $search(true)}
                    onBlur={() => $search(false)}
                  />
                </Command>
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