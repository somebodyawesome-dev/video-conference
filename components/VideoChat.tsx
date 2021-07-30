type VideoChatProps = {
  onToggleChat: Function;
};
export default function VideoChat({ onToggleChat }: VideoChatProps) {
  return (
    <div className="flex-grow bg-gray-700">
      video calls
      <button
        className="transition m-2 p-2 px-3 border-solid border-2 border-blue-500 rounded-lg hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-opacity-50"
        onClick={() => {
          onToggleChat();
        }}
      >
        ~~
      </button>
    </div>
  );
}
