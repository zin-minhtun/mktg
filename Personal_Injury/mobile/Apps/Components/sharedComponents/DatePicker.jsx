import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";


//Components
import PickerButton from "./PickerButton";

const DatePicker = ({ label, value, onChange, placeholder, minimumDate, maximumDate, mode = "date" }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (date) => {
    setShowPicker(false);
    if (onChange) {
      onChange(date);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const formatValue = (date) => {
    if (!date) return placeholder || label || (mode === "time" ? "Select Time" : "Select Date");
    if (mode === "time") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <>
      <PickerButton isMenuVisible={showPicker} onPress={showDatePicker}>
        {formatValue(value ? new Date(value) : null)}
      </PickerButton>

      <DateTimePickerModal
        isVisible={showPicker}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        date={value ? new Date(value) : new Date()}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </>
  );
};

export default DatePicker;
