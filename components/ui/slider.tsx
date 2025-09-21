import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      onValueCommit,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(
      defaultValue?.[0] ?? Number(min),
    );

    const currentValue = isControlled ? value?.[0] ?? Number(min) : internalValue;

    React.useEffect(() => {
      if (isControlled && value?.[0] !== undefined) {
        setInternalValue(value[0]);
      }
    }, [isControlled, value]);

    const handleChange = (next: number) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.([next]);
    };

    const handleCommit = (next: number) => {
      onValueCommit?.([next]);
    };

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary",
          className,
        )}
        onChange={(event) => handleChange(Number(event.target.value))}
        onMouseUp={(event) => handleCommit(Number(event.currentTarget.value))}
        onTouchEnd={(event) => handleCommit(Number((event.currentTarget as HTMLInputElement).value))}
        onKeyUp={(event) => {
          const keysToCommit = [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
          ];
          if (keysToCommit.includes(event.key)) {
            handleCommit(Number((event.currentTarget as HTMLInputElement).value));
          }
        }}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";
