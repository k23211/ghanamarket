import React from 'react'
import { TouchableOpacity, Text, Share, Alert, View } from 'react-native'

type Props = {
  url: string
  title?: string
  text?: string
}

export default function ShareButton({ url, title, text }: Props) {
  const onShare = async () => {
    try {
      await Share.share({ message: `${title ? title + ' - ' : ''}${text || ''}\n${url}` })
    } catch (err) {
      Alert.alert('Unable to share')
    }
  }

  return (
    <TouchableOpacity onPress={onShare} style={{ padding: 8, backgroundColor: '#e6f4ea', borderRadius: 6 }} accessibilityLabel="Share product">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#0b6a3d' }}>Share</Text>
      </View>
    </TouchableOpacity>
  )
}
