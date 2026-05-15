import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccent } from "@/context/AccentContext";

export function AccentPicker() {
  const { accent, setAccentId, options } = useAccent();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Accent colour: ${accent.name}. Open picker.`}
          className="flex items-center justify-center w-7 h-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <span
            aria-hidden="true"
            className="block w-4 h-4 rounded-full ring-1 ring-[color:var(--color-accent-foreground)]/40"
            style={{ backgroundColor: accent.hex }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-44 bg-surface text-ink border-hairline"
      >
        <DropdownMenuLabel className="ptta-label text-[10pt] tracking-[0.12em]">
          Accent
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const isActive = opt.id === accent.id;
          return (
            <DropdownMenuItem
              key={opt.id}
              onSelect={() => setAccentId(opt.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 rounded-full ring-1 ring-hairline"
                style={{ backgroundColor: opt.hex }}
              />
              <span className="flex-1">{opt.name}</span>
              {isActive && <Check className="w-4 h-4 opacity-70" aria-hidden="true" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
