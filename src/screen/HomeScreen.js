import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../services/GoogleCalendarService';
import CalendarView from '../components/CalendarView';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/HomeScreenStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = ['#3b82f6', '#22c55e', '#6366f1', '#eab308', '#ef4444'];

const COLOR_MAP = {
  '#22c55e': '2', // Green
  '#3b82f6': '1', // Blue
  '#6366f1': '7', // Indigo
  '#eab308': '5', // Yellow
  '#ef4444': '11', // Red
};

export default class HomeScreen extends Component {
  state = {
    events: [],
    selectedDay: null,
    token: null,
    loading: false,

    showAddEditModal: false,
    showDeleteModal: false,

    modalEvent: {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      color: '#3b82f6', // default blue
    },
    deleteEventId: null,
    showTimerForEventStart: false,
    showTimerForEventEnd: false,
    selectedColor: '',

    showStartPicker: false,
    showEndPicker: false,
    isEventUpdated: false,
    initialLoading: false,
    refreshing:false,
    logOutModal:false
  };

  async requestCalendarPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        ]);
  
        if (
          granted["android.permission.READ_CALENDAR"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.WRITE_CALENDAR"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  async componentDidMount() {
    this.requestCalendarPermission()
    const { route } = this.props || {};
    const { token } = route?.params || {};

    this.setState({ token, initialLoading: true }, async () => {
      if (token) {
        const events = await fetchEvents(token);
        this.setState({ events }, () => {
          this.setState({ initialLoading: false });
        });
      }
    });
  }

  handleDayPress = date => {
    console.log(date,"--->>>>>>>>rrrrrr")
    const { events } = this.state;

    const existingEvent = events?.find(e => {
      const startDate = e.start?.date || e.start?.dateTime?.split('T')[0];
      return startDate === date.dateString;
    });

    if (existingEvent) {
      const startTime = existingEvent.start?.dateTime
        ? new Date(existingEvent.start.dateTime)
        : new Date(date.dateString);

      const endTime = existingEvent.end?.dateTime
        ? new Date(existingEvent.end.dateTime)
        : new Date(date.dateString);

      this.setState({
        selectedDay: date,
        showAddEditModal: true,
        modalEvent: {
          title: existingEvent.summary || '',
          description: existingEvent.description || '',
          startTime,
          endTime,
          color:
            Object.keys(COLOR_MAP).find(
              key => COLOR_MAP[key] === existingEvent.colorId,
            ) || '#3b82f6',
          id: existingEvent?.id,
        },
        selectedColor:
          Object.keys(COLOR_MAP).find(
            key => COLOR_MAP[key] === existingEvent.colorId,
          ) || '#3b82f6',
        isEventUpdated: true,
      });
    } else {
      const selectedDate = new Date(date.dateString);
      this.setState({
        selectedDay: date,
        showAddEditModal: true,
        modalEvent: {
          title: '',
          description: '',
          startTime: new Date(selectedDate.setHours(9, 0, 0, 0)),
          endTime: new Date(new Date(date.dateString).setHours(10, 0, 0, 0)),
          color: '#3b82f6',
        },
        selectedColor: '#3b82f6',
        isEventUpdated: false,
      });
    }
  };

  handleDeleteRequest = eventId => {
    this.setState({ showDeleteModal: true, deleteEventId: eventId });
  };

  confirmDeleteEvent = async () => {
    const { token, deleteEventId } = this.state;
    await deleteEvent(token, deleteEventId);

    this.setState(prev => ({
      events: prev.events.filter(e => e.id !== deleteEventId),
      showDeleteModal: false,
      deleteEventId: null,
    }));
  };
  getEventByDate(selectedDay) {
    if (!this.state.events?.length || !selectedDay) return null;

    return this.state.events?.find(event => {
      const startDate = new Date(event.start.dateTime)
        .toISOString()
        .split('T')[0];
      return startDate === selectedDay.dateString; // compare YYYY-MM-DD
    });
  }

  handleSaveEvent = async () => {
    this.setState({ loading: true });
    const { modalEvent, selectedDay, token } = this.state;

    try {
      const startDate = new Date(selectedDay.dateString); // "2025-08-18"
      startDate.setHours(
        modalEvent.startTime.getHours(),
        modalEvent.startTime.getMinutes(),
        modalEvent.startTime.getSeconds(),
        0,
      );

      // Build end Date from selectedDay + time from picker
      const endDate = new Date(selectedDay.dateString);
      endDate.setHours(
        modalEvent.endTime.getHours(),
        modalEvent.endTime.getMinutes(),
        modalEvent.endTime.getSeconds(),
        0,
      );

      const event = {
        summary: modalEvent.title,
        description: modalEvent.description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'UTC',
        },
        colorId: COLOR_MAP[this.state.selectedColor],
      };

      const created = await addEvent(token, event);

      this.setState(prev => ({
        events: [...prev.events, created],
        showAddEditModal: false,
      }));

      setTimeout(async () => {
        const events = await fetchEvents(token);
        this.setState({ events, loading: false });
      }, 200);
    } catch (error) {
      this.setState({ loading: false });
      console.error('Error while saving event:', error);
    }
  };

  updateEvent = async () => {
    this.setState({ loading: true });
    const { modalEvent, selectedDay, token } = this.state;

    try {
      const startDate = new Date(selectedDay.dateString);
      startDate.setHours(
        modalEvent.startTime.getHours(),
        modalEvent.startTime.getMinutes(),
        modalEvent.startTime.getSeconds(),
        0,
      );

      const endDate = new Date(selectedDay.dateString);
      endDate.setHours(
        modalEvent.endTime.getHours(),
        modalEvent.endTime.getMinutes(),
        modalEvent.endTime.getSeconds(),
        0,
      );

      const updatedEvent = {
        summary: modalEvent.title,
        description: modalEvent.description,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'UTC',
        },
        colorId: COLOR_MAP[this.state.selectedColor],
      };

      await updateEvent(token, modalEvent.id, updatedEvent);

      this.setState(prev => ({
        events: prev.events.map(ev =>
          ev.id === modalEvent.id ? { ...ev, ...updatedEvent } : ev
        ),
        showAddEditModal: false,
        isEventUpdated: false,
        loading: false,
      }));
      
      // optional: background sync
      fetchEvents(token).then(events => this.setState({ events }));

      // const events = await fetchEvents(token);
      // this.setState({
      //   events,
      //   showAddEditModal: false,
      //   isEventUpdated: false,
      //   loading: false,
      // });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  deleteEventByDate = async date => {
    this.setState({ loading: true });
    const { events, token } = this.state;

    try {
      // find event(s) on that date
      const eventsOnDate = events.filter(e => {
        const startDate = e.start?.date || e.start?.dateTime?.split('T')[0];
        return startDate === date.dateString;
      });

      if (eventsOnDate.length === 0) {
        console.log('No events found on this date:', date.dateString);
        return;
      }

      // loop through and delete each one
      for (const ev of eventsOnDate) {
        await deleteEvent(token, ev.id);
      }

      // refresh events list
      const refreshedEvents = await fetchEvents(token);
      this.setState({
        events: refreshedEvents,
        showAddEditModal: false,
        isEventUpdated: false,
        showDeleteModal: false,
        loading: false,
      });

    } catch (error) {
      this.setState({ loading: false });
      console.error('Error deleting event(s):', error);
    }
  };


