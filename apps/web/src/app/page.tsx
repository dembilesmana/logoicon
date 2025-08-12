import * as logoicon from "@logoicon/react";

export default function Home() {
  return (
    <div className="bg-white">
      {Object.entries(logoicon).map(([name, Component]) => (
        <Component className="border fill-red-500 w-8" key={name} />
      ))}
    </div>
  );
}
