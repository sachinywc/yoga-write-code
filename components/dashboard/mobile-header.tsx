"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import { SidebarBody } from "./sidebar";
import { Wordmark } from "./wordmark";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-stone-200 bg-stone-50 px-4 lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          className="-mr-2 grid h-9 w-9 place-items-center rounded-md text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-stone-200 px-6">
              <Wordmark />
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation"
                className="-mr-2 grid h-9 w-9 place-items-center rounded-md text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto pt-4">
              <SidebarBody onNavigate={close} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}