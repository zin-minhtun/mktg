import React, { useState } from "react";

//Components
import PickerButton from "./PickerButton";
import DailyFreqMenu from "../JournalV1/Medication/DailyFreqMenu";


function DaysFreqPicker({ placeHolder, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFreqOptions, setSelectedFreqOptions] = useState([]);

  const UpdateOptionsHandler = (option) => {
    setSelectedFreqOptions(option); // Set the selected option
    console.log(option);
   if (onChange) onChange(option); // Optional callback for external handling
  };

  const onPressHandler = () => {
    setShowPicker(!showPicker);
  };

  return (
    <>      
      <PickerButton isMenuVisible={showPicker} onPress={onPressHandler}>
        {selectedFreqOptions.length == 0 ? placeHolder : selectedFreqOptions.length == 7 ? "Every day" : selectedFreqOptions.join(", ")}
      </PickerButton>
      {showPicker && (
        <>
          <DailyFreqMenu
            selectedOptions={selectedFreqOptions}
            onSave={UpdateOptionsHandler}
            onCancel={onPressHandler}
          />
        </>
      )}
    </>
  );
}

export default DaysFreqPicker;
