import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

export default function NotesScreen({ notes, onChangeNotes, theme }) {
  const [query, setQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState(null);
  const [deleteArmedNoteId, setDeleteArmedNoteId] = useState(null);
  const notePreviewMaxLength = 31;
  const accentColor = theme?.accent ?? '#2d76f9';
  const descriptionColor = `${accentColor}CC`;
  const accentBorder = `${accentColor}99`;

  const filteredNotes = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return notes;
    }

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() ?? '';
      const body = note.body?.toLowerCase() ?? '';
      return title.includes(cleanQuery) || body.includes(cleanQuery);
    });
  }, [notes, query]);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) ?? null,
    [notes, activeNoteId]
  );
  const pendingDeleteNote = useMemo(
    () => notes.find((note) => note.id === pendingDeleteNoteId) ?? null,
    [notes, pendingDeleteNoteId]
  );

  const handleAddNote = () => {
    const nextId = `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    onChangeNotes([
      ...notes,
      {
        id: nextId,
        title: '',
        body: '',
        isHidden: false,
      },
    ]);
    setActiveNoteId(nextId);
  };

  const handleRemoveNote = (id) => {
    onChangeNotes(notes.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
    if (pendingDeleteNoteId === id) {
      setPendingDeleteNoteId(null);
    }
  };

  const handleChangeNote = (id, key, value) => {
    onChangeNotes(
      notes.map((note) => (note.id === id ? { ...note, [key]: value } : note))
    );
  };

  const requestDeleteNote = (id) => {
    setPendingDeleteNoteId(id);
    setDeleteArmedNoteId(null);
  };

  const cancelDeleteNote = () => {
    setPendingDeleteNoteId(null);
    setDeleteArmedNoteId(null);
  };

  const confirmDeleteNote = () => {
    if (!pendingDeleteNoteId) {
      return;
    }

    handleRemoveNote(pendingDeleteNoteId);
    setPendingDeleteNoteId(null);
    setDeleteArmedNoteId(null);
  };

  const handleExportNotes = async () => {
    if (notes.length === 0) {
      Alert.alert('No Notes', 'Add at least one note before exporting.');
      return;
    }

    const exportedAt = new Date().toISOString();
    const payload = {
      exportedAt,
      noteCount: notes.length,
      notes,
    };
    const message = JSON.stringify(payload, null, 2);

    try {
      await Share.share({
        title: 'ContactLess Notes Backup',
        message,
        subject: 'ContactLess Notes Backup',
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export notes right now.');
    }
  };

  const confirmDeleteModal = (
    <Modal visible={Boolean(pendingDeleteNote)} transparent animationType="fade">
      <Pressable style={styles.modalBackdrop} onPress={cancelDeleteNote}>
        <Pressable
          style={[styles.modalCard, { backgroundColor: theme?.card ?? '#13233a', borderColor: accentBorder }]}
          onPress={() => {}}
        >
          <Text style={styles.modalTitle}>Delete Note</Text>
          <Text style={[styles.screenSubtitle, { color: descriptionColor }]}>
            Are you sure you want to delete this note? It will be lost forever.
          </Text>
          <Text style={styles.confirmNoteName}>
            {pendingDeleteNote?.title?.trim() ? pendingDeleteNote.title : 'Untitled'}
          </Text>

          <View style={styles.confirmActions}>
            <Pressable style={[styles.backButton, { borderColor: accentBorder }]} onPress={cancelDeleteNote}>
              <Text style={styles.backButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmDeleteButton} onPress={confirmDeleteNote}>
              <Text style={styles.confirmDeleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  if (activeNote) {
    return (
      <>
      <View>
        <View style={styles.detailTopRow}>
          <Pressable style={[styles.backButton, { borderColor: accentBorder }]} onPress={() => setActiveNoteId(null)}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Pressable
            style={[styles.removeButton, styles.detailRemoveButton, { borderColor: accentBorder }]}
            onPress={() => requestDeleteNote(activeNote.id)}
          >
            <Text style={styles.detailRemoveButtonText}>Delete</Text>
          </Pressable>
        </View>

        <TextInput
          style={[styles.input, styles.titleInput, { backgroundColor: theme?.card ?? '#13233a', borderColor: accentBorder }]}
          value={activeNote.title}
          onChangeText={(text) => handleChangeNote(activeNote.id, 'title', text)}
          placeholder="Title"
          placeholderTextColor="#6d7888"
        />

        <TextInput
          style={[styles.input, styles.noteBodyInput, { backgroundColor: theme?.card ?? '#13233a', borderColor: accentBorder }]}
          value={activeNote.body}
          onChangeText={(text) => handleChangeNote(activeNote.id, 'body', text)}
          placeholder="Type note details..."
          placeholderTextColor="#6d7888"
          multiline
        />

        <View style={styles.visibilityRow}>
          <Text style={[styles.visibilityLabel, { color: descriptionColor }]}>
            Hide note content on notes screen
          </Text>
          <Pressable
            style={[styles.visibilityToggle, { borderColor: accentBorder }]}
            onPress={() =>
              handleChangeNote(activeNote.id, 'isHidden', !Boolean(activeNote.isHidden))
            }
          >
            <Ionicons
              name={activeNote.isHidden ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={descriptionColor}
            />
          </Pressable>
        </View>

        <Pressable style={[styles.saveButton, { backgroundColor: accentColor }]} onPress={() => setActiveNoteId(null)}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      {confirmDeleteModal}
      </>
    );
  }

  return (
    <>
    <Pressable style={styles.screenWrap} onPress={() => setDeleteArmedNoteId(null)}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text" size={20} color={descriptionColor} style={styles.headerIcon} />
        <Text style={styles.screenTitle}>Notes</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme?.card ?? '#13233a', borderColor: accentBorder }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search all notes"
          placeholderTextColor="#7f93b3"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.actionsRow}>
        <Text style={styles.cardLabel}>Personal Notes ({notes.length})</Text>
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.exportButton, { borderColor: accentBorder }]}
            onPress={(event) => {
              event.stopPropagation();
              if (deleteArmedNoteId !== null) {
                setDeleteArmedNoteId(null);
              }
              handleExportNotes();
            }}
          >
            <Text style={[styles.exportButtonText, { color: descriptionColor }]}>Export</Text>
          </Pressable>
          <Pressable
            style={[styles.addButton, { backgroundColor: accentColor }]}
            onPress={(event) => {
              event.stopPropagation();
              if (deleteArmedNoteId !== null) {
                setDeleteArmedNoteId(null);
                return;
              }
              handleAddNote();
            }}
          >
            <Text style={styles.addButtonText}>+ Add Note</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        {filteredNotes.map((note) => (
          <Pressable
            key={note.id}
            style={[styles.card, { backgroundColor: theme?.card ?? '#13233a' }]}
            onLongPress={() => setDeleteArmedNoteId(note.id)}
            delayLongPress={260}
            onPress={(event) => {
              event.stopPropagation();
              if (deleteArmedNoteId !== null) {
                setDeleteArmedNoteId(null);
                return;
              }
              setActiveNoteId(note.id);
            }}
          >
            <View style={styles.noteHeader}>
              <Text style={styles.noteLabel}>
                {note.title?.trim() ? note.title : 'Untitled'}
              </Text>
              {deleteArmedNoteId !== null ? (
                <Pressable
                  style={[styles.removeButton, { borderColor: accentBorder }]}
                  onPress={(event) => {
                    event.stopPropagation();
                    requestDeleteNote(note.id);
                  }}
                >
                  <Text style={styles.cardRemoveButtonText}>X</Text>
                </Pressable>
              ) : (
                <View style={styles.removeButtonPlaceholder} />
              )}
            </View>
            {note.isHidden ? (
              <Text style={styles.hiddenPreview}>Content hidden</Text>
            ) : (
              <Text style={styles.notePreview} numberOfLines={6} ellipsizeMode="tail">
                {note.body?.trim()
                  ? note.body.length > notePreviewMaxLength
                    ? `${note.body.slice(0, notePreviewMaxLength)}...`
                    : note.body
                  : 'No content yet'}
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      {filteredNotes.length === 0 && (
        <Text style={[styles.emptyState, { color: descriptionColor }]}>You have no notes, add some!</Text>
      )}
    </Pressable>
    {confirmDeleteModal}
    </>
  );
}

const styles = StyleSheet.create({
  screenWrap: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 15, 27, 0.72)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#13233a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#355072',
    padding: 16,
  },
  modalTitle: {
    color: '#f2f7ff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  screenTitle: {
    color: '#f2f7ff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    color: '#b0c0d9',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#13233a',
    borderRadius: 14,
    padding: 14,
    width: '48%',
    marginBottom: 12,
    minHeight: 94,
  },
  searchWrap: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#13233a',
    color: '#f2f7ff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#223b5d',
  },
  cardLabel: {
    color: '#f2f7ff',
    fontWeight: '700',
  },
  noteLabel: {
    color: '#f2f7ff',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  input: {
    backgroundColor: '#13233a',
    color: '#f2f7ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#223b5d',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  noteBodyInput: {
    minHeight: 320,
    textAlignVertical: 'top',
    marginBottom: 0,
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  visibilityLabel: {
    color: '#b8c9e2',
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  visibilityToggle: {
    borderWidth: 1,
    borderColor: '#355072',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButton: {
    borderWidth: 1,
    borderColor: '#355072',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  exportButtonText: {
    color: '#c8d8ef',
    fontWeight: '700',
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#1f4f86',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#e7f1ff',
    fontWeight: '700',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#355072',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  backButtonText: {
    color: '#d9e3f0',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#355072',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  removeButtonPlaceholder: {
    width: 30,
    height: 30,
  },
  detailRemoveButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  detailRemoveButtonText: {
    color: '#d9e3f0',
    fontSize: 13,
    fontWeight: '600',
  },
  cardRemoveButtonText: {
    color: '#d9e3f0',
    fontSize: 13,
    fontWeight: '700',
  },
  notePreview: {
    color: '#d4e2f5',
    fontSize: 13,
    lineHeight: 18,
  },
  hiddenPreview: {
    color: '#9eb1ce',
    fontSize: 13,
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: '#1f4f86',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#e7f1ff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    color: '#9eb1ce',
    marginTop: 4,
  },
  confirmNoteName: {
    color: '#f2f7ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmDeleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#8f2b2b',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: '#ffeaea',
    fontSize: 13,
    fontWeight: '700',
  },
});