fetchAllEvents = async () => {
  try {
    this.setState({refreshing:true,loading:true})
    const events = await fetchEvents(this.state.token);
    this.setState({
      events,
    });
  } catch (error) {
    console.log("Error fetching events:", error);
  } finally {
    this.setState({ refreshing: false, initialLoading: false });
  }
};


  renderAddEditModal = () => {
    const { showAddEditModal, modalEvent, showStartPicker, showEndPicker } =
      this.state;

    return (
      <Modal
        visible={showAddEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => this.setState({ showAddEditModal: false })}
      >
        <ScrollView style={styles.safeArea}
        >
          <View style={{ flex: 1, padding: 20 }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => this.setState({ showAddEditModal: false })}
                style={styles.headerButton}
              >
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => this.setState({ showDeleteModal: true })}
              >
                <Ionicons name="trash-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.title}>Create New Event</Text>

              {/* Title */}
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Meeting with John Doe"
                placeholderTextColor="#ccc"
                value={modalEvent.title}
                onChangeText={text =>
                  this.setState(prev => ({
                    modalEvent: { ...prev.modalEvent, title: text },
                  }))
                }
              />

              {/* Description */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Project discussion"
                placeholderTextColor="#ccc"
                value={modalEvent.description}
                onChangeText={text =>
                  this.setState(prev => ({
                    modalEvent: { ...prev.modalEvent, description: text },
                  }))
                }
              />

              {/* Start Time */}
              <Text style={styles.label}>Event Start Time</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.setState({ showStartPicker: true })}
              >
                <Text style={{ color: '#fff' }}>
                  {modalEvent.startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={modalEvent.startTime}
                  mode="time"
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      this.setState(prev => ({
                        modalEvent: { ...prev.modalEvent, startTime: date },
                        showStartPicker: false, // ✅ close picker after select
                      }));
                    } else {
                      this.setState({ showStartPicker: false });
                    }
                  }}
                />
              )}

              {/* End Time */}
              <Text style={styles.label}>Event End Time</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => this.setState({ showEndPicker: true })}
              >
                <Text style={{ color: '#fff' }}>
                  {modalEvent.endTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={modalEvent.endTime}
                  mode="time"
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      this.setState(prev => ({
                        modalEvent: { ...prev.modalEvent, endTime: date },
                        showEndPicker: false, // ✅ close picker after select
                      }));
                    } else {
                      this.setState({ showEndPicker: false });
                    }
                  }}
                />
              )}

              {/* Color Selector */}
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorSelector}>
                {COLORS.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      this.state.selectedColor === color &&
                        styles.selectedColor,
                    ]}
                    onPress={() =>
                      this.setState(prev => ({
                        selectedColor: color,
                        modalEvent: { ...prev.modalEvent, color },
                      }))
                    }
                  />
                ))}
              </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.setState({ showAddEditModal: false })}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={
                  !this.state.isEventUpdated
                    ? this.handleSaveEvent
                    : this.updateEvent
                }
              >
                {this.state.loading ? (
                  <ActivityIndicator size={'small'} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {!this.state.isEventUpdated ? 'Save' : 'Update'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  renderDeleteModal = () => {
    const { showDeleteModal } = this.state;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => this.setState({ showDeleteModal: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Event</Text>
            <Text style={styles.modalSubtitle}>Are you sure?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => this.setState({ showDeleteModal: false })}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => this.deleteEventByDate(this.state.selectedDay)}
              >
                {this.state.loading ? (
                  <ActivityIndicator size={'small'} />
                ) : (
                  <Text style={styles.modalDeleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  removeToken = async () => {
    await AsyncStorage.removeItem('accessToken');
  };
  logoutUser = () => {
    this.removeToken();
    this.props?.navigation?.navigate('Login');
  };


  renderCofirmLogoutModal = () => {
    const { logOutModal } = this.state;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={logOutModal}
        onRequestClose={() => this.setState({ logOutModal: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to do logout?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => this.setState({ logOutModal: false })}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => this.logoutUser()}
              >
                 <Text style={styles.modalDeleteButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const { events } = this.state;
    return (
      <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.fetchAllEvents}  // 👈 call your function here
          colors={["#000"]}                // Android
          tintColor={"#000"}               // iOS
        />
      }  
      >
        <TouchableOpacity
          style={styles.loading}
          onPress={() => this.setState({logOutModal:true})}
        >
          <MaterialIcons name="logout" size={30} color="#fff" />
        </TouchableOpacity>
        {/* Calendar */}
        {this.state.initialLoading ? (
          <View
            style={styles.loadingContainer}
          >
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        ) : (
          <CalendarView events={events} onDayPress={this.handleDayPress} />
        )}

        {this.renderAddEditModal()}
        {this.renderDeleteModal()}
        {this.renderCofirmLogoutModal()}
      </ScrollView>
    );
  }
}
