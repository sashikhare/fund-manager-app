import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#007AFF',
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      zIndex: 999
    },
  
    fabText: {
      color: '#fff',
      fontSize: 28,
      fontWeight: 'bold',
    },
  
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
  
    modalCard: {
      width: "100%",
      backgroundColor: "#111",
      borderRadius: 20,
      padding: 20,
    },
  
    modalTitle: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 4,
    },
  
    modalSubtitle: {
      color: "#aaa",
      textAlign: "center",
      marginBottom: 20,
    },
  
    modalInput: {
      borderWidth: 1,
      borderColor: "#333",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
    },
  
    modalBtn: {
      backgroundColor: "#007AFF",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
  
    modalBtnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  
    cancelText: {
      color: "#aaa",
      textAlign: "center",
      marginTop: 12,
    },

    memberCard: {
      backgroundColor: "#fff",
      padding: 14,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
    
      // shadow
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    
    memberCardSelected: {
      backgroundColor: "#E8F0FF",
      borderWidth: 1,
      borderColor: "#007AFF",
    },
    
    // memberRow: {
    //   flexDirection: "row",
    //   alignItems: "center",
    // },
    
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#007AFF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    
    avatarText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    
    memberName: {
      fontSize: 16,
      fontWeight: "500",
      color: "#111",
    },
    
    checkbox: {
      fontSize: 18,
    },

    fundCard: {
      backgroundColor: "#007AFF",
      margin: 16,
      padding: 20,
      borderRadius: 16,
    },
    
    fundLabel: {
      color: "#fff",
      fontSize: 14,
    },
    
    fundAmount: {
      color: "#fff",
      fontSize: 32,
      fontWeight: "bold",
    },
    
    spendPrimaryBtn: {
      backgroundColor: "#111",
      marginHorizontal: 16,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    
    spendPrimaryBtnText: {
      color: "#fff",
      fontWeight: "bold",
    },
    
    txCard: {
      backgroundColor: "#fff",
      marginHorizontal: 16,
      marginVertical: 6,
      padding: 14,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    
    txTitle: {
      fontWeight: "500",
    },
    
    txDate: {
      color: "#999",
      fontSize: 12,
    },
    
    txAmount: {
      fontWeight: "bold",
    },

    guestSecondaryBtn: {
      // marginHorizontal: 16,
      marginTop: 30,
      padding: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#007AFF",
      alignItems: "center",
    },
    
    secondaryBtn: {
      marginHorizontal: 16,
      marginBottom: 10,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#007AFF",
      alignItems: "center",
    },
    
    secondaryBtnText: {
      color: "#007AFF",
      fontWeight: "bold",
    },
    
    eventTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    
    eventDate: {
      color: "#999",
      marginTop: 4,
    },
    
    title: {
      fontSize: 20,
      fontWeight: "bold",
      margin: 16,
    },
    dropdownOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "flex-end",
    },
    
    // dropdownContainer: {
    //   backgroundColor: "#111",
    //   padding: 16,
    //   borderTopLeftRadius: 20,
    //   borderTopRightRadius: 20,
    //   maxHeight: "60%",
    // },
    
    dropdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: "#333",
    },
    
    dropdownItemSelected: {
      backgroundColor: "#007AFF20",
    },

    inlineDropdown: {
      backgroundColor: "#1a1a1a",
      borderRadius: 10,
      marginTop: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "#333",
    },

    dropdownAbsolute: {
      position: "absolute",
      top: 200, // adjust based on your layout
      left: 20,
      right: 20,
      zIndex: 999,
      elevation: 10,
    },
    
    dropdownContainer: {
      backgroundColor: "#111",
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: "#333",
    },

    overlayBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    
    overlayCard: {
      width: "85%",
      backgroundColor: "#111",
      borderRadius: 16,
      padding: 16,
    },
    
    overlayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    
    overlayTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    
    doneText: {
      color: "#007AFF",
      fontWeight: "bold",
    },
    
    overlayItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: "#333",
    },
    
    overlayItemSelected: {
      backgroundColor: "#007AFF20",
    },
    
    overlayItemText: {
      color: "#fff",
      fontSize: 15,
    },
    
    checkText: {
      color: "#007AFF",
    },

    container: {
      padding: 16,
      backgroundColor: "#F5F5F5",
      flexGrow: 1,
    },
    
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },

    eventDetailsHeading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
    },
    
    label: {
      fontSize: 14,
      color: "#555",
      marginBottom: 6,
      marginTop: 10,
    },
    
    input: {
      backgroundColor: "#fff",
      padding: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
    },
    
    primaryBtn: {
      backgroundColor: "#007AFF",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 30,
    },
    
    primaryBtnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },

    eventCard: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 14,
      marginBottom: 12,
      elevation: 2,
    },
    
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    
    badgeGreen: {
      backgroundColor: "#D4EDDA",
    },
    
    badgeOrange: {
      backgroundColor: "#FFF3CD",
    },
    
    badgeText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    
    subText: {
      color: "#666",
      marginTop: 4,
    },
    
    infoText: {
      marginTop: 4,
      fontSize: 14,
    },
    
    memberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 6,
    },
    
    inputSmall: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 6,
      width: 80,
      borderRadius: 6,
      textAlign: "center",
    },
    
    summary: {
      marginTop: 10,
      fontWeight: "bold",
    },

    amountText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#333",
    },

    eventMetaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
      marginBottom: 16
    },
    
    eventDate: {
      color: "#666",
      fontSize: 13,
    },
    
    turfCost: {
      fontSize: 14,
      fontWeight: "600",
      color: "#000",
    },

    amountSymbol: {
      marginRight: 4,
      fontSize: 20
    }
  });
