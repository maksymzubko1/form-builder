import { useCallback, useState } from 'react';

type UseModalResult = {
  open: boolean;
  setOpen: (v: boolean) => void;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export function useModal(initial = false): UseModalResult {
  const [open, setOpen] = useState(initial);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  return { open, setOpen, show, hide, toggle };
}
