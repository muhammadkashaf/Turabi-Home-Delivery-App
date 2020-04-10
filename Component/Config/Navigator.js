import React from 'react';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator, createDrawerNavigator, createSwitchNavigator } from 'react-navigation';
import Home from '../../Screens/Home';
import OrdersScreen from '../../Screens/OrdersScreen';
import Login from '../../Screens/Login';
import SignUp from '../../Screens/SignUp';
import DashboardForUser from '../../Screens/DashboardForUser';
import SubCategory from '../../Screens/SubCategory';
import OrderDataForm from '../../Screens/OrderSendDataForm';
import OrderSent from '../../Screens/OrderSent';
import ProfileScreen from '../../Screens/UserProfileScreen';
import OrderList from '../../Screens/OrderListScreen';
import ActiveOrder from '../../Screens/ActiveOrder';
import DeliverScreen from '../../Screens/DeliverScreen';
import RiderProfileScreen from '../../Screens/RiderProfileScreen';
import ActiveOrderOfCurrentUser from '../../Screens/ActiveOrder/ListOfActiveOrders';
import ActiveOrderDeliveryDetails from '../../Screens/ActiveOrder/AboutOrderSender';
import CompletedOrdersByRider from '../../Screens/CompletedOrdersByRider';

const OrderSentStack = createSwitchNavigator({
    OrderSent: OrderSent,
}, {
    headerMode: 'none'
})

const StactNavigation = createStackNavigator({

    DashboardForUser: DashboardForUser,
    SubCategory: SubCategory,
    OrderDataForm: OrderDataForm,
    OrderSent: OrderSentStack,
    ProfileScreen: ProfileScreen,
    OrderList: OrderList
    // Home: Home,
    // Login: Login,
    // SignUp: SignUp,
}, {
        headerMode: 'none',
    }
)

const StackForRider = createStackNavigator({
    OrdersScreen: OrdersScreen,
    OrderList: OrderList,
    ActiveOrder: ActiveOrder,
    DeliverScreen: DeliverScreen,
    RiderProfileScreen: RiderProfileScreen,
    ActiveOrderOfCurrentUser: ActiveOrderOfCurrentUser,
    ActiveOrderDeliveryDetails: ActiveOrderDeliveryDetails,
    CompletedOrders: CompletedOrdersByRider
}, {
        headerMode: 'none'
    })

const StackForLogin = createStackNavigator({
    Home: Home,
    Login: Login,
    SignUp: SignUp,
    DashboardForUser: DashboardForUser,
    SubCategory: SubCategory,
    OrderDataForm: OrderDataForm,
    OrderSent: OrderSent,
    ProfileScreen: ProfileScreen,
}, {
        headerMode: 'none'
})

const Navigator = createAppContainer(StactNavigation)
const NavigatorForLogin = createAppContainer(StackForLogin)
const NavigatorForRider = createAppContainer(StackForRider)


export { Navigator, NavigatorForLogin, NavigatorForRider }