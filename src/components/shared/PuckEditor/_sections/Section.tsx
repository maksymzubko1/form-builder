import { CSSProperties, forwardRef, ReactNode } from "react";

export type SectionProps = {
  className?: string;
  children: ReactNode;
  maxWidth?: string;
  style?: CSSProperties;
};

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className, maxWidth = "1280px", style = {} }, ref) => {
    return (
      <div
        className={`${className ? ` ${className}` : ""} pl-3 pr-3`}
        style={{
          ...style,
        }}
        ref={ref}
      >
        <div style={{ maxWidth }}>
          {children}
        </div>
      </div>
    );
  }
);