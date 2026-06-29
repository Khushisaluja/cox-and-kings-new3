import { Compass } from 'lucide-react';

/* The "Since 1758" heritage lockup — a repeated brand-recall signature.
   Used in the header, hero eyebrow, and footer. variant: 'gold' | 'ink'. */
export default function HeritageMark({ variant = 'gold', size = 14 }) {
  return (
    <span className={`v3-heritage ${variant === 'ink' ? 'v3-heritage--ink' : ''}`}>
      <Compass size={size} strokeWidth={1.6} aria-hidden="true" />
      Since 1758
    </span>
  );
}
