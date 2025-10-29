'use client'

import { useState, useEffect } from 'react'

interface IPInfo {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  hostname?: string
}

interface VPNProvider {
  name: string
  detected: boolean
}

export default function Home() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [vpnProvider, setVpnProvider] = useState<VPNProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const detectVPNProvider = (org: string): VPNProvider => {
    const orgLower = org.toLowerCase()

    const providers = [
      { keywords: ['nordvpn', 'nord vpn'], name: 'NordVPN' },
      { keywords: ['expressvpn', 'express vpn'], name: 'ExpressVPN' },
      { keywords: ['surfshark'], name: 'Surfshark' },
      { keywords: ['protonvpn', 'proton vpn', 'proton ag'], name: 'ProtonVPN' },
      { keywords: ['cyberghost'], name: 'CyberGhost' },
      { keywords: ['private internet access', 'pia'], name: 'Private Internet Access' },
      { keywords: ['ipvanish'], name: 'IPVanish' },
      { keywords: ['vyprvpn'], name: 'VyprVPN' },
      { keywords: ['hotspot shield'], name: 'Hotspot Shield' },
      { keywords: ['tunnelbear'], name: 'TunnelBear' },
      { keywords: ['windscribe'], name: 'Windscribe' },
      { keywords: ['mullvad'], name: 'Mullvad VPN' },
      { keywords: ['hide.me'], name: 'Hide.me' },
      { keywords: ['zenmate'], name: 'ZenMate' },
      { keywords: ['purevpn'], name: 'PureVPN' },
      { keywords: ['ivpn'], name: 'IVPN' },
      { keywords: ['astrill'], name: 'Astrill VPN' },
      { keywords: ['torguard'], name: 'TorGuard' },
      { keywords: ['perfect privacy'], name: 'Perfect Privacy' },
      { keywords: ['vpn unlimited'], name: 'VPN Unlimited' },
      { keywords: ['opera vpn'], name: 'Opera VPN' },
      { keywords: ['hola vpn'], name: 'Hola VPN' },
      { keywords: ['cloudflare'], name: 'Cloudflare WARP' },
      { keywords: ['google cloud', 'gce'], name: 'Google Cloud VPN' },
      { keywords: ['amazon', 'aws', 'ec2'], name: 'AWS VPN' },
      { keywords: ['microsoft azure', 'azure'], name: 'Azure VPN' },
      { keywords: ['digitalocean'], name: 'DigitalOcean VPN' },
      { keywords: ['linode'], name: 'Linode VPN' },
      { keywords: ['vultr'], name: 'Vultr VPN' },
      { keywords: ['ovh'], name: 'OVH VPN' },
      { keywords: ['m247'], name: 'M247 VPN Service' },
      { keywords: ['vpn', 'proxy', 'anonymous'], name: 'Generic VPN/Proxy' },
    ]

    for (const provider of providers) {
      for (const keyword of provider.keywords) {
        if (orgLower.includes(keyword)) {
          return { name: provider.name, detected: true }
        }
      }
    }

    return { name: 'No VPN Detected', detected: false }
  }

  const fetchIPInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://ipinfo.io/json?token=demo')

      if (!response.ok) {
        throw new Error('Failed to fetch IP information')
      }

      const data: IPInfo = await response.json()
      setIpInfo(data)

      const vpn = detectVPNProvider(data.org || '')
      setVpnProvider(vpn)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIPInfo()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>IP Info & VPN Detector</h1>
          <p>Real-time IP information and VPN provider detection</p>
        </div>
        <div className="info-card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching your IP information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>IP Info & VPN Detector</h1>
          <p>Real-time IP information and VPN provider detection</p>
        </div>
        <div className="info-card">
          <div className="error">
            <p>Error: {error}</p>
          </div>
          <button className="refresh-btn" onClick={fetchIPInfo}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>IP Info & VPN Detector</h1>
        <p>Real-time IP information and VPN provider detection</p>
      </div>

      <div className="info-card">
        {vpnProvider && (
          <div className={`vpn-status ${vpnProvider.detected ? 'detected' : 'not-detected'}`}>
            <h2>{vpnProvider.detected ? '🛡️ VPN Detected' : '✅ Direct Connection'}</h2>
            <p>{vpnProvider.detected ? 'Your connection is routed through a VPN' : 'You are connected directly to the internet'}</p>
            {vpnProvider.detected && (
              <div className="provider-badge">
                Provider: {vpnProvider.name}
              </div>
            )}
          </div>
        )}

        {ipInfo && (
          <>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">IP Address</div>
                <div className="info-value">{ipInfo.ip}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Location</div>
                <div className="info-value">{ipInfo.city}, {ipInfo.region}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Country</div>
                <div className="info-value">{ipInfo.country}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Postal Code</div>
                <div className="info-value">{ipInfo.postal || 'N/A'}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Coordinates</div>
                <div className="info-value">{ipInfo.loc}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Timezone</div>
                <div className="info-value">{ipInfo.timezone}</div>
              </div>

              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <div className="info-label">Organization / ISP</div>
                <div className="info-value">{ipInfo.org}</div>
              </div>

              {ipInfo.hostname && (
                <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="info-label">Hostname</div>
                  <div className="info-value">{ipInfo.hostname}</div>
                </div>
              )}
            </div>

            <div className="map-section">
              <div className="map-placeholder">
                📍 Location: {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                <br />
                Coordinates: {ipInfo.loc}
              </div>
            </div>
          </>
        )}

        <button className="refresh-btn" onClick={fetchIPInfo}>
          🔄 Refresh Information
        </button>
      </div>
    </div>
  )
}
