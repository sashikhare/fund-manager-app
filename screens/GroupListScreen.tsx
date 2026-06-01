import { subscribeGroupsByAdminAPI } from "@/api/groupApi";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroup } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function GroupListScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.app.currentUser);
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const [groups, setGroups] = useState<any[]>([]);

  // const loadGroups = async () => {
  //   const data = await getGroupsByAdminAPI(user?.email);
  //   setGroups(data);
  // };

  // useEffect(() => {
  //   loadGroups();
  // }, []);

  useEffect(() => {
    if (!user?.email) return;
  
    const unsubscribe =
      subscribeGroupsByAdminAPI(
        user.email,
        (data) => {
          setGroups(data);
        }
      );
  
    return () => unsubscribe();
  }, [user]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedGroup?.id === item.groupId;
        
          return (
            <Pressable
              onPress={() =>
                dispatch(
                  setSelectedGroup({
                    id: item.groupId,
                    name: item.name,
                  })
                )
              }
              style={[
                styles.memberCard,
                isSelected && {
                  borderColor: "#007AFF",
                  borderWidth: 2,
                  backgroundColor: "#1c1c1e",
                },
              ]}
            >
              <Text style={styles.memberName}>
                {item.name}
              </Text>
        
              <Text style={{ color: "#aaa", marginTop: 4 }}>
                Group ID: {item.groupId}
              </Text>
        
              <Text style={{ color: "#999", marginTop: 4 }}>
                Member Fee: ₹{item.memberFee}
              </Text>
        
              {isSelected && (
                <Text
                  style={{
                    color: "#007AFF",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  Selected
                </Text>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
