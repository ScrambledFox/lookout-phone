import { useEffect, useState } from "react";
import styled from "styled-components";

import { AvatarGenerator } from "random-avatar-generator";
import { MutatingDots } from "react-loader-spinner";

const avatarGenerator = new AvatarGenerator();

const PlayerCard = ({ size, player, requestNewAvatar }) => {
  const [avatar, setAvatar] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  useEffect(() => {
    setAvatar(avatarGenerator.generateRandomAvatar(player.avatarSeed));
  }, [player]);

  const handleAvatarClick = () => {
    setAvatar("");
    requestNewAvatar();
    setLoadingAvatar(true);
  };

  return (
    <Card className="PlayerCard">
      {loadingAvatar && (
        <MutatingDots
          height={"100px"}
          width={"100px"}
          color={player.colour}
          secondaryColor={player.colour}
          radius={10}
        />
      )}
      <img
        src={avatar}
        onClick={() => handleAvatarClick()}
        onLoad={() => setLoadingAvatar(false)}
      />
      <h2>{player.username}</h2>
    </Card>
  );
};

const Card = styled.div`
  width: 100%;
  height: 100%;

  div {
    justify-content: center;
  }
`;

export default PlayerCard;
