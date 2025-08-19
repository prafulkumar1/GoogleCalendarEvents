// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   PanResponder,
//   Animated,
//   findNodeHandle,
// } from "react-native";
// import { Calendar } from "react-native-calendars";

// export default function CalendarView({ events, onDayPress, onUpdateEvent }) {
//   const [eventState, setEventState] = useState(events || []);
//   const [draggingEvent, setDraggingEvent] = useState(null);
//   const [draggingPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

//   // Store absolute positions of day cells
//   const dayLayouts = useRef({});

//   const markedDates = eventState.reduce((acc, event) => {
//     const startDate = event.start?.date || event.start?.dateTime?.split("T")[0];
//     if (startDate) {
//       acc[startDate] = {
//         marked: true,
//         events: [...(acc[startDate]?.events || []), event],
//       };
//     }
//     return acc;
//   }, {});

//   // PanResponder for drag/drop
//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: () => !!draggingEvent,
//     onPanResponderMove: (_, gesture) => {
//       if (draggingEvent) {
//         draggingPosition.setValue({ x: gesture.moveX - 50, y: gesture.moveY - 20 });
//       }
//     },
//     onPanResponderRelease: (_, gesture) => {
//       if (!draggingEvent) return;

//       let dropDate = null;

//       // Check which cell finger is released into
//       for (const [date, layout] of Object.entries(dayLayouts.current)) {
//         if (
//           gesture.moveX >= layout.x &&
//           gesture.moveX <= layout.x + layout.width &&
//           gesture.moveY >= layout.y &&
//           gesture.moveY <= layout.y + layout.height
//         ) {
//           dropDate = date;
//           break;
//         }
//       }

//       if (dropDate) {
//         const updatedEvent = {
//           ...draggingEvent,
//           start: { ...draggingEvent.start, date: dropDate },
//         };

//         setEventState((prev) =>
//           prev.map((ev) => (ev.id === draggingEvent.id ? updatedEvent : ev))
//         );

//         if (onUpdateEvent) {
//           onUpdateEvent(updatedEvent); // sync back to Google Calendar
//         }
//       }

//       setDraggingEvent(null);
//     },
//   });

//   const COLOR_MAP = {
//     "2": "#22c55e",
//     "1": "#3b82f6",
//     "7": "#6366f1",
//     "5": "#eab308",
//     "11": "#ef4444",
//   };

//   return (
//     <View style={{ flex: 1 }} {...panResponder.panHandlers}>
//       <Calendar
//         style={styles.calendar}
//         onDayPress={onDayPress}
//         markedDates={markedDates}
//         theme={{
//           backgroundColor: "#000",
//           calendarBackground: "#000",
//           monthTextColor: "white",
//           dayTextColor: "white",
//           todayTextColor: "red",
//         }}
//         dayComponent={({ date }) => {
//           const eventsForDay = markedDates[date.dateString]?.events || [];

//           return (
//             <View
//               style={styles.dayCell}
//               ref={(ref) => {
//                 if (ref) {
//                   // Measure absolute position of cell
//                   ref.measureInWindow((x, y, width, height) => {
//                     dayLayouts.current[date.dateString] = { x, y, width, height };
//                   });
//                 }
//               }}
//             >
//               <Text style={{ color: "#fff" }}>{date.day}</Text>
//               {eventsForDay.map((ev) => (
//                 <TouchableOpacity
//                   key={ev.id}
//                   onLongPress={() => {
//                     setDraggingEvent(ev);
//                     draggingPosition.setValue({ x: 0, y: 0 }); // reset pos
//                   }}
//                   style={[
//                     styles.eventText,
//                     { backgroundColor: COLOR_MAP[ev.colorId] || "gray" },
//                   ]}
//                 >
//                   <Text numberOfLines={2} style={{ color: "#fff", fontSize: 10 }}>
//                     {ev.summary}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           );
//         }}
//       />

