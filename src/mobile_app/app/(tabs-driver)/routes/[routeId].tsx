import StaticMapDriver from "@/components/StaticMapDriver";
import { OrderStatus, RouteStatus } from "@/types/types";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetRouteById } from "@/hooks/useRoute";
import NotFoundPage from "@/app/+not-found";
import CurrentRouteDetails from "./current";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const { height: screenHeight } = Dimensions.get('window');

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "REASSIGNED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return "checkmark-circle";
    case "IN_PROGRESS":
      return "time";
    case "PENDING":
      return "clock-outline";
    case "CANCELLED":
      return "close-circle";
    case "REASSIGNED":
      return "swap-horizontal";
    default:
      return "help-circle-outline";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDistance = (distance: number) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${distance.toFixed(0)} m`;
};

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "GENERAL":
      return "trash-outline";
    case "ORGANIC":
      return "leaf-outline";
    case "RECYCLABLE":
      return "refresh-outline";
    case "HAZARDOUS":
      return "warning-outline";
    case "ELECTRONIC":
      return "phone-portrait-outline";
    default:
      return "cube-outline";
  }
};

const OrderCard = ({ order, index }: { order: any; index: number }) => {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className="bg-blue-600 rounded-full w-6 h-6 items-center justify-center mr-3">
            <Text className="text-white text-xs font-bold">{index + 1}</Text>
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">
              {t('routeDetails.orderCard.orderNumber')}{order.id.slice(-6).toUpperCase()}
            </Text>
            <Text className="text-sm text-gray-500">{order.address}</Text>
          </View>
        </View>
        
        <View className={`px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
          <Text className={`text-xs font-medium ${order.status === "COMPLETED" ? "text-green-800" : 
            order.status === "IN_PROGRESS" ? "text-blue-800" :
            order.status === "PENDING" ? "text-yellow-800" :
            order.status === "CANCELLED" ? "text-red-800" : "text-purple-800"}`}>
            {t(`routeDetails.status.${order.status}`)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Ionicons 
            name={getCategoryIcon(order.category) as any} 
            size={16} 
            color="#6b7280" 
          />
          <Text className="text-sm text-gray-600 ml-2 capitalize">
            {t(`routeDetails.category.${order.category}`)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="scale-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">{order.weight} kg</Text>
        </View>
      </View>

      {order.description && (
        <View className="bg-gray-50 rounded-lg p-3 mb-3">
          <Text className="text-sm text-gray-700">{order.description}</Text>
        </View>
      )}

      <View className="flex-row justify-between items-center text-xs text-gray-500">
        <Text className="text-xs text-gray-500">
          {t('routeDetails.orderCard.createdAt', { date: formatDate(order.createdAt) })}
        </Text>
        {order.completedAt && (
          <Text className="text-xs text-green-600">
            {t('routeDetails.orderCard.completedAt', { date: formatDate(order.completedAt) })}
          </Text>
        )}
      </View>
    </View>
  );
};

export default function RouteDetails() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams();
  const {data} = useGetRouteById(routeId as string);
  const route = data?.result;
  const [showOrdersList, setShowOrdersList] = useState(false);
  const { t } = useTranslation();
  
  if (!route) {
    return (
      <NotFoundPage />
    );
  }

  if (route.status === RouteStatus.IN_PROGRESS) {
    return (
      <CurrentRouteDetails />
    );
  }

  const completedOrders = route.orders.filter(order => order.status === "COMPLETED").length;
  const totalOrders = route.orders.length;
  const progressPercentage = Math.round((completedOrders / totalOrders) * 100);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row bg-white px-2 py-4 border-b border-gray-200 items-center">
        <TouchableOpacity className="p-1" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {t('routeDetails.headerTitle')}{route.id.slice(-6).toUpperCase()}
          </Text>
          <Text className="text-gray-600">
            {route.vehicle.licensePlate} • {formatDate(route.createdAt)}
          </Text>
        </View>
      </View>

      {/* Route Stats */}
      <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-gray-900">{totalOrders}</Text>
            <Text className="text-sm text-gray-600">{t('routeDetails.ordersLabel')}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-blue-600">{formatDistance(route.distance)}</Text>
            <Text className="text-sm text-gray-600">{t('routeDetails.distanceLabel')}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-purple-600">{formatDuration(route.duration)}</Text>
            <Text className="text-sm text-gray-600">{t('routeDetails.durationLabel')}</Text>
          </View>
        </View>

        {route.status === RouteStatus.COMPLETED && route.completedAt && (
          <View className="bg-green-50 rounded-lg p-3 flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text className="text-sm text-green-800 ml-2 font-medium">
              {t('routeDetails.routeCompleted', { date: formatDate(route.completedAt) })}
            </Text>
          </View>
        )}
      </View>

      {/* Map Container */}
      <View className="flex-1 mx-4 mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <StaticMapDriver route={route} />
        
        {/* Map Overlay Controls */}
        <View className="absolute top-4 right-4">
          <TouchableOpacity
            onPress={() => setShowOrdersList(!showOrdersList)}
            className="bg-white rounded-full p-3 shadow-lg border border-gray-200"
            activeOpacity={0.8}
          >
            <Ionicons 
              name={showOrdersList ? "map" : "list"} 
              size={20} 
              color="#374151" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders List Toggle */}
      {showOrdersList && (
        <View 
          className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200"
          style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: screenHeight * 0.6,
          }}
        >
          <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">
              {t('routeDetails.ordersLabel')} ({totalOrders})
            </Text>
            <TouchableOpacity
              onPress={() => setShowOrdersList(false)}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {route.orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </ScrollView>
        </View>
      )}

      {!showOrdersList && (
        <View className="bg-white px-6 py-4 border-t border-gray-200">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => setShowOrdersList(true)}
              className="flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="list" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">{t('routeDetails.viewOrdersButton')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-100 py-3 px-4 rounded-lg flex-row items-center"
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}