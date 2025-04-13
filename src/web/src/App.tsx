import { Button } from "@/components/ui/button"
import { useState } from "react";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button onClick={() => setCount((prev: number) => prev + 1)}>{count}</Button>
    </div>
  )
}

export default App;