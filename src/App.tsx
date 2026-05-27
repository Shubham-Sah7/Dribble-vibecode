import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import "./index.css"

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">shadcn/ui Ready</h1>
          <p className="text-muted-foreground">Vite + React + Tailwind + shadcn/ui</p>
          <Badge variant="secondary">Dribble Vibe Code</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Your shadcn/ui setup is complete and working.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Primary</Button>
              <Button variant="outline" className="flex-1">Outline</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
