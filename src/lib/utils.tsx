// src/lib/utils.tsx
export function nl2br(str: string) {
  return str.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))
}