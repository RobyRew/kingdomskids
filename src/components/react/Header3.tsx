import { useState, useEffect, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Command } from 'cmdk';
import { cn } from '@lib/utils';
import { Button } from './Button';
import { Burger, Search } from './icons';

interface NavLink { href: string; label: string; }
interface DropdownItem extends NavLink { icon: ComponentType<{ className?: string }>; }

interface Props {
  className?: string;
  homeHref: string;
  logoLabel: string;
  searchPlaceholder: string;
  donateLabel: string;
  donateHref: string;
  volunteerLabel: string;
  volunteerHref: string;
  topLinks: NavLink[];
  dropdownItems: DropdownItem[];
}

export default function Header3({
  className,
  homeHref,
  logoLabel,
  searchPlaceholder,
  donateLabel,
  donateHref,
  volunteerLabel,
  volunteerHref,
  topLinks,
  dropdownItems,
}: Props) {
  const [burger, setBurger] = useState(false);
  const [search, setSearch] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    if (burger || search) setDropdown(true);
  }, [burger, search]);

  return (
    <header className={cn('w-full', className)}>
      <div className="mx-auto max-w-7xl p-5">
        <Collapsible.Root open={burger || search}>
          <div className="grid grid-cols-[auto_1fr_auto]">
            <div
              className={cn(
                'col-span-3 grid grid-cols-subgrid',
                'gap-4',
                'p-5',
                'transition-colors duration-300',
                'bg-transparent hover:bg-gray',
                dropdown ? 'bg-gray rounded-t-lg' : 'rounded-lg',
              )}
            >
              <div className="flex flex-shrink-0 items-center gap-4">
                <Button
                  variant="burger"
                  size="burger"
                  aria-label="Open menu"
                  onFocus={() => setBurger(true)}
                  onClick={() => setBurger((v) => !v)}
                  onBlur={() => setBurger(false)}
                >
                  <Burger />
                </Button>

                <Button variant="logo" size="logo" asChild>
                  <a href={homeHref}>{logoLabel}</a>
                </Button>
              </div>

              <div className={cn('flex flex-1 items-center', search ? 'gap-0' : 'gap-4')}>
                <motion.nav
                  className="flex items-center gap-4 overflow-hidden"
                  animate={{
                    width: search ? 0 : 'auto',
                    opacity: search ? 0 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {topLinks.map((link) => (
                    <Button key={link.href} variant="tertiary" size="tertiary" asChild>
                      <a href={link.href}>{link.label}</a>
                    </Button>
                  ))}
                </motion.nav>

                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-hover:text-orange transition-colors duration-300 pointer-events-none z-10" />
                  <Command className="border-0 shadow-none">
                    <Command.Input
                      placeholder={searchPlaceholder}
                      className="w-full rounded-lg transition-colors duration-300 focus:outline-none focus-visible:outline-none font-medium text-black placeholder:text-black caret-orange selection:bg-orange selection:text-white bg-white border border-transparent px-5 py-2.5 pl-10"
                      onFocus={() => setSearch(true)}
                      onClick={() => setSearch(true)}
                      onBlur={() => setSearch(false)}
                    />
                  </Command>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-4">
                <Button variant="primary" size="primary" asChild>
                  <a href={donateHref} target="_blank" rel="noopener noreferrer">
                    {donateLabel}
                  </a>
                </Button>
                <Button variant="secondary" size="secondary" asChild>
                  <a href={volunteerHref}>{volunteerLabel}</a>
                </Button>
              </div>
            </div>

            <Collapsible.Content forceMount asChild>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: burger || search ? 'auto' : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                onAnimationComplete={() => {
                  if (!burger && !search) setDropdown(false);
                }}
                className="col-span-3 grid grid-cols-subgrid gap-4 overflow-hidden bg-gray rounded-b-lg"
                onMouseDown={(e) => e.preventDefault()}
              >
                <nav className="col-start-2 grid grid-cols-2 grid-flow-col grid-rows-3 gap-4 pb-4">
                  {dropdownItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button key={item.href} variant="quaternary" size="quaternary" asChild>
                        <a href={item.href} className="group">
                          <Icon className="w-5 h-5 text-black group-hover:text-orange transition-colors duration-300" />
                          {item.label}
                        </a>
                      </Button>
                    );
                  })}
                </nav>
              </motion.div>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      </div>
    </header>
  );
}
