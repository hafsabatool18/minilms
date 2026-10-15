export function getYouTubeId(url) {
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace('www.', '')
    let id = null

    if (host === 'youtu.be') {
      id = u.pathname.slice(1)
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') {
        id = u.searchParams.get('v')
      } else if (
        u.pathname.startsWith('/embed/') ||
        u.pathname.startsWith('/shorts/')
      ) {
        id = u.pathname.split('/')[2]
      }
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}