interface LoadingProps {
  isLoading: boolean;
}

export default function Loading({ isLoading }: LoadingProps) {
  return (
    <div
      className={`absolute bg-black ${
        isLoading ? "flex" : "hidden"
      } flex h-screen items-center justify-center opacity-60 w-screen`}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
          <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
