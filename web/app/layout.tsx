import '../styles/globals.css'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Agriquex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}