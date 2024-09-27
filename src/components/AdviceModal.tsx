'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

interface AdviceModalProps {
  information: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdviceModal({ information, open, setOpen }: AdviceModalProps) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <InformationCircleIcon aria-hidden="true" className="h-6 w-6 text-blue-400" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Advice for question
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    {information}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 sm:mt-0 sm:w-auto"
              >
                Return
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}