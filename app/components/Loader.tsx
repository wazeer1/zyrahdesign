import Lottie from "lottie-react";
// import loaderAnimation from "../../public/assets/loader.json"; // adjust path

export default function Loader({ size = 120 }) {
  return (
    <div className="flex justify-center items-center h-48">
      <Lottie
        animationData={require("../../public/assets/loader.json")}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
