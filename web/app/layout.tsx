import '../styles/globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Agriquex',
  verification: {
    google: 'tHHlkzvmkq4lc-KQeBSf1sdMxlnDLsK50XpWDyxGH58',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}