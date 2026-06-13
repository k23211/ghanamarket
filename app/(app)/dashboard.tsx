import { View, Text } from 'react-native';
import React from 'react'
import ShareButton from '../components/ShareButton'

export default function Dashboard() {
  const demoProduct = {
    id: '123',
    title: 'Organic Fertilizer Pack',
    description: 'High-quality fertilizer for healthy crops',
    url: 'https://agriquex.example/products/123'
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{demoProduct.title}</Text>
      <Text style={{ marginTop: 8 }}>{demoProduct.description}</Text>
      <View style={{ marginTop: 12 }}>
        <ShareButton url={demoProduct.url} title={demoProduct.title} text={demoProduct.description} />
      </View>
    </View>
  )
}