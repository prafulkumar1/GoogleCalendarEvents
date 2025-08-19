import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      marginVertical: 8,
    },
    colorCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 5,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
    cancelBtn: { marginRight: 10, padding: 10 },
    saveBtn: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8 },
    deleteBtn: { backgroundColor: '#ef4444', padding: 10, borderRadius: 8 },
  
    safeArea: {
      flex: 1,
      backgroundColor: '#5D112A',
    },
  
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerButton: {
      padding: 5,
    },
    form: {
      flex: 1,
      marginTop: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      color: '#e0e0e0',
      marginBottom: 8,
      marginTop: 15,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
    },
    colorSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    colorCircle: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
    },
    selectedColor: {
      borderWidth: 3,
      borderColor: '#fff',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 180,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingVertical: 18,
      borderRadius: 30,
      alignItems: 'center',
      marginRight: 5,
    },
    cancelButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
    },
    updateButton: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingVertical: 18,
      borderRadius: 30,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    updateButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#fff',
      paddingVertical: 18,
      borderRadius: 30,
      alignItems: 'center',
      marginLeft: 5,
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#5D112A',
    },
  
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    modalSubtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 25,
      textAlign: 'center',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    modalCancelButton: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 30,
      alignItems: 'center',
      marginRight: 10,
    },
    modalCancelButtonText: {
      color: '#555',
      fontWeight: '600',
      fontSize: 16,
    },
    modalDeleteButton: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 30,
      alignItems: 'center',
      marginLeft: 10,
    },
    modalDeleteButtonText: {
      color: '#D93434', // Red color for delete action
      fontWeight: 'bold',
      fontSize: 16,
    },
    loading:{
      backgroundColor: '#000',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      padding: 15,
    },
    loadingContainer:{
      backgroundColor: '#000',
      height: '100%',
      width: '100%',
      marginTop: 400,
    }
  });