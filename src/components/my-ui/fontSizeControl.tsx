import { ChecksIcon, TextAaIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FONT_SIZES, useFontSize } from "@/hooks/useFontSize";
import { cn } from "@/lib/utils";

export function FontSizeControl() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <TextAaIcon className="size-5" />
            <span className="sr-only">Change text size</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium text-muted-foreground text-xs">
            Text size
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {FONT_SIZES.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setFontSize(opt.value)}
              className={cn(
                "flex cursor-pointer items-center gap-3",
                fontSize === opt.value && "bg-accent/60",
              )}
            >
              <span
                className="w-6 text-center font-semibold leading-none"
                style={{ fontSize: opt.hint }}
              >
                Aa
              </span>
              <span className="flex-1">{opt.label}</span>
              <span className="text-muted-foreground text-xs tabular-nums">{opt.hint}</span>
              {fontSize === opt.value && <ChecksIcon />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
