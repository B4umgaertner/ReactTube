import React from "react";
import {FlatList, Text} from "react-native";

import {VideoMenuContainer} from "@/components/general/VideoMenuContainer";
import {VideoMenuTextItem} from "@/components/video/videoPlayer/settings/VideoMenuTextItem";
import {useVideoPlayerSettings} from "@/components/video/videoPlayer/settings/VideoPlayerSettingsContext";

const speeds = [1, 1.25, 1.5, 1.75, 2, 2.17, 2.25, 2.5];

export function VideoPlayerSpeed() {
  const {speed, setSpeed} = useVideoPlayerSettings();

  const renderItem = ({item}: {item: number}) => {
    return (
      <VideoMenuTextItem
        selected={speed === item}
        item={`${item}`}
        onPress={() => setSpeed?.(item)}
      />
    );
  };

  return (
    <VideoMenuContainer>
      <FlatList
        data={speeds}
        renderItem={renderItem}
        ListHeaderComponent={
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}>
            {"Player Speeds"}
          </Text>
        }
      />
    </VideoMenuContainer>
  );
}
