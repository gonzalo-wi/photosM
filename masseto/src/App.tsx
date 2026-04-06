import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import CustomCursor from './components/CustomCursor/CustomCursor'
import Nav         from './components/Nav/Nav'
import Hero        from './components/Hero/Hero'
import About       from './components/About/About'
import Portfolio   from './components/Portfolio/Portfolio'
import Services    from './components/Services/Services'
import Contact     from './components/Contact/Contact'
import CategoryPage from './components/CategoryPage/CategoryPage'
import Admin       from './components/Admin/Admin'

function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
    </main>
  )
}

function AppShell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Nav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/:slug" element={<CategoryPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
