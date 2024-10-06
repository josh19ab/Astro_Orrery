const Animation = () => {
  return (
    <div>
      <lottie-player
        src="avatar.lottie" // Path to your DotLottie file
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }} // Adjust size as needed
        loop
        autoplay
      />
    </div>
  );
};

export default Animation;
