import '../styles/globals.css'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="tHHlkzvmkq4lc-KQeBSf1sdMxlnDLsK50XpWDyxGH58" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}