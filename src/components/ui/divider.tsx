interface DividerProps {
  inverse?: boolean;
}

export function Divider({ inverse }: DividerProps) {
  return (
    <div
      role="separator"
      className="border-border"
      style={{
        borderTopWidth: inverse ? "1px" : "2px",
        borderTopStyle: "solid",
        borderBottomWidth: inverse ? "2px" : "1px",
        borderBottomStyle: "solid",
        height: "4px",
      }}
    />
  );
}
