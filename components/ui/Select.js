'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronsUpDown as ChevronUpDownIcon, Check as CheckIcon } from "lucide-react";

export default function Select({ label, value, onChange, options, placeholder = '—', className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <div className="text-sm text-white/80">{label}</div>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-xl bg-neutral-800/80 border border-white/10 py-2.5 pl-4 pr-10 text-left text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className={`block truncate ${!value ? 'text-white/50' : ''}`}>
              {options.find(o => o.value === value)?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-white/60" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-neutral-900 border border-white/10 py-1 text-sm shadow-lg focus:outline-none">
              {options.length === 0 && (
                <div className="px-3 py-2 text-white/50">нет данных</div>
              )}
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-3 py-2 ${
                      active ? 'bg-white/10 text-white' : 'text-white/90'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{opt.label}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-3 flex items-center">
                          <CheckIcon className="h-4 w-4 text-white/90"/>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