//       {draggingEvent && (
//         <Animated.View
//           style={[
//             styles.floatingEvent,
//             {
//               transform: [
//                 { translateX: draggingPosition.x },
//                 { translateY: draggingPosition.y },
//               ],
//             },
//           ]}
//         >
//           <Text style={{ color: "#fff" }}>{draggingEvent.summary}</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   calendar: { backgroundColor: "#000", height: "100%", width: "100%" },
//   dayCell: {
//     borderWidth: 1,
//     borderColor: "#fff",
//     height: 124,
//     width: 62,
//     padding: 2,
//   },
//   eventText: {
//     fontSize: 10,
//     marginTop: 4,
//     borderRadius: 2,
//     padding: 4,
//   },
//   floatingEvent: {
//     position: "absolute",
//     backgroundColor: "#333",
//     padding: 6,
//     borderRadius: 4,
//     zIndex: 1000,
//   },
// });

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarView({ events, onDayPress, onUpdateEvent }) {
  const [eventState, setEventState] = useState(events || []);
  const [draggingEvent, setDraggingEvent] = useState(null);
  const [draggingPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));


  useEffect(() => {
    setEventState(events || []);
  }, [events]);


  const dayLayouts = useRef({});
  const COLOR_MAP = {
    "2": "#22c55e",
    "1": "#3b82f6",
    "7": "#6366f1",
    "5": "#eab308",
    "11": "#ef4444",
  };

  const markedDates = eventState.reduce((acc, event) => {
    const startDate = event.start?.date || event.start?.dateTime?.split("T")[0];
    if (startDate) {
      acc[startDate] = {
        marked: true,
        events: [...(acc[startDate]?.events || []), event],
      };
    }
    return acc;
  }, {});

  // PanResponder for drag/drop
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !!draggingEvent,
    onPanResponderMove: (_, gesture) => {
      if (draggingEvent) {
        draggingPosition.setValue({
          x: gesture.moveX - 50,
          y: gesture.moveY - 20,
        });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (!draggingEvent) return;

      let dropDate = null;

      for (const [date, layout] of Object.entries(dayLayouts.current)) {
        if (
          gesture.moveX >= layout.x &&
          gesture.moveX <= layout.x + layout.width &&
          gesture.moveY >= layout.y &&
          gesture.moveY <= layout.y + layout.height
        ) {
          dropDate = date;
          break;
        }
      }

      if (dropDate) {
        const updatedEvent = {
          ...draggingEvent,
          start: { ...draggingEvent.start, date: dropDate },
        };

        setEventState((prev) =>
          prev.map((ev) => (ev.id === draggingEvent.id ? updatedEvent : ev))
        );

        if (onUpdateEvent) {
          onUpdateEvent(updatedEvent);
        }
      }

      setDraggingEvent(null);
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: "#000",
          calendarBackground: "#000",
          monthTextColor: "#fff",
          dayTextColor: "#fff",
          todayTextColor: "red",
        }}
        dayComponent={({ date }) => {
          const eventsForDay = markedDates[date.dateString]?.events || [];

          return (
            <TouchableOpacity
              style={styles.dayCell}
              onPress={() => onDayPress(date)}
              ref={(ref) => {
                if (ref) {
                  ref?.measureInWindow((x, y, width, height) => {
                    dayLayouts.current[date.dateString] = {
                      x,
                      y,
                      width,
                      height,
                    };
                  });
                }
              }}
            >
              <Text style={{ color: "#fff" }}>{date.day}</Text>
              {eventsForDay.map((ev) => (
                <TouchableOpacity
                  key={ev.id}
                  onLongPress={(e) => {
                    setDraggingEvent(ev);

                    draggingPosition.setValue({
                      x: e.nativeEvent.pageX - 50,
                      y: e.nativeEvent.pageY - 20,
                    });
                  }}
                  style={[
                    styles.eventText,
                    { backgroundColor: COLOR_MAP[ev.colorId] || "gray" },
                  ]}
                >
                  <Text numberOfLines={2} style={{ color: "#fff", fontSize: 10 }}>
                    {ev.summary}
                  </Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          );
        }}
      />

      {draggingEvent && (
        <Animated.View
          style={[
            styles.floatingEvent,
            {
              transform: [
                { translateX: draggingPosition.x },
                { translateY: draggingPosition.y },
              ],
            },
          ]}
        >
          <Text style={{ color: "#fff" }}>{draggingEvent.summary}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: { backgroundColor: "#000", height: "100%", width: "100%" },
  dayCell: {
    borderWidth: 1,
    borderColor: "#fff",
    height: 124,
    width: 62,
    padding: 2,
  },
  eventText: {
    fontSize: 10,
    marginTop: 4,
    borderRadius: 2,
    padding: 4,
  },
  floatingEvent: {
    position: "absolute",
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 4,
    zIndex: 1000,
  },
});
