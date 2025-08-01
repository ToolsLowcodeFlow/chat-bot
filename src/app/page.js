import Link from "next/link";
import ChatWidget from "./components/chatwidget";

export default function Home() {
  return (
  <>
    <div>
<Link href="/new page" className="text-black">
new Page test
</Link>
    </div>
<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-transparent">
<ChatWidget/>
</div>
</>
  );
}
