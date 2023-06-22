export default function MiniProfile() {
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        className="h-16 rounded-full border p-[2px]"
        src="https://rstatic.stores.musicarts.com/locations/durrell-j-2-mac-columbia---sc-5f82b5ac-3cb4-474f-b148-0c8cfb143d72.jpg"
        alt="user-image"
      />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">codewithpercy</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>
      <button className="font-semibold text-blue-400 text-sm">Sign Out</button>
    </div>
  );
}
