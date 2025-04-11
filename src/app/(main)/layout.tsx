import { FooterWrapper } from '@/components/layout/FooterWrapper'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FooterWrapper />
    </>
  )
} 