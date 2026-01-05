import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";

const LogData = [
  {
    icon: <MaterialIcons name="local-pharmacy" size={24} color="black" />,
    label: "Medications",
    screen: "Medication",
  },
  {
    icon: <FontAwesome5 name="briefcase-medical" size={24} color="black" />,
    label: "Pain",
    screen: "Pain",
  },
  {
    icon: <Ionicons name="water" size={24} color="black" />,
    label: "Fluid",
    screen: "Fluid",
  },
  {
    icon: <Ionicons name="walk" size={24} color="black" />,
    label: "Activity",
    screen: "ADL",
  },
  {
    icon: <Ionicons name="bed" size={24} color="black" />,
    label: "Sleep",
    screen: "SleepForm",
  },
  {
    icon: <MaterialIcons name="healing" size={24} color="black" />,
    label: "Treatment",
  },
  {
    icon: <FontAwesome5 name="weight" size={24} color="black" />,
    label: "Measurement/weight",
    screen: "MeasurementForm",
  },
  {
    icon: <MaterialIcons name="restaurant" size={24} color="black" />,
    label: "Diet",
    screen: "DietForm",
  },
  {
    icon: <Entypo name="emoji-happy" size={24} color="black" />,
    label: "Mood",
    screen: "Mood",
  },
];

export default LogData;
