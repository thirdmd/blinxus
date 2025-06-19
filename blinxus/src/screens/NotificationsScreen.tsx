import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Bell, Heart, MessageCircle, UserPlus, Camera, Settings } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'post';
  user: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: 'Jessica Martinez',
    message: 'liked your post from El Nido, Palawan',
    time: '2h',
    read: false
  },
  {
    id: '2',
    type: 'comment',
    user: 'Miguel Santos',
    message: 'commented on your Mount Pulag post',
    time: '4h',
    read: false
  },
  {
    id: '3',
    type: 'follow',
    user: 'Carlos Rodriguez',
    message: 'started following you',
    time: '1d',
    read: true
  },
  {
    id: '4',
    type: 'like',
    user: 'Alfonso Rivera',
    message: 'liked your Banaue rice terraces post',
    time: '2d',
    read: true
  },
  {
    id: '5',
    type: 'post',
    user: 'Isabella Chen',
    message: 'shared a new Lucid album from Kyoto',
    time: '3d',
    read: true
  }
];

export default function NotificationsScreen() {
  const themeColors = useThemeColors();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} color="#EF4444" fill="#EF4444" />;
      case 'comment':
        return <MessageCircle size={20} color="#3B82F6" />;
      case 'follow':
        return <UserPlus size={20} color="#10B981" />;
      case 'post':
        return <Camera size={20} color="#8B5CF6" />;
      default:
        return <Bell size={20} color={themeColors.textSecondary} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar 
        barStyle={themeColors.isDark ? "light-content" : "dark-content"} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 24, 
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.border
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'normal', 
          color: themeColors.text 
        }}>
          Notifications
        </Text>
        
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: themeColors.backgroundSecondary,
              borderRadius: 16
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 12,
              color: themeColors.text,
              fontWeight: '500'
            }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {notifications.length === 0 ? (
          // Empty state
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 80
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: themeColors.backgroundSecondary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Bell size={32} color={themeColors.textSecondary} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'normal',
              color: themeColors.text,
              marginBottom: 8
            }}>
              No notifications yet
            </Text>
            <Text style={{
              fontSize: 14,
              color: themeColors.textSecondary,
              textAlign: 'center',
              lineHeight: 20
            }}>
              When people interact with your posts,{'\n'}you'll see it here
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 16,
                backgroundColor: notification.read 
                  ? 'transparent' 
                  : themeColors.backgroundSecondary,
                borderLeftWidth: notification.read ? 0 : 3,
                borderLeftColor: notification.read ? 'transparent' : '#0047AB'
              }}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.backgroundSecondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                {getNotificationIcon(notification.type)}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  color: themeColors.text,
                  fontWeight: notification.read ? '300' : '400',
                  lineHeight: 20
                }}>
                  <Text style={{ fontWeight: '500' }}>{notification.user}</Text>
                  {' '}
                  {notification.message}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: themeColors.textSecondary,
                  marginTop: 4
                }}>
                  {notification.time}
                </Text>
              </View>

              {/* Unread indicator */}
              {!notification.read && (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#0047AB',
                  marginLeft: 12
                }} />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 