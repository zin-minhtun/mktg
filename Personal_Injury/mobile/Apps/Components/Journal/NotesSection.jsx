import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AddNoteComponent = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null); // Track which note is being edited
  const [showFullNote, setShowFullNote] = useState({});
  const [tempNote, setTempNote] = useState(''); // Temporary note text for inline editing

  const characterLimit = 65; // Set the character limit for the note preview

  const handleSaveNote = () => {
    if (note.trim()) {
      setNotes([...notes, {
        id: Date.now(), // Unique ID for each note
        text: note,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNote('');
      setShowFullNote({});
    }
  };

  const handleCancelNote = () => {
    setNote('');
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find(n => n.id === id);
    setTempNote(noteToEdit.text); // Initialize tempNote with the text of the note being edited
    setEditingNoteId(id);
  };

  const handleSaveEdit = (id) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, text: tempNote, timestamp: new Date().toLocaleTimeString() } : n
    ));
    setEditingNoteId(null);
    setTempNote('');
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setTempNote('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setTempNote('');
    }
  };

  const handleToggleFullNote = (id) => {
    setShowFullNote(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const renderNoteItem = ({ item }) => (
    <View className="mt-6 p-4 bg-gray-100 rounded-md">
      <Text className="text-gray-500 mb-2">{item.timestamp}</Text>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 flex-row items-center">
          <FontAwesome name="sticky-note" size={24} color="orange" />
          {editingNoteId === item.id ? (
            <TextInput
              className="ml-2 flex-1 border border-gray-300 rounded-md p-2 text-lg"
              value={tempNote}
              onChangeText={text => setTempNote(text)}
              onSubmitEditing={() => handleSaveEdit(item.id)}
              multiline
            />
          ) : (
            <Text className="ml-2 flex-1">
              {showFullNote[item.id] ? item.text : `${item.text.slice(0, characterLimit)}`}
              {!showFullNote[item.id] && item.text.length > characterLimit && (
                <>
                  <Text>...</Text>
                  <TouchableOpacity onPress={() => handleToggleFullNote(item.id)}>
                    <Text className="ml-1 text-[#00B8DF]">More</Text>
                  </TouchableOpacity>
                </>
              )}
            </Text>
          )}
        </View>
        {editingNoteId === item.id ? (
          <View className="flex-row">
            <TouchableOpacity onPress={handleCancelEdit} className="mr-2 bg-[#FDA29B] p-2 rounded-full">
              <FontAwesome name="times" size={14} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSaveEdit(item.id)} className="bg-[#00B8DF] p-2 rounded-full">
              <FontAwesome name="check" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row">
            <TouchableOpacity onPress={() => handleEditNote(item.id)} className="mr-2">
              <FontAwesome name="edit" size={24} color="cyan" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
              <FontAwesome name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {showFullNote[item.id] && (
        <TouchableOpacity onPress={() => handleToggleFullNote(item.id)}>
          <Text className="text-[#00B8DF] mt-2">Show less</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 mt-8 bg-white p-4 rounded-md">
      <Text className="text-blue-900 font-semibold">Add New Note</Text>
      <TextInput
        className="mt-2 border border-[#00B8DF] rounded-md p-2 text-lg"
        placeholder="Add notes"
        placeholderTextColor="gray"
        onChangeText={text => setNote(text)}
        value={note}
        multiline
      />
      <View className="flex-row justify-end mt-4">
        <TouchableOpacity className="mr-4 bg-[#FDA29B] p-2 rounded-full" onPress={handleCancelNote}>
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#00B8DF] p-2 rounded-full" onPress={handleSaveNote}>
          <FontAwesome name="check" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default AddNoteComponent;
