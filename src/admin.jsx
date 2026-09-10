import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Admin } from './components/Admin'
import { Flame } from 'lucide-react'

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>

      {/* Standalone Admin Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              backgroundColor: '#1e1e24',
              padding: '6px 14px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--border)'
            }}>
              <Flame size={20} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                <span style={{ color: '#ffffff' }}>Fit</span><span style={{ color: 'var(--primary)' }}>Life</span>
              </span>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '8px' }}>Admin Console</span>
          </div>

          <a href="/" style={{
            textDecoration: 'none',
            color: 'var(--primary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-glow)',
            transition: 'all var(--transition-fast)'
          }}>
            Back to Tracker
          </a>
        </div>
      </header>

      {/* Main Admin Panel View */}
      <main className="app-container" style={{ flex: 1, padding: '24px 0' }}>
        <Admin />
      </main>

      {/* Standalone Admin Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-card)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <p>© {new Date().getFullYear()} FitLife. Admin Console.</p>
        </div>
      </footer>
    </div>
  </StrictMode>,
)
