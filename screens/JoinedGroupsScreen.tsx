import { getGroupStatsAPI, subscribeGroupsForUserAPI } from "@/api/groupApi";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroup } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function JoinedGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.app.currentUser);
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  useEffect(() => {
    if (!user?.uid) return;
  
    const unsubscribe =
      subscribeGroupsForUserAPI(
        user.uid,
        async (data) => {
          const groupsWithStats =
            await Promise.all(
              data.map(async (group: any) => {
                const stats =
                  await getGroupStatsAPI(
                    group.groupId
                  );
  
                return {
                  ...group,
                  stats,
                };
              })
            );
  
          setGroups(groupsWithStats);
        }
      );
  
    return () => unsubscribe();
  }, [user]);

//   const loadGroups = async () => {
//     const data = await getGroupsForUserAPI(user.uid);

//     const groupsWithStats = await Promise.all(
//       data.map(async (group: any) => {
//         const stats = await getGroupStatsAPI(group.groupId);

//         return {
//           ...group,
//           stats,
//         };
//       })
//     );

//     setGroups(groupsWithStats);
//   };

//   useEffect(() => {
//     loadGroups();
//   }, []);

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.groupId}
      contentContainerStyle={{
        padding: 16,
      }}
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
                borderWidth: 2,
                borderColor: "#007AFF",
              },
            ]}
          >
            <Text style={styles.memberName}>{item.name}</Text>
            <View
              style={{
                marginTop: 8,
                alignSelf: "flex-start",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,

                backgroundColor:
                  item.membershipType === "GUEST"
                    ? "#444"
                    : item.status === "APPROVED"
                    ? "#1f7a1f"
                    : "#8a6d1d",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {item.membershipType === "GUEST"
                  ? "GUEST"
                  : item.status === "APPROVED"
                  ? "MEMBER"
                  : "Awaiting Approval"}
              </Text>
            </View>

            <Text
              style={{
                color: "#aaa",
                marginTop: 6,
              }}
            >
              Group ID: {item.groupId}
            </Text>

            <Text
              style={{
                color: "#aaa",
                marginTop: 6,
              }}
            >
              Members: {item.stats?.members || 0}
            </Text>

            <Text style={{ color: "#aaa" }}>
              Guests: {item.stats?.guests || 0}
            </Text>

            <Text style={{ color: "#aaa" }}>
              Awaiting Approval: {item.stats?.pending || 0}
            </Text>

            {isSelected && (
              <Text
                style={{
                  color: "#007AFF",
                  marginTop: 10,
                }}
              >
                Selected
              </Text>
            )}
          </Pressable>
        );
      }}
    />
  );
}
