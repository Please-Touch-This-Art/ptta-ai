import { Check, Type } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesign } from "@/context/DesignContext";

export function DesignPicker() {
  const { design, setDesignId, options } = useDesign();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Design: ${design.name}. Open design picker.`}
          /* 28px is a small target for a 17px glyph. The pseudo-element takes the
             hit area to ~40x44 without changing the header's height, which the
             button's own box currently sets. */
          className="relative flex items-center justify-center w-7 h-7 [touch-action:manipulation] before:absolute before:content-[''] before:-inset-x-1.5 before:-inset-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <Type className="w-4 h-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-56 bg-surface text-ink border-hairline"
      >
        <DropdownMenuLabel className="ptta-label text-[10pt] tracking-[0.12em]">
          Design
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const isActive = opt.id === design.id;
          return (
            <DropdownMenuItem
              key={opt.id}
              onSelect={() => setDesignId(opt.id)}
              className="flex items-start gap-3 cursor-pointer py-2"
            >
              <span className="flex-1">
                <span className="block text-sm">{opt.name}</span>
                <span className="block text-[11px] text-muted-fg leading-snug mt-0.5">
                  {opt.description}
                </span>
              </span>
              {isActive && (
                <Check className="w-4 h-4 opacity-70 mt-0.5 shrink-0" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
