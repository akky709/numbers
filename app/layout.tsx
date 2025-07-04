import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Numbers Analytics - ナンバーズ分析サイト',
  description: 'ナンバーズ3・4の当選番号を詳細に分析するデータドリブンな分析サイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}