import ShareButton from '../components/ShareButton'

export default function Home() {
  const demoProduct = {
    id: '123',
    title: 'Organic Fertilizer Pack',
    description: 'High-quality fertilizer for healthy crops',
    url: 'https://agriquex.example/products/123'
  }

  return (
    <div className="container">
      <h1>Welcome to Agriquex (web)</h1>
      <p>This demo shows theme switching using CSS variables.</p>

      <div className="card" style={{ padding: 16 }}>
        <h2>{demoProduct.title}</h2>
        <p>{demoProduct.description}</p>
        <div style={{ marginTop: 12 }}>
          <ShareButton url={demoProduct.url} title={demoProduct.title} text={demoProduct.description} />
        </div>
      </div>
    </div>
  )
}
