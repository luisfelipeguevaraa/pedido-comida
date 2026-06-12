import Link from 'next/link'

export default function BackButton({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Link href="/" className="btn">{children ?? 'Atrás'}</Link>
    </div>
  )
}
